import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/projects/status-badge";
import { buttonStyles } from "@/components/ui";
import { loadProjectOrNotFound } from "@/lib/projects/load";

export const metadata: Metadata = {
  title: "Proyecto",
};

const dateFormat = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const project = await loadProjectOrNotFound((await params).id);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Link href="/projects" className="text-sm text-fg-tertiary hover:text-fg">
        ← Proyectos
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight wrap-break-word">
            {project.name}
          </h1>
          <div className="mt-2">
            <StatusBadge status={project.status} />
          </div>
        </div>
        <Link href={`/projects/${project.id}/edit`} className={buttonStyles.secondary}>
          Editar
        </Link>
      </div>

      <p className="mt-6 max-w-2xl whitespace-pre-line text-fg-secondary">
        {project.description ?? "Sin descripción."}
      </p>

      <dl className="mt-8 flex gap-8 text-sm">
        <div>
          <dt className="text-fg-tertiary">Creado</dt>
          <dd className="text-fg-secondary">{dateFormat.format(project.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-fg-tertiary">Actualizado</dt>
          <dd className="text-fg-secondary">{dateFormat.format(project.updatedAt)}</dd>
        </div>
      </dl>
    </main>
  );
}
