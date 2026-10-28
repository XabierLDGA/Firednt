import type { Metadata } from "next";
import Link from "next/link";
import { TaskBoard } from "@/components/tasks/task-board";
import { getDb } from "@/lib/db";
import { listTasks } from "@/lib/db/tasks";
import { loadProjectOrNotFound } from "@/lib/projects/load";

export const metadata: Metadata = {
  title: "Tablero",
};

export default async function ProjectBoardPage({ params }: PageProps<"/projects/[id]/board">) {
  const project = await loadProjectOrNotFound((await params).id);
  const tasks = await listTasks(getDb(), project.id);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Link
        href={`/projects/${project.id}`}
        className="text-sm wrap-break-word text-fg-tertiary hover:text-fg"
      >
        ← {project.name}
      </Link>
      <h1 className="mt-3 mb-6 text-xl font-semibold tracking-tight">Tablero</h1>
      {tasks.length === 0 ? (
        <p className="text-fg-secondary">
          Este proyecto aún no tiene tareas.{" "}
          <Link href={`/projects/${project.id}`} className="text-accent hover:underline">
            Añade la primera
          </Link>
          .
        </p>
      ) : (
        <TaskBoard tasks={tasks} />
      )}
    </main>
  );
}
