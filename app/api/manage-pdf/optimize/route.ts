import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { publicId } = body;

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [{ fetch_format: "auto", quality: "auto" }],
    });

    const originalBytes = result.bytes;
    const optimizedBytes = result.eager?.[0]?.bytes ?? originalBytes;

    return Response.json({
      success: true,
      publicId,
      optimizedUrl: result.eager?.[0]?.secure_url,
      stats: {
        originalBytes,
        optimizedBytes,
        savedBytes: originalBytes - optimizedBytes,
        savedPercent: `${(((originalBytes - optimizedBytes) / originalBytes) * 100).toFixed(1)}%`,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Optimization failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
