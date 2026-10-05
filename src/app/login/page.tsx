"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const mode = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") ?? "login";
    const params = new URLSearchParams(window.location.search);
    const body = { email: form.get("email"), password: form.get("password"), next: params.get("next") ?? undefined };

    const res = await fetch(mode === "signup" ? "/api/auth/signup" : "/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error ?? "Something went wrong");
    if (mode === "signup") return setMessage("Account created. Now sign in.");
    window.location.href = data.redirect;
  }

  return (
    <main>
      <h1>Sign in</h1>
      <form onSubmit={submit}>
        <p>
          <label>
            Email <input name="email" type="email" required />
          </label>
        </p>
        <p>
          <label>
            Password <input name="password" type="password" required />
          </label>
        </p>
        <button type="submit" value="login">Sign in</button> <button type="submit" value="signup">Sign up</button>
      </form>
      <p role="status">{message}</p>
    </main>
  );
}
