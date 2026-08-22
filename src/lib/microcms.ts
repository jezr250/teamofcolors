// microCMS フェッチヘルパー（サーバー側専用 — APIキーを扱うためクライアントからimportしない）
// フロントは /api/works 経由でアクセスする。Xserver版では同じレスポンス形式の
// server/api/works.php に差し替える（Contact.tsx と同じ中継パターン）。
//
// microCMS側には works（施工実績）API を作る。/works ページの全件一覧＋カテゴリー絞り込み用。
// トップの代表6件はハードコード（WorksSection）。
//
// 環境変数 MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が未設定の間は
// サンプルデータを返す（microCMSアカウント作成前でも画面確認できるように）。

export type Post = {
  id: string;
  title: string;
  content?: string; // richEditorのHTML（一覧では省略）
  eyecatch?: { url: string; width?: number; height?: number };
  category?: { id: string; name: string };
  tags?: string[]; // worksのみ使用（microCMS側は複数選択フィールド想定）
  publishedAt?: string;
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
  if (!isMicroCMSConfigured) {
    const posts = category
      ? SAMPLE_DATA[endpoint].filter((p) => p.category?.id === category)
      : SAMPLE_DATA[endpoint];
    return {
      contents: posts
        .slice(offset, offset + limit)
        .map(({ content: _content, ...rest }) => rest),
      totalCount: posts.length,
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
  return fetchMicroCMS(endpoint, params);
}

export async function getPostDetail(endpoint: Endpoint, id: string): Promise<Post | null> {
  if (!isMicroCMSConfigured) {
    return SAMPLE_DATA[endpoint].find((p) => p.id === id) ?? null;
  }
  try {
    return await fetchMicroCMS(`${endpoint}/${encodeURIComponent(id)}`, {});
  } catch {
    return null;
  }
}

/* ── microCMS未設定時のサンプルデータ ── */

// /works の全件一覧用サンプル（microCMS未接続時のフォールバック）
const SAMPLE_WORKS: Post[] = [
  {
    id: "sample-work-1",
    title: "洞窟テーマカフェ「岩窟」内装",
    content:
      "<p>これはmicroCMS未接続時のサンプル実績です。FRPによる大型擬岩をフルスクラッチで制作しました。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1702847341686-ba2c2b173371?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "mortar", name: "モルタル造形制作" },
    tags: ["ARTISTIC", "FULL SCRATCH"],
    publishedAt: "2026-06-20T09:00:00.000Z",
  },
  {
    id: "sample-work-2",
    title: "バー「KURAYAMI」エイジング内装",
    content: "<p>これはサンプル実績です。経年変化を再現したエイジング塗装で店内を仕上げました。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "interior", name: "内装・インテリア" },
    tags: ["INTERIOR", "AGING PAINT"],
    publishedAt: "2026-06-10T09:00:00.000Z",
  },
  {
    id: "sample-work-3",
    title: "商業施設 大型岩石オブジェ",
    content: "<p>これはサンプル実績です。商業施設のエントランスに大型の岩石オブジェを制作しました。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1613981371672-98fcc5a1b59e?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "mortar", name: "モルタル造形制作" },
    tags: ["LARGE SCALE", "FRP"],
    publishedAt: "2026-05-25T09:00:00.000Z",
  },
  {
    id: "sample-work-4",
    title: "レストラン コンクリート壁面",
    content: "<p>これはサンプル実績です。コンクリート壁面にエイジング塗装を施しました。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1578922427288-a47338083a57?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "aging", name: "エイジング塗装" },
    tags: ["AGING PAINT", "CONCRETE"],
    publishedAt: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "sample-work-5",
    title: "アミューズメント洞窟エリア",
    content: "<p>これはサンプル実績です。アミューズメント施設の洞窟エリアを施工しました。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1760119547261-2acb17d8ae71?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "mortar", name: "モルタル造形制作" },
    tags: ["THEME PARK", "CAVE"],
    publishedAt: "2026-04-15T09:00:00.000Z",
  },
  {
    id: "sample-work-6",
    title: "フルスクラッチ造形 施工事例",
    content: "<p>これはサンプル実績です。すべて手作業によるフルスクラッチ造形の事例です。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1608613304899-ea8098577e38?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "mortar", name: "モルタル造形制作" },
    tags: ["FULL SCRATCH", "CRAFT"],
    publishedAt: "2026-04-01T09:00:00.000Z",
  },
];

const SAMPLE_DATA: Record<Endpoint, Post[]> = {
  works: SAMPLE_WORKS,
};
