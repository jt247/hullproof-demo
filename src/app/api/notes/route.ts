import { z } from "zod";
import { db, newId } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { json, unauthorized } from "@/lib/http";

const Create = z.object({ title: z.string().min(1).max(200), body: z.string().max(20000).default("") });

export async function GET(req: Request) {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 50);
  const rows = db
    .prepare("SELECT id, title, archived, created_at FROM notes WHERE owner_id = ? ORDER BY created_at DESC LIMIT ?")
    .all(user.id, limit);
  return json(rows);
}

export async function POST(req: Request) {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const parsed = Create.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Check the title and body" }, 400);
  const id = newId();
  db.prepare("INSERT INTO notes (id, owner_id, title, body) VALUES (?, ?, ?, ?)").run(
    id,
    user.id,
    parsed.data.title,
    parsed.data.body,
  );
  return json({ id }, 201);
}
