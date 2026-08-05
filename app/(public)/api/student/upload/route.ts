import { authOptions } from "@/lib/authOptions";
import { pool } from "@/lib/postgresql";
import { cloudinary } from "@/lib/cloudinary";
import { isFileTypeAllowed, resolveCloudinaryResourceType, MAX_FILE_SIZE_BYTES } from "@/lib/allowedFileTypes";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "student")  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const taskId = formData.get("taskId") as string | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!taskId) return NextResponse.json({ error: "Missing taskId" }, { status: 400 });

    if (file.size > MAX_FILE_SIZE_BYTES) return NextResponse.json({ error: "File exceeds 30MB limit" }, { status: 400 });
    
    const taskResult = await pool.query(
      `SELECT t.allowed_file_types, t.course_id
       FROM tasks t
       WHERE t.id = $1`,
      [taskId]
    );

    if (taskResult.rowCount === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    
    const { allowed_file_types, course_id } = taskResult.rows[0];

    const enrolled = await pool.query(
      `SELECT 1 FROM enrollments WHERE course_id = $1 AND student_id = $2`,
      [course_id, session.user.id]
    );
    if (enrolled.rowCount === 0) return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
    
    if (!isFileTypeAllowed(file.name, file.type, allowed_file_types)) return NextResponse.json( { error: `File type not allowed for this task. Allowed: ${allowed_file_types?.join(", ") ?? "any"}` }, { status: 400 } );
    
    const resourceType = resolveCloudinaryResourceType(file.type);
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: `submissions/${course_id}/${taskId}/${session.user.id}`,
          // keep original filename visible in the URL for non-image files
          use_filename: true,
          unique_filename: true,
        },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error("Upload failed"));
          resolve(result as { secure_url: string; public_id: string });
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
