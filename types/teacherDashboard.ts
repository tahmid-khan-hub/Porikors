// types/dashboard.ts

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  pendingSubmissions: number;
  upcomingDeadlineCount: number; // deadlines in next 7 days
}

export interface UpcomingDeadline {
  task_id: string;
  task_title: string;
  course_id: string;
  course_name: string;
  deadline: string; // ISO
  submitted_count: number;
  enrolled_count: number;
}

export interface RecentAnnouncement {
  id: string;
  title: string;
  content: string;
  course_id: string;
  course_name: string;
  created_at: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  join_code: string;
  student_count: number;
  created_at: string;
}

export interface TeacherDashboardData {
  stats: DashboardStats;
  upcomingDeadlines: UpcomingDeadline[];
  recentAnnouncements: RecentAnnouncement[];
  courses: CourseSummary[];
}