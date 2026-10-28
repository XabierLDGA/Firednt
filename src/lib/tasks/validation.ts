import { z } from "zod";
import { TASK_STATUSES } from "@/lib/db/enums";
import type { TaskInput } from "@/lib/db/tasks";
import { TASK_DESCRIPTION_MAX, TASK_TITLE_MAX } from "./constants";

const taskStatusSchema = z.enum(TASK_STATUSES, { error: "Elige un estado válido." });

// The quick-add form only sends a title: a missing description or status
// falls back to its default, but a status that is sent must be valid.
const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "El título es obligatorio.")
    .max(TASK_TITLE_MAX, `Máximo ${TASK_TITLE_MAX} caracteres.`),
  description: z
    .string()
    .trim()
    .max(TASK_DESCRIPTION_MAX, `Máximo ${TASK_DESCRIPTION_MAX} caracteres.`)
    .default("")
    .transform((value) => value || null),
  status: taskStatusSchema.default("TODO"),
});

export type TaskFormValues = { title: string; description: string; status: string };
export type TaskFieldErrors = Partial<Record<keyof TaskFormValues, string[]>>;

export type TaskFormResult =
  | { success: true; data: TaskInput }
  | { success: false; errors: TaskFieldErrors; values: TaskFormValues };

function optionalField(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
}

export function parseTaskForm(formData: FormData): TaskFormResult {
  const raw = {
    title: optionalField(formData, "title") ?? "",
    description: optionalField(formData, "description"),
    status: optionalField(formData, "status"),
  };

  const result = taskFormSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values: {
        title: raw.title,
        description: raw.description ?? "",
        status: raw.status ?? "TODO",
      },
    };
  }
  return { success: true, data: result.data };
}

export function parseTaskStatus(formData: FormData) {
  return taskStatusSchema.safeParse(formData.get("status"));
}
