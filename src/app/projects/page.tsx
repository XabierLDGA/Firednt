import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ProjectProgress } from "@/components/projects/project-progress";
import { StatusBadge } from "@/components/projects/status-badge";
import { buttonStyles } from "@/components/ui";
import { getDb } from "@/lib/db";
import { listProjects } from "@/lib/db/projects";
import { countTasksByProject } from "@/lib/db/tasks";
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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Proyectos</h1>
        <Link href="/projects/new" className={buttonStyles.primary}>
          Nuevo proyecto
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-line px-6 py-12 text-center">
          <p className="text-fg-secondary">Todavía no tienes proyectos.</p>
          <Link
            href="/projects/new"
            className="mt-2 inline-block font-medium text-accent hover:underline"
          >
            Crea el primero
          </Link>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-md border border-line">
          {projects.map((project) => {
            const counts = taskCounts.get(project.id);
            const progress = counts ? progressFromCounts(counts.done, counts.total) : null;
            return (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-fg">{project.name}</p>
                    {project.description && (
                      <p className="truncate text-sm text-fg-tertiary">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <ProjectProgress progress={progress} className="w-44" />
                    <StatusBadge status={project.status} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
