"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ProjectFormState } from "@/app/projects/actions";
import { Field } from "@/components/field";
import { buttonStyles, inputStyles } from "@/components/ui";
import { PROJECT_STATUSES } from "@/lib/db/enums";
import type { Project } from "@/lib/db/schema";
import {
  PROJECT_DESCRIPTION_MAX,
  PROJECT_NAME_MAX,
  PROJECT_STATUS_LABELS,
} from "@/lib/projects/constants";

type ProjectFormProps = {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  project?: Project;
  submitLabel: string;
  cancelHref: string;
};

export function ProjectForm({ action, project, submitLabel, cancelHref }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  // After a failed submit, show what the user typed instead of the original values.
  const values = state.values ?? {
    name: project?.name ?? "",
    description: project?.description ?? "",
    status: project?.status ?? "IDEA",
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5" noValidate>
      <Field label="Nombre" htmlFor="name" errors={state.errors?.name}>
        <input
          id="name"
          name="name"
          defaultValue={values.name}
          maxLength={PROJECT_NAME_MAX}
          required
          autoFocus={!project}
          aria-invalid={state.errors?.name ? true : undefined}
          aria-describedby={state.errors?.name ? "name-error" : undefined}
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
          rows={3}
          defaultValue={values.description}
          maxLength={PROJECT_DESCRIPTION_MAX}
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
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {PROJECT_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={buttonStyles.primary}>
          {pending ? "Guardando…" : submitLabel}
        </button>
        <Link href={cancelHref} className={buttonStyles.secondary}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
