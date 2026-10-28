import Link from "next/link";
import { Avatar } from "@/components/avatar";
import {
  IconBriefcase,
  IconDashboard,
  IconListCheck,
  IconPlus,
  IconTrendingUp,
} from "@/components/icons";
import { Page } from "@/components/page";
import { ProjectProgress } from "@/components/projects/project-progress";
import { Tag, TAG_CLASSES, TAG_SOLID_CLASSES } from "@/components/tag";
import { buttonStyles } from "@/components/ui";
import type { TagColor } from "@/lib/colors";
import type { DashboardStats } from "@/lib/dashboard/stats";
import { PROJECT_STATUSES, TASK_STATUSES } from "@/lib/db/enums";
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from "@/lib/projects/constants";
import { APP_NAME } from "@/lib/site";
import { TASK_STATUS_COLORS, TASK_STATUS_LABELS } from "@/lib/tasks/constants";

export function Dashboard({ stats }: { stats: DashboardStats }) {
  if (stats.projects.total === 0) return <Welcome />;

  return (
    <Page icon={<IconDashboard />} title="Dashboard">
      <div className="flex flex-col gap-8 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Proyectos"
            icon={<IconBriefcase size={14} />}
            iconColor="orange"
            total={stats.projects.total}
            rows={PROJECT_STATUSES.map((status) => ({
              key: status,
              label: PROJECT_STATUS_LABELS[status],
              color: PROJECT_STATUS_COLORS[status],
              value: stats.projects.byStatus[status],
            }))}
          />
          <StatCard
            title="Tareas"
            icon={<IconListCheck size={14} />}
            iconColor="sky"
            total={stats.tasks.total}
            rows={TASK_STATUSES.map((status) => ({
              key: status,
              label: TASK_STATUS_LABELS[status],
              color: TASK_STATUS_COLORS[status],
              value: stats.tasks.byStatus[status],
            }))}
          />
        </div>

        <section aria-labelledby="in-progress-heading">
          <div className="flex items-center justify-between gap-4">
            <h2 id="in-progress-heading" className="flex items-center gap-2 font-medium text-fg">
              <span className={`flex size-5 items-center justify-center rounded-sm ${TAG_CLASSES.blue}`}>
                <IconTrendingUp size={14} />
              </span>
              En desarrollo
            </h2>
            <Link href="/projects" className="text-sm text-fg-tertiary hover:text-fg">
              Ver todos los proyectos
            </Link>
          </div>
          {stats.inProgress.length === 0 ? (
            <p className="mt-3 rounded-md border border-dashed border-line px-4 py-8 text-center text-fg-tertiary">
              Ningún proyecto en desarrollo ahora mismo.
            </p>
          ) : (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stats.inProgress.map(({ project, progress }) => (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex h-full flex-col gap-3 rounded-md border border-line bg-page p-3 transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span className="flex items-center gap-2 font-medium text-fg">
                      <Avatar name={project.name} size="md" />
                      <span className="truncate">{project.name}</span>
                    </span>
                    {project.description && (
                      <span className="line-clamp-2 text-sm text-fg-secondary">
                        {project.description}
                      </span>
                    )}
                    <span className="mt-auto flex flex-col gap-1">
                      <ProjectProgress progress={progress} />
                      {progress && (
                        <span className="text-sm text-fg-tertiary">
                          {progress.done} de {progress.total} tareas hechas
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Page>
  );
}

type StatRow = { key: string; label: string; color: TagColor; value: number };

function StatCard({
  title,
  icon,
  iconColor,
  total,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  iconColor: TagColor;
  total: number;
  rows: StatRow[];
}) {
  return (
    <section className="rounded-md border border-line bg-page p-4" aria-label={title}>
      <h2 className="flex items-center gap-2 font-medium text-fg-secondary">
        <span className={`flex size-5 items-center justify-center rounded-sm ${TAG_CLASSES[iconColor]}`}>
          {icon}
        </span>
        {title}
      </h2>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{total}</p>
      {/* Share of each status; the numbers below carry the same information. */}
      <div aria-hidden className="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full bg-active">
        {total > 0 &&
          rows
            .filter((row) => row.value > 0)
            .map((row) => (
              <div
                key={row.key}
                className={TAG_SOLID_CLASSES[row.color]}
                style={{ width: `${(row.value / total) * 100}%` }}
              />
            ))}
      </div>
      <dl className="mt-4 flex flex-col gap-1.5">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4">
            <dt>
              <Tag color={row.color}>{row.label}</Tag>
            </dt>
            <dd className="font-medium text-fg tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Welcome() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-md bg-fg text-xl font-semibold text-page">
        f
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
      <p className="max-w-md text-lg text-fg-secondary">
        Aquí verás el resumen de tus proyectos, sus tareas y su progreso. Empieza creando uno.
      </p>
      <Link href="/projects/new" className={buttonStyles.primary}>
        <IconPlus size={14} />
        Crear tu primer proyecto
      </Link>
    </main>
  );
}
