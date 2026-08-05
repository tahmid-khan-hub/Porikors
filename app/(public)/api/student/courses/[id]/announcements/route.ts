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
            `SELECT id, content, created_at
            FROM announcements
            WHERE course_id = $1
            ORDER BY created_at DESC`,
            [courseId]
        );

        return NextResponse.json({ announcements: result.rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to load announcements" }, { status: 500 });
    }
}
