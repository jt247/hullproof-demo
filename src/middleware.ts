import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get("session")?.value);

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!hasSession) {
      return pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Sign in required" }, { status: 401 })
        : NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const res = NextResponse.next();
  const origin = req.headers.get("origin");
  if (pathname.startsWith("/api/") && origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Headers", "content-type");
  }
  return res;
}

export const config = { matcher: ["/admin/:path*", "/api/:path*"] };
