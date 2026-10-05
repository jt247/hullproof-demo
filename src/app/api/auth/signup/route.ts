import { z } from "zod";
import { signUp } from "@/lib/fakeAuth";
import { json } from "@/lib/http";

const Body = z.object({
  email: z.string().email().max(254),
  password: z.string().min(6).max(128),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Check the email and password and try again" }, 400);
  const id = signUp(parsed.data.email.toLowerCase(), parsed.data.password);
  if (!id) return json({ error: "We could not create that account" }, 400);
  return json({ ok: true }, 201);
}
