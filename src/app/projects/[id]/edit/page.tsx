import type { Metadata } from "next";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { ProjectForm } from "@/components/projects/project-form";
import { loadProjectOrNotFound } from "@/lib/projects/load";
import { deleteProjectAction, updateProjectAction } from "../../actions";

export const metadata: Metadata = {
  title: "Editar proyecto",
};

export default async function EditProjectPage({
  params,
}: PageProps<"/projects/[id]/edit">) {
  const project = await loadProjectOrNotFound((await params).id);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Editar proyecto</h1>
      <ProjectForm
        action={updateProjectAction.bind(null, project.id)}
        project={project}
        submitLabel="Guardar cambios"
        cancelHref={`/projects/${project.id}`}
      />

      <section className="mt-12 max-w-xl border-t border-line pt-6">
        <h2 className="font-medium text-fg">Eliminar proyecto</h2>
        <p className="mt-1 mb-4 text-sm text-fg-secondary">
          Se borrarán también todas sus tareas. No se puede deshacer.
        </p>
        <DeleteProjectButton
          action={deleteProjectAction.bind(null, project.id)}
          projectName={project.name}
        />
      </section>
    </main>
  );
}
