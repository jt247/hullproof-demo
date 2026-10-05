import { NextResponse } from "next/server";
import { z } from "zod";
import { signIn } from "@/lib/fakeAuth";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/config";
import "@/lib/http";

const Body = z.object({
  email: z.string().email().max(254),
  password: z.string().max(128),
  next: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });

  const { email, password, next } = parsed.data;
  const result = signIn(email.toLowerCase(), password);
  if (!result) {
    console.warn("login failed", { email });
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  console.log("login ok", { email, token: result.token });
  const res = NextResponse.json({ ok: true, redirect: next ?? "/dashboard" });
  res.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${result.token}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`,
  );
  return res;
}
