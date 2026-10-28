import type { Metadata } from "next";
import { ProjectForm } from "@/components/projects/project-form";
import { createProjectAction } from "../actions";

export const metadata: Metadata = {
  title: "Nuevo proyecto",
};

export default function NewProjectPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Nuevo proyecto</h1>
      <ProjectForm
        action={createProjectAction}
        submitLabel="Crear proyecto"
        cancelHref="/projects"
      />
    </main>
  );
}
