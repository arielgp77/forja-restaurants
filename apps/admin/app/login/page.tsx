export default function AdminLoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, border: "1px solid #ddd", borderRadius: 12, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Admin Login</h1>
        <p>Bootstrap access for MB13 base auth.</p>

        <form action="/api/auth/login" method="post" style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Email</span>
            <input name="email" type="email" required />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Password</span>
            <input name="password" type="password" required />
          </label>

          <button type="submit">Login</button>
        </form>

        <form action="/api/auth/logout" method="post" style={{ marginTop: 12 }}>
          <button type="submit">Logout</button>
        </form>
      </div>
    </main>
  );
}