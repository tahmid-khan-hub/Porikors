import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { DatabaseUser } from "@/types/DatabaseUser";
import { pool } from "./postgresql";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }

        let user: DatabaseUser;
        try {
          const result = await pool.query<DatabaseUser>(
            "SELECT * FROM users WHERE email = $1",
            [credentials.email]
          );

          if (result.rows.length === 0) {
            throw new Error("Invalid email or password");
          }
          user = result.rows[0];
        } catch (err) {
          console.error("authorize() DB error:", err);
          throw new Error("Invalid email or password");
        }

        if (!user.password) {
          throw new Error("This account uses Google Sign-In. Please continue with Google.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login", 
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }: { user: User }) {
      try {
        const existing = await pool.query<DatabaseUser>(
          "SELECT id FROM users WHERE email = $1",
          [user?.email]
        );

        if (existing.rows.length === 0) {
          await pool.query(
            "INSERT INTO users (name, email, image, password) VALUES ($1, $2, $3, $4)",
            [user.name, user.email, user.image, null]
          );
        }
        return true;
      } catch (error) {
        console.error("signIn callback DB error:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.role) {
        token.role = session.role;
        token.roleStatus = session.roleStatus ?? token.roleStatus;
        return token;
      }

      if (user || !token.userId) {
        try {
          const result = await pool.query<{ id: string; role: string | null; role_status: string }>(
            "SELECT id, role, role_status FROM users WHERE email = $1",
            [token.email]
          );
          if (result.rows.length > 0) {
            token.userId = result.rows[0].id;
            token.role = result.rows[0].role;
            token.roleStatus = (result.rows[0].role_status as JWT["roleStatus"]) ?? "unset";
          }
        } catch (error) {
          console.error("jwt callback DB error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = String(token.userId);
        session.user.role = token.role ?? null;
        session.user.roleStatus = token.roleStatus ?? "unset";
      }
      if (!session.user.image || session.user.image.trim() === "") {
        session.user.image = null;
      }
      return session;
    },
  },
};