"use server";
import { revalidatePath } from "next/cache";
import { pool } from "../postgresql";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

interface SubmitTaskInput {
  taskId: string;
  courseId: string;
  textContent: string | null;
  fileUrl: string | null;
  fileName: string | null;
}

export async function submitTask(input: SubmitTaskInput): Promise<ActionResult<{ id: string; status: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "student") return { success: false, error: "Unauthorized" };

    // must be enrolled
    const enrolled = await pool.query(
      `SELECT 1 FROM enrollments WHERE course_id = $1 AND student_id = $2`,
      [input.courseId, session.user.id]
    );

    if (enrolled.rowCount === 0) return { success: false, error: "Not enrolled in this course" };

    // fetch task, confirm it belongs to this course, and check requirements
    const taskResult = await pool.query(
      `SELECT id, deadline, allowed_file_types FROM tasks WHERE id = $1 AND course_id = $2`,
      [input.taskId, input.courseId]
    );

    if (taskResult.rowCount === 0)  return { success: false, error: "Task not found" };
    
    const task = taskResult.rows[0];

    const requiresFile = task.allowed_file_types && task.allowed_file_types.length > 0;

    if (requiresFile && !input.fileUrl) return { success: false, error: "A file is required for this task" };
    if (!requiresFile && (!input.textContent || !input.textContent.trim())) return { success: false, error: "Text submission cannot be empty" };

    const isLate = new Date() > new Date(task.deadline);
    const status = isLate ? "late" : "submitted";

    // student may already have a row from a prior resubmission_requested cycle
    const existing = await pool.query(
      `SELECT id, status FROM submissions WHERE task_id = $1 AND student_id = $2`,
      [input.taskId, session.user.id]
    );

    let result;
    if (existing.rowCount === 0) {
      result = await pool.query(
        `INSERT INTO submissions (task_id, student_id, text_content, file_url, file_name, status, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, now())
         RETURNING id, status`,
        [input.taskId, session.user.id, input.textContent, input.fileUrl, input.fileName, status]
      );
    } else {
      const current = existing.rows[0];
      // block edits after grading, resubmission only allowed if teacher explicitly requested it
      if (current.status === "graded") return { success: false, error: "This task has already been graded" };
      
      const nextStatus = current.status === "resubmission_requested" ? "resubmitted" : status;
      result = await pool.query(
        `UPDATE submissions
         SET text_content = $1, file_url = $2, file_name = $3, status = $4, submitted_at = now()
         WHERE id = $5
         RETURNING id, status`,
        [input.textContent, input.fileUrl, input.fileName, nextStatus, current.id]
      );
    }

    revalidatePath(`/student/courses/${input.courseId}/tasks/${input.taskId}`);
    revalidatePath(`/student/courses/${input.courseId}`);

    return { success: true, data: result.rows[0] };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to submit task" };
  }
}