import { createHmac, timingSafeEqual } from "node:crypto";
import { API_SECRET } from "./config";

// Fake payment provider. It signs each event body with a shared secret.
export function sign(rawBody: string): string {
  return createHmac("sha256", API_SECRET).update(rawBody).digest("hex");
}

export function verifySignature(rawBody: string, header: string | null): boolean {
  if (!header) return false;
  const expected = Buffer.from(sign(rawBody));
  const actual = Buffer.from(header);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
