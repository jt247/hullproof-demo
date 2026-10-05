import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { json, unauthorized } from "@/lib/http";

const SetRole = z.object({ userId: z.string(), role: z.enum(["member", "admin"]) });
const Remove = z.object({ userId: z.string() });

export async function GET(req: Request) {
  if (!currentUser(req)) return unauthorized();
  const rows = db
    .prepare("SELECT u.id, u.email, p.role, p.plan FROM users u JOIN profiles p ON p.id = u.id ORDER BY u.email")
    .all();
  return json(rows);
}

export async function POST(req: Request) {
  if (!currentUser(req)) return unauthorized();
  const parsed = SetRole.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Pick a user and a role" }, 400);
  db.prepare("UPDATE profiles SET role = ? WHERE id = ?").run(parsed.data.role, parsed.data.userId);
  return json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!currentUser(req)) return unauthorized();
  const parsed = Remove.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Pick a user" }, 400);
  db.prepare("DELETE FROM notes WHERE owner_id = ?").run(parsed.data.userId);
  db.prepare("DELETE FROM files WHERE owner_id = ?").run(parsed.data.userId);
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(parsed.data.userId);
  db.prepare("DELETE FROM profiles WHERE id = ?").run(parsed.data.userId);
  db.prepare("DELETE FROM users WHERE id = ?").run(parsed.data.userId);
  return json({ ok: true });
}
