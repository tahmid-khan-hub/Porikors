export interface Announcement {
    id: string;
    teacherId: string;
    courseId: string | null;
    content: string;
    createdAt: string;
    updatedAt: string;
}