import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { Resource } from "@/types/resources";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: courseId } = await params;

        const ownershipCheck = await pool.query(
            `SELECT id FROM courses WHERE id = $1::uuid AND teacher_id = $2::uuid`, [courseId, session.user.id]
        );

        if (ownershipCheck.rowCount === 0) return NextResponse.json({ error: "Course not found" }, { status: 404 }); 

        const result = await pool.query(
            `SELECT id, course_id, teacher_id, title, description, resource_type, url, text_content, created_at
            FROM resources WHERE course_id = $1::uuid
            ORDER BY created_at DESC`,
            [courseId]
        );

        const resources: Resource[] = result.rows;

        return NextResponse.json({ resources });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}