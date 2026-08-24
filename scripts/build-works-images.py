#!/usr/bin/env python3
"""実写真を WebP に最適化し、施工実績一覧のマニフェストを生成する。

入力  : teamofcolors-materials/photos/<カテゴリ日本語名>/*.jpg
        scripts/works-selection.json（一覧に載せる写真の選別リスト）
出力  : public/works/<id>.webp（拡大表示用）, <id>-thumb.webp（一覧グリッド用）
        public/works-manifest.json
        scripts/works-sources.json（番号と元ファイル名の対応表・自動生成）

元写真は全部が公開向きではない（施工中の写真、事務所で撮った見本板の記録写真など）ため、
公開するものを works-selection.json で明示的に選ぶ。番号は「カテゴリ内のファイル名順の通し番号」で、
選別しても振り直さない。載せたい写真が増えたら selection に番号を足して再実行すればよい。

床に資材が写り込んでいるだけの惜しい写真は、works-selection.json の "crop" に切り抜き範囲を
書けば救える。一覧グリッドは 4:3 の中央切り抜き（object-cover）なので、極端な横長・縦長に
切ると一覧で主役が画面外に出る。4:3 に近い比率で切ること。

マニフェストは Next（src/lib/staticWorks.ts）と Xserver の PHP
（server/lib/microcms.php）の両方が読む唯一の実績リスト。二重管理を避けるため
JSON 1ファイルに集約している。

Docker での実行方法:
  docker run --rm \
    -v /home/eza/projects/teamofcolors-materials:/src:ro \
    -v /home/eza/projects/teamofcolors:/app \
    -w /app python:3.12-slim \
    sh -c "pip install --quiet pillow && python scripts/build-works-images.py"

コンテナは root で動くため、生成物の所有者をホストユーザーに戻すこと:
  docker run --rm -v /home/eza/projects/teamofcolors:/app alpine \
    chown -R $(id -u):$(id -g) /app/public/works /app/public/works-manifest.json

再生成しても、既存マニフェストの retired フラグは引き継ぐ。retired は
「この写真は microCMS に記事として登録し直したので一覧から外す」という手動の
重複除けで、写真を追加するたびに消えては困るため。
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

SRC_ROOT = Path("/src/photos")
OUT_DIR = Path("public/works")
MANIFEST = Path("public/works-manifest.json")
SELECTION = Path("scripts/works-selection.json")
SOURCES = Path("scripts/works-sources.json")

# 元フォルダ名 → カテゴリID。IDと表示名は src/lib/serviceCategories.ts と揃えること。
# 並び順もそのまま一覧の表示順になる（モルタル→内装→エイジング）。
CATEGORIES = [
    ("モルタル造形", "mortar", "モルタル造形制作"),
    ("内装・インテリア", "interior", "内装・インテリア"),
    ("エイジング塗装", "aging", "エイジング塗装"),
]

FULL_MAX = 1600  # 拡大表示（ライトボックス）用の長辺上限
THUMB_MAX = 800  # 一覧グリッド用の長辺上限
# 元画像が小さいものは拡大しても意味がないので、この長辺以下なら thumb 1枚で済ませる
FULL_SKIP_UNDER = 1000
QUALITY = 80


def resize(im: Image.Image, max_edge: int) -> Image.Image:
    """長辺が max_edge に収まるよう縮小する（元より大きくはしない）。"""
    w, h = im.size
    scale = min(1.0, max_edge / max(w, h))
    if scale == 1.0:
        return im.copy()
    return im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)


def load_selection() -> dict[str, set[str]] | None:
    """公開する写真の番号をカテゴリIDごとに返す。選別ファイルが無ければ None（=全件公開）。"""
    if not SELECTION.exists():
        print(f"警告: {SELECTION} が無いため全件を公開対象にします", file=sys.stderr)
        return None
    data = json.loads(SELECTION.read_text(encoding="utf-8"))
    return {cat: set(nums) for cat, nums in data.get("publish", {}).items()}


def load_crops() -> dict[str, tuple[int, int, int, int]]:
    """トリミング範囲を id ごとに返す。値は EXIF 補正後の (左, 上, 右, 下) ピクセル。"""
    if not SELECTION.exists():
        return {}
    data = json.loads(SELECTION.read_text(encoding="utf-8"))
    return {work_id: tuple(box) for work_id, box in data.get("crop", {}).items()}


def crop(im: Image.Image, box: tuple[int, int, int, int], name: str) -> Image.Image:
    """指定範囲で切り抜く。範囲が画像からはみ出していたら切らずに元のまま返す。"""
    left, top, right, bottom = box
    w, h = im.size
    if not (0 <= left < right <= w and 0 <= top < bottom <= h):
        print(
            f"警告: トリミング範囲が画像の外です（{name} は {w}x{h}、指定は {box}）。"
            "切り抜かずに使います",
            file=sys.stderr,
        )
        return im
    return im.crop(box)


def load_retired() -> set[str]:
    """既存マニフェストから retired が立っている id を拾う。"""
    if not MANIFEST.exists():
        return set()
    try:
        existing = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        print(f"警告: {MANIFEST} を読めませんでした。retired を引き継ぎません", file=sys.stderr)
        return set()
    return {e["id"] for e in existing if e.get("retired")}


def main() -> int:
    if not SRC_ROOT.is_dir():
        print(f"エラー: 元画像が見つかりません: {SRC_ROOT}", file=sys.stderr)
        return 1

    retired = load_retired()
    selection = load_selection()
    crops = load_crops()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    entries = []
    generated: set[str] = set()
    sources: dict[str, str] = {}
    skipped = 0

    for folder, cat_id, cat_name in CATEGORIES:
        src_dir = SRC_ROOT / folder
        if not src_dir.is_dir():
            print(f"警告: フォルダがありません: {src_dir}", file=sys.stderr)
            continue

        chosen = None if selection is None else selection.get(cat_id, set())
        files = sorted(p for p in src_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
        for i, src in enumerate(files, start=1):
            num = f"{i:02d}"
            work_id = f"{cat_id}-{num}"
            # 選別しても番号は振り直さないので、対応表には未公開分も含めて全件記録する
            sources[work_id] = src.name
            if chosen is not None and num not in chosen:
                skipped += 1
                continue

            with Image.open(src) as im:
                # iOS写真の向き情報を反映してから破棄（保存時にEXIFを持ち越さないので
                # 位置情報などのメタデータもここで落ちる）
                im = ImageOps.exif_transpose(im).convert("RGB")
                if work_id in crops:
                    im = crop(im, crops[work_id], src.name)
                long_edge = max(im.size)

                thumb = resize(im, THUMB_MAX)
                thumb_name = f"{work_id}-thumb.webp"
                thumb.save(OUT_DIR / thumb_name, "WEBP", quality=QUALITY, method=6)
                generated.add(thumb_name)

                if long_edge > FULL_SKIP_UNDER:
                    full = resize(im, FULL_MAX)
                    full_name = f"{work_id}.webp"
                    full.save(OUT_DIR / full_name, "WEBP", quality=QUALITY, method=6)
                    generated.add(full_name)
                else:
                    # 元が小さい写真は縮小版のみ。拡大表示も同じファイルを使う。
                    full, full_name = thumb, thumb_name

            entry = {
                "id": f"static-{work_id}",
                # 架空の物件名は付けない方針なので、タイトルはサービス名。
                # 一覧カードの表示と画像の alt を兼ねる。
                "title": cat_name,
                "category": {"id": cat_id, "name": cat_name},
                "eyecatch": {
                    "url": f"/works/{full_name}",
                    "width": full.size[0],
                    "height": full.size[1],
                },
                "thumb": {
                    "url": f"/works/{thumb_name}",
                    "width": thumb.size[0],
                    "height": thumb.size[1],
                },
                # 写真のみのギャラリー項目（タイトル・本文を持たず、詳細ページも作らない）。
                # microCMS 由来の記事と区別してライトボックス表示にするための目印。
                "photoOnly": True,
            }
            if entry["id"] in retired:
                entry["retired"] = True
            entries.append(entry)

    MANIFEST.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    SOURCES.write_text(
        json.dumps(sources, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    # 選別ファイルに実在しない番号が書かれていたら知らせる（番号ずれ・打ち間違いの検出）
    if selection is not None:
        for cat_id, nums in selection.items():
            unknown = sorted(n for n in nums if f"{cat_id}-{n}" not in sources)
            if unknown:
                print(f"警告: {cat_id} に存在しない番号があります: {', '.join(unknown)}", file=sys.stderr)
    stray = sorted(work_id for work_id in crops if work_id not in sources)
    if stray:
        print(f"警告: crop に存在しない id があります: {', '.join(stray)}", file=sys.stderr)

    # 前回生成ぶんで今回使われなかったファイルを掃除（元写真を減らした場合に残骸を残さない）
    removed = 0
    for old in OUT_DIR.iterdir():
        if old.is_file() and old.name not in generated:
            old.unlink()
            removed += 1

    total_bytes = sum(f.stat().st_size for f in OUT_DIR.iterdir() if f.is_file())
    print(f"生成: {len(entries)}件 / 画像{len(generated)}ファイル / {total_bytes / 1_048_576:.1f}MB")
    if skipped:
        print(f"未公開: {skipped}件（scripts/works-selection.json で選別）")
    if removed:
        print(f"削除: 未使用ファイル {removed} 件")
    if retired:
        print(f"引き継ぎ: retired {len(retired)}件")
    return 0


if __name__ == "__main__":
    sys.exit(main())
