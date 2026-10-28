import { and, asc, eq, max, ne, sql } from "drizzle-orm";
import type { Db } from "./client.ts";
import { tasks, type NewTask, type Task, type TaskStatus } from "./schema.ts";

export type TaskInput = Pick<NewTask, "title" | "description" | "status">;

export function listTasks(db: Db, projectId: number): Promise<Task[]> {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, projectId))
    .orderBy(asc(tasks.position), asc(tasks.id));
}

export async function getTask(db: Db, id: number): Promise<Task | undefined> {
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
  return task;
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

// Changes the status and puts the task last in its new column. One UPDATE
// with a subquery, so reading the last position and writing it is atomic.
export async function moveTask(
  db: Db,
  id: number,
  status: TaskStatus,
): Promise<Task | undefined> {
  const [task] = await db
    .update(tasks)
    .set({
      status,
      position: sql`(select coalesce(max(other.position), -1) + 1 from ${tasks} as other where other.project_id = ${tasks.projectId})`,
    })
    .where(and(eq(tasks.id, id), ne(tasks.status, status)))
    .returning();
  // Nothing updated: the task is missing or already has that status.
  return task ?? getTask(db, id);
}

export async function deleteTask(db: Db, id: number): Promise<boolean> {
  const deleted = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning({ id: tasks.id });
  return deleted.length > 0;
}
