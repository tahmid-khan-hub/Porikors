import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; taskId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const { id: courseId, taskId } = await params;

        const enrolled = await pool.query(
            `SELECT 1 FROM enrollments WHERE course_id = $1 AND student_id = $2`,
            [courseId, session.user.id]
        );

        if (enrolled.rowCount === 0) return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });

        const taskResult = await pool.query(
            `SELECT t.id, t.course_id, c.title AS course_title, t.title, t.description, t.deadline, t.max_marks, t.allowed_file_types
            FROM tasks t
            JOIN courses c ON c.id = t.course_id
            WHERE t.id = $1 AND t.course_id = $2`,
            [taskId, courseId]
        );
        if (taskResult.rowCount === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });
        
        const submissionResult = await pool.query(
            `SELECT id, status, content_text, file_url, grade, feedback, submitted_at, created_at
            FROM submissions
            WHERE task_id = $1 AND student_id = $2`,
            [taskId, session.user.id]
        );

        return NextResponse.json({
            task: {
                ...taskResult.rows[0],
                submission: submissionResult.rows[0] ?? null,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to load task" }, { status: 500 });
    }
}