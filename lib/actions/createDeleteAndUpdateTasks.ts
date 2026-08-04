"use server";
import { revalidatePath } from "next/cache";
import { pool } from "../postgresql";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { AllowedFileType } from "@/types/task";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

interface CreateTaskInput {
  courseId: string;
  title: string;
  description: string | null;
  allowedFileTypes: AllowedFileType[] | null;
  deadline: string;
  maxMarks: number | null;
}

export async function createTask( input: CreateTaskInput ): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    
    const ownsCourse = await pool.query(
      `SELECT id FROM courses WHERE id = $1::uuid AND teacher_id = $2::uuid`,
      [input.courseId, session.user.id]
    );

    if (ownsCourse.rowCount === 0) return { success: false, error: "Course not found or access denied" };

    if (!input.title.trim()) return { success: false, error: "Title is required" };
    
    const result = await pool.query(
        `INSERT INTO tasks (course_id, title, description, allowed_file_types, deadline, max_marks)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [input.courseId, input.title.trim(), input.description, input.allowedFileTypes, input.deadline, input.maxMarks]
    );

    revalidatePath(`/teacher/courses/${input.courseId}/tasks`);

    return { success: true, data: { id: result.rows[0].id } };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to create task" };
  }
}

interface UpdateTaskInput {
  taskId: string;
  title: string;
  description: string | null;
  allowedFileTypes: AllowedFileType[] | null;
  deadline: string;
  maxMarks: number | null;
}

export async function updateTask(input: UpdateTaskInput): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    
    if (!input.title.trim()) return { success: false, error: "Title is required" };
    
    const result = await pool.query(
        `UPDATE tasks t
        SET title = $1, description = $2, allowed_file_types = $3, deadline = $4, max_marks = $5, updated_at = now()
        FROM courses c WHERE t.id = $6
        AND t.course_id = c.id AND c.teacher_id = $7
        RETURNING t.id, t.course_id`,
        [input.title.trim(), input.description, input.allowedFileTypes, input.deadline, input.maxMarks, input.taskId, session.user.id]
    );

    if (result.rowCount === 0) return { success: false, error: "Task not found or access denied" };

    revalidatePath(`/teacher/courses/${result.rows[0].course_id}/tasks`);

    return { success: true, data: { id: result.rows[0].id } };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTask(taskId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    
    const result = await pool.query(
      `DELETE FROM tasks t
       USING courses c
       WHERE t.id = $1 AND t.course_id = c.id AND c.teacher_id = $2
       RETURNING t.id, t.course_id`,
       [taskId, session.user.id]
    );

    if (result.rowCount === 0) return { success: false, error: "Task not found or access denied" };

    revalidatePath(`/teacher/courses/${result.rows[0].course_id}/tasks`);

    return { success: true, data: { id: result.rows[0].id } };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete task" };
  }
}