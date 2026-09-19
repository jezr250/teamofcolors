#!/usr/bin/env python3
"""正式ロゴ（透過PNG・白文字版）からファビコンとヘッダー/フッター用のロゴマークを起こす。

入力  : teamofcolors-materials/20260919_追加依頼/20260917_修正セット/ロゴ/logo(文字白).png
        （2026-09-17 の修正依頼 01 で支給された正式ロゴ。黒地JPG・白地JPG・透過PNG黒文字も
          同梱されているが、サイトは黒地なので白文字の透過PNGを使う）
出力  : public/favicon.ico（16/32/48px）, public/apple-touch-icon.png（180px）… 黒背景
        public/logo-mark.webp（320px）… 背景透明。ヘッダーはヒーロー写真の上に透けて載るので
        黒い四角が出ないよう透明のまま（LogoMark.tsx が使う）

元画像は 3509x2481 の横長キャンバスにロゴが中央に置かれているので、
  1. 不透明部分の外接矩形を取り、正方形に切り出して余白を足す
  2. 各サイズに縮小する
ファビコンは黒地に合成する（ブラウザのタブが白でも白いロゴが見えるように）。

旧版（2026-09-13 の暫定ロゴ 730110.jpg）は白背景のJPGだったため白抜き処理をしていたが、
正式ロゴは透過PNGなのでその処理は不要になった。

Docker での実行方法:
  docker run --rm \
    -v /home/eza/projects/teamofcolors-materials:/src:ro \
    -v /home/eza/projects/teamofcolors:/app \
    -w /app python:3.12-slim \
    sh -c "pip install --quiet pillow && python scripts/build-favicon.py"
  docker run --rm -v /home/eza/projects/teamofcolors:/app alpine \
    chown $(id -u):$(id -g) /app/public/favicon.ico /app/public/apple-touch-icon.png /app/public/logo-mark.webp
"""

from PIL import Image

SRC = "/src/20260919_追加依頼/20260917_修正セット/ロゴ/logo(文字白).png"
PADDING = 0.06  # 正方形にしたあと四辺に足す余白（一辺に対する比率）

im = Image.open(SRC).convert("RGBA")

# ロゴの外接矩形（アルファが立っている範囲）→ 正方形 → 余白
left, top, right, bottom = im.getbbox()
side = int(max(bottom - top, right - left) * (1 + PADDING * 2))
cx, cy = (left + right) // 2, (top + bottom) // 2
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.alpha_composite(im, (side // 2 - cx, side // 2 - cy))

# 透明版（ヘッダー・フッター）
square.resize((320, 320), Image.LANCZOS).save("public/logo-mark.webp", quality=90)

# 黒地版（ファビコン）
black = Image.new("RGBA", (side, side), (0, 0, 0, 255))
black.alpha_composite(square)
black = black.convert("RGB")
black.resize((180, 180), Image.LANCZOS).save("public/apple-touch-icon.png", optimize=True)
black.save("public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print(f"元 {im.size} → ロゴ範囲 {(left, top, right, bottom)} → 正方形 {side}px")
