import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Avatar } from "@/components/avatar";
import { IconList, IconPlus, IconSchool } from "@/components/icons";
import { Page } from "@/components/page";
import { ProgressBar } from "@/components/progress-bar";
import { buttonStyles } from "@/components/ui";
import { getDb } from "@/lib/db";
import { countItemsByTopic, listTopics } from "@/lib/db/learning";
import { progressFromCounts } from "@/lib/tasks/progress";

// Blocks while reading the local database; see app/learning/layout.tsx.
export const instant = false;

export const metadata: Metadata = {
  title: "Aprendizaje",
};

export default async function LearningPage() {
  await connection(); // read the database at request time, never at build time
  const db = getDb();
  const [topics, itemCounts] = await Promise.all([listTopics(db), countItemsByTopic(db)]);

  return (
    <Page
      icon={<IconSchool />}
      title="Aprendizaje"
      actions={
        <Link href="/learning/new" className={buttonStyles.primary}>
          <IconPlus size={14} />
          Nuevo tema
        </Link>
      }
    >
      {topics.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
          <span className="flex size-10 items-center justify-center rounded-md bg-tag-green text-tag-green-fg">
            <IconSchool size={20} />
          </span>
          <p className="max-w-sm text-fg-secondary">
            Crea un tema (Docker, testing, SQL…) y apunta lo que quieres investigar. Lo irás
            marcando a medida que lo aprendas.
          </p>
          <Link href="/learning/new" className={buttonStyles.secondary}>
            <IconPlus size={14} />
            Crear el primero
          </Link>
        </div>
      ) : (
        <>
          <div className="flex h-10 items-center gap-1.5 border-b border-line px-4 text-fg-secondary">
            <IconList size={14} />
            Todos los temas
            <span className="text-fg-tertiary tabular-nums">{topics.length}</span>
          </div>
          <ul className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {topics.map((topic) => {
              const counts = itemCounts.get(topic.id);
              const progress = counts ? progressFromCounts(counts.done, counts.total) : null;
              return (
                <li key={topic.id}>
                  <Link
                    href={`/learning/${topic.id}`}
                    className="flex h-full flex-col gap-3 rounded-md border border-line bg-page p-4 transition-colors hover:border-line-strong hover:bg-subtle focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span className="flex items-center gap-2">
                      <Avatar name={topic.name} />
                      <span className="truncate font-medium text-fg">{topic.name}</span>
                    </span>
                    <span className="line-clamp-2 min-h-10 text-sm text-fg-secondary">
                      {topic.description ?? (
                        <span className="text-fg-tertiary">Sin descripción</span>
                      )}
                    </span>
                    <span className="mt-auto flex flex-col gap-1">
                      <ProgressBar
                        progress={progress}
                        emptyLabel="Sin elementos"
                        doneLabel="aprendidos"
                      />
                      {counts && (
                        <span className="text-sm text-fg-tertiary tabular-nums">
                          {counts.done} de {counts.total} aprendidos
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Page>
  );
}
