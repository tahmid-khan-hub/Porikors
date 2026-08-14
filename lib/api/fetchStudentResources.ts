import { StudentResource } from "@/types/resources";

export async function fetchStudentResources(limit = 10): Promise<StudentResource[]> {
    const res = await fetch(`/api/student/resources?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch resources");
    const data = await res.json();
    return data.resources;
}