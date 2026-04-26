import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Forja Restaurants Web</h1>
      <p style={{ color: "#94a3b8" }}>
        MB04 scaffold activo. Usa el tenant demo:
      </p>

      <p>
        <Link href="/r/demo-pizzeria" style={{ color: "#22c55e", fontWeight: 700 }}>
          /r/demo-pizzeria
        </Link>
      </p>
    </main>
  );
}