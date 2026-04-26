import { getSmsConfig } from "./config";

export interface SmsSendInput {
  to: string;
  body: string;
}

export interface SmsSendResult {
  ok: boolean;
  provider: string;
  to: string;
  bodyPreview: string;
}

export async function sendSms(input: SmsSendInput): Promise<SmsSendResult> {
  const config = getSmsConfig();

  return {
    ok: true,
    provider: config.provider,
    to: input.to,
    bodyPreview: input.body.slice(0, 40),
  };
}