import { Resource } from "@/types/resources";

export async function fetchResources(courseId?: string | null): Promise<Resource[]> {
  const params = new URLSearchParams();
  if (courseId) params.set("course_id", courseId);

  const res = await fetch(`/api/teacher/resources?${params.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch resources");

  const data = await res.json();
  return data.resources;
}

export async function fetchCourseResources(courseId: string): Promise<Resource[]> {
  const res = await fetch(`/api/teacher/courses/${courseId}/resources`);
  if (!res.ok) throw new Error("Failed to fetch resources");
  const data = await res.json();
  return data.resources;
}