// @vitest-environment node
import { describe, expect, test } from "vitest";
import { createProject } from "@/lib/db/projects";
import { seedDatabase } from "@/lib/db/seed-data";
import { createTask } from "@/lib/db/tasks";
import { createTestDb } from "@/lib/db/test-db";
import { getDashboardStats } from "./stats";

describe("getDashboardStats", () => {
  test("matches the seed data", async () => {
    const db = await createTestDb();
    await seedDatabase(db);

    const stats = await getDashboardStats(db);

    expect(stats.projects).toEqual({
      total: 3,
      byStatus: { IDEA: 1, IN_PROGRESS: 1, PAUSED: 1, DONE: 0 },
    });
    expect(stats.tasks).toEqual({
      total: 6,
      byStatus: { TODO: 2, DOING: 1, DONE: 3 },
    });
    expect(stats.inProgress).toHaveLength(1);
    expect(stats.inProgress[0].project.name).toBe("firedn't");
    expect(stats.inProgress[0].progress).toEqual({ done: 3, total: 6, percent: 50 });
  });

  test("returns zeros for an empty database", async () => {
    const stats = await getDashboardStats(await createTestDb());

    expect(stats).toEqual({
      projects: { total: 0, byStatus: { IDEA: 0, IN_PROGRESS: 0, PAUSED: 0, DONE: 0 } },
      tasks: { total: 0, byStatus: { TODO: 0, DOING: 0, DONE: 0 } },
      inProgress: [],
    });
  });

  test("an in-progress project without tasks has no progress", async () => {
    const db = await createTestDb();
    await createProject(db, { name: "Recién empezado", status: "IN_PROGRESS" });
    const idea = await createProject(db, { name: "Idea", status: "IDEA" });
    await createTask(db, idea.id, { title: "No cuenta en progreso" });

    const { inProgress } = await getDashboardStats(db);

    expect(inProgress).toEqual([
      { project: expect.objectContaining({ name: "Recién empezado" }), progress: null },
    ]);
  });
});
