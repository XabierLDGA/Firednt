"use server";

// Same trust model as ./actions.ts: no login yet (ADR 0002).
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getProject } from "@/lib/db/projects";
import { createTask, deleteTask, getTask, moveTask, updateTask } from "@/lib/db/tasks";
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

// Tasks are shown on the project page and its board; their progress also
// on the project list.
function revalidateProjectTasks(projectId: number) {
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/board`);
}

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
  revalidateProjectTasks(projectId);
  return {};
}

export async function updateTaskAction(
  taskId: number,
  _previous: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const result = parseTaskForm(formData);
  if (!result.success) return { errors: result.errors, values: result.values };

  const db = getDb();
  const { status, ...fields } = result.data;
  // A new status goes through moveTask so the task lands last in its column.
  if (!(await updateTask(db, taskId, fields))) notFound();
  const task = await moveTask(db, taskId, status ?? "TODO");
  if (!task) notFound();
  revalidateProjectTasks(task.projectId);
  redirect(`/projects/${task.projectId}`);
}

// Used by the status select on the project page and the board buttons.
export async function updateTaskStatusAction(
  taskId: number,
  formData: FormData,
): Promise<void> {
  // The UI only offers valid options, so an invalid value means a
  // tampered request: fail loudly instead of ignoring it.
  const status = parseTaskStatus(formData);
  if (!status.success) throw new Error("Estado de tarea no válido.");

  const task = await moveTask(getDb(), taskId, status.data);
  if (!task) notFound();
  revalidateProjectTasks(task.projectId);
}

export async function deleteTaskAction(taskId: number): Promise<void> {
  const db = getDb();
  const task = await getTask(db, taskId);
  if (!task) notFound();
  await deleteTask(db, taskId);
  revalidateProjectTasks(task.projectId);
  redirect(`/projects/${task.projectId}`);
}
