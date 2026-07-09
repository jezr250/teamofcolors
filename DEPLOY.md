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
├── lib/config.php     # DB接続情報・管理画面パスワード ★本番アップ時に書き換える
├── lib/db.php         # PDO接続
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

## 今後の予定

- **News/Blog（microCMS）**: ブラウザから直接microCMSを呼ぶとAPIキーが露出する
  ため、`server/api/news.php` にPHP中継（プロキシ）を作る方式で実装予定。
  キーはサーバー側だけに置き、レスポンスは数分ファイルキャッシュしてAPI枠を節約する。
- **Xserver契約後**（2026-07中旬予定）: CORESERVERでテスト済みの手順をそのまま実行 →
  問題なければ xserver ブランチを main に統合して一本化する。
