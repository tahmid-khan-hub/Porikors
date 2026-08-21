"use server"
import { Role } from "@/app/onboarding/components/OnBoardingClientSide";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { pool } from "../postgresql";

export async function submitVerification(role: Role, formData: FormData) {
    const session = await getServerSession(authOptions)
    if(!session?.user?.id) return { error: "You must  bg logged in to continue", status: 401 }

    const institution = formData.get("institution")?.toString().trim()
    const dept = formData.get("department")?.toString().trim()
    const rawPhoneNumber = formData.get("phone_number")?.toString().trim()
    const gender = formData.get("gender")?.toString().trim()
    const dateOfBirth = formData.get("date_of_birth")?.toString().trim()

    if(!institution) return { error: "Institution is required", status: 400 };
    if(!dept) return { error: "Department is required", status: 400 };
    if(!rawPhoneNumber) return { error: "Phone number is required", status: 400 };
    if(!gender) return { error: "Gender is required", status: 400 };
    if(!dateOfBirth) return { error: "Date of birth is required", status: 400 };

    if(role !== "teacher" && role !== "student") return { error: "Role must be teacher or student", status: 400 };

    const phoneNumber = rawPhoneNumber.replace(/[\s\-]/g, "");
    const phonePattern = /^(?:\+?880|0)1[3-9]\d{8}$/;
    if(!phonePattern.test(phoneNumber)) return { error: "Enter a valid Bangladeshi phone number", status: 400 };

    const genderOptions = ["Male", "Female"];
    if(!genderOptions.includes(gender)) return { error: "Enter a valid gender", status: 400 };

    const parsedDob = new Date(dateOfBirth);
    if(Number.isNaN(parsedDob.getTime())) return { error: "Enter a valid date of birth", status: 400 };
    if(parsedDob > new Date()) return { error: "Date of birth cannot be in the future", status: 400 };
    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
    if(parsedDob > minAgeDate) return { error: "You must be at least 18 years old", status: 400 };

    try {
        if(role === "teacher") {
            const designation = formData.get("designation")?.toString().trim();
            const department = formData.get("department")?.toString().trim();
            const work_email = formData.get("work_email")?.toString().trim();

            if(!department || !designation || !work_email) return { error: "all fields are required", status: 400 }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailPattern.test(work_email)) return { error: "Enter a valid work email", status: 400 }

            await pool.query(
                `INSERT INTO role_verifications
                (user_id, requested_role, institution, designation, department, work_email, phone_number, gender, date_of_birth)
                VALUES ($1, 'teacher', $2, $3, $4, $5, $6, $7, $8)`,
                [session.user.id, institution, designation, department, work_email, phoneNumber, gender, dateOfBirth]
            )
        } else {
            const student_id_number = formData.get("student_id_number")?.toString().trim();
            const department = formData.get("department")?.toString().trim();

            if(!student_id_number || !department ) return { error: "all fields are required", status: 400 }

            await pool.query(
                `INSERT INTO role_verifications
                (user_id, requested_role, institution, student_id_number, department, phone_number, gender, date_of_birth)
                VALUES ($1, 'student', $2, $3, $4, $5, $6, $7)`,
                [session.user.id, institution, student_id_number, department, phoneNumber, gender, dateOfBirth]
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
