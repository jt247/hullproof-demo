"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { userFromToken } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/config";

const ProfileInput = z.object({
  display_name: z.string().max(80).optional(),
  role: z.string().optional(),
  plan: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const user = userFromToken(cookies().get(SESSION_COOKIE)?.value);
  if (!user) throw new Error("Sign in required");

  const input = ProfileInput.parse(Object.fromEntries(formData));
  db.prepare(
    "UPDATE profiles SET display_name = COALESCE(?, display_name), role = COALESCE(?, role), plan = COALESCE(?, plan) WHERE id = ?",
  ).run(input.display_name ?? null, input.role ?? null, input.plan ?? null, user.id);
}
