import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db, newId } from "./db";

// Stand in for a hosted auth provider. Password hashing lives inside it,
// the same way it would inside a real provider.

function hash(password: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 32);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

function matches(password: string, stored: string): boolean {
  const [saltHex, keyHex] = stored.split(":");
  const expected = Buffer.from(keyHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), 32);
  return timingSafeEqual(expected, actual);
}

export function signUp(email: string, password: string): string | null {
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) return null;
  const id = newId();
  db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)").run(id, email, hash(password));
  db.prepare("INSERT INTO profiles (id, display_name) VALUES (?, ?)").run(id, email.split("@")[0]);
  return id;
}

export function signIn(email: string, password: string): { userId: string; token: string } | null {
  const row = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as
    | { id: string; password_hash: string }
    | undefined;
  if (!row || !matches(password, row.password_hash)) return null;
  const token = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)").run(token, row.id);
  return { userId: row.id, token };
}

export function signOut(token: string): void {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}
