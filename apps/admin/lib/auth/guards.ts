import { redirect } from "next/navigation";
import { readAdminSessionFromCookies } from "./session";

export async function requireAdminSession() {
  const session = await readAdminSessionFromCookies();

  if (!session) {
    redirect("/login");
  }

  return session;
}