import { demoTeamMembers } from "@/lib/auth/dev-team";
import { getPermissionsForRole } from "@/lib/auth/rbac";
import { requirePermission } from "@/lib/auth/server-auth";

export default async function TeamSettingsPage() {
  const session = await requirePermission("team:read");
  const permissions = getPermissionsForRole(session.role);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h1 style={{ marginTop: 0 }}>Team Management</h1>
        <p style={{ color: "#94a3b8" }}>
          MB03 scaffold. Provider-neutral auth plus RBAC.
        </p>

        <div style={{ display: "grid", gap: 6 }}>
          <div><strong>Name:</strong> {session.name}</div>
          <div><strong>Email:</strong> {session.email}</div>
          <div><strong>Role:</strong> {session.role}</div>
          <div><strong>Tenant:</strong> {session.tenantSlug}</div>
        </div>
      </section>

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h2 style={{ marginTop: 0 }}>Granted permissions</h2>
        <ul>
          {permissions.map((permission) => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
      </section>

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h2 style={{ marginTop: 0 }}>Demo team</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #334155", paddingBottom: 8 }}>Name</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #334155", paddingBottom: 8 }}>Email</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #334155", paddingBottom: 8 }}>Role</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #334155", paddingBottom: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {demoTeamMembers
              .filter((member) => member.tenantSlug === session.tenantSlug)
              .map((member) => (
                <tr key={member.id}>
                  <td style={{ padding: "10px 0" }}>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>{member.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}