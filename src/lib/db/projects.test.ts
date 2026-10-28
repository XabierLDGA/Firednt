// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { Db } from "./client.ts";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "./projects.ts";
import { createTask, listTasks } from "./tasks.ts";
import { createTestDb } from "./test-db.ts";

let db: Db;

beforeEach(async () => {
  db = await createTestDb();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("projects data access", () => {
  test("creates a project with defaults and reads it back", async () => {
    const created = await createProject(db, { name: "firedn't" });

    expect(created.id).toBeTypeOf("number");
    expect(created.status).toBe("IDEA");
    expect(created.description).toBeNull();
    expect(await getProject(db, created.id)).toEqual(created);
  });

  test("returns undefined for a missing project", async () => {
    expect(await getProject(db, 999)).toBeUndefined();
  });

  test("lists the most recently updated projects first", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-01-01"));
    const older = await createProject(db, { name: "Older" });
    vi.setSystemTime(new Date("2026-01-02"));
    const newer = await createProject(db, { name: "Newer" });

    const names = (await listProjects(db)).map((p) => p.name);
    expect(names).toEqual([newer.name, older.name]);
  });

  test("updates fields and refreshes updatedAt", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-01-01"));
    const project = await createProject(db, { name: "Draft" });
    vi.setSystemTime(new Date("2026-02-01"));

    const updated = await updateProject(db, project.id, {
      name: "Final",
      status: "IN_PROGRESS",
    });

    expect(updated?.name).toBe("Final");
    expect(updated?.status).toBe("IN_PROGRESS");
    expect(updated?.createdAt).toEqual(project.createdAt);
    expect(updated?.updatedAt).toEqual(new Date("2026-02-01"));
  });

  test("returns undefined when updating a missing project", async () => {
    expect(await updateProject(db, 999, { name: "Nope" })).toBeUndefined();
  });

  test("deletes a project and its tasks", async () => {
    const project = await createProject(db, { name: "Doomed" });
    await createTask(db, project.id, { title: "Task" });

    expect(await deleteProject(db, project.id)).toBe(true);
    expect(await getProject(db, project.id)).toBeUndefined();
    expect(await listTasks(db, project.id)).toEqual([]);
  });

  test("reports false when deleting a missing project", async () => {
    expect(await deleteProject(db, 999)).toBe(false);
  });

  test("the database rejects a blank name", async () => {
    await expect(createProject(db, { name: "   " })).rejects.toThrow();
  });
});
