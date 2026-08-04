export type TaskDeadlineStatus = "upcoming" | "due_soon" | "overdue";

export function getTaskDeadlineStatus(deadline: string): TaskDeadlineStatus {
  const diffMs = new Date(deadline).getTime() - Date.now();
  if (diffMs < 0) return "overdue";
  if (diffMs < 24 * 60 * 60 * 1000) return "due_soon";
  return "upcoming";
}

export const taskStatusStyles: Record<TaskDeadlineStatus, { label: string; bg: string; text: string }> = {
  upcoming: { label: "Upcoming", bg: "#F6F5F1", text: "#6B7369" },
  due_soon: { label: "Due soon", bg: "#FBEBD9", text: "#D98B3F" },
  overdue: { label: "Overdue", bg: "#F6E3E1", text: "#C1443D" },
};