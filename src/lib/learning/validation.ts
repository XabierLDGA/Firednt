import { z } from "zod";
import type { ItemInput, TopicInput } from "@/lib/db/learning";
import {
  ITEM_TITLE_MAX,
  ITEM_URL_MAX,
  TOPIC_DESCRIPTION_MAX,
  TOPIC_NAME_MAX,
} from "./constants";

const topicFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(TOPIC_NAME_MAX, `Máximo ${TOPIC_NAME_MAX} caracteres.`),
  description: z
    .string()
    .trim()
    .max(TOPIC_DESCRIPTION_MAX, `Máximo ${TOPIC_DESCRIPTION_MAX} caracteres.`)
    .transform((value) => value || null),
});

// Links are rendered as <a href>, so only http(s) is allowed: a
// "javascript:" URL would run code when clicked.
const itemUrlSchema = z.union([
  z.literal("").transform(() => null),
  z
    .url({ protocol: /^https?$/, error: "Escribe un enlace válido (https://…)." })
    .max(ITEM_URL_MAX, `Máximo ${ITEM_URL_MAX} caracteres.`),
]);

const itemFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "El título es obligatorio.")
    .max(ITEM_TITLE_MAX, `Máximo ${ITEM_TITLE_MAX} caracteres.`),
  url: z.string().trim().pipe(itemUrlSchema),
});

export type TopicFormValues = { name: string; description: string };
export type TopicFieldErrors = Partial<Record<keyof TopicFormValues, string[]>>;
export type TopicFormResult =
  | { success: true; data: TopicInput }
  | { success: false; errors: TopicFieldErrors; values: TopicFormValues };

export type ItemFormValues = { title: string; url: string };
export type ItemFieldErrors = Partial<Record<keyof ItemFormValues, string[]>>;
export type ItemFormResult =
  | { success: true; data: ItemInput }
  | { success: false; errors: ItemFieldErrors; values: ItemFormValues };

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseTopicForm(formData: FormData): TopicFormResult {
  const values: TopicFormValues = {
    name: field(formData, "name"),
    description: field(formData, "description"),
  };

  const result = topicFormSchema.safeParse(values);
  if (!result.success) {
    return { success: false, errors: z.flattenError(result.error).fieldErrors, values };
  }
  return { success: true, data: result.data };
}

export function parseItemForm(formData: FormData): ItemFormResult {
  const values: ItemFormValues = {
    title: field(formData, "title"),
    url: field(formData, "url"),
  };

  const result = itemFormSchema.safeParse(values);
  if (!result.success) {
    return { success: false, errors: z.flattenError(result.error).fieldErrors, values };
  }
  return { success: true, data: result.data };
}

// The check button sends done=true or done=false; anything else is rejected.
export function parseItemDone(formData: FormData) {
  return z.enum(["true", "false"]).transform((value) => value === "true").safeParse(
    formData.get("done"),
  );
}
