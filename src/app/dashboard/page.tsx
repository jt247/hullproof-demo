"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { updateProfile } from "../actions/profile";

type Note = { id: string; title: string };
type Me = { email: string; role: string; plan: string };

export default function Dashboard() {
  const [me, setMe] = useState<Me | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const meRes = await fetch("/api/me");
    if (!meRes.ok) {
      window.location.href = "/login?next=/dashboard";
      return;
    }
    setMe(await meRes.json());
    setNotes(await (await fetch("/api/notes")).json());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: form.get("title"), body: form.get("body") }),
    });
    e.currentTarget.reset();
    await load();
  }

  async function ask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/ai/assistant", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: form.get("question"), noteId: form.get("noteId") || undefined }),
    });
    const data = await res.json();
    setAnswer(data.answer ?? data.error);
  }

  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/files", { method: "POST", body: new FormData(e.currentTarget) });
    setStatus(res.ok ? "Uploaded" : "Upload failed");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  if (!me) return <p>Loading</p>;

  return (
    <main>
      <h1>Your notes</h1>
      <p>
        Signed in as {me.email} ({me.plan} plan) <button onClick={logout}>Sign out</button>
        {me.role === "admin" && <> <a href="/admin">Admin</a></>}
      </p>

      <ul>
        {notes.map((n) => (
          <li key={n.id}>{n.title}</li>
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input name="title" placeholder="Title" required /> <input name="body" placeholder="Body" />{" "}
        <button type="submit">Add note</button>
      </form>

      <h2>Ask the assistant</h2>
      <form onSubmit={ask}>
        <input name="question" placeholder="Summarise this note" required />{" "}
        <input name="noteId" placeholder="Note id (optional)" /> <button type="submit">Ask</button>
      </form>
      <p>{answer}</p>

      <h2>Attachments</h2>
      <form onSubmit={upload}>
        <input name="file" type="file" required /> <button type="submit">Upload</button>
      </form>
      <p role="status">{status}</p>

      <h2>Profile</h2>
      <form action={updateProfile}>
        <input name="display_name" placeholder="Display name" /> <button type="submit">Save</button>
      </form>
    </main>
  );
}
