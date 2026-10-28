// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Db } from "@/lib/db/client";
import { createProject } from "@/lib/db/projects";
import { createTask } from "@/lib/db/tasks";
import { createTestDb } from "@/lib/db/test-db";
import { loadTaskOrNotFound } from "./load";

const state = vi.hoisted(() => ({ db: undefined as Db | undefined }));

vi.mock("@/lib/db", () => ({ getDb: () => state.db }));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

let projectId: number;
let taskId: number;

beforeEach(async () => {
  state.db = await createTestDb();
  projectId = (await createProject(state.db, { name: "Proyecto" })).id;
  taskId = (await createTask(state.db, projectId, { title: "Tarea" })).id;
});

describe("loadTaskOrNotFound", () => {
  test("returns the task when it belongs to the project in the URL", async () => {
    const task = await loadTaskOrNotFound(String(projectId), String(taskId));

    expect(task).toMatchObject({ id: taskId, title: "Tarea" });
  });

  test("is not found when the task belongs to another project", async () => {
    const other = await createProject(state.db!, { name: "Otro" });

    await expect(loadTaskOrNotFound(String(other.id), String(taskId))).rejects.toThrow(
      "NOT_FOUND",
    );
  });

  test.each([
    ["missing task", () => [String(projectId), "999"]],
    ["invalid task id", () => [String(projectId), "abc"]],
    ["invalid project id", () => ["abc", String(taskId)]],
  ])("is not found for a %s", async (_case, ids) => {
    const [rawProjectId, rawTaskId] = ids();

    await expect(loadTaskOrNotFound(rawProjectId, rawTaskId)).rejects.toThrow("NOT_FOUND");
  });
});
