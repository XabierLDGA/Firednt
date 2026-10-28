"use server";

// Same trust model as the project actions: no login yet (ADR 0002).
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  createItem,
  createTopic,
  deleteItem,
  deleteTopic,
  getItem,
  getTopic,
  setItemDone,
  updateTopic,
} from "@/lib/db/learning";
import {
  parseItemDone,
  parseItemForm,
  parseTopicForm,
  type ItemFieldErrors,
  type ItemFormValues,
  type TopicFieldErrors,
  type TopicFormValues,
} from "@/lib/learning/validation";

export type TopicFormState = {
  errors?: TopicFieldErrors;
  values?: TopicFormValues;
};

export type ItemFormState = {
  errors?: ItemFieldErrors;
  values?: ItemFormValues;
};

// A topic's checklist is on its page; its progress also on the topic list.
function revalidateLearning(topicId?: number) {
  revalidatePath("/learning");
  if (topicId !== undefined) revalidatePath(`/learning/${topicId}`);
}

export async function createTopicAction(
  _previous: TopicFormState,
  formData: FormData,
): Promise<TopicFormState> {
  const result = parseTopicForm(formData);
  if (!result.success) return { errors: result.errors, values: result.values };

  const topic = await createTopic(getDb(), result.data);
  revalidateLearning();
  redirect(`/learning/${topic.id}`);
}

export async function updateTopicAction(
  id: number,
  _previous: TopicFormState,
  formData: FormData,
): Promise<TopicFormState> {
  const result = parseTopicForm(formData);
  if (!result.success) return { errors: result.errors, values: result.values };

  if (!(await updateTopic(getDb(), id, result.data))) notFound();
  revalidateLearning(id);
  redirect(`/learning/${id}`);
}

export async function deleteTopicAction(id: number): Promise<void> {
  await deleteTopic(getDb(), id);
  revalidateLearning();
  redirect("/learning");
}

// Stays on the topic page: returning an empty state lets the form reset
// so the next item can be typed straight away.
export async function createItemAction(
  topicId: number,
  _previous: ItemFormState,
  formData: FormData,
): Promise<ItemFormState> {
  const result = parseItemForm(formData);
  if (!result.success) return { errors: result.errors, values: result.values };

  const db = getDb();
  if (!(await getTopic(db, topicId))) notFound();
  await createItem(db, topicId, result.data);
  revalidateLearning(topicId);
  return {};
}

// The check button sends the new value (done=true|false), so the form
// works without JavaScript and a double submit cannot flip it back.
export async function toggleItemAction(itemId: number, formData: FormData): Promise<void> {
  const done = parseItemDone(formData);
  if (!done.success) throw new Error("Valor de aprendizaje no válido.");

  const item = await setItemDone(getDb(), itemId, done.data);
  if (!item) notFound();
  revalidateLearning(item.topicId);
}

export async function deleteItemAction(itemId: number): Promise<void> {
  const db = getDb();
  const item = await getItem(db, itemId);
  if (!item) notFound();
  await deleteItem(db, itemId);
  revalidateLearning(item.topicId);
}
