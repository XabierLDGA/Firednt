import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Next.js loads .env.local by itself; drizzle-kit runs outside Next, so load it here.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: { url },
});
