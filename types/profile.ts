export interface StudentIdentity {
    id: string;
    name: string;
    email: string;
    image: string | null;
    institution: string;
}

export interface StudentAcademicInfo {
    studentId: string | null;
    institution: string;
    department: string | null;
    idCardUrl: string | null;
    verificationStatus: "unset" | "pending" | "approved" | "rejected";
    memberSince: string; // ISO date
}

export interface StudentStats {
    coursesEnrolled: number;
    tasksCompleted: number;
    pendingTasks: number;
    overallGradePercent: number | null; // null = nothing graded yet
}

export interface StudentCourseSummary {
    courseId: string;
    courseName: string;
    teacherName: string;
    isArchived: boolean;
}

export interface StudentProfile {
    identity: StudentIdentity;
    academic: StudentAcademicInfo;
    stats: StudentStats;
    courses: StudentCourseSummary[];
}

export interface ProfileUpdateInput {
    name: string;
    institution: string;
}

export type ProfileUpdateResult =
    | { success: true; data: { name: string; institution: string } }
    | { success: false; error: string };

export type ImageUpdateResult =
    | { success: true; data: { image: string } }
    | { success: false; error: string };

export interface TeacherIdentity {
    id: string;
    name: string;
    email: string;
    image: string | null;
    institution: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
}

export interface TeacherAcademicInfo {
    designation: string | null;
    department: string | null;
    institution: string;
    workEmail: string | null;
    verificationStatus: "unset" | "pending" | "approved" | "rejected";
    memberSince: string;
}

export interface TeacherStats {
    coursesTaught: number;
    totalStudents: number;
    pendingGrading: number;
    announcementsPosted: number;
}

export interface TeacherCourseSummary {
    courseId: string;
    courseName: string;
    studentCount: number;
    isArchived: boolean;
}

export interface TeacherProfile {
    identity: TeacherIdentity;
    academic: TeacherAcademicInfo;
    stats: TeacherStats;
    courses: TeacherCourseSummary[];
}

export interface TeacherProfileUpdateInput {
    name: string;
    institution: string;
}

export type TeacherProfileUpdateResult =
  | { success: true; data: { name: string; institution: string } }
  | { success: false; error: string };