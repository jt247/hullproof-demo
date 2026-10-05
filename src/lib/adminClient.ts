// Tiny stand in for a Supabase client, used by the admin dashboard widgets.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? "";
  return {
    async count(table: string): Promise<number> {
      const res = await fetch(`${url}/rest/v1/${table}?select=id`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
      });
      const rows = (await res.json()) as unknown[];
      return rows.length;
    },
  };
}
