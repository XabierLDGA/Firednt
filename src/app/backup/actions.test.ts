// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";
import { exportBackup } from "@/lib/backup/backup";
import type { Db } from "@/lib/db/client";
import { createProject, listProjects } from "@/lib/db/projects";
import { seedDatabase } from "@/lib/db/seed-data";
import { createTestDb } from "@/lib/db/test-db";
import { importBackupAction } from "./actions";

const state = vi.hoisted(() => ({ db: undefined as Db | undefined }));

vi.mock("@/lib/db", () => ({ getDb: () => state.db }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

let db: Db;
let backupJson: string;

beforeEach(async () => {
  const source = await createTestDb();
  await seedDatabase(source);
  backupJson = JSON.stringify(await exportBackup(source));

  db = await createTestDb();
  state.db = db;
  await createProject(db, { name: "Dato actual" });
});

function form(file: string | null, confirm = true): FormData {
  const data = new FormData();
  if (file !== null) data.set("file", new File([file], "copia.json", { type: "application/json" }));
  if (confirm) data.set("confirm", "yes");
  return data;
}

async function projectNames() {
  return (await listProjects(db)).map((project) => project.name).sort();
}

describe("importBackupAction", () => {
  test("replaces the data and reports what was imported", async () => {
    const result = await importBackupAction({}, form(backupJson));

    expect(result).toEqual({
      imported: { projects: 3, tasks: 6, learningTopics: 1, learningItems: 5 },
    });
    expect(await projectNames()).toEqual(["App de recetas", "Portfolio personal", "firedn't"]);
  });

  test("requires the confirmation box", async () => {
    const result = await importBackupAction({}, form(backupJson, false));

    expect(result.error).toMatch(/Marca la casilla/);
    expect(await projectNames()).toEqual(["Dato actual"]);
  });

  test("requires a file", async () => {
    expect((await importBackupAction({}, form(null))).error).toMatch(/Elige el archivo/);
    expect((await importBackupAction({}, form(""))).error).toMatch(/Elige el archivo/);
  });

  test("an invalid file changes nothing and explains why", async () => {
    const broken = JSON.parse(backupJson);
    broken.tasks[0].status = "MAYBE";

    const result = await importBackupAction({}, form(JSON.stringify(broken)));

    expect(result.error).toContain("tasks[0].status:");
    expect(await projectNames()).toEqual(["Dato actual"]);
  });
});
