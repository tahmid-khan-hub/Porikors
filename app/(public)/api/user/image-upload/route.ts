import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Only JPEG, PNG or WEBP images are allowed" }, { status: 400 });

        if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "porikors/profile-images",
                    public_id: `user_${session.user.id}`,
                    overwrite: true,
                    resource_type: "image",
                    transformation: [{ width: 256, height: 256, crop: "fill", gravity: "face" }],
                },
                (err, result) => {
                    if (err || !result) return reject(err);
                    resolve(result as { secure_url: string });
                }
            );
            stream.end(buffer);
        });

        return NextResponse.json({ url: uploadResult.secure_url });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}