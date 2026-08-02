import { Course, CourseDetail } from "@/types/course";

export async function fetchTeacherCourses(): Promise<Course[]> {
    const res = await fetch("/api/teacher/courses");
    if (!res.ok) throw new Error("Failed to fetch courses");
    const data = await res.json();
    return data.courses;
}

export async function fetchCourseDetail(id: string): Promise<CourseDetail> {
    const res = await fetch(`/api/teacher/courses/${id}`)
    if(!res.ok) throw new Error("Failed to fetch course");
    const data = await res.json();
    return data.course;
}
