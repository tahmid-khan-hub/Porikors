import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const { searchParams } = new URL(req.url)
        const role = searchParams.get("role") // "teacher" | "student" | null
        const cursor = searchParams.get("cursor") // "<created_at>|<id>"
        const limit = 10

        const [cursorCreatedAt, cursorId] = cursor ? cursor.split("|") : [null, null] 

        // instead of writing separate queries for role = teacher or student or role null, checking all in one
        const result = await pool.query(`
            SELECT * FROM (
                SELECT DISTINCT ON (rv.user_id) 
                    rv.id, rv.user_id, rv.requested_role, rv.status, rv.institution,
                    rv.id_card_url, rv.created_at,
                    u.name, u.email, u.image
                FROM role_verifications rv
                JOIN users u ON u.id = rv.user_id
                ORDER BY rv.user_id, rv.created_at DESC
            ) latest
            WHERE latest.status = 'pending'
                AND ($1::text is NULL OR latest.requested_role = $1)
                AND (
                    $2::timestamptz is NULL
                    OR (latest.created_at, latest.id) < ($2::timestamptz, $3::uuid)
                )
            ORDER BY latest.created_at DESC, latest.id DESC
            LIMIT $4
            `, [role, cursorCreatedAt, cursorId, limit]);
        
        const rows = result.rows;
        const nextCursor = cursor?.length === limit ? 
        `${rows[rows.length - 1].created_at}|${rows[rows.length - 1].id}` : null;
        
        return NextResponse.json({ success: true, items: rows, nextCursor }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
