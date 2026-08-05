import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: courseId } = await params;

        const enrolled = await pool.query(
            `SELECT 1 FROM enrollments WHERE course_id = $1 AND student_id = $2`,
            [courseId, session.user.id]
        );

        if (enrolled.rowCount === 0) return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });

        const result = await pool.query(
            `SELECT t.id, t.title, t.description, t.deadline, t.max_marks, t.allowed_file_types,
                COALESCE(s.status, 'not_submitted') AS submission_status,
                s.marks AS submission_marks
            FROM tasks t
            LEFT JOIN submissions s ON s.task_id = t.id AND s.student_id = $2
            WHERE t.course_id = $1
            ORDER BY t.deadline ASC`,
            [courseId, session.user.id]
        );

        return NextResponse.json({ tasks: result.rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
    }
}
