import { TeacherDashboardData } from "@/types/teacherDashboard";

export async function fetchTeacherDashboard(): Promise<TeacherDashboardData> {
    const res = await fetch("/api/teacher/dashboard");
    if (!res.ok) throw new Error("Failed to fetch dashboard");
    const data = await res.json();
    return data.dashboard;
}