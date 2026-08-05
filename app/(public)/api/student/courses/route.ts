import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "student")  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const result = await pool.query(
            `SELECT c.id, c.title, c.description, c.join_code,
                u.name AS teacher_name,
                en.enrolled_at,
                COUNT(DISTINCT r.id) AS resource_count, COUNT(DISTINCT t.id) AS task_count,
                COUNT(DISTINCT t.id) FILTER (
                    WHERE t.deadline > now()
                    AND NOT EXISTS (
                        SELECT 1 FROM submissions s
                        WHERE s.task_id = t.id AND s.student_id = en.student_id
                        AND s.status IN ('submitted', 'late', 'graded', 'resubmitted')
                    )
                ) AS pending_task_count
            FROM enrollments en
            JOIN courses c ON c.id = en.course_id
            JOIN users u ON u.id = c.teacher_id
            LEFT JOIN resources r ON r.course_id = c.id
            LEFT JOIN tasks t ON t.course_id = c.id
            WHERE en.student_id = $1
            GROUP BY c.id, u.name, en.enrolled_at
            ORDER BY en.enrolled_at DESC`,
            [session.user.id]
        );

        return NextResponse.json({
            courses: result.rows.map((r) => ({
                ...r,
                resource_count: Number(r.resource_count),
                task_count: Number(r.task_count),
                pending_task_count: Number(r.pending_task_count),
            })),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to load courses" }, { status: 500 });
    }
}