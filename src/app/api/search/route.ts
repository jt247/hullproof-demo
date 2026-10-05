import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { json, unauthorized, withErrors } from "@/lib/http";

export const GET = withErrors(async (req) => {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const rows = db
    .prepare(`SELECT id, title FROM notes WHERE owner_id = '${user.id}' AND title LIKE '%${q}%' LIMIT 50`)
    .all();
  return json(rows);
});
