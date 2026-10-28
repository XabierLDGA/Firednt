"use client";

import { TAG_CLASSES } from "@/components/tag";
import { compactSelectStyles } from "@/components/ui";
import { TASK_STATUSES, type TaskStatus } from "@/lib/db/enums";
import { TASK_STATUS_COLORS, TASK_STATUS_LABELS } from "@/lib/tasks/constants";

type TaskStatusSelectProps = {
  action: (formData: FormData) => Promise<void>;
  status: TaskStatus;
  taskTitle: string;
};

// Saves as soon as a new status is picked, without a submit button.
// Colored like the status tag it stands for.
export function TaskStatusSelect({ action, status, taskTitle }: TaskStatusSelectProps) {
  return (
    <form action={action}>
      <select
        // Remount when the saved status changes so the select shows it.
        key={status}
        name="status"
        defaultValue={status}
        aria-label={`Estado de "${taskTitle}"`}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className={`${compactSelectStyles} ${TAG_CLASSES[TASK_STATUS_COLORS[status]]}`}
      >
        {TASK_STATUSES.map((value) => (
          <option key={value} value={value}>
            {TASK_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
    </form>
  );
}
