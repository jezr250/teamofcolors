// 実写真の施工実績（public/works-manifest.json）を読み込む。
//
// マニフェストは scripts/build-works-images.py が生成する。同じJSONを Xserver 版の
// server/lib/microcms.php も読むので、実績リストの実体はこのファイル1つだけ。
//
// これは microCMS を契約する前から本物の実績を公開しておくための「土台」で、
// microCMS を繋いだ後も消えない。microCMS の記事はこの上に積まれる（getPostList を参照）。
// 同じ写真を microCMS にも記事として登録した場合だけ、マニフェストの該当エントリに
// "retired": true を足して一覧から外す。
//
// 循環参照を避けるため microcms.ts の Post 型は import せず、構造だけ合わせている。

import manifest from "../../public/works-manifest.json";

export type StaticWork = {
  id: string; // "static-mortar-03" 形式。microCMSの自動IDと衝突しないよう接頭辞を付けている
  title: string; // 架空の物件名は付けない方針なのでサービス名が入る
  category: { id: string; name: string };
  eyecatch: { url: string; width: number; height: number }; // 拡大表示用
  thumb: { url: string; width: number; height: number }; // 一覧グリッド用
  photoOnly: boolean; // 写真のみ＝詳細ページを持たない（ライトボックスで拡大する）
  retired?: boolean; // microCMSへ移行済み。一覧から外す
};

// JSONの推論型はマニフェストの中身に左右されるため、ここで一度だけ型を確定させる。
export const STATIC_WORKS: StaticWork[] = (manifest as StaticWork[]).filter(
  (w) => !w.retired
);

export function staticWorksByCategory(category?: string): StaticWork[] {
  return category
    ? STATIC_WORKS.filter((w) => w.category.id === category)
    : STATIC_WORKS;
}

export function isStaticWorkId(id: string): boolean {
  return id.startsWith("static-");
}
