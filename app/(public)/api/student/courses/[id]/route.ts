import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: courseId } = await params;

        const result = await pool.query(
            `SELECT c.id, c.title, c.description, c.join_code, en.enrolled_at,
            u.name AS teacher_name
            FROM enrollments en
            JOIN courses c ON c.id = en.course_id
            JOIN users u ON u.id = c.teacher_id
            WHERE en.course_id = $1 AND en.student_id = $2`,
            [courseId, session.user.id]
        );

        if (result.rowCount === 0) return NextResponse.json({ error: "Course not found" }, { status: 404 });

        return NextResponse.json({ course: result.rows[0] });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to load course" }, { status: 500 });
    }
}
