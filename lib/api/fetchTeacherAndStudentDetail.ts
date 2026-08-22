import { StudentDetail, TeacherDetail } from "@/types/admin";

export async function fetchTeacherDetail(id: string): Promise<TeacherDetail> {
    const res = await fetch(`/api/admin/teachers/${id}`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message ?? "Failed to load teacher");
    return data.teacher;
}

export async function fetchStudentDetail(id: string): Promise<StudentDetail> {
    const res = await fetch(`/api/admin/students/${id}`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message ?? "Failed to load student");
    return data.student;
}