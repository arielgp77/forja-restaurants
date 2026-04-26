import "server-only";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type {
  PendingProviderState,
  ProviderConnectionKey,
  ProviderConnectionRecord,
  ProviderConnectionStateFile,
} from "./types";

const STORE_PATH = path.join(process.cwd(), "state", "provider-connections.json");

async function ensureStoreFile(): Promise<void> {
  const dir = path.dirname(STORE_PATH);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    const initial: ProviderConnectionStateFile = {
      pending: [],
      connections: {},
    };
    await fs.writeFile(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

export async function readProviderConnectionState(): Promise<ProviderConnectionStateFile> {
  await ensureStoreFile();
  const raw = await fs.readFile(STORE_PATH, "utf8");
  const parsed = JSON.parse(raw) as ProviderConnectionStateFile;

  return {
    pending: Array.isArray(parsed.pending) ? parsed.pending : [],
    connections: parsed.connections ?? {},
  };
}

export async function writeProviderConnectionState(
  state: ProviderConnectionStateFile,
): Promise<void> {
  await ensureStoreFile();
  await fs.writeFile(STORE_PATH, JSON.stringify(state, null, 2), "utf8");
}

export async function createPendingState(
  provider: ProviderConnectionKey,
  hintEmail?: string,
): Promise<string> {
  const state = await readProviderConnectionState();
  const token = crypto.randomUUID();

  const entry: PendingProviderState = {
    provider,
    state: token,
    createdAt: new Date().toISOString(),
    hintEmail,
  };

  state.pending = [
    ...state.pending.filter((item) => item.provider !== provider),
    entry,
  ];

  await writeProviderConnectionState(state);
  return token;
}

export async function consumePendingState(
  provider: ProviderConnectionKey,
  token: string,
): Promise<PendingProviderState | null> {
  const state = await readProviderConnectionState();
  const match = state.pending.find(
    (item) => item.provider === provider && item.state === token,
  );

  state.pending = state.pending.filter(
    (item) => !(item.provider === provider && item.state === token),
  );

  await writeProviderConnectionState(state);
  return match ?? null;
}

export async function upsertConnection(
  provider: ProviderConnectionKey,
  record: ProviderConnectionRecord,
): Promise<void> {
  const state = await readProviderConnectionState();
  state.connections[provider] = record;
  await writeProviderConnectionState(state);
}

export async function removeConnection(
  provider: ProviderConnectionKey,
): Promise<void> {
  const state = await readProviderConnectionState();
  delete state.connections[provider];
  await writeProviderConnectionState(state);
}

export async function listConnections(): Promise<ProviderConnectionRecord[]> {
  const state = await readProviderConnectionState();

  return (Object.values(state.connections).filter(Boolean) as ProviderConnectionRecord[])
    .sort((a, b) => a.provider.localeCompare(b.provider));
}
