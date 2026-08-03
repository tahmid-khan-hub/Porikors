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
