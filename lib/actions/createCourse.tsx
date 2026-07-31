"use server"
import { pool } from "../postgresql";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateJoinCode(): string {
    let code = ""
    for (let i=0; i<6; i++) {
        code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    return code;
}

function isUniqueViolation(err: unknown, constraintName: string): boolean {
    return (
        typeof err === "object" && err !== null &&
        "code" in err && err.code === "23505" &&
        "constraint" in err && err.constraint === constraintName
    );
}

export async function createCourse(teacherId: string, title: string, description?: string) {
    const MAX_ATTEMPTS = 5;

    for (let attempt = 0; attempt<MAX_ATTEMPTS; attempt++) {
        const joinCode = generateJoinCode();
        try {
            const result = await pool.query(
                `INSERT INTO courses (teacher_id, title, description, join_code) VALUES ($1::uuid, $2, $3, $4)
                RETURNING id, title, join_code, created_at`,
                [teacherId, title, description ?? null, joinCode]
            )
            return { success: true as const, course: result.rows[0] };

        } catch (err: unknown) {
            if (isUniqueViolation(err, "courses_join_code_unique")) continue;
            return { success: false as const, error: "Failed to create course" };
        }
    }
    return { success: false as const, error: "Could not generate a unique join code, try again" };
}