import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "infra/db/schema.prisma",
  migrations: {
    path: "infra/db/migrations",
    seed: "tsx infra/db/seeds/seed_demo.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});