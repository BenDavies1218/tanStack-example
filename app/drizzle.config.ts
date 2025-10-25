import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schemas/asset.drizzle.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/tanstack-example",
  },
  verbose: true,
  strict: true,
});
