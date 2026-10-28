import type { Progress } from "@/lib/tasks/progress";

type ProjectProgressProps = {
  progress: Progress | null;
  className?: string;
};

// Bar plus "done/total · percent". Projects without tasks show "Sin tareas".
export function ProjectProgress({ progress, className = "" }: ProjectProgressProps) {
  if (!progress) {
    return <p className={`text-sm text-fg-tertiary ${className}`}>Sin tareas</p>;
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
        aria-valuetext={`${percent} %, ${done} de ${total} tareas hechas`}
        className="h-1.5 min-w-12 flex-1 overflow-hidden rounded-full bg-active"
      >
        <div
          className={`h-full rounded-full ${percent === 100 ? "bg-green-600" : "bg-accent"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-sm text-fg-secondary tabular-nums">
        {done}/{total} · {percent} %
      </span>
    </div>
  );
}
