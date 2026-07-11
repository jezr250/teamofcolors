// microCMS フェッチヘルパー（サーバー側専用 — APIキーを扱うためクライアントからimportしない）
// フロントは /api/news・/api/works 経由でアクセスする。Xserver版では同じレスポンス形式の
// server/api/news.php・works.php に差し替える（Contact.tsx と同じ中継パターン）。
//
// microCMS側には2つのAPIを作る:
//   - works … 施工実績（/worksページの全件一覧用。トップの代表6件はハードコード）
//   - news  … お知らせ・ブログ（トップの最新3件 + /blogページ）
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

export type Endpoint = "news" | "works";

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
  { limit = 12, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<PostListResponse> {
  if (!isMicroCMSConfigured) {
    const posts = SAMPLE_DATA[endpoint];
    return {
      contents: posts
        .slice(offset, offset + limit)
        .map(({ content: _content, ...rest }) => rest),
      totalCount: posts.length,
      offset,
      limit,
    };
  }
  return fetchMicroCMS(endpoint, {
    limit: String(limit),
    offset: String(offset),
    fields: "id,title,eyecatch,category,tags,publishedAt",
    orders: "-publishedAt",
  });
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

const SAMPLE_NEWS: Post[] = [
  {
    id: "sample-news-1",
    title: "【サンプル】エイジング塗装ワークショップ開催のお知らせ",
    content:
      "<p>これはmicroCMS未接続時のサンプル記事です。環境変数 MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY を設定すると実データに切り替わります。</p><h2>開催概要</h2><p>エイジング塗装の技法を体験できるワークショップを開催します。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "event", name: "イベント" },
    publishedAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "sample-news-2",
    title: "【サンプル】洞窟テーマカフェ「岩窟」の施工事例を公開しました",
    content:
      "<p>これはサンプル記事です。FRPによる大型擬岩をフルスクラッチで制作し、照明計画と合わせて洞窟の質感を再現しました。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1702847341686-ba2c2b173371?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "info", name: "お知らせ" },
    publishedAt: "2026-06-15T09:00:00.000Z",
  },
  {
    id: "sample-news-3",
    title: "【サンプル】公式サイトをリニューアルしました",
    content: "<p>これはサンプル記事です。Team of Colors の公式サイトを公開しました。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1608613304899-ea8098577e38?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "info", name: "お知らせ" },
    publishedAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "sample-news-4",
    title: "【サンプル】夏季休業のお知らせ",
    content: "<p>これはサンプル記事です。8月13日〜16日は夏季休業とさせていただきます。</p>",
    category: { id: "info", name: "お知らせ" },
    publishedAt: "2026-05-20T09:00:00.000Z",
  },
];

// トップページのWORKSグリッド6件（ハードコード側）と同素材のサンプル
const SAMPLE_WORKS: Post[] = [
  {
    id: "sample-work-1",
    title: "洞窟テーマカフェ「岩窟」内装",
    content:
      "<p>これはmicroCMS未接続時のサンプル実績です。FRPによる大型擬岩をフルスクラッチで制作しました。</p>",
    eyecatch: {
      url: "https://images.unsplash.com/photo-1702847341686-ba2c2b173371?w=1200&auto=format&fit=crop&q=85",
    },
    category: { id: "rock", name: "擬岩制作" },
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
    category: { id: "interior", name: "内装・エイジング" },
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
    category: { id: "rock", name: "擬岩制作" },
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
    category: { id: "rock", name: "擬岩制作" },
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
    category: { id: "scratch", name: "フルスクラッチ" },
    tags: ["FULL SCRATCH", "CRAFT"],
    publishedAt: "2026-04-01T09:00:00.000Z",
  },
];

const SAMPLE_DATA: Record<Endpoint, Post[]> = {
  news: SAMPLE_NEWS,
  works: SAMPLE_WORKS,
};
