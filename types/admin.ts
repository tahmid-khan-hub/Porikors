export interface Teacher {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  coursesCount: number;
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

export type TeacherSortBy = "newest" | "oldest" | "name_asc" | "name_desc";
export type TeacherDateRange = "all" | "today" | "week" | "month" | "year";