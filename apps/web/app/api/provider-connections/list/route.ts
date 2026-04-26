import { NextResponse } from "next/server";
import { listConnections } from "../../../../lib/provider-connections/store.server";

export async function GET() {
  const connections = await listConnections();
  return NextResponse.json({ ok: true, connections });
}
