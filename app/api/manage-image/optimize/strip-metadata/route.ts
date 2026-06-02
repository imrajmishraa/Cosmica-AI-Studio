import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { publicId } = body;

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  try {
    // Get original metadata before stripping
    const original = await cloudinary.api.resource(publicId, {
      exif: true,
      image_metadata: true,
    });

    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [
        {
          fetch_format: "auto",
          quality: "auto",
          flags: "strip_profile", // removes EXIF, ICC, XMP metadata
        },
      ],
    });

    const originalBytes = result.bytes;
    const strippedBytes = result.eager?.[0]?.bytes ?? originalBytes;

    return Response.json({
      success: true,
      publicId,
      strippedUrl: result.eager?.[0]?.secure_url,
      metadata: {
        before: {
          exif: original.exif ?? {},
          hasGpsData: !!original.image_metadata?.GPSLatitude,
          hasColorProfile: !!original.image_metadata?.ProfileDescription,
          hasCameraInfo: !!original.image_metadata?.Make,
        },
        after: {
          exif: {},
          hasGpsData: false,
          hasColorProfile: false,
          hasCameraInfo: false,
        },
      },
      stats: {
        originalBytes,
        strippedBytes,
        savedBytes: originalBytes - strippedBytes,
        savedPercent: `${(((originalBytes - strippedBytes) / originalBytes) * 100).toFixed(1)}%`,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Metadata strip failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
