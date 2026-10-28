"use client";

import { useActionState, useId } from "react";
import type { TaskFormState } from "@/app/projects/task-actions";
import { IconPlus } from "@/components/icons";
import { buttonStyles, inputStyles } from "@/components/ui";
import type { TaskStatus } from "@/lib/db/enums";
import { TASK_TITLE_MAX } from "@/lib/tasks/constants";

type NewTaskFormProps = {
  action: (state: TaskFormState, formData: FormData) => Promise<TaskFormState>;
  // Board columns create the task directly in their own status.
  status?: TaskStatus;
  autoFocus?: boolean;
};

// Quick add: only a title. React resets the form after a successful submit,
// so the input is empty for the next task.
export function NewTaskForm({ action, status, autoFocus }: NewTaskFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const id = useId();
  const errors = state.errors?.title;

  return (
    <form action={formAction} className="flex flex-col gap-1.5" noValidate>
      {status && <input type="hidden" name="status" value={status} />}
      <div className="flex gap-2">
        <label htmlFor={id} className="sr-only">
          Nueva tarea
        </label>
        <input
          id={id}
          name="title"
          placeholder="Añadir una tarea…"
          defaultValue={state.values?.title ?? ""}
          maxLength={TASK_TITLE_MAX}
          required
          autoFocus={autoFocus}
          aria-invalid={errors ? true : undefined}
          aria-describedby={errors ? `${id}-error` : undefined}
          className={inputStyles}
        />
        <button type="submit" disabled={pending} className={buttonStyles.secondary}>
          <IconPlus size={14} />
          Añadir
        </button>
      </div>
      {errors && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {errors.join(" ")}
        </p>
      )}
    </form>
  );
}
