import Link from "next/link";
import { updateTaskStatusAction } from "@/app/projects/task-actions";
import { IconPencil } from "@/components/icons";
import { compactButtonStyles } from "@/components/ui";
import type { Task } from "@/lib/db/schema";
import { TaskStatusSelect } from "./task-status-select";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line px-4 py-8 text-center text-fg-tertiary">
        Este proyecto aún no tiene tareas. Escribe la primera arriba.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-md border border-line">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center gap-3 px-3 py-2 hover:bg-subtle">
          <div className="min-w-0 flex-1">
            <p
              className={`wrap-break-word ${task.status === "DONE" ? "text-fg-tertiary line-through" : "text-fg"}`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="mt-0.5 truncate text-sm text-fg-tertiary">{task.description}</p>
            )}
          </div>
          <TaskStatusSelect
            action={updateTaskStatusAction.bind(null, task.id)}
            status={task.status}
            taskTitle={task.title}
          />
          <Link
            href={`/projects/${task.projectId}/tasks/${task.id}/edit`}
            aria-label={`Editar "${task.title}"`}
            className={compactButtonStyles}
          >
            <IconPencil size={14} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
