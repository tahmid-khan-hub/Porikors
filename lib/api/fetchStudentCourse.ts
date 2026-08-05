import { StudentCourseDetail } from "@/types/studentCourseDetail";
import { StudentResource } from "@/types/studentCourseDetail";
import { StudentAnnouncement } from "@/types/studentCourseDetail";
import { StudentTask } from "@/types/studentCourseDetail";

export async function fetchStudentCourseDetail(courseId: string): Promise<StudentCourseDetail> {
    const res = await fetch(`/api/student/courses/${courseId}`);
    if (!res.ok) throw new Error("Failed to fetch course");
    const data = await res.json();
    return data.course;
}

export async function fetchStudentCourseResources(courseId: string): Promise<StudentResource[]> {
    const res = await fetch(`/api/student/courses/${courseId}/resources`);
    if (!res.ok) throw new Error("Failed to fetch resources");
    const data = await res.json();
    return data.resources;
}

export async function fetchStudentCourseAnnouncements(courseId: string): Promise<StudentAnnouncement[]> {
    const res = await fetch(`/api/student/courses/${courseId}/announcements`);
    if (!res.ok) throw new Error("Failed to fetch announcements");
    const data = await res.json();
    return data.announcements;
}

export async function fetchStudentCourseTasks(courseId: string): Promise<StudentTask[]> {
    const res = await fetch(`/api/student/courses/${courseId}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = await res.json();
    return data.tasks;
}
