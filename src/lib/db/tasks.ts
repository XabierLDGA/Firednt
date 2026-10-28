import { asc, eq, max } from "drizzle-orm";
import type { Db } from "./client.ts";
import { tasks, type NewTask, type Task } from "./schema.ts";

export type TaskInput = Pick<NewTask, "title" | "description" | "status">;

export function listTasks(db: Db, projectId: number): Promise<Task[]> {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, projectId))
    .orderBy(asc(tasks.position), asc(tasks.id));
}

// New tasks go to the end of the project's list.
export async function createTask(
  db: Db,
  projectId: number,
  input: TaskInput,
): Promise<Task> {
  const [{ last }] = await db
    .select({ last: max(tasks.position) })
    .from(tasks)
    .where(eq(tasks.projectId, projectId));

  const [task] = await db
    .insert(tasks)
    .values({ ...input, projectId, position: (last ?? -1) + 1 })
    .returning();
  return task;
}

export async function updateTask(
  db: Db,
  id: number,
  input: Partial<TaskInput & Pick<NewTask, "position">>,
): Promise<Task | undefined> {
  const [task] = await db
    .update(tasks)
    .set(input)
    .where(eq(tasks.id, id))
    .returning();
  return task;
}

export async function deleteTask(db: Db, id: number): Promise<boolean> {
  const deleted = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning({ id: tasks.id });
  return deleted.length > 0;
}
