import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url)
        const rawLimit = Number(searchParams.get("limit"));
        const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;

        const result = await pool.query(
        `SELECT a.id, a.content, a.created_at, a.updated_at,
            a.course_id, c.title AS course_name,
            a.teacher_id, u.name AS teacher_name
        FROM announcements a
        JOIN users u ON u.id = a.teacher_id
        LEFT JOIN courses c ON c.id = a.course_id
        WHERE a.teacher_id IN (
            SELECT DISTINCT co.teacher_id
            FROM enrollments en
            JOIN courses co ON co.id = en.course_id
            WHERE en.student_id = $1::uuid
        )
        AND (
            a.course_id IS NULL
            OR a.course_id IN (
            SELECT course_id FROM enrollments WHERE student_id = $1::uuid
            )
        )
        ORDER BY a.created_at DESC
        LIMIT $2`,
        [session.user.id, limit]
        );

        const announcements = result.rows.map((r) => ({
            id: r.id,
            content: r.content,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            courseId: r.course_id,
            courseName: r.course_name,
            teacherId: r.teacher_id,
            teacherName: r.teacher_name,
        }));

        return NextResponse.json({ announcements });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
    }
}