import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import {
  IconBriefcase,
  IconCalendar,
  IconClock,
  IconListCheck,
  IconPencil,
  IconStatus,
  IconText,
  IconTrendingUp,
} from "@/components/icons";
import { Page } from "@/components/page";
import { ProgressBar } from "@/components/progress-bar";
import { ProjectStatusTag } from "@/components/projects/project-status-tag";
import { ProjectTabs } from "@/components/projects/project-tabs";
import { NewTaskForm } from "@/components/tasks/new-task-form";
import { TaskList } from "@/components/tasks/task-list";
import { buttonStyles } from "@/components/ui";
import { getDb } from "@/lib/db";
import { listTasks } from "@/lib/db/tasks";
import { formatDate } from "@/lib/format";
import { loadProjectOrNotFound } from "@/lib/projects/load";
import { calculateProgress } from "@/lib/tasks/progress";
import { createTaskAction } from "../task-actions";

// Blocks while reading the local database; see app/projects/layout.tsx.
export const instant = false;

export const metadata: Metadata = {
  title: "Proyecto",
};

export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const project = await loadProjectOrNotFound((await params).id);
  const tasks = await listTasks(getDb(), project.id);
  const progress = calculateProgress(tasks);

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
      <div className="flex flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-line p-4 lg:w-80 lg:border-r lg:border-b-0">
          <div className="flex items-center gap-3">
            <Avatar name={project.name} size="lg" />
            <p className="min-w-0 text-lg font-semibold tracking-tight wrap-break-word">
              {project.name}
            </p>
          </div>
          <dl className="mt-5 flex flex-col">
            <Field icon={<IconStatus size={14} />} label="Estado">
              <ProjectStatusTag status={project.status} />
            </Field>
            <Field icon={<IconTrendingUp size={14} />} label="Progreso">
              <ProgressBar progress={progress} />
            </Field>
            <Field icon={<IconListCheck size={14} />} label="Tareas">
              {progress ? `${progress.done} de ${progress.total} hechas` : "Ninguna"}
            </Field>
            <Field icon={<IconText size={14} />} label="Descripción">
              {project.description ?? <span className="text-fg-tertiary">Sin descripción</span>}
            </Field>
            <Field icon={<IconCalendar size={14} />} label="Creado">
              {formatDate(project.createdAt)}
            </Field>
            <Field icon={<IconClock size={14} />} label="Actualizado">
              {formatDate(project.updatedAt)}
            </Field>
          </dl>
        </aside>

        <section className="min-w-0 flex-1" aria-label="Tareas">
          <ProjectTabs projectId={project.id} active="list" taskCount={tasks.length} />
          <div className="flex flex-col gap-3 p-4">
            <NewTaskForm action={createTaskAction.bind(null, project.id)} />
            <TaskList tasks={tasks} />
          </div>
        </section>
      </div>
    </Page>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] items-start gap-2 py-1.5">
      <dt className="flex h-5 items-center gap-1.5 text-fg-tertiary">
        {icon}
        {label}
      </dt>
      <dd className="min-h-5 whitespace-pre-line text-fg wrap-break-word">{children}</dd>
    </div>
  );
}
