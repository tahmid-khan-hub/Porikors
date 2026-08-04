"use server";
import { revalidatePath } from "next/cache";
import { pool } from "../postgresql";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { AssessmentComponentInput, } from "@/types/grade";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createAssessmentComponent( courseId: string, input: AssessmentComponentInput, ): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const owns = await pool.query(
      `SELECT id FROM courses WHERE id = $1::uuid AND teacher_id = $2::uuid`, [courseId, session.user.id],
    );
    if (owns.rowCount === 0) return { success: false, error: "Course not found or access denied" };

    if (!input.name.trim()) return { success: false, error: "Name is required" };
    if (!input.maxMarks || input.maxMarks <= 0) return { success: false, error: "Max marks must be greater than 0" };

    const posResult = await pool.query(
      `SELECT COALESCE(MAX(position), -1) + 1 AS next_position
       FROM assessment_components WHERE course_id = $1::uuid`, [courseId],
    );
    const nextPosition = posResult.rows[0].next_position;

    const result = await pool.query(
      `INSERT INTO assessment_components (course_id, name, max_marks, position)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [courseId, input.name.trim(), input.maxMarks, nextPosition],
    );

    revalidatePath(`/teacher/courses/${courseId}/grades`);
    return { success: true, data: { id: result.rows[0].id } };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to create assessment component" };
  }
}

export async function updateAssessmentComponent( componentId: string, input: AssessmentComponentInput, ): Promise<ActionResult<{ id: string; courseId: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    if (!input.name.trim()) return { success: false, error: "Name is required" };
    if (!input.maxMarks || input.maxMarks <= 0) return { success: false, error: "Max marks must be greater than 0" };

    const result = await pool.query(
      `UPDATE assessment_components ac
       SET name = $1, max_marks = $2, updated_at = now()
       FROM courses c
       WHERE ac.id = $3 AND ac.course_id = c.id AND c.teacher_id = $4
       RETURNING ac.id, ac.course_id`,
      [input.name.trim(), input.maxMarks, componentId, session.user.id],
    );

    if (result.rowCount === 0) return { success: false, error: "Component not found or access denied" };

    revalidatePath(`/teacher/courses/${result.rows[0].course_id}/grades`);
    return { success: true, data: { id: result.rows[0].id, courseId: result.rows[0].course_id }, };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update assessment component" };
  }
}

export async function deleteAssessmentComponent( componentId: string, ): Promise<ActionResult<{ id: string; courseId: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const result = await pool.query(
      `DELETE FROM assessment_components ac
       USING courses c
       WHERE ac.id = $1 AND ac.course_id = c.id AND c.teacher_id = $2
       RETURNING ac.id, ac.course_id`,
      [componentId, session.user.id],
    );

    if (result.rowCount === 0) return { success: false, error: "Component not found or access denied" };

    revalidatePath(`/teacher/courses/${result.rows[0].course_id}/grades`);
    return { success: true, data: { id: result.rows[0].id, courseId: result.rows[0].course_id },};
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete assessment component" };
  }
}
