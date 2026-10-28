"use client";

import { useActionState } from "react";
import type { TaskFormState } from "@/app/projects/task-actions";
import { buttonStyles, inputStyles } from "@/components/ui";
import { TASK_TITLE_MAX } from "@/lib/tasks/constants";

type NewTaskFormProps = {
  action: (state: TaskFormState, formData: FormData) => Promise<TaskFormState>;
};

// Quick add: only a title. React resets the form after a successful submit,
// so the input is empty for the next task.
export function NewTaskForm({ action }: NewTaskFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.errors?.title;

  return (
    <form action={formAction} className="flex flex-col gap-1.5" noValidate>
      <div className="flex gap-2">
        <label htmlFor="new-task-title" className="sr-only">
          Nueva tarea
        </label>
        <input
          id="new-task-title"
          name="title"
          placeholder="Añadir una tarea…"
          defaultValue={state.values?.title ?? ""}
          maxLength={TASK_TITLE_MAX}
          required
          aria-invalid={errors ? true : undefined}
          aria-describedby={errors ? "new-task-title-error" : undefined}
          className={inputStyles}
        />
        <button type="submit" disabled={pending} className={buttonStyles.secondary}>
          Añadir
        </button>
      </div>
      {errors && (
        <p id="new-task-title-error" className="text-sm text-danger">
          {errors.join(" ")}
        </p>
      )}
    </form>
  );
}
