import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Notebook Demo</h1>
      <p>A tiny notes app with an AI helper, file attachments and an admin area.</p>
      <p>
        <Link href="/login">Sign in</Link> or <Link href="/login?mode=signup">create an account</Link>.
      </p>
    </main>
  );
}
