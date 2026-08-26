"use server"

import { Resource, ResourceType } from "@/types/resources";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "../authOptions";
import { pool } from "../postgresql";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

interface CreateResourceInput {
  course_id: string | null;
  title: string;
  description: string | null;
  resource_type: ResourceType;
  url: string | null;
  text_content: string | null;
}

export async function createResource( input: CreateResourceInput ): Promise<ActionResult<Resource>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "teacher") return { success: false, error: "Unauthorized" };
  
  if (!input.title.trim()) return { success: false, error: "Title is required" };
  
  try {
    const result = await pool.query(
        `INSERT INTO resources (course_id, teacher_id, title, description, resource_type, url, text_content)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [input.course_id, session.user.id, input.title.trim(), input.description, input.resource_type, input.url, input.text_content,]
    );

    revalidatePath("/teacher/resources");
    return { success: true, data: result.rows[0] };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to create resource" };
  }
} 

interface UpdateResourceInput {
  id: string;
  course_id: string | null;
  title: string;
  description: string | null;
  resource_type: ResourceType;
  url: string | null;
  text_content: string | null;
}

export async function updateResource(input: UpdateResourceInput): Promise<ActionResult<Resource>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "teacher") return { success: false, error: "Unauthorized" };
  
  if (!input.title.trim()) return { success: false, error: "Title is required" };
  
  try {
    const result = await pool.query(
      `UPDATE resources
       SET title = $1, description = $2, resource_type = $3, url = $4, text_content = $5
       WHERE id = $6 AND teacher_id = $7 RETURNING *`,
      [input.title.trim(), input.description, input.resource_type, input.url, input.text_content, input.id, session.user.id,]
    );

    if (result.rows.length === 0) return { success: false, error: "Resource not found or not yours" };
    
    if (result.rows[0].course_id) revalidatePath(`/teacher/courses/${result.rows[0].course_id}/resources`);  
    else revalidatePath(`/teacher/resources`);

    return { success: true, data: result.rows[0] };
  } catch (err) {
    console.error( err);
    return { success: false, error: "Failed to update resource" };
  }
}

export async function deleteResource( id: string, course_id: string | null ): Promise<ActionResult<{ id: string }>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "teacher") return { success: false, error: "Unauthorized" };

  try {
    const result = await pool.query(
      `DELETE FROM resources WHERE id = $1 AND teacher_id = $2 RETURNING id, course_id`,
      [id, session.user.id]
    );

    if (result.rows.length === 0) return { success: false, error: "Resource not found or not yours" };

    if (result.rows[0].course_id) revalidatePath(`/teacher/courses/${result.rows[0].course_id}/resources`);
    else revalidatePath(`/teacher/resources`);

    return { success: true, data: { id } };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete resource" };
  }
}