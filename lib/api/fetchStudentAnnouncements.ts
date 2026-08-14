import { StudentAnnouncement } from "@/types/announcement";

export async function fetchStudentAnnouncements(limit = 10): Promise<StudentAnnouncement[]> {
    const res = await fetch(`/api/student/announcements?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch announcements");
    const data = await res.json();
    return data.announcements;
}