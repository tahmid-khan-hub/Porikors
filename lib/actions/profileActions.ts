"use server";
import { revalidatePath } from "next/cache";
import { pool } from "../postgresql";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { ImageUpdateResult, ProfileUpdateInput, ProfileUpdateResult, TeacherProfileUpdateInput, TeacherProfileUpdateResult, } from "@/types/profile";

export async function updateStudentProfile(input: ProfileUpdateInput): Promise<ProfileUpdateResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const name = input.name.trim();
        const institution = input.institution.trim();
        const phoneNumber = input.phoneNumber.replace(/[\s\-]/g, "");

        if (!name) return { success: false, error: "Name is required" };
        if (name.length > 120) return { success: false, error: "Name is too long" };
        if (!institution) return { success: false, error: "Institution is required" };

        const phonePattern = /^(?:\+?880|0)1[3-9]\d{8}$/;
        if (!phoneNumber) return { success: false, error: "Phone number is required" };
        if (!phonePattern.test(phoneNumber)) return { success: false, error: "Enter a valid Bangladeshi phone number" };

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            await client.query(`UPDATE users SET name = $1, updated_at = now() WHERE id = $2::uuid`, [name, session.user.id]);

            const rv = await client.query(
                `UPDATE role_verifications SET institution = $1, phone_number = $2
                WHERE user_id = $3::uuid AND requested_role = 'student' RETURNING id`, [institution, phoneNumber, session.user.id]
            );

            if (rv.rowCount === 0) {
                await client.query("ROLLBACK");
                return { success: false, error: "No verification record found for this account" };
            }
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally { client.release(); }

        revalidatePath("/student/profile");
        return { success: true, data: { name, institution, phoneNumber } };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function updateUserImage(image: string): Promise<ImageUpdateResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };
        if (!image.startsWith("https://res.cloudinary.com/")) return { success: false, error: "Invalid image URL" };

        await pool.query(`UPDATE users SET image = $1, updated_at = now() WHERE id = $2::uuid`, [image, session.user.id]);

        revalidatePath(`/${session.user.role}/profile`);
        return { success: true, data: { image } };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to update image" };
    }
}

export async function updateTeacherProfile(input: TeacherProfileUpdateInput): Promise<TeacherProfileUpdateResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const name = input.name.trim();
        const institution = input.institution.trim();
        const phoneNumber = input.phoneNumber.replace(/[\s\-]/g, "");

        if (!name) return { success: false, error: "Name is required" };
        if (name.length > 120) return { success: false, error: "Name is too long" };
        if (!institution) return { success: false, error: "Institution is required" };

        const phonePattern = /^(?:\+?880|0)1[3-9]\d{8}$/;
        if (!phoneNumber) return { success: false, error: "Phone number is required" };
        if (!phonePattern.test(phoneNumber)) return { success: false, error: "Enter a valid Bangladeshi phone number" };

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            await client.query(`UPDATE users SET name = $1, updated_at = now() WHERE id = $2::uuid`, [name,session.user.id,]);

            const rv = await client.query(
                `UPDATE role_verifications SET institution = $1, phone_number = $2
                WHERE user_id = $3::uuid AND requested_role = 'teacher' RETURNING id`,
                [institution, phoneNumber, session.user.id]
            );

            if (rv.rowCount === 0) {
                await client.query("ROLLBACK");
                return { success: false, error: "No verification record found for this account" };
            }
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally { client.release(); }

        revalidatePath("/teacher/profile");
        return { success: true, data: { name, institution, phoneNumber } };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to update profile" };
    }
}