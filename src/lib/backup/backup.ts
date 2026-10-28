import { asc } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { learningItems, learningTopics, projects, tasks } from "@/lib/db/schema";
import { BACKUP_VERSION, type Backup } from "./schema";

export type BackupCounts = {
  projects: number;
  tasks: number;
  learningTopics: number;
  learningItems: number;
};

// Every table, rows ordered by id so two exports of the same data match.
export async function exportBackup(db: Db): Promise<Backup> {
  const [projectRows, taskRows, topicRows, itemRows] = await Promise.all([
    db.select().from(projects).orderBy(asc(projects.id)),
    db.select().from(tasks).orderBy(asc(tasks.id)),
    db.select().from(learningTopics).orderBy(asc(learningTopics.id)),
    db.select().from(learningItems).orderBy(asc(learningItems.id)),
  ]);

  return {
    app: "firednt",
    version: BACKUP_VERSION,
    exportedAt: new Date(),
    projects: projectRows,
    tasks: taskRows,
    learningTopics: topicRows,
    learningItems: itemRows,
  };
}

// Replaces ALL data with the backup's, in one transaction: if any insert
// fails, the database keeps its previous data.
export async function restoreBackup(db: Db, backup: Backup): Promise<BackupCounts> {
  await db.transaction(async (tx) => {
    await tx.delete(tasks);
    await tx.delete(projects);
    await tx.delete(learningItems);
    await tx.delete(learningTopics);

    // Parents before children, so foreign keys always find their row.
    if (backup.projects.length > 0) await tx.insert(projects).values(backup.projects);
    if (backup.tasks.length > 0) await tx.insert(tasks).values(backup.tasks);
    if (backup.learningTopics.length > 0) {
      await tx.insert(learningTopics).values(backup.learningTopics);
    }
    if (backup.learningItems.length > 0) {
      await tx.insert(learningItems).values(backup.learningItems);
    }
  });

  return {
    projects: backup.projects.length,
    tasks: backup.tasks.length,
    learningTopics: backup.learningTopics.length,
    learningItems: backup.learningItems.length,
  };
}
