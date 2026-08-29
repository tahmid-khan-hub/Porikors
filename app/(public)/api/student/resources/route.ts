import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "student")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const rawLimit = Number(searchParams.get("limit"));
        const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;

        const result = await pool.query(
        `WITH my_courses AS (
            SELECT co.id AS course_id, co.teacher_id
            FROM enrollments en
            JOIN courses co ON co.id = en.course_id
            WHERE en.student_id = $1::uuid
        )
        SELECT r.id, r.title, r.description, r.resource_type, r.url,
            r.text_content, r.created_at,
            r.course_id, c.title AS course_title,
            r.teacher_id, u.name AS teacher_name
        FROM resources r
        JOIN users u ON u.id = r.teacher_id
        LEFT JOIN courses c ON c.id = r.course_id
        WHERE
            r.course_id IS NULL
            AND r.teacher_id IN (SELECT teacher_id FROM my_courses)
        ORDER BY r.created_at DESC
        LIMIT $2`,
        [session.user.id, limit]
        );

        const resources = result.rows.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            resourceType: r.resource_type,
            url: r.url,
            textContent: r.text_content,
            createdAt: r.created_at,
            courseId: r.course_id,
            courseTitle: r.course_title,
            teacherId: r.teacher_id,
            teacherName: r.teacher_name,
        }));

        return NextResponse.json({ resources });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }
}