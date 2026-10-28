import type { Metadata } from "next";
import { FormPanel } from "@/components/form-panel";
import { IconSchool } from "@/components/icons";
import { TopicForm } from "@/components/learning/topic-form";
import { Page } from "@/components/page";
import { createTopicAction } from "../actions";

export const metadata: Metadata = {
  title: "Nuevo tema",
};

export default function NewTopicPage() {
  return (
    <Page
      icon={<IconSchool />}
      crumbs={[{ label: "Aprendizaje", href: "/learning" }]}
      title="Nuevo tema"
    >
      <FormPanel>
        <TopicForm action={createTopicAction} submitLabel="Crear tema" cancelHref="/learning" />
      </FormPanel>
    </Page>
  );
}
