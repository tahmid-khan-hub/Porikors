import { Announcement } from "@/types/announcement";

export async function fetchfetchCourseAnnouncements(courseId: string): Promise<Announcement[]>{
    const res = await fetch(`/api/teacher/courses/${courseId}/announcements`);
    if (!res.ok) throw new Error("Failed to fetch announcements");
    const data = await res.json();
    return data.announcements;
}