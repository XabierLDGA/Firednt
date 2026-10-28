"use server";

// Server Actions are plain POST endpoints. firedn't runs locally without
// login (ADR 0002); if it is ever published, add authorization here.
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { createProject, deleteProject, updateProject } from "@/lib/db/projects";
import {
  parseProjectForm,
  type ProjectFieldErrors,
  type ProjectFormValues,
} from "@/lib/projects/validation";

export type ProjectFormState = {
  errors?: ProjectFieldErrors;
  values?: ProjectFormValues;
};

// Projects appear on the list and in the dashboard counters.
function revalidateProjectPages() {
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function createProjectAction(
  _previous: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const result = parseProjectForm(formData);
  if (!result.success) return { errors: result.errors, values: result.values };

  const project = await createProject(getDb(), result.data);
  revalidateProjectPages();
  redirect(`/projects/${project.id}`);
}

export async function updateProjectAction(
  id: number,
  _previous: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const result = parseProjectForm(formData);
  if (!result.success) return { errors: result.errors, values: result.values };

  const project = await updateProject(getDb(), id, result.data);
  if (!project) notFound();
  revalidateProjectPages();
  redirect(`/projects/${id}`);
}

export async function deleteProjectAction(id: number): Promise<void> {
  await deleteProject(getDb(), id);
  revalidateProjectPages();
  redirect("/projects");
}
