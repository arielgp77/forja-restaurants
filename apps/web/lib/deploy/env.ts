export interface WebDeployEnv {
  appEnv: string;
  webBaseUrl: string;
  internalApiBaseUrl: string;
  databaseUrl: string;
  authSecret: string;
  sessionCookieDomain: string;
}

export function getWebDeployEnv(): WebDeployEnv {
  return {
    appEnv: process.env.APP_ENV ?? "local",
    webBaseUrl: process.env.WEB_BASE_URL ?? "http://localhost:3000",
    internalApiBaseUrl: process.env.INTERNAL_API_BASE_URL ?? "http://localhost:3001",
    databaseUrl: process.env.DATABASE_URL ?? "",
    authSecret: process.env.AUTH_SECRET ?? "",
    sessionCookieDomain: process.env.SESSION_COOKIE_DOMAIN ?? "localhost",
  };
}