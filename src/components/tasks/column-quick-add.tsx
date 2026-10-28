"use client";

import { useState } from "react";
import type { TaskFormState } from "@/app/projects/task-actions";
import { IconPlus } from "@/components/icons";
import { compactButtonStyles } from "@/components/ui";
import type { TaskStatus } from "@/lib/db/enums";
import { NewTaskForm } from "./new-task-form";

type ColumnQuickAddProps = {
  action: (state: TaskFormState, formData: FormData) => Promise<TaskFormState>;
  status: TaskStatus;
};

// "+ Nuevo" at the bottom of a board column; opens a title input that
// creates the task in that column. Escape closes it.
export function ColumnQuickAdd({ action, status }: ColumnQuickAddProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={compactButtonStyles}>
        <IconPlus size={14} />
        Nuevo
      </button>
    );
  }

  return (
    <div onKeyDown={(event) => event.key === "Escape" && setOpen(false)}>
      <NewTaskForm action={action} status={status} autoFocus />
    </div>
  );
}
