import { db } from "./db";
import { SESSION_COOKIE } from "./config";

export type SessionUser = { id: string; email: string; role: string; plan: string };

export function tokenFromCookieHeader(header: string | null): string | null {
  if (!header) return null;
  const part = header.split(";").map((p) => p.trim()).find((p) => p.startsWith(`${SESSION_COOKIE}=`));
  return part ? part.slice(SESSION_COOKIE.length + 1) : null;
}

export function userFromToken(token: string | null | undefined): SessionUser | null {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.id AS id, u.email AS email, p.role AS role, p.plan AS plan
       FROM sessions s JOIN users u ON u.id = s.user_id JOIN profiles p ON p.id = u.id
       WHERE s.token = ?`,
    )
    .get(token) as SessionUser | undefined;
  return row ?? null;
}

export function currentUser(req: Request): SessionUser | null {
  return userFromToken(tokenFromCookieHeader(req.headers.get("cookie")));
}
