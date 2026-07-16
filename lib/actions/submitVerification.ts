"use server"
import { Role } from "@/app/onboarding/components/OnBoardingClientSide";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { pool } from "../postgresql";

export async function submitVerification(role: Role, formData: FormData) {
    const session = await getServerSession(authOptions)
    if(!session?.user?.id) return { error: "You must  bg logged in to continue", status: 401 }

    const institution = formData.get("institution")?.toString().trim()
    if(!institution) return { error: "Institution is required", status: 400 };

    if(role !== "teacher" && role !== "student") return { error: "Role must be teacher or student", status: 400 };

    try {
        if(role === "teacher") {
            const designation = formData.get("designation")?.toString().trim();
            const department = formData.get("department")?.toString().trim();
            const work_email = formData.get("work_email")?.toString().trim();

            if(!department || !designation || !work_email) return { error: "all fields are required", status: 400 }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailPattern.test(work_email)) return { error: "Enter a valid work email", status: 400 }

            await pool.query(
                "INSERT INTO role_verifications (user_id, requested_role, institution, designation, department, work_email) VALUES ($1, 'teacher', $2, $3, $4, $5)",
                [session.user.id, institution, designation, department, work_email]
            )
        } else {
            const student_id_number = formData.get("student_id_number")?.toString().trim();

            if(!student_id_number) return { error: "student id is required", status: 400 }

            await pool.query(
                "INSERT INTO role_verifications (user_id, requested_role, institution, student_id_number) VALUES ($1, 'student', $2, $3)",
                [session.user.id, institution, student_id_number]
            )
        }

        await pool.query(
            `UPDATE users SET role = $1, role_status = 'pending' WHERE id = $2`,
            [role, session.user.id]
        )
    } catch (error) {
        console.error("submitVerification error:", error);
        return { error: "Something went wrong. Try again.", status: 500 };
    }
}
