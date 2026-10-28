// Loads sample data into the local database. Run with `npm run db:seed`.
// Wipes existing projects and tasks first, so it can be re-run safely.
import { existsSync } from "node:fs";
import { createDb } from "./client.ts";
import { projects, tasks, type NewTask } from "./schema.ts";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
}

const db = createDb(url);

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

const [projectCount, taskCount] = await Promise.all([
  db.$count(projects),
  db.$count(tasks),
]);
console.log(`Seed completed: ${projectCount} projects, ${taskCount} tasks.`);
