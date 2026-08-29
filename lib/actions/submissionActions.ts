"use server";
import { revalidatePath } from "next/cache";
import { pool } from "../postgresql";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { GradeSubmissionInput, GradeSubmissionResult } from "@/types/submission";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function gradeSubmission(
    submissionId: string,
    input: GradeSubmissionInput
): Promise<GradeSubmissionResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        if (input.grade !== null && input.grade < 0) return { success: false, error: "Grade cannot be negative" };

        const result = await pool.query(
            `UPDATE submissions s
            SET grade = $1, feedback = $2, status = 'graded',
                version = s.version + 1, updated_at = now()
            FROM tasks t, courses c
            WHERE s.id = $3
               AND s.task_id = t.id
               AND t.course_id = c.id
               AND c.teacher_id = $4
               AND s.version = $5
            RETURNING s.id, t.id AS task_id, c.id AS course_id`,
            [input.grade, input.feedback.trim() || null, submissionId, session.user.id, input.version]
        );

        if (result.rowCount === 0) {
            const current = await pool.query(
                `SELECT s.version
                FROM submissions s
                JOIN tasks t ON t.id = s.task_id
                JOIN courses c ON c.id = t.course_id
                WHERE s.id = $1 AND c.teacher_id = $2`,
                [submissionId, session.user.id]
            );
            if (current.rowCount === 0) return { success: false, error: "Submission not found or access denied" };
            return {
                success: false,
                error: "This submission changed since you loaded it — refresh and try again",
                conflictVersion: current.rows[0].version,
            };
        }

        const { course_id, task_id } = result.rows[0];
        revalidatePath(`/teacher/courses/${course_id}/tasks/${task_id}`);
        return { success: true, data: { id: result.rows[0].id } };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to save grade" };
    }
}

export async function requestResubmission(
    submissionId: string
): Promise<ActionResult<{ id: string }>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const result = await pool.query(
            `UPDATE submissions s
            SET status = 'resubmission_requested', updated_at = now()
            FROM tasks t, courses c
            WHERE s.id = $1
               AND s.task_id = t.id
               AND t.course_id = c.id
               AND c.teacher_id = $2
            RETURNING s.id, t.id AS task_id, c.id AS course_id`,
            [submissionId, session.user.id]
        );

        if (result.rowCount === 0) return { success: false, error: "Submission not found or access denied" };

        const { course_id, task_id } = result.rows[0];
        revalidatePath(`/teacher/courses/${course_id}/tasks/${task_id}`);
        return { success: true, data: { id: result.rows[0].id } };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to request resubmission" };
    }
}