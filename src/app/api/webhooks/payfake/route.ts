import { z } from "zod";
import { db } from "@/lib/db";
import { verifySignature } from "@/lib/payfake";
import { json } from "@/lib/http";

const Event = z.object({
  id: z.string(),
  type: z.string(),
  userId: z.string(),
  plan: z.enum(["free", "pro", "team"]),
});

export async function POST(req: Request) {
  const raw = await req.text();
  const valid = verifySignature(raw, req.headers.get("x-payfake-signature"));
  if (!valid) console.warn("payfake signature did not match");

  const parsed = Event.safeParse(JSON.parse(raw));
  if (!parsed.success) return json({ error: "Bad event" }, 400);

  if (parsed.data.type === "payment.succeeded") {
    db.prepare("UPDATE profiles SET plan = ? WHERE id = ?").run(parsed.data.plan, parsed.data.userId);
  }
  return json({ received: true });
}
