import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const { id } = await params;

        const result = await pool.query(
            `SELECT DISTINCT ON (rv.user_id)
                u.id, u.name, u.email, u.image, u.role_approved_at AS "roleApprovedAt",
                (SELECT COUNT(*) FROM courses WHERE teacher_id = u.id) AS "coursesCount",
                rv.institution, rv.department, rv.designation, rv.work_email AS "workEmail",
                rv.phone_number AS "phoneNumber", rv.gender, rv.date_of_birth AS "dateOfBirth"
            FROM users u
            LEFT JOIN role_verifications rv
            ON rv.user_id = u.id AND rv.requested_role = 'teacher'
            WHERE u.id = $1::uuid AND u.role = 'teacher'
            ORDER BY rv.user_id, rv.created_at DESC`, [id]
        );

        if (result.rowCount === 0) return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 });

        const row = result.rows[0];
        return NextResponse.json({
            success: true,
            teacher: { ...row, coursesCount: Number(row.coursesCount), },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}