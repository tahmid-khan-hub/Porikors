import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { Announcement } from "@/types/announcement";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const { id: courseId } = await params;

        const ownershipCheck = await pool.query(
            `SELECT id FROM courses WHERE id = $1::uuid AND teacher_id = $2::uuid`,
            [courseId, session.user.id]
        );

        if (ownershipCheck.rowCount === 0) { return NextResponse.json({ error: "Course not found" }, { status: 404 }); }

        const result = await pool.query(
            `SELECT id, teacher_id, course_id, content, created_at, updated_at
            FROM announcements WHERE course_id = $1::uuid
            ORDER BY created_at DESC`,
            [courseId]
        );

        const announcements: Announcement[] = result.rows.map((row) => ({
            id: row.id,
            teacherId: row.teacher_id,
            courseId: row.course_id,
            content: row.content,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }))

        return NextResponse.json({ announcements });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}