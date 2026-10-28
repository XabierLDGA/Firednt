// Sample data: three projects and the tasks of firedn't. Wipes existing
// projects and tasks first. Used by `npm run db:seed` and by tests that
// check figures against these known data.
import type { Db } from "./client.ts";
import { projects, tasks, type NewTask } from "./schema.ts";

export async function seedDatabase(db: Db): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(tasks);
    await tx.delete(projects);

    const [firednt] = await tx
      .insert(projects)
      .values({
        name: "firedn't",
        description: "Gestor de mis proyectos desarrollados con IA",
        status: "IN_PROGRESS",
      })
      .returning();

    await tx.insert(projects).values([
      {
        name: "Portfolio personal",
        description: "Web con mis proyectos y experiencia",
        status: "IDEA",
      },
      { name: "App de recetas", status: "PAUSED" },
    ]);

    const firedntTasks: Omit<NewTask, "projectId">[] = [
      { title: "Estructura inicial del proyecto", status: "DONE" },
      { title: "Configurar CI con GitHub Actions", status: "DONE" },
      { title: "Layout principal y navegación", status: "DONE" },
      { title: "Base de datos y modelos", status: "DOING" },
      { title: "Gestión de proyectos", status: "TODO" },
      { title: "Gestión de tareas", status: "TODO" },
    ];

    await tx.insert(tasks).values(
      firedntTasks.map((task, position) => ({
        ...task,
        projectId: firednt.id,
        position,
      })),
    );
  });
}
