import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; taskId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: courseId, taskId } = await params;

        const taskResult = await pool.query(
            `SELECT t.id, t.title, t.description, t.deadline, t.max_marks,
                t.attachment_url, t.attachment_name,
                c.id AS course_id, c.title AS course_title
            FROM tasks t
            JOIN courses c ON c.id = t.course_id
            WHERE t.id = $1 AND c.id = $2 AND c.teacher_id = $3`,
            [taskId, courseId, session.user.id]
        );

        if (taskResult.rowCount === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        const submissionsResult = await pool.query(
            `SELECT u.id AS student_id, u.name AS student_name, u.email AS student_email,
                    s.id AS submission_id,
                    COALESCE(s.status, 'not_submitted') AS status,
                    s.content_text, s.file_url, s.submitted_at,
                    s.grade, s.feedback,
                    COALESCE(s.version, 0) AS version
            FROM enrollments en
            JOIN users u ON u.id = en.student_id
            LEFT JOIN submissions s ON s.student_id = u.id AND s.task_id = $1
            WHERE en.course_id = $2
            ORDER BY u.name ASC`,
            [taskId, courseId]
        );

        return NextResponse.json({
            task: taskResult.rows[0],
            submissions: submissionsResult.rows.map((r) => ({
                ...r,
                grade: r.grade !== null ? Number(r.grade) : null,
            })),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 });
    }
}