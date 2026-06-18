import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: any;
}

// API route handler supporting dynamic resource types
export async function POST(request: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File || null;
        const resourceType = (formData.get("resourceType") as string) || "image";

        if (!file) {
          return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Dynamically adjust size limit (e.g. 70MB for video/audio, 10MB for images/documents)
        const sizeLimit = resourceType === "video" ? 70 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > sizeLimit) {
            return NextResponse.json(
                { error: `File size exceeds the limit of ${resourceType === "video" ? "70MB" : "10MB"}` },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                cloudinary.uploader
                  .upload_stream(
                    {
                      folder: `digi-cloudinary/${resourceType === "raw" ? "raw" : resourceType === "video" ? "video" : "images"}`,
                      resource_type: resourceType as any,
                    },
                    (error, result) => {
                      if (error) reject(error);
                      else resolve(result as CloudinaryUploadResult);
                    },
                  )
                  .end(buffer);
            }
        );

        return NextResponse.json({ publicId: result.public_id }, { status: 200 });
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return NextResponse.json({ error: "Failed to upload file asset" }, { status: 500 });
    }
}
