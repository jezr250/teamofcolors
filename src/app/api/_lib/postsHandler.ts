import { NextRequest, NextResponse } from "next/server";
import { getPostList, getPostDetail, type Endpoint } from "@/lib/microcms";

// microCMS中継APIの共通ハンドラ（APIキーをクライアントに出さないための中継）
// - GET /api/works?limit=12&offset=0&category=xxx → 記事一覧（PostListResponse）
// - GET /api/works?id=xxx                         → 記事詳細（Post）
// Xserver版では同じレスポンス形式の server/api/works.php に置き換える。

export function createPostsHandler(endpoint: Endpoint) {
  return async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    try {
      if (id) {
        const post = await getPostDetail(endpoint, id);
        if (!post) {
          return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
        }
        return NextResponse.json(post);
      }

      const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 12, 1), 50);
      const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);
      const category = searchParams.get("category") || undefined;
      const list = await getPostList(endpoint, { limit, offset, category });
      return NextResponse.json(list);
    } catch {
      return NextResponse.json(
        { error: "記事の取得に失敗しました。しばらくしてから再度お試しください。" },
        { status: 502 }
      );
    }
  };
}
