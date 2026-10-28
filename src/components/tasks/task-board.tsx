import Link from "next/link";
import { updateTaskStatusAction } from "@/app/projects/task-actions";
import { compactButtonStyles } from "@/components/ui";
import { TASK_STATUSES } from "@/lib/db/enums";
import type { Task } from "@/lib/db/schema";
import { groupTasksByStatus, neighborStatuses } from "@/lib/tasks/board";
import { TASK_STATUS_LABELS } from "@/lib/tasks/constants";

// Columns side by side on wide screens, stacked on mobile.
export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const columns = groupTasksByStatus(tasks);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => (
        <section
          key={status}
          aria-labelledby={`column-${status}`}
          className="flex flex-col gap-2 rounded-md bg-subtle p-2"
        >
          <h2 id={`column-${status}`} className="px-1 py-0.5 text-sm font-medium text-fg-secondary">
            {TASK_STATUS_LABELS[status]}{" "}
            <span className="font-normal text-fg-tertiary">{columns[status].length}</span>
          </h2>
          {columns[status].length === 0 ? (
            <p className="px-1 pb-1 text-sm text-fg-tertiary">Sin tareas</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {columns[status].map((task) => (
                <li key={task.id}>
                  <TaskCard task={task} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

// Moving is a plain form: the clicked button sends its status, so it works
// with the keyboard and even before JavaScript loads.
function TaskCard({ task }: { task: Task }) {
  const { previous, next } = neighborStatuses(task.status);

  return (
    <article className="rounded-md border border-line bg-page p-3">
      <Link
        href={`/projects/${task.projectId}/tasks/${task.id}/edit`}
        className="wrap-break-word text-fg hover:underline"
      >
        {task.title}
      </Link>
      {task.description && (
        <p className="mt-1 line-clamp-3 text-sm text-fg-tertiary">{task.description}</p>
      )}
      <form
        action={updateTaskStatusAction.bind(null, task.id)}
        className="mt-3 flex flex-wrap justify-between gap-2"
      >
        {previous && (
          <button
            type="submit"
            name="status"
            value={previous}
            aria-label={`Mover "${task.title}" a ${TASK_STATUS_LABELS[previous]}`}
            className={compactButtonStyles}
          >
            ← {TASK_STATUS_LABELS[previous]}
          </button>
        )}
        {next && (
          <button
            type="submit"
            name="status"
            value={next}
            aria-label={`Mover "${task.title}" a ${TASK_STATUS_LABELS[next]}`}
            className={`${compactButtonStyles} ml-auto`}
          >
            {TASK_STATUS_LABELS[next]} →
          </button>
        )}
      </form>
    </article>
  );
}
