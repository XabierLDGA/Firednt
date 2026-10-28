// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Db } from "@/lib/db/client";
import { createProject } from "@/lib/db/projects";
import { createTask, getTask, listTasks } from "@/lib/db/tasks";
import { createTestDb } from "@/lib/db/test-db";
import {
  createTaskAction,
  deleteTaskAction,
  updateTaskAction,
  updateTaskStatusAction,
} from "./task-actions";

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
let projectId: number;

beforeEach(async () => {
  db = await createTestDb();
  state.db = db;
  projectId = (await createProject(db, { name: "Proyecto" })).id;
});

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("createTaskAction", () => {
  test("creates a TODO task in the project and returns an empty state", async () => {
    const result = await createTaskAction(projectId, {}, form({ title: "Nueva" }));

    expect(result).toEqual({});
    const [task] = await listTasks(db, projectId);
    expect(task).toMatchObject({ title: "Nueva", status: "TODO", description: null });
  });

  test("the task does not appear in other projects", async () => {
    const other = await createProject(db, { name: "Otro" });

    await createTaskAction(projectId, {}, form({ title: "Solo mía" }));

    expect(await listTasks(db, other.id)).toEqual([]);
  });

  test("returns errors and keeps values when invalid, without saving", async () => {
    const result = await createTaskAction(projectId, {}, form({ title: "  " }));

    expect(result.errors?.title).toEqual(["El título es obligatorio."]);
    expect(result.values?.title).toBe("  ");
    expect(await listTasks(db, projectId)).toEqual([]);
  });

  test("responds with not found for a missing project", async () => {
    await expect(createTaskAction(999, {}, form({ title: "X" }))).rejects.toThrow(
      "NOT_FOUND",
    );
  });
});

describe("updateTaskAction", () => {
  test("updates the task and redirects to its project", async () => {
    const task = await createTask(db, projectId, { title: "Antes" });

    await expect(
      updateTaskAction(
        task.id,
        {},
        form({ title: "Después", description: "Nota", status: "DOING" }),
      ),
    ).rejects.toThrow(`REDIRECT /projects/${projectId}`);

    expect(await getTask(db, task.id)).toMatchObject({
      title: "Después",
      description: "Nota",
      status: "DOING",
    });
  });

  test("returns errors for invalid input without changing the task", async () => {
    const task = await createTask(db, projectId, { title: "Original" });

    const result = await updateTaskAction(
      task.id,
      {},
      form({ title: "Original", description: "", status: "LOQUESEA" }),
    );

    expect(result.errors?.status).toBeDefined();
    expect((await getTask(db, task.id))?.status).toBe("TODO");
  });

  test("responds with not found for a missing task", async () => {
    await expect(
      updateTaskAction(999, {}, form({ title: "X", status: "TODO" })),
    ).rejects.toThrow("NOT_FOUND");
  });
});

describe("updateTaskStatusAction", () => {
  test("changes only the status", async () => {
    const task = await createTask(db, projectId, { title: "Tarea", description: "D" });

    await updateTaskStatusAction(task.id, form({ status: "DONE" }));

    expect(await getTask(db, task.id)).toMatchObject({
      title: "Tarea",
      description: "D",
      status: "DONE",
    });
  });

  test("rejects an invalid status without changing the task", async () => {
    const task = await createTask(db, projectId, { title: "Tarea" });

    await expect(
      updateTaskStatusAction(task.id, form({ status: "LOQUESEA" })),
    ).rejects.toThrow("Estado de tarea no válido.");
    expect((await getTask(db, task.id))?.status).toBe("TODO");
  });

  test("responds with not found for a missing task", async () => {
    await expect(updateTaskStatusAction(999, form({ status: "DONE" }))).rejects.toThrow(
      "NOT_FOUND",
    );
  });
});

describe("deleteTaskAction", () => {
  test("deletes the task and redirects to its project", async () => {
    const task = await createTask(db, projectId, { title: "Borrar" });

    await expect(deleteTaskAction(task.id)).rejects.toThrow(
      `REDIRECT /projects/${projectId}`,
    );

    expect(await getTask(db, task.id)).toBeUndefined();
  });

  test("responds with not found for a missing task", async () => {
    await expect(deleteTaskAction(999)).rejects.toThrow("NOT_FOUND");
  });
});
