import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { IconPencil, IconSchool } from "@/components/icons";
import { Checklist } from "@/components/learning/checklist";
import { NewItemForm } from "@/components/learning/new-item-form";
import { Page } from "@/components/page";
import { ProgressBar } from "@/components/progress-bar";
import { buttonStyles } from "@/components/ui";
import { getDb } from "@/lib/db";
import { listItems } from "@/lib/db/learning";
import { loadTopicOrNotFound } from "@/lib/learning/load";
import { progressFromCounts } from "@/lib/tasks/progress";
import { createItemAction } from "../actions";

// Blocks while reading the local database; see app/learning/layout.tsx.
export const instant = false;

export const metadata: Metadata = {
  title: "Tema",
};

export default async function TopicPage({ params }: PageProps<"/learning/[id]">) {
  const topic = await loadTopicOrNotFound((await params).id);
  const items = await listItems(getDb(), topic.id);
  const done = items.filter((item) => item.done).length;
  const progress = progressFromCounts(done, items.length);

  return (
    <Page
      icon={<IconSchool />}
      crumbs={[{ label: "Aprendizaje", href: "/learning" }]}
      title={topic.name}
      actions={
        <Link href={`/learning/${topic.id}/edit`} className={buttonStyles.secondary}>
          <IconPencil size={14} />
          Editar
        </Link>
      }
    >
      <div className="flex w-full max-w-3xl flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col gap-3 rounded-md border border-line bg-page p-4">
          <div className="flex items-center gap-3">
            <Avatar name={topic.name} size="lg" />
            <p className="min-w-0 text-lg font-semibold tracking-tight wrap-break-word">
              {topic.name}
            </p>
          </div>
          {topic.description && (
            <p className="whitespace-pre-line text-fg-secondary wrap-break-word">
              {topic.description}
            </p>
          )}
          <div className="flex flex-col gap-1">
            <ProgressBar progress={progress} emptyLabel="Sin elementos" doneLabel="aprendidos" />
            {progress && (
              <p className="text-sm text-fg-tertiary tabular-nums">
                {progress.done} de {progress.total} aprendidos
              </p>
            )}
          </div>
        </div>

        <section className="flex flex-col gap-3" aria-label="Lista de aprendizaje">
          <NewItemForm action={createItemAction.bind(null, topic.id)} />
          <Checklist items={items} />
        </section>
      </div>
    </Page>
  );
}
