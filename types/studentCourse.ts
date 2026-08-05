export interface StudentCourse {
    id: string;
    title: string;
    description: string | null;
    teacher_name: string;
    join_code: string;
    enrolled_at: string;
    resource_count: number;
    task_count: number;
    pending_task_count: number;
}

export interface JoinCourseResult {
    id: string;
    title: string;
}