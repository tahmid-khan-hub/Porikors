export interface Teacher {
  id: string;
  name: string;
  email: string;
  image: string | null;
  roleApprovedAt: string;
  coursesCount: number;
}

export interface TeacherDetail extends Teacher {
  institution: string | null;
  department: string | null;
  designation: string | null;
  workEmail: string | null;
  phoneNumber: string | null;
  gender: string | null;
  dateOfBirth: string | null;
}

export interface TeacherStats {
  totalTeachers: number;
  newThisMonth: number;
  newThisWeek: number;
  pendingVerifications: number;
}

export interface TeachersResponse {
  success: boolean;
  teachers: Teacher[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface TeacherDetailResponse {
  success: boolean;
  teacher: TeacherDetail;
}

export type TeacherSortBy = "newest" | "oldest" | "name_asc" | "name_desc";
export type TeacherDateRange = "all" | "today" | "week" | "month" | "year";

export interface Student {
  id: string;
  name: string;
  email: string;
  image: string | null;
  roleApprovedAt: string;
}

export interface StudentDetail extends Student {
  institution: string | null;
  department: string | null;
  studentIdNumber: string | null;
  phoneNumber: string | null;
  gender: string | null;
  dateOfBirth: string | null;
}

export interface StudentStats {
  totalStudents: number;
  newThisMonth: number;
  newThisWeek: number;
  pendingVerifications: number;
}

export interface StudentsResponse {
  success: boolean;
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface StudentDetailResponse {
  success: boolean;
  student: StudentDetail;
}

export type StudentSortBy = "newest" | "oldest" | "name_asc" | "name_desc";
export type StudentDateRange = "all" | "today" | "week" | "month" | "year";