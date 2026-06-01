import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: any; // Allow other properties that Cloudinary returns
}


// API route handler
export async function POST(request: NextRequest) {
    const {userId} = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File || null;

        if (!file) {
          return NextResponse.json({ error: "No file uploaded"}, { status: 400});
        }

        const bytes = await file.arrayBuffer();
        const byffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                cloudinary.uploader
                  .upload_stream(
                    { folder: "digi-cloudinary/images" },
                    (error, result) => {
                      if (error) reject(error);
                      else resolve(result as CloudinaryUploadResult);
                    },
                  )
                  .end(byffer);
            }
        )
        return NextResponse.json({ publicId : result.public_id }, { status: 200 });
    } catch (error) {
        console.log("Error uploading to Cloudinary:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}    
