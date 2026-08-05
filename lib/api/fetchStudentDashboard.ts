import { StudentDashboardData } from "@/types/studentDashboard";

export async function fetchStudentDashboard(): Promise<StudentDashboardData> {
    const res = await fetch("/api/student/dashboard");
    if (!res.ok) throw new Error("Failed to fetch dashboard");
    const data = await res.json();
    return data;
}