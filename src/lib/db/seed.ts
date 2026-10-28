// Loads sample data into the local database. Run with `npm run db:seed`.
// Wipes all existing data first, so it can be re-run safely.
import { existsSync } from "node:fs";
import { createDb } from "./client.ts";
import { learningItems, projects, tasks } from "./schema.ts";
import { seedDatabase } from "./seed-data.ts";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
}

const db = createDb(url);
await seedDatabase(db);

const [projectCount, taskCount, itemCount] = await Promise.all([
  db.$count(projects),
  db.$count(tasks),
  db.$count(learningItems),
]);
console.log(
  `Seed completed: ${projectCount} projects, ${taskCount} tasks, ${itemCount} learning items.`,
);
