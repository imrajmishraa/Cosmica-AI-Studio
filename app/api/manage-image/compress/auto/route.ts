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
          fetch_format: "auto", // picks best format per browser
          quality: "auto", // cloudinary decides optimal quality
        },
      ],
    });

    return Response.json({
      success: true,
      publicId,
      compressedUrl: result.eager?.[0]?.secure_url,
      bytes: result.eager?.[0]?.bytes,
      originalBytes: result.bytes,
      savedBytes: result.bytes - (result.eager?.[0]?.bytes ?? 0),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Compression failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
