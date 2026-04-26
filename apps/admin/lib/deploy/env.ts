export interface AdminDeployEnv {
  appEnv: string;
  adminBaseUrl: string;
  internalApiBaseUrl: string;
  databaseUrl: string;
  authSecret: string;
  sessionCookieDomain: string;
}

export function getAdminDeployEnv(): AdminDeployEnv {
  return {
    appEnv: process.env.APP_ENV ?? "local",
    adminBaseUrl: process.env.ADMIN_BASE_URL ?? "http://localhost:3001",
    internalApiBaseUrl: process.env.INTERNAL_API_BASE_URL ?? "http://localhost:3001",
    databaseUrl: process.env.DATABASE_URL ?? "",
    authSecret: process.env.AUTH_SECRET ?? "",
    sessionCookieDomain: process.env.SESSION_COOKIE_DOMAIN ?? "localhost",
  };
}