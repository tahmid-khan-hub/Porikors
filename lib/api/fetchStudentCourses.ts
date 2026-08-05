import { StudentCourse } from "@/types/studentCourse";

export async function fetchStudentCourses(): Promise<StudentCourse[]> {
    const res = await fetch("/api/student/courses");
    if (!res.ok) throw new Error("Failed to fetch courses");
    const data = await res.json();
    return data.courses;
}