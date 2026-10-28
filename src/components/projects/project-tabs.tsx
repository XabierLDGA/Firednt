import Link from "next/link";
import { IconKanban, IconList } from "@/components/icons";

type ProjectTabsProps = {
  projectId: number;
  active: "list" | "board";
  taskCount: number;
};

// The two views of a project's tasks, like Twenty's view switcher.
export function ProjectTabs({ projectId, active, taskCount }: ProjectTabsProps) {
  const tabs = [
    { key: "list", label: "Lista", href: `/projects/${projectId}`, Icon: IconList },
    { key: "board", label: "Tablero", href: `/projects/${projectId}/board`, Icon: IconKanban },
  ] as const;

  return (
    <nav aria-label="Vistas de tareas" className="flex h-10 items-end gap-4 border-b border-line px-4">
      {tabs.map(({ key, label, href, Icon }) => (
        <Link
          key={key}
          href={href}
          aria-current={key === active ? "page" : undefined}
          className={`-mb-px flex items-center gap-1.5 border-b-2 pb-2 font-medium focus-visible:outline-2 focus-visible:outline-accent ${
            key === active
              ? "border-fg text-fg"
              : "border-transparent text-fg-tertiary hover:text-fg"
          }`}
        >
          <Icon size={14} />
          {label}
          {key === "list" && (
            <span className="text-sm font-normal text-fg-tertiary tabular-nums">{taskCount}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}
