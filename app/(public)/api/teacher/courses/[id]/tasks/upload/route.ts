import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".zip"];
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) return NextResponse.json({ error: "Only PDF, DOC, DOCX, TXT, or ZIP files are allowed" }, { status: 400 });

        if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File exceeds the 30MB limit" }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: `porikors/tasks/${session.user.id}`,
                public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`,
            },
                (error, result) => {
                if (error || !result) return reject(error);
                resolve(result as { secure_url: string });
            }
        );
            uploadStream.end(buffer);
        });

        return NextResponse.json({ url: uploadResult.secure_url, name: file.name });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}