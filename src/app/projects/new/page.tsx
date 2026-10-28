import type { Metadata } from "next";
import { FormPanel } from "@/components/form-panel";
import { IconBriefcase } from "@/components/icons";
import { Page } from "@/components/page";
import { ProjectForm } from "@/components/projects/project-form";
import { createProjectAction } from "../actions";

export const metadata: Metadata = {
  title: "Nuevo proyecto",
};

export default function NewProjectPage() {
  return (
    <Page
      icon={<IconBriefcase />}
      crumbs={[{ label: "Proyectos", href: "/projects" }]}
      title="Nuevo proyecto"
    >
      <FormPanel>
        <ProjectForm
          action={createProjectAction}
          submitLabel="Crear proyecto"
          cancelHref="/projects"
        />
      </FormPanel>
    </Page>
  );
}
