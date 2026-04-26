export type ProviderConnectionKey = "stripe" | "square" | "adyen";

export interface ProviderConnectionRecord {
  provider: ProviderConnectionKey;
  connected: boolean;
  connectedAt?: string;
  environment?: string;
  accountId?: string;
  merchantId?: string;
  label?: string;
  mode: "oauth" | "manual";
  accessToken?: string;
  refreshToken?: string;
  metadata?: Record<string, string>;
}

export interface PendingProviderState {
  provider: ProviderConnectionKey;
  state: string;
  createdAt: string;
  hintEmail?: string;
}

export interface ProviderConnectionStateFile {
  pending: PendingProviderState[];
  connections: Partial<Record<ProviderConnectionKey, ProviderConnectionRecord>>;
}
