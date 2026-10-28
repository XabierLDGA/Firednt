"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { TaskFormState } from "@/app/projects/task-actions";
import { Field } from "@/components/field";
import { buttonStyles, inputStyles } from "@/components/ui";
import { TASK_STATUSES } from "@/lib/db/enums";
import type { Task } from "@/lib/db/schema";
import {
  TASK_DESCRIPTION_MAX,
  TASK_STATUS_LABELS,
  TASK_TITLE_MAX,
} from "@/lib/tasks/constants";

type TaskFormProps = {
  action: (state: TaskFormState, formData: FormData) => Promise<TaskFormState>;
  task: Task;
  cancelHref: string;
};

export function TaskForm({ action, task, cancelHref }: TaskFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  // After a failed submit, show what the user typed instead of the original values.
  const values = state.values ?? {
    title: task.title,
    description: task.description ?? "",
    status: task.status,
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5" noValidate>
      <Field label="Título" htmlFor="title" errors={state.errors?.title}>
        <input
          id="title"
          name="title"
          defaultValue={values.title}
          maxLength={TASK_TITLE_MAX}
          required
          aria-invalid={state.errors?.title ? true : undefined}
          aria-describedby={state.errors?.title ? "title-error" : undefined}
          className={inputStyles}
        />
      </Field>

      <Field
        label="Descripción"
        htmlFor="description"
        hint="Opcional"
        errors={state.errors?.description}
      >
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={values.description}
          maxLength={TASK_DESCRIPTION_MAX}
          aria-invalid={state.errors?.description ? true : undefined}
          aria-describedby={state.errors?.description ? "description-error" : undefined}
          className={inputStyles}
        />
      </Field>

      <Field label="Estado" htmlFor="status" errors={state.errors?.status}>
        <select
          id="status"
          name="status"
          defaultValue={values.status}
          aria-invalid={state.errors?.status ? true : undefined}
          aria-describedby={state.errors?.status ? "status-error" : undefined}
          className={inputStyles}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={buttonStyles.primary}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
        <Link href={cancelHref} className={buttonStyles.secondary}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
