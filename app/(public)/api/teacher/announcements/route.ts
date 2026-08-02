import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { Announcement } from "@/types/announcement";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const result = await pool.query(
            `SELECT id, teacher_id, course_id, content, created_at, updated_at
            FROM announcements
            WHERE teacher_id = $1::uuid AND course_id IS NULL
            ORDER BY created_at DESC`,
            [session.user.id]
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
        console.error(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}