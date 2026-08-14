export interface Announcement {
    id: string;
    teacherId: string;
    courseId: string | null;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface StudentAnnouncement {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    courseId: string | null;   // null = teacher-wide/global
    courseName: string | null; // null when courseId is null
    teacherId: string;
    teacherName: string;
}
