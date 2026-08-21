import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const teacherId = session.user.id;

        const identityResult = await pool.query(
            `SELECT u.id, u.name, u.email, u.image, u.created_at,
            rv.institution, rv.department, rv.designation,
            rv.work_email, rv.status AS verification_status,
            rv.phone_number, rv.gender, rv.date_of_birth
            FROM users u
            LEFT JOIN role_verifications rv
            ON rv.user_id = u.id AND rv.requested_role = 'teacher'
            WHERE u.id = $1::uuid`,
            [teacherId]
        );

        if (identityResult.rowCount === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const u = identityResult.rows[0];

        const statsResult = await pool.query(
            `SELECT
                (SELECT COUNT(*) FROM courses WHERE teacher_id = $1::uuid) AS courses_taught,
                (SELECT COUNT(DISTINCT en.student_id)
                    FROM enrollments en
                    JOIN courses c ON c.id = en.course_id
                    WHERE c.teacher_id = $1::uuid) AS total_students,
                (SELECT COUNT(*) FROM submissions s
                    JOIN tasks t ON t.id = s.task_id
                    JOIN courses c ON c.id = t.course_id
                    WHERE c.teacher_id = $1::uuid
                    AND s.status IN ('submitted', 'late', 'resubmitted')) AS pending_grading,
                (SELECT COUNT(*) FROM announcements
                    WHERE teacher_id = $1::uuid) AS announcements_posted`,
            [teacherId]
        );

        const s = statsResult.rows[0];

        const coursesResult = await pool.query(
            `SELECT c.id AS course_id, c.title AS course_name, c.is_archived,
            COUNT(en.student_id) AS student_count
            FROM courses c
            LEFT JOIN enrollments en ON en.course_id = c.id
            WHERE c.teacher_id = $1::uuid
            GROUP BY c.id, c.title, c.is_archived
            ORDER BY c.is_archived ASC, c.created_at DESC`,
            [teacherId]
        );

        return NextResponse.json({
            identity: {
                id: u.id,
                name: u.name,
                email: u.email,
                image: u.image,
                institution: u.institution ?? "",
                phoneNumber: u.phone_number ?? "",
                gender: u.gender ?? "",
                dateOfBirth: u.date_of_birth ?? null,
            },
            academic: {
                designation: u.designation,
                department: u.department,
                institution: u.institution ?? "",
                workEmail: u.work_email,
                verificationStatus: u.verification_status ?? "unset",
                memberSince: u.created_at,
            },
            stats: {
                coursesTaught: Number(s.courses_taught),
                totalStudents: Number(s.total_students),
                pendingGrading: Number(s.pending_grading),
                announcementsPosted: Number(s.announcements_posted),
            },
            courses: coursesResult.rows.map((r) => ({
                courseId: r.course_id,
                courseName: r.course_name,
                studentCount: Number(r.student_count),
                isArchived: r.is_archived,
            })),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}