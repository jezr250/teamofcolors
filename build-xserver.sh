#!/usr/bin/env bash
# Xserverアップロード用の成果物を dist/public_html/ に組み立てる
#
# 事前に Next.js を静的ビルドしておくこと:
#   docker compose run --rm -e NODE_ENV=production web npm run build
#
# 完成した dist/public_html/ の中身を、そのままサーバーの public_html/ へ
# アップロードすれば公開できる。

set -eu
cd "$(dirname "$0")"

if [ ! -d out ]; then
  echo "エラー: out/ がありません。先に npm run build を実行してください" >&2
  exit 1
fi

rm -rf dist/public_html
mkdir -p dist/public_html/api

cp -r out/. dist/public_html/
cp server/api/contact.php dist/public_html/api/
cp -r server/admin dist/public_html/admin
cp -r server/lib dist/public_html/lib

echo "完成: dist/public_html/ の中身をサーバーの public_html/ にアップロードしてください"
