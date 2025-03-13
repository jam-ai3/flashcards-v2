CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  token TEXT,
  confirmation_code TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  subscription_start INTEGER,
  subscription_end INTEGER,
  paid_generates INTEGER NOT NULL,
  free_generates INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users_new (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  token TEXT,
  confirmation_code TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  subscription_start INTEGER,
  subscription_end INTEGER,
  subscription_type TEXT,
  paid_generates INTEGER NOT NULL,
  free_generates INTEGER NOT NULL,
  subscription_generates_used INTEGER NOT NULL
);
