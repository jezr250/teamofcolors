# Xserver デプロイガイド（xserverブランチ）

このブランチは **Xserver（共用レンタルサーバー）で動かすための構成** です。
今後のセッションで作業を再開するときは、まずこのファイルを読むこと。

## なぜこの構成か

Xserver / CORESERVER などの共用レンタルサーバーは **Node.js を常駐できない**
（Apache + PHP + MySQL の環境）。そのため：

| mainブランチ（Node前提） | xserverブランチ（このブランチ） |
|---|---|
| `output: "standalone"` でNodeサーバー起動 | `output: "export"` で静的HTML書き出し |
| `/api/contact`（API Route + Prisma + SQLite） | `server/api/contact.php`（PHP + MySQL） |
| `/admin/contacts`（Server Actions） | `server/admin/index.php`（PHP + セッション認証） |
| `next/image` の画像最適化 | `images.unoptimized: true` |

## ブランチ・ディレクトリ運用

```
~/projects/teamofcolors/          ← mainブランチ（リポジトリ本体 .git/ はここ）
~/projects/teamofcolors-xserver/  ← xserverブランチ（git worktreeで作成した作業コピー）
```

- **共通の修正（デザイン・文言・コンポーネント）→ mainでやる**
- **Xserver特有の修正（PHP・設定）→ xserverでやる**
- mainの修正は xserver側で `git merge main` して取り込む（**一方通行**。xserver→mainへはマージしない）
- Xserver本番が確定したら、xserverの内容をmainに統合して一本化する予定

## ディレクトリ構成（xserver固有分）

```
server/
├── api/contact.php    # お問い合わせ受信API（JSON受信→MySQL保存）
├── admin/index.php    # 問い合わせ管理画面（一覧・フィルター・ステータス変更）
├── api/news.php       # お知らせ・ブログ中継API（microCMS news）GET ?limit&offset / ?id=xxx
├── api/works.php      # 施工実績中継API（microCMS works）同上
├── lib/config.php     # DB接続情報・管理画面パスワード・microCMSキー ★本番アップ時に書き換える
├── lib/db.php         # PDO接続
├── lib/microcms.php   # microCMS中継の共通ロジック（キー未設定時はサンプルJSONを返す）
├── lib/sample-news.json / sample-works.json  # microCMS未設定時のサンプルデータ
├── lib/.htaccess      # lib/への直接アクセス禁止
└── schema.sql         # Contactテーブル定義（初回にphpMyAdminでインポート）
build-xserver.sh       # out/ + server/ → dist/public_html/ に組み立てるスクリプト
Dockerfile.php         # ローカル本番模擬用（php:8.2-apache + pdo_mysql）
```

## ローカルでの開発・テスト（Docker）

main側のコンテナと共存できるようポートを分けている：
Next.js開発 = **3001**、本番模擬PHP = **8080**（mainは3000のまま）。

```bash
cd ~/projects/teamofcolors-xserver

# 1. 静的ビルド（out/ が生成される）
docker compose run --rm -e NODE_ENV=production web npm run build

# 2. デプロイ物を組み立て（dist/public_html/ が完成）
./build-xserver.sh

# 3. 本番模擬環境を起動（Apache+PHP+MySQL。Xserverと同等の構成）
docker compose up -d php db

# 4. ブラウザで確認
#    サイト:    http://localhost:8080/
#    管理画面:  http://localhost:8080/admin/  （パスワード: admin ※compose環境変数）
```

フォーム送信テスト（コマンドで確認する場合）：

```bash
curl -s -X POST http://localhost:8080/api/contact.php \
  -H "Content-Type: application/json" \
  -d '{"name":"テスト","email":"test@example.com","message":"テスト送信"}'
# → {"success":true,"id":1} が返ればOK
```

デザイン修正しながら開発したいときは `docker compose up -d web` で
http://localhost:3001 に開発サーバーが立つ（ただしフォーム送信は
PHP環境がないので8080側で確認する）。

## 本番デプロイ手順（Xserver / CORESERVER 共通）

### 初回のみ：サーバー側の準備

1. サーバーパネルで **MySQLデータベースとユーザーを作成**（DB名・ユーザー名・パスワードを控える）
2. phpMyAdmin を開き、作成したDBに `server/schema.sql` をインポート（Contactテーブルができる）
3. `dist/public_html/lib/config.php` を本番の値に書き換える：
   - `DB_HOST` → Xserverは `localhost`（CORESERVERはパネル記載のホスト名）
   - `DB_NAME` / `DB_USER` / `DB_PASS` → 手順1で控えた値
   - `ADMIN_PASSWORD` → 推測されない強いパスワードに必ず変更
   - `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` → microCMSのサービスID・APIキー
     （未設定のままだとNews/Worksはサンプルデータ表示になる）

### 毎回のデプロイ

```bash
docker compose run --rm -e NODE_ENV=production web npm run build
./build-xserver.sh
# → dist/public_html/ の「中身」を FTP でサーバーの public_html/ へアップロード
```

注意：
- `config.php` を上書きアップロードしないこと（本番の接続情報が消える）。
  2回目以降は `lib/` を除いてアップロードするか、アップ後に再度書き換える。
- `schema.sql` はアップロード不要（DBに一度流すだけ）

## News/Blog（microCMS）中継 — 実装済み（2026-07-11）

ブラウザから直接microCMSを呼ぶとAPIキーが露出するため、PHP中継（プロキシ）方式。
- `server/api/news.php`・`works.php` が microCMS を中継（キーはサーバー側のみ）
- レスポンス形式は main の `/api/news`・`/api/works`（Route Handler）と同一。
  フロント側の違いは fetch 先が `.php` 付きな点だけ（Contact.tsxと同じパターン。
  対象: NewsSection.tsx / works・blog 各ページの apiPath）
- キー未設定時は `lib/sample-*.json` のサンプルデータを返す（登録前でも画面確認可）
- TODO: 転送量・API枠の節約用に、レスポンスの数分ファイルキャッシュを検討
- **Xserver契約後**（2026-07中旬予定）: 上記デプロイ手順を実行 → 問題なければ
  xserver ブランチを main に統合して一本化する。
  （CORESERVERでの事前テストはローカルDocker検証で代替済みのため省略）

## Xserver本番デプロイ時のチェックリスト

ローカルの模擬環境では検証できていない、サーバー固有の確認事項：

1. **PHPバージョン**: サーバーパネルで PHP 8.1 以上を選択（コードが8.1+前提）
2. **DBはMariaDB**: XserverのMySQLは実体がMariaDB。schema.sqlは互換構文のみだが認識しておく
3. **.htaccessの確認**: デプロイ後、ブラウザで `https://ドメイン/lib/config.php` を開き、
   中身が表示されない（真っ白 or 403）ことを確認する
   （ローカルのApacheコンテナは.htaccessを読まない設定のため未検証）
