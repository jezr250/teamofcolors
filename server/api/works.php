<?php
// 施工実績中継API（microCMS worksエンドポイント）
// 旧 src/app/api/works/route.ts と同じ仕様
require_once __DIR__ . '/../lib/microcms.php';

handlePostsRequest('works');
