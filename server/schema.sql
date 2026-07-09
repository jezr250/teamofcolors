-- お問い合わせテーブル（旧 prisma/schema.prisma の Contact モデルと同じ構造）
-- Xserver / CORESERVER では phpMyAdmin からこのファイルをインポートして実行する

CREATE TABLE IF NOT EXISTS Contact (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  company   VARCHAR(255) NULL,
  email     VARCHAR(255) NOT NULL,
  phone     VARCHAR(50)  NULL,
  message   TEXT         NOT NULL,
  status    VARCHAR(20)  NOT NULL DEFAULT 'new',
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
