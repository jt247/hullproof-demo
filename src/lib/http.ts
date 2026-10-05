import { NextResponse } from "next/server";
import { seed } from "./seed";

seed();

type Handler = (req: Request, ctx: { params: Record<string, string> }) => Promise<Response>;

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

export const unauthorized = () => json({ error: "Sign in required" }, 401);

export const notFound = () => json({ error: "Not found" }, 404);

// Shared error wrapper so every route answers failures the same way.
export function withErrors(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      const e = err as Error;
      return json({ error: e.message, stack: e.stack }, 500);
    }
  };
}
