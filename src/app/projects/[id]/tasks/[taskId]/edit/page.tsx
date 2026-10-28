import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { TaskForm } from "@/components/tasks/task-form";
import { loadTaskOrNotFound } from "@/lib/tasks/load";
import { deleteTaskAction, updateTaskAction } from "../../../../task-actions";

export const metadata: Metadata = {
  title: "Editar tarea",
};

export default async function EditTaskPage({
  params,
}: PageProps<"/projects/[id]/tasks/[taskId]/edit">) {
  const { id, taskId } = await params;
  const task = await loadTaskOrNotFound(id, taskId);
  const projectHref = `/projects/${task.projectId}`;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Link href={projectHref} className="text-sm text-fg-tertiary hover:text-fg">
        ← Volver al proyecto
      </Link>
      <h1 className="mt-3 mb-6 text-xl font-semibold tracking-tight">Editar tarea</h1>
      <TaskForm
        action={updateTaskAction.bind(null, task.id)}
        task={task}
        cancelHref={projectHref}
      />

      <section className="mt-12 max-w-xl border-t border-line pt-6">
        <h2 className="font-medium text-fg">Eliminar tarea</h2>
        <p className="mt-1 mb-4 text-sm text-fg-secondary">No se puede deshacer.</p>
        <ConfirmDeleteButton
          action={deleteTaskAction.bind(null, task.id)}
          confirmMessage={`¿Eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`}
          label="Eliminar tarea"
        />
      </section>
    </main>
  );
}
