import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { publicId, targetSizeKb } = body;

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  try {
    // Get original resource details to inspect size
    const resourceInfo = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });
    const originalBytes = resourceInfo.bytes;

    // Determine quality preset based on targetSizeKb ratio
    let qualityPreset = "auto";
    if (targetSizeKb) {
      const originalKb = originalBytes / 1024;
      const ratio = targetSizeKb / originalKb;

      if (ratio < 0.25) {
        qualityPreset = "auto:low";
      } else if (ratio < 0.5) {
        qualityPreset = "auto:eco";
      } else if (ratio < 0.75) {
        qualityPreset = "auto:good";
      } else {
        qualityPreset = "auto:best";
      }
    }

    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [{ fetch_format: "auto", quality: qualityPreset }],
    });

    const optimizedBytes = result.eager?.[0]?.bytes ?? originalBytes;

    return Response.json({
      success: true,
      publicId,
      optimizedUrl: result.eager?.[0]?.secure_url,
      stats: {
        originalBytes,
        optimizedBytes,
        savedBytes: Math.max(0, originalBytes - optimizedBytes),
        savedPercent: `${(((originalBytes - optimizedBytes) / originalBytes) * 100).toFixed(1)}%`,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Optimization failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
