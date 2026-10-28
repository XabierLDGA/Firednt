// @vitest-environment node
import { beforeEach, describe, expect, test } from "vitest";
import type { Db } from "@/lib/db/client";
import { createItem, createTopic, setItemDone } from "@/lib/db/learning";
import { createProject, listProjects } from "@/lib/db/projects";
import { seedDatabase } from "@/lib/db/seed-data";
import { createTask } from "@/lib/db/tasks";
import { createTestDb } from "@/lib/db/test-db";
import { exportBackup, restoreBackup } from "./backup";
import { parseBackup, type Backup } from "./schema";

let source: Db;

beforeEach(async () => {
  source = await createTestDb();
  await seedDatabase(source);
  const project = await createProject(source, {
    name: "Con descripción",
    description: "Línea 1\nLínea 2 \"con comillas\"",
    status: "DONE",
  });
  await createTask(source, project.id, { title: "Tarea", description: "Detalle" });
  const topic = await createTopic(source, { name: "Git" });
  const item = await createItem(source, topic.id, { title: "Rebase", url: null });
  await setItemDone(source, item.id, true);
});

// What a user does: download the file, then upload it.
function throughFile(backup: Backup): Backup {
  const parsed = parseBackup(JSON.stringify(backup));
  if (!parsed.success) throw new Error(parsed.error);
  return parsed.data;
}

function withoutExportDate(backup: Backup): Omit<Backup, "exportedAt"> {
  const { projects, tasks, learningTopics, learningItems, app, version } = backup;
  return { app, version, projects, tasks, learningTopics, learningItems };
}

describe("export and restore", () => {
  test("a round trip gives back exactly the same data, replacing what was there", async () => {
    const original = await exportBackup(source);
    const target = await createTestDb();
    await createProject(target, { name: "Se borrará" });

    const counts = await restoreBackup(target, throughFile(original));

    expect(counts).toEqual({ projects: 4, tasks: 7, learningTopics: 2, learningItems: 6 });
    expect(withoutExportDate(await exportBackup(target))).toEqual(withoutExportDate(original));
  });

  test("keeps dates to the second", async () => {
    const original = await exportBackup(source);
    const target = await createTestDb();
    await restoreBackup(target, throughFile(original));

    const [first] = (await exportBackup(target)).projects;
    expect(first.createdAt.getTime()).toBe(original.projects[0].createdAt.getTime());
  });

  test("new records after a restore get fresh ids", async () => {
    const target = await createTestDb();
    await restoreBackup(target, throughFile(await exportBackup(source)));

    const maxId = Math.max(...(await listProjects(target)).map((project) => project.id));
    expect((await createProject(target, { name: "Nuevo" })).id).toBeGreaterThan(maxId);
  });

  test("an empty backup empties the database", async () => {
    const empty = await exportBackup(await createTestDb());

    await restoreBackup(source, throughFile(empty));

    expect(withoutExportDate(await exportBackup(source))).toEqual(withoutExportDate(empty));
  });

  test("if an insert fails half way, nothing changes", async () => {
    const before = await exportBackup(source);
    const backup = await exportBackup(source);
    // Passes no validation: the database's CHECK rejects the blank title
    // after projects, tasks and topics were already inserted.
    backup.learningItems[0] = { ...backup.learningItems[0], title: "   " };

    await expect(restoreBackup(source, backup)).rejects.toThrow();
    expect(withoutExportDate(await exportBackup(source))).toEqual(withoutExportDate(before));
  });
});
