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
                rv.institution, rv.department, rv.student_id_number AS "studentIdNumber",
                rv.phone_number AS "phoneNumber", rv.gender, rv.date_of_birth AS "dateOfBirth"
            FROM users u
            LEFT JOIN role_verifications rv
            ON rv.user_id = u.id AND rv.requested_role = 'student'
            WHERE u.id = $1::uuid AND u.role = 'student'
            ORDER BY rv.user_id, rv.created_at DESC`,
            [id]
        );

        if (result.rowCount === 0) return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });

        return NextResponse.json({ success: true, student: result.rows[0] });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}