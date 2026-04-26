export default function SignInPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#020617", color: "#e2e8f0" }}>
      <div style={{ width: 420, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Dev Sign-In</h1>
        <p style={{ color: "#94a3b8" }}>
          This is a development-only session bootstrap for MB03.
        </p>

        <form action="/api/internal/dev-sign-in" method="POST" style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Name</div>
            <input name="name" defaultValue="Demo Owner" style={{ width: "100%", padding: 10, borderRadius: 8 }} />
          </label>

          <label>
            <div>Email</div>
            <input name="email" defaultValue="owner@demo-pizzeria.local" style={{ width: "100%", padding: 10, borderRadius: 8 }} />
          </label>

          <label>
            <div>Tenant slug</div>
            <input name="tenantSlug" defaultValue="demo-pizzeria" style={{ width: "100%", padding: 10, borderRadius: 8 }} />
          </label>

          <label>
            <div>Role</div>
            <select name="role" defaultValue="restaurant_owner" style={{ width: "100%", padding: 10, borderRadius: 8 }}>
              <option value="platform_admin">platform_admin</option>
              <option value="restaurant_owner">restaurant_owner</option>
              <option value="restaurant_manager">restaurant_manager</option>
              <option value="kitchen_staff">kitchen_staff</option>
              <option value="support_staff">support_staff</option>
              <option value="driver">driver</option>
              <option value="customer">customer</option>
            </select>
          </label>

          <input type="hidden" name="redirectTo" value="/settings/team" />

          <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
            Start dev session
          </button>
        </form>
      </div>
    </main>
  );
}