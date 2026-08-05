"use server";
import { revalidatePath } from "next/cache";
import { pool } from "../postgresql";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { DatabaseError } from "pg";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function joinCourse(rawCode: string): Promise<ActionResult<{ id: string; title: string }>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "student") return { success: false, error: "Unauthorized" };
        
        const code = rawCode.trim();
        if (!code) return { success: false, error: "Join code is required" };
        if (code.length !== 6) return { success: false, error: "Join code must be 6 characters" };

        // join code lookup is case-sensitive per your spec
        const courseResult = await pool.query(
            `SELECT id, title FROM courses WHERE join_code = $1`, [code]
        );

        if (courseResult.rowCount === 0) return { success: false, error: "Invalid join code" };

        const course = courseResult.rows[0];

        // duplicate-join guarded by unique constraint on (course_id, student_id),
        const existing = await pool.query(
            `SELECT 1 FROM enrollments WHERE course_id = $1 AND student_id = $2`, [course.id, session.user.id]
        );

        if ((existing.rowCount ?? 0) > 0)  return { success: false, error: "You're already enrolled in this course" };

        await pool.query(
            `INSERT INTO enrollments (course_id, student_id, enrolled_at) VALUES ($1, $2, now())`, [course.id, session.user.id]
        );

        revalidatePath("/student/courses");
        revalidatePath("/student/dashboard");

        return { success: true, data: { id: course.id, title: course.title } };
    } catch (err: unknown) {
        // race-condition fallback - unique constraint violation if two requests slip past the check above
        if (err instanceof DatabaseError && err.code === "23505") { return { success: false, error: "You're already enrolled in this course" }; }
        console.error(err);
        return { success: false, error: "Failed to join course" };
    }
}