import { StudentProfile } from "@/types/profile";

export async function fetchStudentProfile(): Promise<StudentProfile> {
    const res = await fetch("/api/student/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
}