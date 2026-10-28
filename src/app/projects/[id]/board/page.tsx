import type { Metadata } from "next";
import Link from "next/link";
import { IconBriefcase, IconPencil } from "@/components/icons";
import { Page } from "@/components/page";
import { ProjectTabs } from "@/components/projects/project-tabs";
import { TaskBoard } from "@/components/tasks/task-board";
import { buttonStyles } from "@/components/ui";
import { getDb } from "@/lib/db";
import { listTasks } from "@/lib/db/tasks";
import { loadProjectOrNotFound } from "@/lib/projects/load";

// Blocks while reading the local database; see app/projects/layout.tsx.
export const instant = false;

export const metadata: Metadata = {
  title: "Tablero",
};

export default async function ProjectBoardPage({ params }: PageProps<"/projects/[id]/board">) {
  const project = await loadProjectOrNotFound((await params).id);
  const tasks = await listTasks(getDb(), project.id);

  return (
    <Page
      icon={<IconBriefcase />}
      crumbs={[{ label: "Proyectos", href: "/projects" }]}
      title={project.name}
      actions={
        <Link href={`/projects/${project.id}/edit`} className={buttonStyles.secondary}>
          <IconPencil size={14} />
          Editar
        </Link>
      }
    >
      <ProjectTabs projectId={project.id} active="board" taskCount={tasks.length} />
      <TaskBoard projectId={project.id} tasks={tasks} />
    </Page>
  );
}
