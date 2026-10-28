"use client";

import { useActionState, useId } from "react";
import type { ImportState } from "@/app/backup/actions";
import { buttonStyles, inputStyles } from "@/components/ui";

type ImportFormProps = {
  action: (state: ImportState, formData: FormData) => Promise<ImportState>;
};

export function ImportForm({ action }: ImportFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const id = useId();
  const imported = state.imported;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-file`} className="font-medium text-fg">
          Archivo de copia
        </label>
        <input
          id={`${id}-file`}
          name="file"
          type="file"
          accept=".json,application/json"
          required
          className={`${inputStyles} file:mr-3 file:rounded-sm file:border-0 file:bg-muted file:px-2 file:py-0.5 file:text-fg-secondary`}
        />
      </div>

      <label className="flex items-start gap-2 text-fg-secondary">
        <input type="checkbox" name="confirm" value="yes" required className="mt-1 accent-danger" />
        Entiendo que se borrarán todos mis datos actuales y se reemplazarán por los del archivo.
      </label>

      <div>
        <button type="submit" disabled={pending} className={buttonStyles.danger}>
          {pending ? "Importando…" : "Importar y reemplazar"}
        </button>
      </div>

      {/* Announced by screen readers when the result appears. */}
      <div aria-live="polite">
        {state.error && (
          <p className="rounded-md border border-tag-red bg-tag-red px-3 py-2 text-sm whitespace-pre-line text-tag-red-fg">
            {state.error}
          </p>
        )}
        {imported && (
          <p className="rounded-md border border-tag-green bg-tag-green px-3 py-2 text-sm text-tag-green-fg">
            Copia importada: {count(imported.projects, "proyecto", "proyectos")},{" "}
            {count(imported.tasks, "tarea", "tareas")},{" "}
            {count(imported.learningTopics, "tema", "temas")} y{" "}
            {count(imported.learningItems, "elemento", "elementos")} de aprendizaje.
          </p>
        )}
      </div>
    </form>
  );
}

// count(1, "tema", "temas") -> "1 tema"; count(3, ...) -> "3 temas"
function count(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}
