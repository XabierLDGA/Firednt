// @vitest-environment node
import { beforeEach, describe, expect, test } from "vitest";
import type { Db } from "./client.ts";
import { createProject, deleteProject } from "./projects.ts";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./tasks.ts";
import { createTestDb } from "./test-db.ts";

let db: Db;
let projectId: number;

beforeEach(async () => {
  db = await createTestDb();
  projectId = (await createProject(db, { name: "Project" })).id;
});

describe("tasks data access", () => {
  test("creates tasks with defaults, appended in order", async () => {
    const first = await createTask(db, projectId, { title: "First" });
    const second = await createTask(db, projectId, { title: "Second" });

    expect(first.status).toBe("TODO");
    expect([first.position, second.position]).toEqual([0, 1]);
    expect((await listTasks(db, projectId)).map((t) => t.title)).toEqual([
      "First",
      "Second",
    ]);
  });

  test("lists only the tasks of the given project", async () => {
    const other = await createProject(db, { name: "Other" });
    await createTask(db, projectId, { title: "Mine" });
    await createTask(db, other.id, { title: "Theirs" });

    const titles = (await listTasks(db, projectId)).map((t) => t.title);
    expect(titles).toEqual(["Mine"]);
  });

  test("gets a task by id, or undefined when missing", async () => {
    const task = await createTask(db, projectId, { title: "Find me" });

    expect(await getTask(db, task.id)).toMatchObject({ title: "Find me", projectId });
    expect(await getTask(db, 999)).toBeUndefined();
  });

  test("updates the status of a task", async () => {
    const task = await createTask(db, projectId, { title: "Work" });

    const updated = await updateTask(db, task.id, { status: "DONE" });

    expect(updated?.status).toBe("DONE");
  });

  test("deletes a task", async () => {
    const task = await createTask(db, projectId, { title: "Temp" });

    expect(await deleteTask(db, task.id)).toBe(true);
    expect(await deleteTask(db, task.id)).toBe(false);
    expect(await listTasks(db, projectId)).toEqual([]);
  });

  test("deleting a project deletes its tasks", async () => {
    const task = await createTask(db, projectId, { title: "Goes away" });

    await deleteProject(db, projectId);

    expect(await getTask(db, task.id)).toBeUndefined();
  });

  test("the database rejects a task for a missing project", async () => {
    await expect(createTask(db, 999, { title: "Orphan" })).rejects.toThrow();
  });
});
