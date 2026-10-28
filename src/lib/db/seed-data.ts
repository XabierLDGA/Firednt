// Sample data: three projects, the tasks of firedn't and a Docker learning
// topic. Wipes all existing data first. Used by `npm run db:seed` and by tests that
// check figures against these known data.
import type { Db } from "./client.ts";
import {
  learningItems,
  learningTopics,
  projects,
  tasks,
  type NewLearningItem,
  type NewTask,
} from "./schema.ts";

export async function seedDatabase(db: Db): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(tasks);
    await tx.delete(projects);
    await tx.delete(learningItems);
    await tx.delete(learningTopics);

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

    const [docker] = await tx
      .insert(learningTopics)
      .values({
        name: "Docker",
        description: "Empaquetar y ejecutar mis proyectos en contenedores",
      })
      .returning();

    const dockerItems: Omit<NewLearningItem, "topicId">[] = [
      { title: "Qué es un contenedor y en qué se diferencia de una VM", done: true },
      {
        title: "Escribir un Dockerfile",
        url: "https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/",
        done: true,
      },
      { title: "Volúmenes para guardar datos" },
      { title: "Docker Compose", url: "https://docs.docker.com/compose/" },
      { title: "Dockerizar firedn't" },
    ];

    await tx.insert(learningItems).values(
      dockerItems.map((item, position) => ({ ...item, topicId: docker.id, position })),
    );
  });
}
