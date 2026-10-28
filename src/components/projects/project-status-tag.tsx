import { Tag } from "@/components/tag";
import type { ProjectStatus } from "@/lib/db/enums";
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from "@/lib/projects/constants";

export function ProjectStatusTag({ status }: { status: ProjectStatus }) {
  return <Tag color={PROJECT_STATUS_COLORS[status]}>{PROJECT_STATUS_LABELS[status]}</Tag>;
}
