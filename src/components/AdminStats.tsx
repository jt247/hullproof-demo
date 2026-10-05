"use client";

import { useEffect, useState } from "react";
import { createAdminClient } from "@/lib/adminClient";

export default function AdminStats() {
  const [counts, setCounts] = useState<{ profiles: number; notes: number } | null>(null);

  useEffect(() => {
    const client = createAdminClient();
    void Promise.all([client.count("profiles"), client.count("notes")]).then(([profiles, notes]) =>
      setCounts({ profiles, notes }),
    );
  }, []);

  if (!counts) return <p>Loading totals</p>;
  return (
    <p>
      {counts.profiles} profiles, {counts.notes} notes
    </p>
  );
}
