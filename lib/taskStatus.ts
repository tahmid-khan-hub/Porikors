export type TaskDeadlineStatus = "upcoming" | "due_soon" | "overdue";
import { SubmissionStatus } from "@/types/studentCourseDetail";

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

export const submissionStatusStyles: Record<SubmissionStatus, { bg: string; text: string; label: string }> = {
  not_submitted: { bg: "#DAD7CE", text: "#6B7369", label: "Not submitted" },
  submitted: { bg: "#1F6F5C1A", text: "#1F6F5C", label: "Submitted" },
  late: { bg: "#D98B3F1A", text: "#D98B3F", label: "Late" },
  graded: { bg: "#3B8F5C1A", text: "#3B8F5C", label: "Graded" },
  resubmission_requested: { bg: "#C1443D1A", text: "#C1443D", label: "Resubmit requested" },
  resubmitted: { bg: "#1F6F5C1A", text: "#1F6F5C", label: "Resubmitted" },
};
