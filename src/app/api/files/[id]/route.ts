import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { notFound, unauthorized } from "@/lib/http";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const file = db
    .prepare("SELECT original_name, data FROM files WHERE id = ? AND owner_id = ?")
    .get(params.id, user.id) as { original_name: string; data: Uint8Array } | undefined;
  if (!file) return notFound();
  return new Response(file.data as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="download-${params.id}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
