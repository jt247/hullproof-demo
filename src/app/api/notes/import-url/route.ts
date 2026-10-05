import { z } from "zod";
import { db, newId } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { json, unauthorized, withErrors } from "@/lib/http";

const Body = z.object({ url: z.string().url().max(2000) });

export const POST = withErrors(async (req) => {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Enter a valid link" }, 400);

  const page = await fetch(parsed.data.url);
  const text = (await page.text()).slice(0, 20000);
  const id = newId();
  db.prepare("INSERT INTO notes (id, owner_id, title, body) VALUES (?, ?, ?, ?)").run(
    id,
    user.id,
    `Imported from ${new URL(parsed.data.url).hostname}`,
    text,
  );
  return json({ id }, 201);
});
