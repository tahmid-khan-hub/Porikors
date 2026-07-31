import { Course } from "@/types/course";

export async function fetchTeacherCourses(): Promise<Course[]> {
    const res = await fetch("/api/teacher/courses");
    if (!res.ok) throw new Error("Failed to fetch courses");
    const data = await res.json();
    return data.courses;
}