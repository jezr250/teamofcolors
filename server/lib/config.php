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

// microCMS（施工実績）。未設定の間は静的写真（works-manifest.json）だけが表示される。
// サービス作成後に https://<サービスID>.microcms.io の <サービスID> とAPIキーを設定する。
define('MICROCMS_SERVICE_DOMAIN', getenv('MICROCMS_SERVICE_DOMAIN') ?: '');
define('MICROCMS_API_KEY', getenv('MICROCMS_API_KEY') ?: '');

// お問い合わせ通知メール（lib/mail.php）
// 通知の宛先。カンマ区切りで複数指定できる。空にすると通知を送らない（DB保存のみ）。
// 開発中は制作者のアドレスに送っていたが、動作確認が済んだので会社のアドレスに切り替えた。
define('CONTACT_NOTIFY_TO', getenv('CONTACT_NOTIFY_TO') ?: 'tomo.syr.108@gmail.com');
// 差出人アドレス。★必ず teamofcolors.jp のアドレスにすること。
// 他ドメイン（送信者本人のアドレス等）にすると SPF/DKIM の検証に失敗し、
// Gmail 側で迷惑メール扱いになる。送信者への返信は Reply-To で行う。
define('CONTACT_MAIL_FROM', getenv('CONTACT_MAIL_FROM') ?: 'noreply@teamofcolors.jp');
define('CONTACT_MAIL_FROM_NAME', getenv('CONTACT_MAIL_FROM_NAME') ?: 'Team of Colors');
// 通知メール本文に載せる管理画面URL
define('ADMIN_URL', getenv('ADMIN_URL') ?: 'https://teamofcolors.jp/admin/');
