"use client";

import { compactSelectStyles } from "@/components/ui";
import { TASK_STATUSES, type TaskStatus } from "@/lib/db/enums";
import { TASK_STATUS_LABELS } from "@/lib/tasks/constants";

type TaskStatusSelectProps = {
  action: (formData: FormData) => Promise<void>;
  status: TaskStatus;
  taskTitle: string;
};

// Saves as soon as a new status is picked, without a submit button.
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
        className={compactSelectStyles}
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
