"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { pool } from "../postgresql";
import { revalidatePath } from "next/cache";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function createCourseAnnouncement( courseId: string, content: string ): Promise<ActionResult<{ id: string }>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") { return { success: false, error: "Unauthorized" }; }

        if (!content.trim()) { return { success: false, error: "Announcement cannot be empty" }; }

        const ownership = await pool.query(
            `SELECT id FROM courses WHERE id = $1::uuid AND teacher_id = $2::uuid`,
            [courseId, session.user.id]
        );
        if (ownership.rowCount === 0) { return { success: false, error: "Course not found" }; }

        const result = await pool.query(
            `INSERT INTO announcements (teacher_id, course_id, content)
            VALUES ($1::uuid, $2::uuid, $3) RETURNING id`,
            [session.user.id, courseId, content.trim()]
        );

        revalidatePath(`/teacher/courses/${courseId}/announcements`);  

        return { success: true, data: { id: result.rows[0].id } };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create announcement" };
    }
}

export async function createGlobalAnnouncement( content: string ): Promise<ActionResult<{ id: string }>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") return { success: false, error: "Unauthorized" };
        
        if (!content.trim()) return { success: false, error: "Announcement cannot be empty" };

        const result = await pool.query(
            `INSERT INTO announcements (teacher_id, course_id, content)
            VALUES ($1::uuid, NULL, $2) RETURNING id`,
            [session.user.id, content.trim()]
        );

        revalidatePath(`/teacher/announcements`);
        return { success: true, data: { id: result.rows[0].id } };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create announcement" };
    }
}

export async function updateAnnouncement( announcementId: string, content: string ): Promise<ActionResult<null>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") { return { success: false, error: "Unauthorized" }; }

        if (!content.trim())  return { success: false, error: "Announcement cannot be empty" };

        const result = await pool.query(
            `UPDATE announcements
            SET content = $1, updated_at = now()
            WHERE id = $2::uuid AND teacher_id = $3::uuid RETURNING course_id`,
            [content.trim(), announcementId, session.user.id]
        );

        if (result.rowCount === 0) return { success: false, error: "Announcement not found" };
    
        if (result.rows[0].course_id) revalidatePath(`/teacher/courses/${result.rows[0].course_id}/announcements`);  
        else revalidatePath(`/teacher/announcements`); 

        return { success: true, data: null };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to update announcement" };
    }
}

export async function deleteAnnouncement(announcementId: string): Promise<ActionResult<null>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "teacher") { return { success: false, error: "Unauthorized" }; }

        const result = await pool.query(
            `DELETE FROM announcements
            WHERE id = $1::uuid AND teacher_id = $2::uuid RETURNING course_id`,
            [announcementId, session.user.id]
        );

        if (result.rowCount === 0)  return { success: false, error: "Announcement not found" };
        
        if (result.rows[0].course_id) revalidatePath(`/teacher/courses/${result.rows[0].course_id}/announcements`);  
        else revalidatePath(`/teacher/announcements`); 

        return { success: true, data: null };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to delete announcement" };
    }
}