// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Db } from "@/lib/db/client";
import { createProject, getProject, listProjects } from "@/lib/db/projects";
import { createTestDb } from "@/lib/db/test-db";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
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

beforeEach(async () => {
  db = await createTestDb();
  state.db = db;
});

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("createProjectAction", () => {
  test("creates the project and redirects to its page", async () => {
    await expect(
      createProjectAction({}, form({ name: "Nuevo", description: "", status: "IDEA" })),
    ).rejects.toThrow(/^REDIRECT \/projects\/\d+$/);

    const [project] = await listProjects(db);
    expect(project).toMatchObject({ name: "Nuevo", status: "IDEA", description: null });
  });

  test("returns field errors and keeps values when invalid, without saving", async () => {
    const values = { name: "", description: "Algo", status: "IDEA" };

    const result = await createProjectAction({}, form(values));

    expect(result.errors?.name).toEqual(["El nombre es obligatorio."]);
    expect(result.values).toEqual(values);
    expect(await listProjects(db)).toEqual([]);
  });
});

describe("updateProjectAction", () => {
  test("updates the project and redirects to it", async () => {
    const project = await createProject(db, { name: "Antes" });

    await expect(
      updateProjectAction(
        project.id,
        {},
        form({ name: "Después", description: "Nota", status: "DONE" }),
      ),
    ).rejects.toThrow(`REDIRECT /projects/${project.id}`);

    expect(await getProject(db, project.id)).toMatchObject({
      name: "Después",
      description: "Nota",
      status: "DONE",
    });
  });

  test("returns errors for invalid input without changing the project", async () => {
    const project = await createProject(db, { name: "Original" });

    const result = await updateProjectAction(
      project.id,
      {},
      form({ name: "Original", description: "", status: "LOQUESEA" }),
    );

    expect(result.errors?.status).toBeDefined();
    expect((await getProject(db, project.id))?.status).toBe("IDEA");
  });

  test("responds with not found for a missing project", async () => {
    await expect(
      updateProjectAction(999, {}, form({ name: "X", description: "", status: "IDEA" })),
    ).rejects.toThrow("NOT_FOUND");
  });
});

describe("deleteProjectAction", () => {
  test("deletes the project and redirects to the list", async () => {
    const project = await createProject(db, { name: "Borrar" });

    await expect(deleteProjectAction(project.id)).rejects.toThrow("REDIRECT /projects");

    expect(await getProject(db, project.id)).toBeUndefined();
  });
});
