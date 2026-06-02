import cloudinary from "@/app/lib/cloudinary";

const VALID_GRAVITY = ["auto", "face", "faces", "body", "subject"] as const;

export async function POST(request: Request) {
  const body = await request.json();
  const { publicId, width, height, gravity = "auto" } = body;

  if (!publicId || !width || !height) {
    return Response.json(
      { error: "publicId, width and height are required" },
      { status: 400 },
    );
  }

  if (!VALID_GRAVITY.includes(gravity)) {
    return Response.json(
      { error: `gravity must be one of: ${VALID_GRAVITY.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [
        {
          width,
          height,
          crop: "fill", // fills exact dimensions
          gravity, // AI detects subject focal point
          fetch_format: "auto",
          quality: "auto",
        },
      ],
    });

    return Response.json({
      success: true,
      publicId,
      settings: { width, height, gravity },
      croppedUrl: result.eager?.[0]?.secure_url,
      stats: {
        originalBytes: result.bytes,
        croppedBytes: result.eager?.[0]?.bytes,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Smart crop failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
