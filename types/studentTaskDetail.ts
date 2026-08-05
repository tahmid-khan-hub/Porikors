import { SubmissionStatus } from "./studentCourseDetail";

export interface StudentTaskDetail {
    id: string;
    course_id: string;
    course_title: string;
    title: string;
    description: string | null;
    deadline: string;
    max_marks: number | null;
    allowed_file_types: string[] | null; // null/empty = text-only
    submission: {
        id: string;
        status: SubmissionStatus;
        text_content: string | null;
        file_url: string | null;
        file_name: string | null;
        marks: number | null;
        feedback: string | null;
        submitted_at: string | null;
        graded_at: string | null;
    } | null;
}
