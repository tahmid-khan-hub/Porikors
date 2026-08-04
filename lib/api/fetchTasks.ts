import { Task } from "@/types/task";

export async function fetchCourseTasks(courseId: string): Promise<Task[]> {
    const res = await fetch(`/api/teacher/courses/${courseId}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = await res.json();
    return data.tasks;
}
