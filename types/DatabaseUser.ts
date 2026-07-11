export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  password_hash: string | null; 
  image: string | null;
  role: "student" | "teacher" | null; 
  created_at: Date;
  updated_at: Date;
}