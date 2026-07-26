import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        
        const teacherCounts = await pool.query(
            `SELECT
            COUNT(*) FILTER (WHERE role = 'teacher' AND role_status = 'approved') AS total_teachers,
            COUNT(*) FILTER (WHERE role = 'teacher' AND role_status = 'approved' AND created_at >= date_trunc('month', NOW())) AS new_this_month,
            COUNT(*) FILTER (WHERE role = 'teacher' AND role_status = 'approved' AND created_at >= NOW() - INTERVAL '7 days') AS new_this_week
            FROM users`
        );

        const pendingResult = await pool.query(
            `SELECT COUNT(*)::int AS pending from role_verifications WHERE requested_role = 'teacher' AND status = 'pending'`
        );

        const row = teacherCounts.rows[0];

        return NextResponse.json({
            success: true,
            stats: {
                totalTeachers: Number(row.total_teachers),
                newThisMonth: Number(row.new_this_month),
                newThisWeek: Number(row.new_this_week),
                pendingVerifications: pendingResult.rows[0]?.pending ?? 0,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}