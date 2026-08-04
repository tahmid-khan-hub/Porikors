import { GradeMatrix } from "@/types/grade";

export async function fetchCourseGrades(courseId: string): Promise<GradeMatrix> {
    const res = await fetch(`/api/teacher/courses/${courseId}/grades`);
    if (!res.ok) throw new Error("Failed to fetch grades");
    const data = await res.json();
    return { components: data.components, rows: data.rows };
}