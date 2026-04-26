import { NextResponse } from "next/server";
import { getSquareStartUrl } from "../../../../../lib/provider-connections/providers/square-oauth.server";
import { createPendingState } from "../../../../../lib/provider-connections/store.server";

export async function GET(request: Request) {
  const state = await createPendingState("square");
  const redirect = await getSquareStartUrl(state);
  return NextResponse.redirect(redirect);
}
