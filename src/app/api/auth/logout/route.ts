import { NextResponse } from "next/server";
import { signOut } from "@/lib/fakeAuth";
import { tokenFromCookieHeader } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/config";

export async function POST(req: Request) {
  const token = tokenFromCookieHeader(req.headers.get("cookie"));
  if (token) signOut(token);
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`);
  return res;
}
