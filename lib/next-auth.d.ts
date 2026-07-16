import { DefaultSession } from "next-auth";

type RoleStatus = "unset" | "pending" | "approved" | "rejected";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; 
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      roleStatus?: RoleStatus;
      isAdmin?: boolean;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string; 
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    roleStatus?: RoleStatus;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: string | null;
    roleStatus?: RoleStatus;
    isAdmin?: boolean;
  }
}