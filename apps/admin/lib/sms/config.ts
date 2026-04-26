export interface SmsConfig {
  provider: string;
  fromNumber: string;
  webhookSecret: string;
}

export function getSmsConfig(): SmsConfig {
  return {
    provider: process.env.SMS_PROVIDER ?? "twilio",
    fromNumber: process.env.SMS_FROM_NUMBER ?? "+10000000000",
    webhookSecret: process.env.SMS_WEBHOOK_SECRET ?? "dev-sms-secret",
  };
}