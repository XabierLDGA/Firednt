import { z } from "zod";
import { PROJECT_STATUSES } from "@/lib/db/enums";
import type { ProjectInput } from "@/lib/db/projects";
import { PROJECT_DESCRIPTION_MAX, PROJECT_NAME_MAX } from "./constants";

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

