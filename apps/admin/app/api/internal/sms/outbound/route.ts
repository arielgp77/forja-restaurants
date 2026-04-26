import { NextResponse } from "next/server";
import { sendSms } from "../../../../../lib/sms/service";

export async function POST(request: Request) {
  const body = await request.json();

  const result = await sendSms({
    to: String(body?.to ?? ""),
    body: String(body?.body ?? ""),
  });

  return NextResponse.json(result);
}