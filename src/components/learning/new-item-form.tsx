"use client";

import { useActionState, useId } from "react";
import type { ItemFormState } from "@/app/learning/actions";
import { IconPlus } from "@/components/icons";
import { buttonStyles, inputStyles } from "@/components/ui";
import { ITEM_TITLE_MAX, ITEM_URL_MAX } from "@/lib/learning/constants";

type NewItemFormProps = {
  action: (state: ItemFormState, formData: FormData) => Promise<ItemFormState>;
};

// Quick add: a title and, optionally, a link to read about it. React resets
// the form after a successful submit, so it is empty for the next item.
export function NewItemForm({ action }: NewItemFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const id = useId();
  const errors = [...(state.errors?.title ?? []), ...(state.errors?.url ?? [])];

  return (
    <form action={formAction} className="flex flex-col gap-1.5" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-title`} className="sr-only">
          Qué quieres aprender
        </label>
        <input
          id={`${id}-title`}
          name="title"
          placeholder="Añadir algo que aprender…"
          defaultValue={state.values?.title ?? ""}
          maxLength={ITEM_TITLE_MAX}
          required
          aria-invalid={state.errors?.title ? true : undefined}
          aria-describedby={errors.length > 0 ? `${id}-error` : undefined}
          className={`${inputStyles} sm:flex-1`}
        />
        <label htmlFor={`${id}-url`} className="sr-only">
          Enlace (opcional)
        </label>
        <input
          id={`${id}-url`}
          name="url"
          type="url"
          placeholder="Enlace (opcional)"
          defaultValue={state.values?.url ?? ""}
          maxLength={ITEM_URL_MAX}
          aria-invalid={state.errors?.url ? true : undefined}
          aria-describedby={errors.length > 0 ? `${id}-error` : undefined}
          className={`${inputStyles} sm:w-64`}
        />
        <button type="submit" disabled={pending} className={buttonStyles.secondary}>
          <IconPlus size={14} />
          Añadir
        </button>
      </div>
      {errors.length > 0 && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {errors.join(" ")}
        </p>
      )}
    </form>
  );
}
