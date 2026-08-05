export interface StudentDashboardStats {
    totalCourses: number;
    pendingTasks: number;
    dueThisWeek: number;
    gradedThisMonth: number;
}

export interface StudentUpcomingDeadline {
    task_id: string;
    task_title: string;
    course_id: string;
    course_name: string;
    deadline: string;
    submission_status: "not_submitted" | "submitted" | "late" | "graded" | "resubmission_requested" | "resubmitted";
}

export interface StudentRecentAnnouncement {
    id: string;
    content: string;
    created_at: string;
    course_id: string;
    course_name: string;
}

export interface StudentRecentGrade {
    task_id: string;
    task_title: string;
    course_id: string;
    course_name: string;
    marks: number;
    max_marks: number | null;
    graded_at: string;
}

export interface StudentDashboardCourse {
    id: string;
    title: string;
    teacher_name: string;
    join_code: string;
    student_count: number;
    pending_task_count: number;
}

export interface StudentDashboardData {
    stats: StudentDashboardStats;
    upcomingDeadlines: StudentUpcomingDeadline[];
    recentAnnouncements: StudentRecentAnnouncement[];
    recentGrades: StudentRecentGrade[];
    courses: StudentDashboardCourse[];
}
