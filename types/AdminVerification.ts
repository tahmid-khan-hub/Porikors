export type RoleTab = "all" | "teacher" | "student";

export interface Verification {
  id: string;
  user_id: string;
  requested_role: "teacher" | "student";
  status: "pending" | "approved" | "rejected";
  institution: string | null;
  id_card_url: string | null;
  reject_reason: string | null;
  created_at: string;
  name: string;
  email: string;
  image: string | null;
  phone_number: string | null;
  gender: string | null;
  date_of_birth: string | null;
  department: string | null;
  // teacher-only
  designation: string | null;
  work_email: string | null;
  // student-only
  student_id_number: string | null;
};

export interface VerificationsPage {
  items: Verification[];
  nextCursor: string | null;
};
