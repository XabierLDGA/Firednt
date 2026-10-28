import { desc, eq } from "drizzle-orm";
import type { Db } from "./client.ts";
import { projects, type NewProject, type Project } from "./schema.ts";

export type ProjectInput = Pick<NewProject, "name" | "description" | "status">;

export function listProjects(db: Db): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .orderBy(desc(projects.updatedAt), desc(projects.id));
}

export async function getProject(
  db: Db,
  id: number,
): Promise<Project | undefined> {
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  return project;
}

export async function createProject(
  db: Db,
  input: ProjectInput,
): Promise<Project> {
  const [project] = await db.insert(projects).values(input).returning();
  return project;
}

export async function updateProject(
  db: Db,
  id: number,
  input: Partial<ProjectInput>,
): Promise<Project | undefined> {
  const [project] = await db
    .update(projects)
    .set(input)
    .where(eq(projects.id, id))
    .returning();
  return project;
}

// Tasks are removed by the database (ON DELETE CASCADE).
export async function deleteProject(db: Db, id: number): Promise<boolean> {
  const deleted = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });
  return deleted.length > 0;
}
