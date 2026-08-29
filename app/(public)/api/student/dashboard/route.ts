import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const studentId = session.user.id;

        const [statsResult, deadlinesResult, announcementsResult, gradesResult, coursesResult] =
        await Promise.all([
            pool.query(
            `SELECT
                (SELECT COUNT(*) FROM enrollments WHERE student_id = $1) AS total_courses,
                (SELECT COUNT(*)
                    FROM tasks t
                    JOIN enrollments en ON en.course_id = t.course_id
                    LEFT JOIN submissions s ON s.task_id = t.id AND s.student_id = $1 WHERE en.student_id = $1 AND t.deadline > now()
                    AND COALESCE(s.status, 'not_submitted') IN ('not_submitted', 'resubmission_requested')
                ) AS pending_tasks,
                (SELECT COUNT(*)
                    FROM tasks t
                    JOIN enrollments en ON en.course_id = t.course_id
                    LEFT JOIN submissions s ON s.task_id = t.id AND s.student_id = $1 WHERE en.student_id = $1
                    AND t.deadline BETWEEN now() AND now() + INTERVAL '7 days'
                    AND COALESCE(s.status, 'not_submitted') IN ('not_submitted', 'resubmission_requested')
                ) AS due_this_week,

                (SELECT COUNT(*)
                    FROM submissions s
                    JOIN tasks t ON t.id = s.task_id JOIN enrollments en ON en.course_id = t.course_id AND en.student_id = s.student_id
                    WHERE s.student_id = $1 AND s.status = 'graded' AND s.created_at >= date_trunc('month', now())
                ) AS graded_this_month`,
                [studentId]
            ),

            // next 5 pending deadlines
            pool.query(
                `SELECT t.id AS task_id, t.title AS task_title,
                c.id AS course_id, c.title AS course_name,
                t.deadline, COALESCE(s.status, 'not_submitted') AS submission_status
                FROM tasks t
                JOIN courses c ON c.id = t.course_id JOIN enrollments en ON en.course_id = c.id AND en.student_id = $1
                LEFT JOIN submissions s ON s.task_id = t.id AND s.student_id = $1 WHERE t.deadline > now()
                AND COALESCE(s.status, 'not_submitted') IN ('not_submitted', 'resubmission_requested')
                ORDER BY t.deadline ASC LIMIT 5`,
                [studentId]
            ),

            // latest 5 announcements across all enrolled courses
            pool.query(
                `SELECT a.id, a.content, a.created_at,
                c.id AS course_id, c.title AS course_name
                FROM announcements a
                LEFT JOIN courses c ON c.id = a.course_id
                WHERE
                  (a.course_id IS NOT NULL AND EXISTS (
                    SELECT 1 FROM enrollments en WHERE en.course_id = a.course_id AND en.student_id = $1
                  ))
                OR
                  (a.course_id IS NULL AND EXISTS (
                    SELECT 1 FROM enrollments en
                    JOIN courses co ON co.id = en.course_id
                    WHERE en.student_id = $1 AND co.teacher_id = a.teacher_id
                  ))
                ORDER BY a.created_at DESC LIMIT 5`,
                [studentId]
            ),

            // latest 5 graded submissions
            pool.query(
                `SELECT t.id AS task_id, t.title AS task_title,
                c.id AS course_id, c.title AS course_name,
                s.grade, t.max_marks, s.created_at
                FROM submissions s
                JOIN tasks t ON t.id = s.task_id JOIN courses c ON c.id = t.course_id
                WHERE s.student_id = $1 AND s.status = 'graded'
                ORDER BY s.created_at DESC LIMIT 5`,
                [studentId]
            ),

            // enrolled courses overview
            pool.query(
                `SELECT c.id, c.title, c.join_code, u.name AS teacher_name,
                COUNT(DISTINCT en2.student_id) AS student_count,
                COUNT(DISTINCT t.id) FILTER (
                    WHERE t.deadline > now()
                    AND NOT EXISTS (
                        SELECT 1 FROM submissions s2 WHERE s2.task_id = t.id AND s2.student_id = $1
                        AND s2.status IN ('submitted', 'late', 'graded', 'resubmitted')
                    )
                ) AS pending_task_count
                FROM enrollments en
                JOIN courses c ON c.id = en.course_id JOIN users u ON u.id = c.teacher_id
                LEFT JOIN enrollments en2 ON en2.course_id = c.id LEFT JOIN tasks t ON t.course_id = c.id
                WHERE en.student_id = $1
                GROUP BY c.id, u.name, en.enrolled_at
                ORDER BY en.enrolled_at DESC LIMIT 6
                `,
                [studentId]
            ),
        ]);

        const s = statsResult.rows[0];

        return NextResponse.json({
            stats: {
                totalCourses: Number(s.total_courses),
                pendingTasks: Number(s.pending_tasks),
                dueThisWeek: Number(s.due_this_week),
                gradedThisMonth: Number(s.graded_this_month),
            },
            upcomingDeadlines: deadlinesResult.rows,
            recentAnnouncements: announcementsResult.rows,
            recentGrades: gradesResult.rows.map((r) => ({
                ...r,
                marks: Number(r.marks),
            })),
            courses: coursesResult.rows.map((r) => ({
                ...r,
                student_count: Number(r.student_count),
                pending_task_count: Number(r.pending_task_count),
            })),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
    }
}
