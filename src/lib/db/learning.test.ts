// @vitest-environment node
import { beforeEach, describe, expect, test } from "vitest";
import type { Db } from "./client.ts";
import {
  countItemsByTopic,
  createItem,
  createTopic,
  deleteItem,
  deleteTopic,
  getItem,
  getTopic,
  listItems,
  listTopics,
  setItemDone,
  updateTopic,
} from "./learning.ts";
import { createTestDb } from "./test-db.ts";

let db: Db;
let topicId: number;

beforeEach(async () => {
  db = await createTestDb();
  topicId = (await createTopic(db, { name: "Docker" })).id;
});

describe("learning topics", () => {
  test("creates, reads, updates and lists topics", async () => {
    await createTopic(db, { name: "Kubernetes", description: "Orquestación" });

    expect(await getTopic(db, topicId)).toMatchObject({ name: "Docker", description: null });
    expect(await updateTopic(db, topicId, { description: "Contenedores" })).toMatchObject({
      description: "Contenedores",
    });
    expect((await listTopics(db)).map((t) => t.name).sort()).toEqual(["Docker", "Kubernetes"]);
  });

  test("the database rejects a blank name", async () => {
    await expect(createTopic(db, { name: "   " })).rejects.toThrow();
  });

  test("deleting a topic deletes its items", async () => {
    const item = await createItem(db, topicId, { title: "Dockerfile" });

    expect(await deleteTopic(db, topicId)).toBe(true);
    expect(await getItem(db, item.id)).toBeUndefined();
    expect(await deleteTopic(db, topicId)).toBe(false);
  });
});

describe("learning items", () => {
  test("creates items not done, appended in order, with an optional url", async () => {
    const first = await createItem(db, topicId, { title: "Qué es un contenedor" });
    const second = await createItem(db, topicId, {
      title: "Dockerfile",
      url: "https://docs.docker.com/reference/dockerfile/",
    });

    expect(first).toMatchObject({ done: false, position: 0, url: null });
    expect(second).toMatchObject({ position: 1, url: "https://docs.docker.com/reference/dockerfile/" });
    expect((await listItems(db, topicId)).map((i) => i.title)).toEqual([
      "Qué es un contenedor",
      "Dockerfile",
    ]);
  });

  test("lists only the items of the given topic", async () => {
    const other = await createTopic(db, { name: "Git" });
    await createItem(db, topicId, { title: "Volúmenes" });
    await createItem(db, other.id, { title: "Rebase" });

    expect((await listItems(db, topicId)).map((i) => i.title)).toEqual(["Volúmenes"]);
  });

  test("marks and unmarks an item as learned", async () => {
    const item = await createItem(db, topicId, { title: "Redes" });

    expect((await setItemDone(db, item.id, true))?.done).toBe(true);
    expect((await setItemDone(db, item.id, false))?.done).toBe(false);
    expect(await setItemDone(db, 999, true)).toBeUndefined();
  });

  test("counts learned and total items per topic", async () => {
    const empty = await createTopic(db, { name: "Vacío" });
    const a = await createItem(db, topicId, { title: "A" });
    await createItem(db, topicId, { title: "B" });
    await setItemDone(db, a.id, true);

    const counts = await countItemsByTopic(db);

    expect(counts.get(topicId)).toEqual({ done: 1, total: 2 });
    expect(counts.has(empty.id)).toBe(false);
  });

  test("deletes an item", async () => {
    const item = await createItem(db, topicId, { title: "Temporal" });

    expect(await deleteItem(db, item.id)).toBe(true);
    expect(await deleteItem(db, item.id)).toBe(false);
  });
});
