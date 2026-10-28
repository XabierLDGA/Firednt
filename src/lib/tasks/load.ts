import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Task } from "@/lib/db/schema";
import { getTask } from "@/lib/db/tasks";
import { parseId } from "@/lib/ids";

// Resolves a task from /projects/[id]/tasks/[taskId], or renders the 404 page.
// The task must belong to the project in the URL. Same soft 404 as projects.
export async function loadTaskOrNotFound(rawProjectId: string, rawTaskId: string): Promise<Task> {
  const projectId = parseId(rawProjectId);
  const taskId = parseId(rawTaskId);
  const task = taskId === null ? undefined : await getTask(getDb(), taskId);
  if (!task || task.projectId !== projectId) notFound();
  return task;
}
