import "server-only";

import { getAppBaseUrl, getStripeConnectConfig } from "../config";

function buildAuthorizeUrl(params: URLSearchParams): string {
  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
}

export async function getStripeStartUrl(input: {
  state: string;
  hintEmail?: string;
}) {
  const cfg = getStripeConnectConfig();
  const appBaseUrl = getAppBaseUrl();

  const redirectUri = `${appBaseUrl}/api/provider-connections/stripe/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: cfg.clientId,
    scope: "read_write",
    state: input.state,
    redirect_uri: redirectUri,
  });

  if (input.hintEmail) {
    params.set("stripe_user[email]", input.hintEmail);
  }

  return buildAuthorizeUrl(params);
}

export async function exchangeStripeCode(code: string) {
  const cfg = getStripeConnectConfig();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
  });

  const response = await fetch("https://connect.stripe.com/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error_description || data?.error || "Stripe OAuth exchange failed.");
  }

  return data as {
    stripe_user_id: string;
    scope: string;
    livemode: boolean;
    refresh_token?: string;
  };
}

export async function deauthorizeStripeAccount(stripeUserId: string) {
  const cfg = getStripeConnectConfig();

  const body = new URLSearchParams({
    client_id: cfg.clientId,
    stripe_user_id: stripeUserId,
  });

  const response = await fetch("https://connect.stripe.com/oauth/deauthorize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe deauthorize failed: ${text}`);
  }

  return await response.json();
}
