import Link from "next/link";
import type { ReactNode } from "react";

const linkStyle = { color: "#93c5fd", textDecoration: "none" };

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #1e293b" }}>
        <div>
          <strong>Forja Restaurants Admin</strong>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Link href="/settings/team" style={linkStyle}>Team</Link>
          <Link href="/content/story" style={linkStyle}>Story</Link>
          <Link href="/settings/branding" style={linkStyle}>Branding</Link>
          <Link href="/settings/pricing" style={linkStyle}>Pricing</Link>
          <Link href="/menu" style={linkStyle}>Menu</Link>
          <Link href="/orders" style={linkStyle}>Orders</Link>
          <Link href="/ops/board" style={linkStyle}>Ops</Link>
          <Link href="/ops/curbside" style={linkStyle}>Curbside</Link>
          <Link href="/finance/payouts" style={linkStyle}>Payouts</Link>

          <form action="/api/internal/dev-sign-out" method="POST">
            <button type="submit" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0" }}>
              Sign out
            </button>
          </form>
        </nav>
      </header>

      <main style={{ padding: 24 }}>
        {children}
      </main>
    </div>
  );
}