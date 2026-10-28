import type { ProjectStatus } from "@/lib/db/schema";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  IDEA: "Idea",
  IN_PROGRESS: "En desarrollo",
  PAUSED: "Pausado",
  DONE: "Terminado",
};
