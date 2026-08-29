export type SubmissionStatus = | "not_submitted" | "submitted" | "late" | "graded" | "resubmission_requested" | "resubmitted";

export interface TaskDetail {
    id: string;
    title: string;
    description: string | null;
    deadline: string | null;
    max_marks: number | null;
    attachment_url: string | null;
    attachment_name: string | null;
    course_id: string;
    course_title: string;
}

export interface StudentSubmissionRow {
    student_id: string;
    student_name: string;
    student_email: string;
    submission_id: string | null;
    status: SubmissionStatus;
    content_text: string | null;
    file_url: string | null;
    submitted_at: string | null;
    grade: number | null;
    feedback: string | null;
    version: number;
}

export interface TaskSubmissionsResponse {
    task: TaskDetail;
    submissions: StudentSubmissionRow[];
}

export interface GradeSubmissionInput {
    grade: number | null;
    feedback: string;
    version: number;
}

export type GradeSubmissionResult =
    | { success: true; data: { id: string } }
    | { success: false; error: string; conflictVersion?: number };