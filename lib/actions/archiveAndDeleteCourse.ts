"use server"
import { pool } from "@/lib/postgresql";

export async function archiveCourse(courseId: string, teacherId: string, archive: boolean) {
    try {
        const result = await pool.query(
            `UPDATE courses SET is_archived = $1, updated_at = NOW()
            WHERE id = $2::uuid AND teacher_id = $3::uuid
            RETURNING id, is_archived`,
            [archive, courseId, teacherId]
        );
        if (result.rowCount === 0) return { success: false as const, error: "Course not found" };

        return { success: true as const, isArchived: result.rows[0].is_archived };
    } catch {
        return { success: false as const, error: "Failed to update course" };
    }
}

export async function deleteCourse(courseId: string, teacherId: string) {
    try {
        const result = await pool.query(
            `DELETE FROM courses WHERE id = $1::uuid AND teacher_id = $2::uuid
            RETURNING id`,
            [courseId, teacherId]
        );
        if (result.rowCount === 0) return { success: false as const, error: "Course not found" };
        
        return { success: true as const };
    } catch {
        return { success: false as const, error: "Failed to delete course" };
    }
}