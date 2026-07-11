<?php
// 接続情報・パスワード設定
//
// ローカル（Docker）では環境変数から読み込まれる。
// Xserver / CORESERVER にアップロードしたら、サーバーパネルで作成した
// MySQL の情報に「右側の値」を書き換えること。
//   例: define('DB_HOST', 'localhost');  // Xserverは localhost
//       define('DB_NAME', 'xxxxx_teamofcolors');
//       define('DB_USER', 'xxxxx_toc');
//       define('DB_PASS', '********');

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'teamofcolors');
define('DB_USER', getenv('DB_USER') ?: 'toc');
define('DB_PASS', getenv('DB_PASS') ?: 'tocpass');

// 管理画面（/admin/）のログインパスワード。本番では必ず変更すること。
define('ADMIN_PASSWORD', getenv('ADMIN_PASSWORD') ?: 'admin');

// microCMS（News/Blog・施工実績）。未設定の間はサンプルデータが表示される。
// サービス作成後に https://<サービスID>.microcms.io の <サービスID> とAPIキーを設定する。
define('MICROCMS_SERVICE_DOMAIN', getenv('MICROCMS_SERVICE_DOMAIN') ?: '');
define('MICROCMS_API_KEY', getenv('MICROCMS_API_KEY') ?: '');
