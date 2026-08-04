import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "teacher") { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
    const teacherId = session.user.id;

    const [statsResult, deadlinesResult, announcementsResult, coursesResult] =
      await Promise.all([
        pool.query(
          `SELECT
            (SELECT COUNT(*) FROM courses WHERE teacher_id = $1) AS total_courses,
            (SELECT COUNT(DISTINCT en.student_id)
                FROM enrollments en
                JOIN courses c ON c.id = en.course_id
                WHERE c.teacher_id = $1) AS total_students,
            (SELECT COUNT(*)
                FROM submissions s
                JOIN tasks t ON t.id = s.task_id
                JOIN courses c ON c.id = t.course_id
                WHERE c.teacher_id = $1 AND s.status IN ('submitted', 'late', 'resubmitted')) AS pending_submissions,
            (SELECT COUNT(*)
                FROM tasks t
                JOIN courses c ON c.id = t.course_id
                WHERE c.teacher_id = $1 AND t.deadline BETWEEN now() AND now() + INTERVAL '7 days') AS upcoming_deadline_count`,
            [teacherId]
        ),

        // next 5 deadlines, with live submission counts per task
        pool.query(
            `SELECT t.id AS task_id, t.title AS task_title, t.deadline,
            c.id AS course_id, c.title AS course_name,
            COUNT(DISTINCT en.student_id) AS enrolled_count,
            COUNT(DISTINCT s.student_id) FILTER (WHERE s.status != 'not_submitted') AS submitted_count
            FROM tasks t
            JOIN courses c ON c.id = t.course_id
            LEFT JOIN enrollments en ON en.course_id = c.id LEFT JOIN submissions s ON s.task_id = t.id
            WHERE c.teacher_id = $1 AND t.deadline > now()
            GROUP BY t.id, c.id ORDER BY t.deadline ASC
            LIMIT 5`,
            [teacherId]
        ),

        // latest 5 announcements across all courses
        pool.query(
            `SELECT a.id, a.content, a.created_at,
            c.id AS course_id, c.title AS course_name
            FROM announcements a
            JOIN courses c ON c.id = a.course_id WHERE a.teacher_id = $1
            ORDER BY a.created_at DESC LIMIT 5`,
            [teacherId]
        ),

        // course cards with live enrollment counts
        pool.query(
            `SELECT c.id, c.title, c.join_code, c.created_at,
            COUNT(en.student_id) AS student_count
            FROM courses c
            LEFT JOIN enrollments en ON en.course_id = c.id WHERE c.teacher_id = $1
            GROUP BY c.id ORDER BY c.created_at DESC LIMIT 6`,
            [teacherId]
        ),
      ]);

    const s = statsResult.rows[0];

    return NextResponse.json({
        stats: {
            totalCourses: Number(s.total_courses),
            totalStudents: Number(s.total_students),
            pendingSubmissions: Number(s.pending_submissions),
            upcomingDeadlineCount: Number(s.upcoming_deadline_count),
        },
        upcomingDeadlines: deadlinesResult.rows.map((r) => ({
            task_id: r.task_id,
            task_title: r.task_title,
            course_id: r.course_id,
            course_name: r.course_name,
            deadline: r.deadline,
            submitted_count: Number(r.submitted_count),
            enrolled_count: Number(r.enrolled_count),
        })),
        recentAnnouncements: announcementsResult.rows,
        courses: coursesResult.rows.map((r) => ({
            ...r,
            student_count: Number(r.student_count),
        })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}