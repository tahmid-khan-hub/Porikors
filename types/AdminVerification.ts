export type RoleTab = "all" | "teacher" | "student";

export interface Verification {
  id: number;
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
};

export interface VerificationsPage {
  items: Verification[];
  nextCursor: string | null;
};
