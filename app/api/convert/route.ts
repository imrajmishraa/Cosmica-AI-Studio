import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      publicId,
      sourceType, // "image" or "video" or "raw"
      targetFormat,
      // Common / Image settings
      width,
      height,
      crop,
      quality,
      background,
      stripMetadata,
      rotate,
      gravity,
      // Video settings
      videoCodec,
      audioCodec,
      fps,
      videoBitrate,
      audioBitrate,
      // Audio settings
      audioFrequency,
    } = body;

    if (!publicId || !targetFormat || !sourceType) {
      return NextResponse.json(
        { error: "publicId, sourceType, and targetFormat are required" },
        { status: 400 }
      );
    }

    const normalizedTarget = targetFormat.toLowerCase();
    const resourceType = sourceType === "video" ? "video" : "image";

    // Build transformation options
    const transformation: any = { format: normalizedTarget };

    // 1. Resize / crop
    if (width) transformation.width = parseInt(width, 10);
    if (height) transformation.height = parseInt(height, 10);
    if (crop) transformation.crop = crop;
    if (gravity) transformation.gravity = gravity;

    // 2. Quality / Delivery
    if (quality) {
      transformation.quality = quality;
    }

    // 3. Colors & background
    if (background) {
      const cleanBg = background.replace("#", "");
      transformation.background = `rgb:${cleanBg}`;
    }

    // 4. Metadata
    if (stripMetadata) {
      transformation.flags = "strip_profile";
    }

    // 5. Rotation
    if (rotate) {
      transformation.angle = parseInt(rotate, 10);
    }

    // 6. Video/Audio Specific parameters
    if (videoCodec) transformation.video_codec = videoCodec;
    if (audioCodec) transformation.audio_codec = audioCodec;
    if (fps) transformation.fps = parseInt(fps, 10);
    if (videoBitrate) transformation.bit_rate = videoBitrate;
    if (audioBitrate) {
      if (sourceType === "video" && videoBitrate) {
        // Fallback for audio bitrate inside video container
      } else {
        transformation.bit_rate = audioBitrate;
      }
    }
    if (audioFrequency) {
      transformation.audio_frequency = parseInt(audioFrequency, 10);
    }

    // Call Cloudinary explicit transformation
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      resource_type: resourceType,
      eager: [transformation],
    });

    const transformedUrl = result.eager?.[0]?.secure_url || result.secure_url;

    return NextResponse.json({
      success: true,
      publicId,
      sourceType,
      targetFormat: normalizedTarget,
      transformedUrl,
    });
  } catch (error: any) {
    console.error("Conversion API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to convert file" },
      { status: 500 }
    );
  }
}
