export type ResourceType = "video_link" | "pdf" | "text" | "drive_link" | "file";

export interface Resource {
  id: string;
  course_id: string | null;
  teacher_id: string;
  title: string;
  description: string | null;
  resource_type: ResourceType;
  url: string | null;
  text_content: string | null;
  created_at: string;
}

export interface ResourceFormValues {
  title: string;
  description: string | null;
  resource_type: ResourceType;
  url: string | null;
  text_content: string | null;
}

export interface StudentResource {
  id: string;
  title: string;
  description: string | null;
  resourceType: ResourceType;
  url: string;
  textContent: string | null;
  createdAt: string;
  courseId: string | null;   // null = teacher-wide/global
  courseTitle: string | null; // null when courseId is null
  teacherId: string;
  teacherName: string;
}
