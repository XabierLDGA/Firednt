import { Tag } from "@/components/tag";
import type { TaskStatus } from "@/lib/db/enums";
import { TASK_STATUS_COLORS, TASK_STATUS_LABELS } from "@/lib/tasks/constants";

export function TaskStatusTag({ status }: { status: TaskStatus }) {
  return <Tag color={TASK_STATUS_COLORS[status]}>{TASK_STATUS_LABELS[status]}</Tag>;
}
