export interface Course {
    id: string;
    title: string;
    description: string | null;
    joinCode: string;
    isArchived: boolean;
    studentCount: number;
    createdAt: string;
}

export interface CourseDetail extends Course {
    teacherId: string;
}