import cloudinary from "@/app/lib/cloudinary";

const VALID_FORMATS = ["jpg", "png", "webp"] as const;

export async function POST(request: Request) {
  const body = await request.json();
  const {
    publicId,
    page = 1, // which page to extract (1-based)
    format = "jpg", // output image format
    width, // optional resize
    height,
  } = body;

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  if (!VALID_FORMATS.includes(format)) {
    return Response.json(
      { error: `format must be one of: ${VALID_FORMATS.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const transformation: Record<string, unknown> = {
      page,
      format,
      quality: "auto",
    };

    if (width) transformation.width = width;
    if (height) transformation.height = height;

    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [transformation],
    });

    return Response.json({
      success: true,
      publicId,
      page,
      imageUrl: result.eager?.[0]?.secure_url,
      output: {
        width: result.eager?.[0]?.width,
        height: result.eager?.[0]?.height,
        bytes: result.eager?.[0]?.bytes,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Conversion failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
