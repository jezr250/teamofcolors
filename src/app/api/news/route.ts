import { createPostsHandler } from "../_lib/postsHandler";

// お知らせ・ブログ（microCMS newsエンドポイントの中継）
export const GET = createPostsHandler("news");
