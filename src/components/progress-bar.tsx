import type { Progress } from "@/lib/tasks/progress";

type ProgressBarProps = {
  progress: Progress | null;
  className?: string;
  // Shown instead of the bar when there is nothing to count.
  emptyLabel?: string;
  // Read by screen readers after the counts: "4 de 6 tareas hechas".
  doneLabel?: string;
};

// Bar plus percent, for project tasks and learning checklists.
export function ProgressBar({
  progress,
  className = "",
  emptyLabel = "Sin tareas",
  doneLabel = "tareas hechas",
}: ProgressBarProps) {
  if (!progress) {
    return <p className={`text-sm text-fg-tertiary ${className}`}>{emptyLabel}</p>;
  }

  const { done, total, percent } = progress;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        role="progressbar"
        aria-label="Progreso"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent} %, ${done} de ${total} ${doneLabel}`}
        className="h-1.5 min-w-12 flex-1 overflow-hidden rounded-full bg-active"
      >
        <div
          className={`h-full rounded-full ${percent === 100 ? "bg-tag-green-fg" : "bg-accent"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-medium text-fg-secondary tabular-nums">
        {percent} %
      </span>
    </div>
  );
}
