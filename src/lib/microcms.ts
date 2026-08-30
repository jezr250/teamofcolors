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
import { SERVICE_CATEGORIES } from "./serviceCategories";

export type Post = {
  id: string;
  title: string;
  content?: string; // richEditorのHTML（一覧では省略）
  eyecatch?: { url: string; width?: number; height?: number };
  thumb?: { url: string; width: number; height: number }; // 一覧グリッド用の軽い画像
  category?: { id: string; name: string };
  tags?: string[]; // worksのみ使用（microCMS側は複数選択フィールド想定）
  publishedAt?: string;
  photoOnly?: boolean; // 写真のみ＝詳細ページを持たず、ライトボックスで拡大する
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

// ── microCMS レスポンスの正規化 ────────────────────────────────────────────
// 実際のworks APIは「カテゴリ（セレクト）＋画像」だけの構成で、Post型とは形が違う:
//   実際 : { id, category: ["interior"], image: {url,width,height}, publishedAt }
//   Post : { id, title, category: {id,name}, eyecatch, thumb, photoOnly, ... }
// 記事側にタイトル・本文を足さなくても運用できるよう、ここで吸収する。
// 将来 microCMS に title / content / eyecatch / tags を足しても壊れないように
// 「あれば使う」形にしてある。

type RawWork = {
  id: string;
  title?: string;
  content?: string;
  // 画像フィールドは image（現行）と eyecatch（将来）の両方を受ける
  image?: { url: string; width?: number; height?: number };
  eyecatch?: { url: string; width?: number; height?: number };
  // セレクト＝["interior"] / テキスト＝"interior" / コンテンツ参照＝{id,name} を許容
  category?: string[] | string | { id: string; name?: string };
  tags?: string[];
  publishedAt?: string;
};

// microCMS の画像API。幅を指定してWebPに変換させる（静的exportでは
// next/image の最適化が効かないため、縮小はこのクエリが担う）
function cmsImage(
  img: { url: string; width?: number; height?: number },
  maxWidth: number
) {
  const w = img.width ?? maxWidth;
  const h = img.height ?? maxWidth;
  const scale = w > maxWidth ? maxWidth / w : 1;
  return {
    url: `${img.url}?fm=webp&w=${Math.round(w * scale)}&q=82`,
    width: Math.round(w * scale),
    height: Math.round(h * scale),
  };
}

function normalizeCategory(raw: RawWork["category"]): { id: string; name: string } | undefined {
  const id = Array.isArray(raw) ? raw[0] : typeof raw === "string" ? raw : raw?.id;
  if (!id) return undefined;
  // 表示名は serviceCategories.ts を正とする（microCMS側はIDしか持たないため）
  const known = SERVICE_CATEGORIES[id];
  const fallback = typeof raw === "object" && !Array.isArray(raw) ? raw?.name : undefined;
  return { id, name: known?.name ?? fallback ?? id };
}

export function normalizeCmsWork(raw: RawWork): Post {
  const category = normalizeCategory(raw.category);
  const img = raw.eyecatch ?? raw.image;
  // タイトルが無い記事＝写真のみ。静的写真と同じくライトボックスで拡大し、
  // 詳細ページへは飛ばさない（本文が無いので開いても白紙になる）
  const photoOnly = !raw.title;

  return {
    id: raw.id,
    title: raw.title || category?.name || "施工実績",
    content: raw.content,
    eyecatch: img ? cmsImage(img, 1600) : undefined,
    thumb: img ? cmsImage(img, 800) : undefined,
    category,
    tags: raw.tags,
    publishedAt: raw.publishedAt,
    photoOnly,
  };
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
    // 存在しないフィールド名を混ぜてもmicroCMSは無視するだけなので、
    // 現行スキーマ(image)と将来の拡張(title/eyecatch/tags)をまとめて要求している
    fields: "id,title,image,eyecatch,category,tags,publishedAt",
    orders: "-publishedAt",
  };
  // categoryは「セレクト」フィールド＝配列で保存されるため equals では一致しない。
  // 配列・文字列のどちらにも効く contains を使う。
  if (category) params.filters = `category[contains]${category}`;
  const cms: { contents: RawWork[]; totalCount: number } = await fetchMicroCMS(
    endpoint,
    params
  );
  const cmsContents = cms.contents.map(normalizeCmsWork);

  // microCMS記事を先に並べ、要求件数に足りない分を静的写真で埋める。
  // offset が microCMS の総件数を超えていれば、その超過分が静的写真側の開始位置になる。
  const shortfall = limit - cmsContents.length;
  const staticStart = Math.max(0, offset - cms.totalCount);
  const filler =
    shortfall > 0 ? statics.slice(staticStart, staticStart + shortfall) : [];

  return {
    contents: [...cmsContents, ...filler],
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
    const raw: RawWork = await fetchMicroCMS(`${endpoint}/${encodeURIComponent(id)}`, {});
    const post = normalizeCmsWork(raw);
    // タイトルも本文も無い＝写真のみの記事。一覧のライトボックスで見せるので
    // 詳細ページは持たせない（静的写真と同じ扱い）
    if (post.photoOnly) return null;
    return post;
  } catch {
    return null;
  }
}
