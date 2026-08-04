export interface AssessmentComponent {
  id: string;
  course_id: string;
  name: string;
  max_marks: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface GradeCell {
  grade_id: string | null;
  score: number | null;
  version: number; // 0 = never graded yet (no row exists)
}

export interface GradeStudentRow {
  student_id: string;
  student_name: string;
  student_email: string;
  grades: Record<string, GradeCell>; // keyed by component_id
}

export interface GradeMatrix {
  components: AssessmentComponent[];
  rows: GradeStudentRow[];
}

export interface AssessmentComponentInput {
  name: string;
  maxMarks: number;
}

export interface GradeCellUpdate {
  componentId: string;
  studentId: string;
  score: number | null;
  version: number; // version the client last saw; 0 if the cell was never graded
}

export interface GradeSaveConflict {
  componentId: string;
  studentId: string;
  currentScore: number | null;
  currentVersion: number;
}

export type GradeSaveResult =
  | { success: true; conflicts: GradeSaveConflict[] }
  | { success: false; error: string };