// @vitest-environment node
import { expect, test } from "vitest";
import { countItemsByTopic, createTopic, listTopics } from "./learning.ts";
import { seedDatabase } from "./seed-data.ts";
import { createTestDb } from "./test-db.ts";

test("seeds a Docker learning topic, replacing existing topics", async () => {
  const db = await createTestDb();
  await createTopic(db, { name: "Viejo" });

  await seedDatabase(db);
  await seedDatabase(db); // running it again does not duplicate data

  const topics = await listTopics(db);
  expect(topics.map((topic) => topic.name)).toEqual(["Docker"]);
  expect((await countItemsByTopic(db)).get(topics[0].id)).toEqual({ done: 2, total: 5 });
});
