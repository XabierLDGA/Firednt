import type { Metadata } from "next";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { FormPanel } from "@/components/form-panel";
import { IconBriefcase } from "@/components/icons";
import { Page } from "@/components/page";
import { ProjectForm } from "@/components/projects/project-form";
import { loadProjectOrNotFound } from "@/lib/projects/load";
import { deleteProjectAction, updateProjectAction } from "../../actions";

// Blocks while reading the local database; see app/projects/layout.tsx.
export const instant = false;

export const metadata: Metadata = {
  title: "Editar proyecto",
};

export default async function EditProjectPage({
  params,
}: PageProps<"/projects/[id]/edit">) {
  const project = await loadProjectOrNotFound((await params).id);

  return (
    <Page
      icon={<IconBriefcase />}
      crumbs={[
        { label: "Proyectos", href: "/projects" },
        { label: project.name, href: `/projects/${project.id}` },
      ]}
      title="Editar"
    >
      <FormPanel
        danger={{
          title: "Eliminar proyecto",
          description: "Se borrarán también todas sus tareas. No se puede deshacer.",
          action: (
            <ConfirmDeleteButton
              action={deleteProjectAction.bind(null, project.id)}
              confirmMessage={`¿Eliminar "${project.name}" y todas sus tareas? Esta acción no se puede deshacer.`}
              label="Eliminar proyecto"
            />
          ),
        }}
      >
        <ProjectForm
          action={updateProjectAction.bind(null, project.id)}
          project={project}
          submitLabel="Guardar cambios"
          cancelHref={`/projects/${project.id}`}
        />
      </FormPanel>
    </Page>
  );
}
