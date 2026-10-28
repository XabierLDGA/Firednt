// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Db } from "@/lib/db/client";
import { createItem, createTopic, getItem, getTopic, listItems } from "@/lib/db/learning";
import { createTestDb } from "@/lib/db/test-db";
import {
  createItemAction,
  createTopicAction,
  deleteItemAction,
  deleteTopicAction,
  toggleItemAction,
  updateTopicAction,
} from "./actions";

const state = vi.hoisted(() => ({ db: undefined as Db | undefined }));

vi.mock("@/lib/db", () => ({ getDb: () => state.db }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
// Next's redirect() and notFound() throw to stop the action; mimic that.
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT ${url}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

let db: Db;
let topicId: number;

beforeEach(async () => {
  db = await createTestDb();
  state.db = db;
  topicId = (await createTopic(db, { name: "Docker" })).id;
});

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("topic actions", () => {
  test("creates a topic and redirects to its page", async () => {
    await expect(
      createTopicAction({}, form({ name: "Kubernetes", description: "" })),
    ).rejects.toThrow(/^REDIRECT \/learning\/\d+$/);
  });

  test("returns errors and values for an invalid topic", async () => {
    const result = await createTopicAction({}, form({ name: " ", description: "x" }));

    expect(result).toEqual({
      errors: { name: ["El nombre es obligatorio."] },
      values: { name: " ", description: "x" },
    });
  });

  test("updates a topic", async () => {
    await expect(
      updateTopicAction(topicId, {}, form({ name: "Docker", description: "Contenedores" })),
    ).rejects.toThrow(`REDIRECT /learning/${topicId}`);
    expect((await getTopic(db, topicId))?.description).toBe("Contenedores");
  });

  test("updating a missing topic is a 404", async () => {
    await expect(updateTopicAction(999, {}, form({ name: "X" }))).rejects.toThrow("NOT_FOUND");
  });

  test("deletes a topic and its items, then goes back to the list", async () => {
    const item = await createItem(db, topicId, { title: "Volúmenes" });

    await expect(deleteTopicAction(topicId)).rejects.toThrow("REDIRECT /learning");
    expect(await getTopic(db, topicId)).toBeUndefined();
    expect(await getItem(db, item.id)).toBeUndefined();
  });
});

describe("item actions", () => {
  test("adds an item with a link and returns an empty state", async () => {
    const result = await createItemAction(
      topicId,
      {},
      form({ title: "Compose", url: "https://docs.docker.com/compose/" }),
    );

    expect(result).toEqual({});
    expect(await listItems(db, topicId)).toMatchObject([
      { title: "Compose", url: "https://docs.docker.com/compose/", done: false },
    ]);
  });

  test("rejects a javascript: link without saving anything", async () => {
    const result = await createItemAction(
      topicId,
      {},
      form({ title: "Trampa", url: "javascript:alert(1)" }),
    );

    expect(result.errors?.url).toEqual(["Escribe un enlace válido (https://…)."]);
    expect(await listItems(db, topicId)).toEqual([]);
  });

  test("adding to a missing topic is a 404", async () => {
    await expect(createItemAction(999, {}, form({ title: "X" }))).rejects.toThrow("NOT_FOUND");
  });

  test("marks and unmarks an item", async () => {
    const item = await createItem(db, topicId, { title: "Redes" });

    await toggleItemAction(item.id, form({ done: "true" }));
    expect((await getItem(db, item.id))?.done).toBe(true);

    await toggleItemAction(item.id, form({ done: "false" }));
    expect((await getItem(db, item.id))?.done).toBe(false);
  });

  test("rejects a tampered done value", async () => {
    const item = await createItem(db, topicId, { title: "Redes" });

    await expect(toggleItemAction(item.id, form({ done: "maybe" }))).rejects.toThrow(
      "Valor de aprendizaje no válido.",
    );
    expect((await getItem(db, item.id))?.done).toBe(false);
  });

  test("toggling a missing item is a 404", async () => {
    await expect(toggleItemAction(999, form({ done: "true" }))).rejects.toThrow("NOT_FOUND");
  });

  test("deletes an item", async () => {
    const item = await createItem(db, topicId, { title: "Temporal" });

    await deleteItemAction(item.id);
    expect(await getItem(db, item.id)).toBeUndefined();
    await expect(deleteItemAction(item.id)).rejects.toThrow("NOT_FOUND");
  });
});
