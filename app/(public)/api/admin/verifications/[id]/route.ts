import { authOptions } from "@/lib/authOptions";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email/verificationEmail";
import { pool } from "@/lib/postgresql";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const { id } = await params;
        if (!id?.trim()) return NextResponse.json({ success: false, message: "Verification ID is required" }, { status: 400 });

        const body = await req.json();
        if (!body) return NextResponse.json( { success: false, message: "Request body is required" }, { status: 400 });
    
        const action = body?.action as "approve" | "reject"
        const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

        if (action !== "approve" && action !== "reject") return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
        
        if (action === "reject" && reason.length === 0) return NextResponse.json({ success: false, message: "Reason is required" }, { status: 400 });
        
        const current = await pool.query(
            `SELECT rv.id, rv.user_id, rv.requested_role, rv.status,
            u.email, u.name
            FROM role_verifications rv
            JOIN users u ON u.id = rv.user_id
            WHERE rv.id = $1`, [id]
        )
        if (current.rows.length === 0) return NextResponse.json({ success: false, message: "Verification not found" }, { status: 404 });
        
        const verification = current.rows[0];
        if (verification.status !== "pending") return NextResponse.json({ success: false, message: "Already processed" }, { status: 409 });
        
        if(action === "approve") {
            await pool.query(
                `UPDATE role_verifications SET status = 'approved', reviewed_at = NOW() WHERE id = $1`, [id]
            )
            await pool.query(
                `UPDATE users SET role = $1, role_status = 'approved' WHERE id = $2`,
                [verification.requested_role, verification.user_id]
            )
        } else {
            await pool.query(
                `UPDATE role_verifications SET status = 'rejected', reject_reason = $1, reviewed_at = NOW() WHERE id = $2`,
                [reason, id]
            )
        }

        const emailPromise = action === "approve"
            ? sendApprovalEmail(verification.email, verification.name, verification.requested_role)
            : sendRejectionEmail(verification.email, verification.name, verification.requested_role, reason);

        emailPromise.catch((emailError) => {
            console.error("Failed to send verification email:", emailError);
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
