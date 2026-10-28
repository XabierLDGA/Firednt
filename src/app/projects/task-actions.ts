"use server";

// Same trust model as ./actions.ts: no login yet (ADR 0002).
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getProject } from "@/lib/db/projects";
import { createTask, deleteTask, getTask, updateTask } from "@/lib/db/tasks";
import {
  parseTaskForm,
  parseTaskStatus,
  type TaskFieldErrors,
  type TaskFormValues,
} from "@/lib/tasks/validation";

export type TaskFormState = {
  errors?: TaskFieldErrors;
  values?: TaskFormValues;
};

// Stays on the project page: returning an empty state lets the form reset
// so the next task can be typed straight away.
export async function createTaskAction(
  projectId: number,
  _previous: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const result = parseTaskForm(formData);
  if (!result.success) return { errors: result.errors, values: result.values };

  const db = getDb();
  if (!(await getProject(db, projectId))) notFound();
  await createTask(db, projectId, result.data);
  revalidatePath(`/projects/${projectId}`);
  return {};
}

export async function updateTaskAction(
  taskId: number,
  _previous: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const result = parseTaskForm(formData);
  if (!result.success) return { errors: result.errors, values: result.values };

  const task = await updateTask(getDb(), taskId, result.data);
  if (!task) notFound();
  revalidatePath(`/projects/${task.projectId}`);
  redirect(`/projects/${task.projectId}`);
}

export async function updateTaskStatusAction(
  taskId: number,
  formData: FormData,
): Promise<void> {
  // The select only offers valid options, so an invalid value means a
  // tampered request: fail loudly instead of ignoring it.
  const status = parseTaskStatus(formData);
  if (!status.success) throw new Error("Estado de tarea no válido.");

  const task = await updateTask(getDb(), taskId, { status: status.data });
  if (!task) notFound();
  revalidatePath(`/projects/${task.projectId}`);
}

export async function deleteTaskAction(taskId: number): Promise<void> {
  const db = getDb();
  const task = await getTask(db, taskId);
  if (!task) notFound();
  await deleteTask(db, taskId);
  revalidatePath(`/projects/${task.projectId}`);
  redirect(`/projects/${task.projectId}`);
}
