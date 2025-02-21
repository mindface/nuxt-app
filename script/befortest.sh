#!/bin/bash

# 環境変数の設定
DATABASE_URL=${DATABASE_URL:-"postgresql://root:1234ewq1@localhost:5432/test_db?schema=public"}

# Prismaの環境設定ファイルを読み込み
echo "設定するデータベースURL: $DATABASE_URL"
export DATABASE_URL

# Prisma の初期化
echo "Prisma を初期化します..."

npx prisma migrate reset -f --skip-seed

# Prisma マイグレーションを実行（スキーマをデータベースに反映）
npx prisma migrate deploy

# Prisma の生成を実行（クライアントのコードを生成）
npx prisma generate

# 初期データの挿入（任意）
echo "テストデータを挿入します..."

# 例として、ユーザーを挿入
npx prisma db seed

echo "Prisma 初期化とマイグレーションが完了しました。"
