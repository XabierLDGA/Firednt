"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { TopicFormState } from "@/app/learning/actions";
import { Field } from "@/components/field";
import { buttonStyles, inputStyles } from "@/components/ui";
import type { LearningTopic } from "@/lib/db/schema";
import { TOPIC_DESCRIPTION_MAX, TOPIC_NAME_MAX } from "@/lib/learning/constants";

type TopicFormProps = {
  action: (state: TopicFormState, formData: FormData) => Promise<TopicFormState>;
  topic?: LearningTopic;
  submitLabel: string;
  cancelHref: string;
};

export function TopicForm({ action, topic, submitLabel, cancelHref }: TopicFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  // After a failed submit, show what the user typed instead of the original values.
  const values = state.values ?? {
    name: topic?.name ?? "",
    description: topic?.description ?? "",
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5" noValidate>
      <Field label="Nombre" htmlFor="name" errors={state.errors?.name}>
        <input
          id="name"
          name="name"
          defaultValue={values.name}
          maxLength={TOPIC_NAME_MAX}
          placeholder="Docker, Testing, SQL…"
          required
          autoFocus={!topic}
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
          maxLength={TOPIC_DESCRIPTION_MAX}
          placeholder="Qué quieres aprender y para qué"
          aria-invalid={state.errors?.description ? true : undefined}
          aria-describedby={state.errors?.description ? "description-error" : undefined}
          className={inputStyles}
        />
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
