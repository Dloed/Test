
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id             UUID       PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name      TEXT       NOT NULL,
  birth_date     DATE       NOT NULL,
  email          TEXT       NOT NULL UNIQUE,
  password_hash  TEXT       NOT NULL,
  role           TEXT       NOT NULL DEFAULT 'user',
  is_active      BOOLEAN    NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMP  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP  NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_role CHECK (LOWER(role) IN ('admin','user'))
);


