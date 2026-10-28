import { TASK_STATUSES, type TaskStatus } from "@/lib/db/enums";
import type { Task } from "@/lib/db/schema";

// One column per status, in board order. Keeps the order of the input,
// which listTasks already sorts by position.
export function groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const columns = Object.fromEntries(
    TASK_STATUSES.map((status) => [status, [] as Task[]]),
  ) as Record<TaskStatus, Task[]>;
  for (const task of tasks) columns[task.status].push(task);
  return columns;
}

// The columns to the left and right of a status, if any.
export function neighborStatuses(status: TaskStatus): {
  previous?: TaskStatus;
  next?: TaskStatus;
} {
  const index = TASK_STATUSES.indexOf(status);
  return { previous: TASK_STATUSES[index - 1], next: TASK_STATUSES[index + 1] };
}
