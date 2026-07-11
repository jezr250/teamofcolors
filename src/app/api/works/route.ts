import { createPostsHandler } from "../_lib/postsHandler";

// 施工実績（microCMS worksエンドポイントの中継）
export const GET = createPostsHandler("works");
