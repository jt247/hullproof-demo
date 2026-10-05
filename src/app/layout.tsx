import type { ReactNode } from "react";

export const metadata = { title: "Notebook Demo" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", maxWidth: 760, margin: "2rem auto", padding: "0 1rem" }}>
        <p style={{ background: "#fde68a", color: "#1f2937", padding: "0.75rem", borderRadius: 6 }}>
          Intentionally vulnerable demo. Never deploy it. Never enter real data.
        </p>
        {children}
      </body>
    </html>
  );
}
