import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const result = await pool.query(
            `SELECT c.id, c.title, c.description, c.join_code, c.is_archived, c.created_at,
            COUNT(e.id)::int AS student_count
            FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id
            WHERE c.teacher_id = $1::uuid
            GROUP BY c.id
            ORDER BY c.created_at DESC`,
            [session.user.id]
        );

        const courses = result.rows.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            joinCode: course.join_code,
            isArchived: course.is_archived,
            studentCount: course.student_count,
            createdAt: course.created_at,
        }));

        return NextResponse.json({ courses });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}