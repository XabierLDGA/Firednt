import type { Db } from "@/lib/db/client";
import { PROJECT_STATUSES, type ProjectStatus, type TaskStatus } from "@/lib/db/enums";
import { listProjects } from "@/lib/db/projects";
import type { Project } from "@/lib/db/schema";
import { countTasksByProject, countTasksByStatus } from "@/lib/db/tasks";
import { progressFromCounts, type Progress } from "@/lib/tasks/progress";

export type DashboardStats = {
  projects: { total: number; byStatus: Record<ProjectStatus, number> };
  tasks: { total: number; byStatus: Record<TaskStatus, number> };
  // Projects with status IN_PROGRESS, most recently updated first.
  inProgress: { project: Project; progress: Progress | null }[];
};

// Everything the home page shows, in three queries.
export async function getDashboardStats(db: Db): Promise<DashboardStats> {
  const [projects, countsByProject, tasksByStatus] = await Promise.all([
    listProjects(db),
    countTasksByProject(db),
    countTasksByStatus(db),
  ]);

  const projectsByStatus = Object.fromEntries(
    PROJECT_STATUSES.map((status) => [status, 0]),
  ) as Record<ProjectStatus, number>;
  for (const project of projects) projectsByStatus[project.status]++;

  return {
    projects: { total: projects.length, byStatus: projectsByStatus },
    tasks: {
      total: Object.values(tasksByStatus).reduce((sum, n) => sum + n, 0),
      byStatus: tasksByStatus,
    },
    inProgress: projects
      .filter((project) => project.status === "IN_PROGRESS")
      .map((project) => {
        const counts = countsByProject.get(project.id);
        return {
          project,
          progress: counts ? progressFromCounts(counts.done, counts.total) : null,
        };
      }),
  };
}
