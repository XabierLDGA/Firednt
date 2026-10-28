import type { ProjectStatus } from "@/lib/db/enums";
import { PROJECT_STATUS_LABELS } from "@/lib/projects/constants";

const DOT_COLORS: Record<ProjectStatus, string> = {
  IDEA: "bg-fg-tertiary",
  IN_PROGRESS: "bg-accent",
  PAUSED: "bg-amber-500",
  DONE: "bg-green-600",
};

export function StatusDot({ status }: { status: ProjectStatus }) {
  return <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${DOT_COLORS[status]}`} />;
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-line px-2 py-0.5 text-sm text-fg-secondary">
      <StatusDot status={status} />
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}
