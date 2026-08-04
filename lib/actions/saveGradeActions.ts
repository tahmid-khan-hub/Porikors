"use server";
import { GradeCellUpdate, GradeSaveConflict, GradeSaveResult, } from "@/types/grade";
import { authOptions } from "../authOptions";
import { getServerSession } from "next-auth";
import { pool } from "../postgresql";
import { revalidatePath } from "next/cache";

export async function saveGrades( courseId: string, updates: GradeCellUpdate[], ): Promise<GradeSaveResult> {
  if (updates.length === 0) { return { success: true, conflicts: [] };}

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) { return { success: false, error: "Unauthorized" }; }

  const componentIds = updates.map((u) => u.componentId);
  const studentIds = updates.map((u) => u.studentId);
  const scores = updates.map((u) => u.score);
  const versions = updates.map((u) => u.version);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // Authorize every cell at once:
    // component must belong to a course this teacher owns,
    // and the student must actually be enrolled in it.
    const authCheck = await client.query(
      `
      SELECT d.component_id, d.student_id
      FROM unnest($1::uuid[], $2::uuid[]) AS d(component_id, student_id)
      JOIN assessment_components ac ON ac.id = d.component_id
      JOIN courses c ON c.id = ac.course_id AND c.teacher_id = $3::uuid
      JOIN enrollments en ON en.course_id = c.id
      AND en.student_id = d.student_id
      `,
      [componentIds, studentIds, session.user.id],
    );

    if (authCheck.rowCount !== updates.length) {
      await client.query("ROLLBACK");
      return {
        success: false,
        error: "One or more cells are invalid (wrong course, component, or student)",
      };
    }
    // Update existing rows only where version matches (optimistic lock),
    // insert fresh rows for cells that have never been graded before.
    const result = await client.query(
      `
      WITH input_data AS (
        SELECT *
        FROM unnest( $1::uuid[], $2::uuid[], $3::numeric[], $4::int[] ) AS t(component_id, student_id, score, version)
      ),

      updated AS (
        UPDATE grades g
        SET score = d.score, version = g.version + 1, graded_by = $5::uuid, updated_at = NOW()
        FROM input_data d
        WHERE g.component_id = d.component_id AND g.student_id = d.student_id AND g.version = d.version
        RETURNING g.component_id, g.student_id
      ),

      inserted AS (
        INSERT INTO grades ( component_id, student_id, score, version, graded_by )
        SELECT d.component_id, d.student_id, d.score, 1, $5::uuid
        FROM input_data d
        WHERE NOT EXISTS (
          SELECT 1
          FROM grades g
          WHERE g.component_id = d.component_id AND g.student_id = d.student_id
        )
        ON CONFLICT (component_id, student_id) DO NOTHING
        RETURNING component_id, student_id
      )

      SELECT component_id, student_id
      FROM updated
      UNION ALL
      SELECT component_id, student_id
      FROM inserted
      `,
      [componentIds, studentIds, scores, versions, session.user.id],
    );

    const successSet = new Set( result.rows.map((r) => `${r.component_id}:${r.student_id}`), );

    const conflictCells = updates.filter( (u) => !successSet.has(`${u.componentId}:${u.studentId}`), );

    let conflicts: GradeSaveConflict[] = [];

    if (conflictCells.length > 0) {
      const currentRows = await client.query(
        `
        SELECT d.component_id, d.student_id, g.score, g.version
        FROM unnest($1::uuid[], $2::uuid[]) AS d(component_id, student_id)
        LEFT JOIN grades g ON g.component_id = d.component_id
        AND g.student_id = d.student_id
        `,
        [
          conflictCells.map((c) => c.componentId),
          conflictCells.map((c) => c.studentId),
        ],
      );

      conflicts = currentRows.rows.map((r) => ({
        componentId: r.component_id,
        studentId: r.student_id,
        currentScore: r.score !== null ? Number(r.score) : null,
        currentVersion: r.version ?? 0,
      }));
    }

    await client.query("COMMIT");

    revalidatePath(`/teacher/courses/${courseId}/grades`);

    return { success: true, conflicts, };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return { success: false, error: "Failed to save grades" };
  } finally { client.release(); }
}
