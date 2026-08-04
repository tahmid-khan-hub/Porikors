export type AllowedFileType = "pdf" | "doc" | "docx" | "zip" | "image" | "code" | "text" | "any";

export interface Task {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  allowed_file_types: AllowedFileType[] | null; // null/empty = text-only submission
  deadline: string;
  max_marks: number | null;
  created_at: string;
  updated_at: string;
}

export interface TaskFormValues {
  title: string;
  description: string | null;
  allowed_file_types: AllowedFileType[] | null;
  deadline: string;
  max_marks: number | null;
}