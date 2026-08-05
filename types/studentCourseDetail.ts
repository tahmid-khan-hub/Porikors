export interface StudentCourseDetail {
    id: string;
    title: string;
    description: string | null;
    teacher_name: string;
    join_code: string;
    enrolled_at: string;
}

export interface StudentResource {
    id: string;
    title: string;
    type: "video" | "note" | "slide" | "link" | "file";
    url: string;
    created_at: string;
}

export interface StudentAnnouncement {
    id: string;
    content: string;
    created_at: string;
}

export type SubmissionStatus = | "not_submitted" | "submitted" | "late" | "graded" | "resubmission_requested" | "resubmitted";

export interface StudentTask {
    id: string;
    title: string;
    description: string | null;
    deadline: string;
    max_marks: number | null;
    allowed_file_types: string[] | null;
    submission_status: SubmissionStatus;
    submission_marks: number | null;
}