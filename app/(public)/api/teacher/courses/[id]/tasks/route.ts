import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                
        const { id: courseId } = await params;

        const result = await pool.query(
            `SELECT t.*
            FROM tasks t
            JOIN courses c ON c.id = t.course_id
            WHERE t.course_id = $1 AND c.teacher_id = $2
            ORDER BY t.deadline ASC`, [courseId, session.user.id]
        );

        if (result.rowCount === 0) return NextResponse.json({ error: "Tasks not found" }, { status: 404 }); 

        return NextResponse.json({ tasks: result.rows });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}