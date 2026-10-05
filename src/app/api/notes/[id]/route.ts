import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { json, notFound, unauthorized } from "@/lib/http";

type Ctx = { params: { id: string } };

const Patch = z.object({ title: z.string().min(1).max(200).optional(), body: z.string().max(20000).optional() });

export async function GET(req: Request, { params }: Ctx) {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const note = db.prepare("SELECT id, owner_id, title, body, archived FROM notes WHERE id = ?").get(params.id);
  if (!note) return notFound();
  return json(note);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const parsed = Patch.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Check the title and body" }, 400);
  const result = db
    .prepare("UPDATE notes SET title = COALESCE(?, title), body = COALESCE(?, body) WHERE id = ? AND owner_id = ?")
    .run(parsed.data.title ?? null, parsed.data.body ?? null, params.id, user.id);
  return result.changes ? json({ ok: true }) : notFound();
}

export async function DELETE(req: Request, { params }: Ctx) {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const result = db.prepare("DELETE FROM notes WHERE id = ? AND owner_id = ?").run(params.id, user.id);
  return result.changes ? json({ ok: true }) : notFound();
}
