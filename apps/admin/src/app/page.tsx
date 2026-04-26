import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Forja Restaurants Admin</h1>
      <p>MB03 auth scaffold seeded.</p>
      <p>
        <Link href="/sign-in" style={{ color: "#22c55e" }}>
          Go to sign-in
        </Link>
      </p>
      <p>
        <Link href="/settings/team" style={{ color: "#22c55e" }}>
          Go to team settings
        </Link>
      </p>
    </main>
  );
}