import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";

const SCHEMA = `
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE profiles (
  id TEXT PRIMARY KEY REFERENCES users(id),
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  plan TEXT NOT NULL DEFAULT 'free'
);
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  archived INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES profiles(id),
  original_name TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  data BLOB NOT NULL
);
`;

const holder = globalThis as unknown as { __demoDb?: DatabaseSync };

function open(): DatabaseSync {
  const database = new DatabaseSync(":memory:");
  database.exec(SCHEMA);
  return database;
}

export const db: DatabaseSync = (holder.__demoDb ??= open());

export const newId = (): string => randomUUID();
