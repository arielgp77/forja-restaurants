export type AdminRole = "owner" | "manager" | "staff" | "kitchen" | "pickup";

export interface AdminAuthConfig {
  cookieName: string;
  sessionTtlHours: number;
  authSecret: string;
  bootstrapOwnerEmail: string;
  bootstrapOwnerPassword: string;
  bootstrapTenantSlug: string;
}

export function getAdminAuthConfig(): AdminAuthConfig {
  return {
    cookieName: process.env.AUTH_COOKIE_NAME ?? "fr_admin_session",
    sessionTtlHours: Number(process.env.AUTH_SESSION_TTL_HOURS ?? "12"),
    authSecret: process.env.AUTH_SECRET ?? "dev-change-me-auth-secret",
    bootstrapOwnerEmail: process.env.AUTH_BOOTSTRAP_OWNER_EMAIL ?? "owner@example.com",
    bootstrapOwnerPassword: process.env.AUTH_BOOTSTRAP_OWNER_PASSWORD ?? "CHANGE_ME",
    bootstrapTenantSlug: process.env.AUTH_BOOTSTRAP_TENANT_SLUG ?? "demo-pizzeria",
  };
}