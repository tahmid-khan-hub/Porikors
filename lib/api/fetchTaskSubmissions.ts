import { TaskSubmissionsResponse } from "@/types/submission";

export async function fetchTaskSubmissions(
    courseId: string,
    taskId: string
): Promise<TaskSubmissionsResponse> {
    const res = await fetch(`/api/teacher/courses/${courseId}/tasks/${taskId}/submissions`);
    if (!res.ok) throw new Error("Failed to fetch submissions");
    return res.json();
}