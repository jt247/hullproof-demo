"use client";

import { useEffect, useState } from "react";
import AdminStats from "@/components/AdminStats";

type Row = { id: string; email: string; role: string; plan: string };

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    void (async () => {
      const me = await fetch("/api/me");
      if (!me.ok) return;
      const user = await me.json();
      setRole(user.role);
      if (user.role === "admin") setRows(await (await fetch("/api/admin/users")).json());
    })();
  }, []);

  async function remove(userId: string) {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setRows(rows.filter((r) => r.id !== userId));
  }

  if (role !== "admin") return <p>You do not have access to this page.</p>;

  return (
    <main>
      <h1>Admin</h1>
      <AdminStats />
      <table>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.email}</td>
              <td>{r.role}</td>
              <td>{r.plan}</td>
              <td>
                <button onClick={() => remove(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
