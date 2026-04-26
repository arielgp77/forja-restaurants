import "server-only";

import { getAppBaseUrl, getSquareOauthConfig } from "../config";

function getSquareBase(environment: "sandbox" | "production") {
  return environment === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

export async function getSquareStartUrl(state: string) {
  const cfg = getSquareOauthConfig();
  const appBaseUrl = getAppBaseUrl();
  const redirectUri = `${appBaseUrl}/api/provider-connections/square/callback`;

  const params = new URLSearchParams({
    client_id: cfg.appId,
    scope: cfg.scopes.join(" "),
    session: "false",
    state,
    redirect_uri: redirectUri,
  });

  return `${getSquareBase(cfg.environment)}/oauth2/authorize?${params.toString()}`;
}

export async function exchangeSquareCode(code: string) {
  const cfg = getSquareOauthConfig();
  const appBaseUrl = getAppBaseUrl();
  const redirectUri = `${appBaseUrl}/api/provider-connections/square/callback`;

  const response = await fetch(`${getSquareBase(cfg.environment)}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Square-Version": "2026-01-22",
    },
    body: JSON.stringify({
      client_id: cfg.appId,
      client_secret: cfg.appSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || data?.errors?.[0]?.detail || "Square OAuth exchange failed.");
  }

  return data as {
    merchant_id?: string;
    access_token: string;
    refresh_token?: string;
    expires_at?: string;
  };
}
