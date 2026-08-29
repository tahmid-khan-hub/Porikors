import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: courseId } = await params;

    const ownershipCheck = await pool.query(
      `SELECT id FROM courses WHERE id = $1::uuid AND teacher_id = $2::uuid`, [courseId, session.user.id]
    );

    if (ownershipCheck.rowCount === 0) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const componentsResult = await pool.query(
        `SELECT id, course_id, name, max_marks, position, created_at, updated_at
        FROM assessment_components WHERE course_id = $1::uuid
        ORDER BY position ASC`, [courseId]
    );

    // one query: every enrolled student, left-joined against their grades
    // for this course's components only
    const gradesResult = await pool.query(
        `SELECT u.id AS student_id, u.name AS student_name, u.email AS student_email,
        g.id AS grade_id, g.component_id, g.score, g.version
        FROM enrollments en
        JOIN users u ON u.id = en.student_id
        LEFT JOIN grades g
        ON g.student_id = u.id
        AND g.component_id IN (SELECT id FROM assessment_components WHERE course_id = $1::uuid)
        WHERE en.course_id = $1::uuid
        ORDER BY u.name ASC`,
        [courseId]
    );

    const rowsMap = new Map<string, {
      student_id: string;
      student_name: string;
      student_email: string;
      grades: Record<string, { grade_id: string | null; score: number | null; version: number }>;
    }>();

    for (const r of gradesResult.rows) {
      if (!rowsMap.has(r.student_id)) {
        rowsMap.set(r.student_id, {
          student_id: r.student_id,
          student_name: r.student_name,
          student_email: r.student_email,
          grades: {},
        });
      }
      if (r.component_id) {
        rowsMap.get(r.student_id)!.grades[r.component_id] = {
          grade_id: r.grade_id,
          score: r.score !== null ? Number(r.score) : null,
          version: r.version,
        };
      }
    }

    return NextResponse.json({
      components: componentsResult.rows,
      rows: Array.from(rowsMap.values()),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
  }
}