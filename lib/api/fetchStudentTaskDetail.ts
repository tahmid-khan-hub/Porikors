import { StudentTaskDetail } from "@/types/studentTaskDetail";

export async function fetchStudentTaskDetail(courseId: string, taskId: string): Promise<StudentTaskDetail> {
    const res = await fetch(`/api/student/courses/${courseId}/tasks/${taskId}`);
    if (!res.ok) throw new Error("Failed to fetch task");
    const data = await res.json();
    return data.task;
}