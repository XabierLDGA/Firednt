import type { Metadata } from "next";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { FormPanel } from "@/components/form-panel";
import { IconSchool } from "@/components/icons";
import { TopicForm } from "@/components/learning/topic-form";
import { Page } from "@/components/page";
import { loadTopicOrNotFound } from "@/lib/learning/load";
import { deleteTopicAction, updateTopicAction } from "../../actions";

// Blocks while reading the local database; see app/learning/layout.tsx.
export const instant = false;

export const metadata: Metadata = {
  title: "Editar tema",
};

export default async function EditTopicPage({ params }: PageProps<"/learning/[id]/edit">) {
  const topic = await loadTopicOrNotFound((await params).id);

  return (
    <Page
      icon={<IconSchool />}
      crumbs={[
        { label: "Aprendizaje", href: "/learning" },
        { label: topic.name, href: `/learning/${topic.id}` },
      ]}
      title="Editar"
    >
      <FormPanel
        danger={{
          title: "Eliminar tema",
          description: "Se borrará también toda su lista. No se puede deshacer.",
          action: (
            <ConfirmDeleteButton
              action={deleteTopicAction.bind(null, topic.id)}
              confirmMessage={`¿Eliminar "${topic.name}" y toda su lista? Esta acción no se puede deshacer.`}
              label="Eliminar tema"
            />
          ),
        }}
      >
        <TopicForm
          action={updateTopicAction.bind(null, topic.id)}
          topic={topic}
          submitLabel="Guardar cambios"
          cancelHref={`/learning/${topic.id}`}
        />
      </FormPanel>
    </Page>
  );
}
