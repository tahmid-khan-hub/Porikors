import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const courseId = req.nextUrl.searchParams.get("course_id");

    const result = await pool.query(
      courseId
        ? `SELECT id, course_id, teacher_id, title, description, resource_type, url, text_content, created_at
          FROM resources
          WHERE teacher_id = $1 AND course_id = $2::uuid
          ORDER BY created_at DESC`
        : `SELECT id, course_id, teacher_id, title, description, resource_type, url, text_content, created_at
          FROM resources
          WHERE teacher_id = $1 AND course_id IS NULL
          ORDER BY created_at DESC`,
      courseId ? [session.user.id, courseId] : [session.user.id]
    );

    return NextResponse.json({ resources: result.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}