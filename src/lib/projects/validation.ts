import { z } from "zod";
import { PROJECT_STATUSES } from "@/lib/db/schema";
import type { ProjectInput } from "@/lib/db/projects";

export const PROJECT_NAME_MAX = 100;
export const PROJECT_DESCRIPTION_MAX = 500;

const projectFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(PROJECT_NAME_MAX, `Máximo ${PROJECT_NAME_MAX} caracteres.`),
  description: z
    .string()
    .trim()
    .max(PROJECT_DESCRIPTION_MAX, `Máximo ${PROJECT_DESCRIPTION_MAX} caracteres.`)
    .transform((value) => value || null),
  status: z.enum(PROJECT_STATUSES, { error: "Elige un estado válido." }),
});

export type ProjectFormValues = { name: string; description: string; status: string };
export type ProjectFieldErrors = Partial<Record<keyof ProjectFormValues, string[]>>;

export type ProjectFormResult =
  | { success: true; data: ProjectInput }
  | { success: false; errors: ProjectFieldErrors; values: ProjectFormValues };

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseProjectForm(formData: FormData): ProjectFormResult {
  const values: ProjectFormValues = {
    name: field(formData, "name"),
    description: field(formData, "description"),
    status: field(formData, "status"),
  };

  const result = projectFormSchema.safeParse(values);
  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values,
    };
  }
  return { success: true, data: result.data };
}

// Route params arrive as strings; only positive integers are valid ids.
export function parseProjectId(raw: string): number | null {
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) ? id : null;
}
