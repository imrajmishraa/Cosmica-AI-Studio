import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const { publicId } = await request.json();

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [
        {
          fetch_format: "auto", // webp for Chrome, avif where supported, jpeg fallback
          quality: "auto", // perceptual quality — no visible degradation
        },
      ],
      eager_async: false,
    });

    const original = result.bytes;
    const compressed = result.eager?.[0]?.bytes ?? original;
    const savedPercent = (((original - compressed) / original) * 100).toFixed(
      1,
    );

    return Response.json({
      success: true,
      publicId,
      optimizedUrl: result.eager?.[0]?.secure_url,
      stats: {
        originalBytes: original,
        optimizedBytes: compressed,
        savedBytes: original - compressed,
        savedPercent: `${savedPercent}%`,
        originalFormat: result.format,
        deliveredFormat: result.eager?.[0]?.format,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Optimization failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
