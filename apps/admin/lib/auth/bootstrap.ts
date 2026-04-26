import crypto from "node:crypto";
import { getAdminAuthConfig } from "./config";

function safeEqualStrings(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateBootstrapCredentials(email: string, password: string): boolean {
  const config = getAdminAuthConfig();

  const normalizedEmail = email.trim().toLowerCase();
  const expectedEmail = config.bootstrapOwnerEmail.trim().toLowerCase();

  return (
    safeEqualStrings(normalizedEmail, expectedEmail) &&
    safeEqualStrings(password, config.bootstrapOwnerPassword)
  );
}