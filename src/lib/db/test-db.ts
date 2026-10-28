import { migrate } from "drizzle-orm/libsql/migrator";
import { createDb } from "./client.ts";

// Fresh in-memory database with all migrations applied, isolated per test.
export async function createTestDb() {
  const db = createDb(":memory:");
  await migrate(db, { migrationsFolder: "drizzle" });
  return db;
}
