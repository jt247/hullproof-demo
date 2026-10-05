import { db, newId } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { json, unauthorized, withErrors } from "@/lib/http";

export const POST = withErrors(async (req) => {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "Choose a file" }, 400);

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = newId();
  db.prepare("INSERT INTO files (id, owner_id, original_name, size_bytes, data) VALUES (?, ?, ?, ?, ?)").run(
    id,
    user.id,
    file.name,
    bytes.length,
    bytes,
  );
  return json({ id, name: file.name, size: bytes.length }, 201);
});
