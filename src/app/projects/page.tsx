import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Avatar } from "@/components/avatar";
import {
  IconAbc,
  IconBriefcase,
  IconClock,
  IconList,
  IconListCheck,
  IconPlus,
  IconStatus,
  IconText,
  IconTrendingUp,
} from "@/components/icons";
import { Page } from "@/components/page";
import { ProjectProgress } from "@/components/projects/project-progress";
import { ProjectStatusTag } from "@/components/projects/project-status-tag";
import { buttonStyles } from "@/components/ui";
import { getDb } from "@/lib/db";
import { listProjects } from "@/lib/db/projects";
import { countTasksByProject } from "@/lib/db/tasks";
import { formatDate } from "@/lib/format";
import { progressFromCounts } from "@/lib/tasks/progress";

export const metadata: Metadata = {
  title: "Proyectos",
};

export default async function ProjectsPage() {
  await connection(); // read the database at request time, never at build time
  const db = getDb();
  const [projects, taskCounts] = await Promise.all([
    listProjects(db),
    countTasksByProject(db),
  ]);

  return (
    <Page
      icon={<IconBriefcase />}
      title="Proyectos"
      actions={
        <Link href="/projects/new" className={buttonStyles.primary}>
          <IconPlus size={14} />
          Nuevo proyecto
        </Link>
      }
    >
      {projects.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
          <span className="flex size-10 items-center justify-center rounded-md bg-tag-orange text-tag-orange-fg">
            <IconBriefcase size={20} />
          </span>
          <p className="text-fg-secondary">Todavía no tienes proyectos.</p>
          <Link href="/projects/new" className={buttonStyles.secondary}>
            <IconPlus size={14} />
            Crear el primero
          </Link>
        </div>
      ) : (
        <>
          <div className="flex h-10 items-center gap-1.5 border-b border-line px-4 text-fg-secondary">
            <IconList size={14} />
            Todos los proyectos
            <span className="text-fg-tertiary tabular-nums">{projects.length}</span>
          </div>
          {/* The table scrolls inside its box on narrow screens, never the page. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-line text-left">
                  <Th icon={<IconAbc size={14} />}>Nombre</Th>
                  <Th icon={<IconStatus size={14} />}>Estado</Th>
                  <Th icon={<IconTrendingUp size={14} />}>Progreso</Th>
                  <Th icon={<IconListCheck size={14} />}>Tareas</Th>
                  <Th icon={<IconText size={14} />}>Descripción</Th>
                  <Th icon={<IconClock size={14} />}>Actualizado</Th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const counts = taskCounts.get(project.id);
                  const progress = counts ? progressFromCounts(counts.done, counts.total) : null;
                  return (
                    <tr key={project.id} className="border-b border-line hover:bg-subtle">
                      <Td>
                        <Link
                          href={`/projects/${project.id}`}
                          className="flex items-center gap-2 rounded-sm font-medium text-fg hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                        >
                          <Avatar name={project.name} />
                          <span className="truncate">{project.name}</span>
                        </Link>
                      </Td>
                      <Td>
                        <ProjectStatusTag status={project.status} />
                      </Td>
                      <Td>
                        <ProjectProgress progress={progress} className="w-36" />
                      </Td>
                      <Td>
                        <span className="text-fg-secondary tabular-nums">
                          {counts ? `${counts.done}/${counts.total}` : "0"}
                        </span>
                      </Td>
                      <Td>
                        <span className="block max-w-64 truncate text-fg-secondary">
                          {project.description}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-fg-secondary">{formatDate(project.updatedAt)}</span>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Page>
  );
}

function Th({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="h-9 border-r border-line px-3 text-sm font-normal whitespace-nowrap text-fg-tertiary last:border-r-0"
    >
      <span className="flex items-center gap-1.5">
        {icon}
        {children}
      </span>
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="h-10 max-w-72 border-r border-line px-3 whitespace-nowrap last:border-r-0">
      {children}
    </td>
  );
}
