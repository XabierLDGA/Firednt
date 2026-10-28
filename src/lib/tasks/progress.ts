import type { Task } from "@/lib/db/schema";

export type Progress = { done: number; total: number; percent: number };

// Done tasks over all tasks. null when there are no tasks, so the UI shows
// "Sin tareas" instead of a misleading 0 %.
export function calculateProgress(tasks: readonly Pick<Task, "status">[]): Progress | null {
  const done = tasks.filter((task) => task.status === "DONE").length;
  return progressFromCounts(done, tasks.length);
}

// Same, from counts already aggregated by the database.
export function progressFromCounts(done: number, total: number): Progress | null {
  if (total === 0) return null;
  return { done, total, percent: roundPercent(done, total) };
}

// Rounds to the nearest integer, but only all tasks done reads as 100 %
// and any done task reads as at least 1 %.
function roundPercent(done: number, total: number): number {
  if (done === 0) return 0;
  if (done === total) return 100;
  return Math.min(99, Math.max(1, Math.round((done / total) * 100)));
}
