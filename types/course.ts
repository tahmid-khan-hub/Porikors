export interface Course {
    id: string;
    title: string;
    description: string | null;
    joinCode: string;
    isArchived: boolean;
    studentCount: number;
    createdAt: string;
}