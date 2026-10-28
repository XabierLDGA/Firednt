import type { Metadata } from "next";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { FormPanel } from "@/components/form-panel";
import { IconBriefcase } from "@/components/icons";
import { Page } from "@/components/page";
import { TaskForm } from "@/components/tasks/task-form";
import { getDb } from "@/lib/db";
import { getProject } from "@/lib/db/projects";
import { loadTaskOrNotFound } from "@/lib/tasks/load";
import { deleteTaskAction, updateTaskAction } from "../../../../task-actions";

export const metadata: Metadata = {
  title: "Editar tarea",
};

export default async function EditTaskPage({
  params,
}: PageProps<"/projects/[id]/tasks/[taskId]/edit">) {
  const { id, taskId } = await params;
  const task = await loadTaskOrNotFound(id, taskId);
  // The task exists, so its project does too (deleting a project deletes its tasks).
  const project = (await getProject(getDb(), task.projectId))!;
  const projectHref = `/projects/${task.projectId}`;

  return (
    <Page
      icon={<IconBriefcase />}
      crumbs={[
        { label: "Proyectos", href: "/projects" },
        { label: project.name, href: projectHref },
      ]}
      title="Editar tarea"
    >
      <FormPanel
        danger={{
          title: "Eliminar tarea",
          description: "No se puede deshacer.",
          action: (
            <ConfirmDeleteButton
              action={deleteTaskAction.bind(null, task.id)}
              confirmMessage={`¿Eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`}
              label="Eliminar tarea"
            />
          ),
        }}
      >
        <TaskForm
          action={updateTaskAction.bind(null, task.id)}
          task={task}
          cancelHref={projectHref}
        />
      </FormPanel>
    </Page>
  );
}
