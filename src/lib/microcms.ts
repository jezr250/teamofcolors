// microCMS フェッチヘルパー（サーバー側専用 — APIキーを扱うためクライアントからimportしない）
// フロントは /api/works 経由でアクセスする。Xserver版では同じレスポンス形式の
// server/api/works.php に差し替える（Contact.tsx と同じ中継パターン）。
//
// 施工実績一覧は「静的写真（土台）＋ microCMS記事（追記）」の2層構成:
//   - 静的写真 … public/works-manifest.json。実写真を選別・最適化したもの（staticWorks.ts）
//   - microCMS … 契約後に登録した実績記事。新しい順で静的写真の"上"に積まれる
// 環境変数 MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が未設定の間は静的写真だけを返す。
// 設定した瞬間から自動的に2層のマージ表示になり、コード変更は要らない。

import { staticWorksByCategory, isStaticWorkId } from "./staticWorks";

export type Post = {
  id: string;
  title: string;
  content?: string; // richEditorのHTML（一覧では省略）
  eyecatch?: { url: string; width?: number; height?: number };
  thumb?: { url: string; width: number; height: number }; // 静的写真のみ（一覧グリッド用の軽い画像）
  category?: { id: string; name: string };
  tags?: string[]; // worksのみ使用（microCMS側は複数選択フィールド想定）
  publishedAt?: string;
  photoOnly?: boolean; // 静的写真＝詳細ページを持たず、ライトボックスで拡大する
};

export type PostListResponse = {
  contents: Post[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type Endpoint = "works";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = process.env.MICROCMS_API_KEY;

export const isMicroCMSConfigured = Boolean(SERVICE_DOMAIN && API_KEY);

async function fetchMicroCMS(path: string, params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${path}${query ? `?${query}` : ""}`;
  const res = await fetch(url, {
    headers: { "X-MICROCMS-API-KEY": API_KEY! },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`microCMS request failed: ${res.status}`);
  }
  return res.json();
}

export async function getPostList(
  endpoint: Endpoint,
  {
    limit = 12,
    offset = 0,
    category,
  }: { limit?: number; offset?: number; category?: string } = {}
): Promise<PostListResponse> {
  const statics = staticWorksByCategory(category);

  if (!isMicroCMSConfigured) {
    return {
      contents: statics.slice(offset, offset + limit),
      totalCount: statics.length,
      offset,
      limit,
    };
  }

  const params: Record<string, string> = {
    limit: String(limit),
    offset: String(offset),
    fields: "id,title,eyecatch,category,tags,publishedAt",
    orders: "-publishedAt",
  };
  if (category) params.filters = `category[equals]${category}`;
  const cms: PostListResponse = await fetchMicroCMS(endpoint, params);

  // microCMS記事を先に並べ、要求件数に足りない分を静的写真で埋める。
  // offset が microCMS の総件数を超えていれば、その超過分が静的写真側の開始位置になる。
  const shortfall = limit - cms.contents.length;
  const staticStart = Math.max(0, offset - cms.totalCount);
  const filler =
    shortfall > 0 ? statics.slice(staticStart, staticStart + shortfall) : [];

  return {
    contents: [...cms.contents, ...filler],
    totalCount: cms.totalCount + statics.length,
    offset,
    limit,
  };
}

export async function getPostDetail(endpoint: Endpoint, id: string): Promise<Post | null> {
  // 静的写真は写真のみで本文を持たないため詳細ページを作らない（一覧でライトボックス表示）
  if (isStaticWorkId(id)) return null;
  if (!isMicroCMSConfigured) return null;
  try {
    return await fetchMicroCMS(`${endpoint}/${encodeURIComponent(id)}`, {});
  } catch {
    return null;
  }
}
