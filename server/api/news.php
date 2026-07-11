<?php
// お知らせ・ブログ中継API（microCMS newsエンドポイント）
// 旧 src/app/api/news/route.ts と同じ仕様
require_once __DIR__ . '/../lib/microcms.php';

handlePostsRequest('news');
