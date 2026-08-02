import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const { id } = await params;

        const result = await pool.query(
            `SELECT c.id, c.teacher_id, c.title, c.description, c.join_code, c.is_archived, c.created_at,
            COUNT(e.id)::int AS student_count
            FROM courses c
            LEFT JOIN enrollments e ON e.course_id = c.id
            WHERE c.id = $1::uuid AND c.teacher_id = $2::uuid
            GROUP BY c.id`,
            [id, session.user.id]
        );

        if (result.rowCount === 0) { return NextResponse.json({ error: "Course not found" }, { status: 404 }); }

        const row = result.rows[0];
        return NextResponse.json({
            course: {
                id: row.id,
                teacherId: row.teacher_id,
                title: row.title,
                description: row.description,
                joinCode: row.join_code,
                isArchived: row.is_archived,
                studentCount: row.student_count,
                createdAt: row.created_at,
            },
        });

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
    }
}