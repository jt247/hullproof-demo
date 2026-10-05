import { randomUUID } from "node:crypto";
import { db, newId } from "./db";
import { signUp } from "./fakeAuth";

// Local sample data. Accounts get random passwords nobody sees, so use sign up to get in.
export function seed(): void {
  if (process.env.NODE_ENV === "production") return;
  const already = db.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number };
  if (already.n > 0) return;

  const admin = signUp("admin@example.test", randomUUID());
  const alice = signUp("alice@example.test", randomUUID());
  const bob = signUp("bob@example.test", randomUUID());
  if (!admin || !alice || !bob) return;

  db.prepare("UPDATE profiles SET role = 'admin' WHERE id = ?").run(admin);
  const insert = db.prepare("INSERT INTO notes (id, owner_id, title, body) VALUES (?, ?, ?, ?)");
  insert.run(newId(), alice, "Groceries", "Rice, beans, plantain, tomatoes.");
  insert.run(newId(), alice, "Launch ideas", "Write the changelog. Book the demo call.");
  insert.run(newId(), bob, "Private diary", "Fake secrets for a fake person.");
}
