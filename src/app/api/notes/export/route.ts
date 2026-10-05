import { db } from "@/lib/db";
import { json } from "@/lib/http";

// Nightly report job reads this to count notes per owner.
export async function GET() {
  const rows = db.prepare("SELECT n.id, n.title, n.body, u.email FROM notes n JOIN users u ON u.id = n.owner_id").all();
  return json(rows);
}
