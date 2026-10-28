import Link from "next/link";
import { createTaskAction, updateTaskStatusAction } from "@/app/projects/task-actions";
import { Avatar } from "@/components/avatar";
import { IconArrowLeft, IconArrowRight, IconClock, IconText } from "@/components/icons";
import { compactButtonStyles } from "@/components/ui";
import { TASK_STATUSES } from "@/lib/db/enums";
import type { Task } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { groupTasksByStatus, neighborStatuses } from "@/lib/tasks/board";
import { TASK_STATUS_LABELS } from "@/lib/tasks/constants";
import { ColumnQuickAdd } from "./column-quick-add";
import { TaskStatusTag } from "./task-status-tag";

type TaskBoardProps = { projectId: number; tasks: Task[] };

// Columns side by side on wide screens, stacked on mobile.
export function TaskBoard({ projectId, tasks }: TaskBoardProps) {
  const columns = groupTasksByStatus(tasks);
  const createInProject = createTaskAction.bind(null, projectId);

  // Stacked columns keep their natural height; side by side they fill the panel.
  return (
    <div className="grid flex-1 content-start divide-y divide-line md:grid-cols-3 md:content-normal md:divide-x md:divide-y-0">
      {TASK_STATUSES.map((status) => (
        <section
          key={status}
          aria-labelledby={`column-${status}`}
          className="flex flex-col gap-2 bg-subtle p-2"
        >
          <h2 id={`column-${status}`} className="flex h-8 items-center gap-2 px-1">
            <TaskStatusTag status={status} />
            <span className="text-sm text-fg-tertiary tabular-nums">{columns[status].length}</span>
          </h2>
          {columns[status].length > 0 && (
            <ul className="flex flex-col gap-2">
              {columns[status].map((task) => (
                <li key={task.id}>
                  <TaskCard task={task} />
                </li>
              ))}
            </ul>
          )}
          <ColumnQuickAdd action={createInProject} status={status} />
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
    <article className="rounded-md border border-line bg-page p-2 transition-colors hover:border-line-strong">
      <Link
        href={`/projects/${task.projectId}/tasks/${task.id}/edit`}
        className="flex items-start gap-1.5 rounded-sm px-1 font-medium text-fg hover:underline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span className="mt-0.5">
          <Avatar name={task.title} />
        </span>
        <span className="min-w-0 wrap-break-word">{task.title}</span>
      </Link>
      <div className="mt-1.5 flex flex-col gap-1 px-1 text-sm">
        <p className="flex items-start gap-1.5 text-fg-secondary">
          <IconText size={14} className="mt-0.5 text-fg-tertiary" />
          {task.description ? (
            <span className="line-clamp-2 min-w-0">{task.description}</span>
          ) : (
            <span className="text-fg-tertiary">Descripción</span>
          )}
        </p>
        <p className="flex items-center gap-1.5 text-fg-secondary">
          <IconClock size={14} className="text-fg-tertiary" />
          {formatDate(task.updatedAt)}
        </p>
      </div>
      <form
        action={updateTaskStatusAction.bind(null, task.id)}
        className="mt-2 flex flex-wrap justify-between gap-1 border-t border-line pt-1.5"
      >
        {previous && (
          <button
            type="submit"
            name="status"
            value={previous}
            aria-label={`Mover "${task.title}" a ${TASK_STATUS_LABELS[previous]}`}
            className={compactButtonStyles}
          >
            <IconArrowLeft size={14} />
            {TASK_STATUS_LABELS[previous]}
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
            {TASK_STATUS_LABELS[next]}
            <IconArrowRight size={14} />
          </button>
        )}
      </form>
    </article>
  );
}
