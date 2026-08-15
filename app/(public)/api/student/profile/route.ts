import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const studentId = session.user.id;

        const identityResult = await pool.query(
            `SELECT u.id, u.name, u.email, u.image, u.created_at,
            rv.institution, rv.department, rv.student_id_number, rv.id_card_url, rv.status AS verification_status
            FROM users u
            LEFT JOIN role_verifications rv
            ON rv.user_id = u.id AND rv.requested_role = 'student'
            WHERE u.id = $1::uuid`, [studentId]
        );

        if (identityResult.rowCount === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const u = identityResult.rows[0];

        const statsResult = await pool.query(
        `SELECT
            (SELECT COUNT(*) FROM enrollments WHERE student_id = $1::uuid) AS courses_enrolled,
            (SELECT COUNT(*) FROM submissions
                WHERE student_id = $1::uuid AND status = 'graded') AS tasks_completed,
            (SELECT COUNT(*) FROM tasks t
                JOIN enrollments en ON en.course_id = t.course_id AND en.student_id = $1::uuid
                LEFT JOIN submissions s ON s.task_id = t.id AND s.student_id = $1::uuid
                WHERE s.id IS NULL AND t.deadline > now()) AS pending_tasks,
            (SELECT SUM(g.score) FROM grades g
                JOIN assessment_components ac ON ac.id = g.component_id
                JOIN enrollments en ON en.course_id = ac.course_id AND en.student_id = $1::uuid
                WHERE g.student_id = $1::uuid AND g.score IS NOT NULL) AS earned,
            (SELECT SUM(ac.max_marks) FROM grades g
                JOIN assessment_components ac ON ac.id = g.component_id
                JOIN enrollments en ON en.course_id = ac.course_id AND en.student_id = $1::uuid
                WHERE g.student_id = $1::uuid AND g.score IS NOT NULL) AS possible`,
        [studentId]
        );

        const s = statsResult.rows[0];
        const earned = s.earned !== null ? Number(s.earned) : null;
        const possible = s.possible !== null ? Number(s.possible) : null;
        const overallGradePercent = earned !== null && possible !== null && possible > 0 ? Math.round((earned / possible) * 1000) / 10 : null;

        const coursesResult = await pool.query(
            `SELECT c.id AS course_id, c.title AS course_name, c.is_archived,
            t.name AS teacher_name
            FROM enrollments en
            JOIN courses c ON c.id = en.course_id JOIN users t ON t.id = c.teacher_id
            WHERE en.student_id = $1::uuid
            ORDER BY c.is_archived ASC, en.enrolled_at DESC`,
            [studentId]
        );

        return NextResponse.json({
            identity: {
                id: u.id,
                name: u.name,
                email: u.email,
                image: u.image,
                institution: u.institution ?? "",
            },
            academic: {
                studentId: u.student_id_number,
                institution: u.institution ?? "",
                department: u.department,
                idCardUrl: u.id_card_url,
                verificationStatus: u.verification_status ?? "unset",
                memberSince: u.created_at,
            },
            stats: {
                coursesEnrolled: Number(s.courses_enrolled),
                tasksCompleted: Number(s.tasks_completed),
                pendingTasks: Number(s.pending_tasks),
                overallGradePercent,
            },
            courses: coursesResult.rows.map((r) => ({
                courseId: r.course_id,
                courseName: r.course_name,
                teacherName: r.teacher_name,
                isArchived: r.is_archived,
            })),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}