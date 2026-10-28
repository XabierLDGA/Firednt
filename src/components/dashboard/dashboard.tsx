import Link from "next/link";
import { ProjectProgress } from "@/components/projects/project-progress";
import { StatusDot } from "@/components/projects/status-badge";
import { buttonStyles } from "@/components/ui";
import type { DashboardStats } from "@/lib/dashboard/stats";
import { PROJECT_STATUSES, TASK_STATUSES } from "@/lib/db/enums";
import { PROJECT_STATUS_LABELS } from "@/lib/projects/constants";
import { APP_NAME } from "@/lib/site";
import { TASK_STATUS_LABELS } from "@/lib/tasks/constants";

export function Dashboard({ stats }: { stats: DashboardStats }) {
  if (stats.projects.total === 0) return <Welcome />;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="text-xl font-semibold tracking-tight">Resumen</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Proyectos"
          total={stats.projects.total}
          rows={PROJECT_STATUSES.map((status) => ({
            key: status,
            label: PROJECT_STATUS_LABELS[status],
            value: stats.projects.byStatus[status],
            dot: <StatusDot status={status} />,
          }))}
        />
        <StatCard
          title="Tareas"
          total={stats.tasks.total}
          rows={TASK_STATUSES.map((status) => ({
            key: status,
            label: TASK_STATUS_LABELS[status],
            value: stats.tasks.byStatus[status],
          }))}
        />
      </div>

      <section className="mt-10" aria-labelledby="in-progress-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="in-progress-heading" className="font-medium text-fg">
            En desarrollo
          </h2>
          <Link href="/projects" className="text-sm text-fg-tertiary hover:text-fg">
            Ver todos los proyectos →
          </Link>
        </div>
        {stats.inProgress.length === 0 ? (
          <p className="mt-3 text-sm text-fg-tertiary">Ningún proyecto en desarrollo ahora mismo.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-md border border-line">
            {stats.inProgress.map(({ project, progress }) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                >
                  <span className="min-w-0 flex-1 truncate font-medium text-fg">
                    {project.name}
                  </span>
                  <ProjectProgress progress={progress} className="w-56" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function StatCard({
  title,
  total,
  rows,
}: {
  title: string;
  total: number;
  rows: { key: string; label: string; value: number; dot?: React.ReactNode }[];
}) {
  return (
    <section className="rounded-md border border-line p-4" aria-label={title}>
      <h2 className="text-sm font-medium text-fg-secondary">{title}</h2>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{total}</p>
      <dl className="mt-3 flex flex-col gap-1 text-sm">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-fg-secondary">
              {row.dot}
              {row.label}
            </dt>
            <dd className="text-fg tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Welcome() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
      <p className="max-w-md text-lg text-fg-secondary">
        Te damos la bienvenida. Aquí verás el resumen de tus proyectos, sus tareas y su
        progreso.
      </p>
      <Link href="/projects/new" className={buttonStyles.primary}>
        Crear tu primer proyecto
      </Link>
    </main>
  );
}
