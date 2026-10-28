// Loads sample data into the local database. Run with `npm run db:seed`.
// Seeding wipes all existing data first, so a database that already has
// data is left untouched unless `npm run db:seed -- --force` is used.
import { existsSync } from "node:fs";
import { createDb } from "./client.ts";
import { learningItems, projects, tasks } from "./schema.ts";
import { isDatabaseEmpty, seedDatabase } from "./seed-data.ts";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
}

const db = createDb(url);
const force = process.argv.includes("--force");

if (!force && !(await isDatabaseEmpty(db))) {
  console.error(
    "The database already has data and the seed would delete it. Nothing was changed.\n" +
      "To replace it with the sample data anyway, run: npm run db:seed -- --force",
  );
  process.exit(1);
}

await seedDatabase(db);

const [projectCount, taskCount, itemCount] = await Promise.all([
  db.$count(projects),
  db.$count(tasks),
  db.$count(learningItems),
]);
console.log(
  `Seed completed: ${projectCount} projects, ${taskCount} tasks, ${itemCount} learning items.`,
);
