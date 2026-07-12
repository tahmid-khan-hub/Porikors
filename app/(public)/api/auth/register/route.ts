import { pool } from "@/lib/postgresql";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, image } = await req.json();

        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email]
        );
        if (userExists.rows.length > 0)  return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
        
        const passwordHashed = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (name, email, password, image) VALUES ($1, $2, $3, $4)", [name, email, passwordHashed, image || null]
        )

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}