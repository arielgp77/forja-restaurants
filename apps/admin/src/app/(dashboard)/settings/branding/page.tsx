import { requirePermission } from "@/lib/auth/server-auth";
import { getAdminRestaurantBundle } from "@/lib/db";

function cardStyle() {
  return {
    padding: 20,
    border: "1px solid #1e293b",
    borderRadius: 16,
    background: "#0f172a",
  } as const;
}

function inputStyle() {
  return {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e2e8f0",
  } as const;
}

export default async function BrandingPage() {
  const session = await requirePermission("settings:read");
  const bundle = await getAdminRestaurantBundle(session.tenantSlug);

  if (!bundle?.restaurant) {
    return <main><h1>Restaurant not found for tenant {session.tenantSlug}</h1></main>;
  }

  const theme = bundle.restaurant.theme;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section style={cardStyle()}>
        <h1 style={{ marginTop: 0 }}>Branding</h1>
        <p style={{ color: "#94a3b8" }}>
          Ajusta colores y preset.
        </p>

        <form action="/api/internal/cms/branding" method="POST" style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Primary color</div>
            <input name="primaryColor" defaultValue={theme?.primaryColor ?? ""} style={inputStyle()} />
          </label>

          <label>
            <div>Secondary color</div>
            <input name="secondaryColor" defaultValue={theme?.secondaryColor ?? ""} style={inputStyle()} />
          </label>

          <label>
            <div>Accent color</div>
            <input name="accentColor" defaultValue={theme?.accentColor ?? ""} style={inputStyle()} />
          </label>

          <label>
            <div>Theme preset</div>
            <input name="themePreset" defaultValue={theme?.themePreset ?? ""} style={inputStyle()} />
          </label>

          <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
            Save branding
          </button>
        </form>
      </section>
    </div>
  );
}