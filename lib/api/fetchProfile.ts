import { StudentProfile, TeacherProfile } from "@/types/profile";

export async function fetchStudentProfile(): Promise<StudentProfile> {
    const res = await fetch("/api/student/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
}

export async function fetchTeacherProfile(): Promise<TeacherProfile> {
    const res = await fetch("/api/teacher/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
}