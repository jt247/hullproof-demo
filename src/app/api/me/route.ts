import { currentUser } from "@/lib/session";
import { json, unauthorized } from "@/lib/http";

export async function GET(req: Request) {
  const user = currentUser(req);
  if (!user) return unauthorized();
  return json(user);
}
