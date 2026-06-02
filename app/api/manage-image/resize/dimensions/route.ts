import cloudinary from "@/app/lib/cloudinary";

const VALID_CROP_MODES = [
  "scale",
  "fit",
  "fill",
  "pad",
  "crop",
  "thumb",
] as const;

export async function POST(request: Request) {
  const body = await request.json();
  const {
    publicId,
    width,
    height,
    cropMode = "scale", // scale: resize only, fill: crop to exact, fit: contain
    background, // only used with "pad" e.g. "white", "#ffffff"
  } = body;

  if (!publicId || (!width && !height)) {
    return Response.json(
      { error: "publicId and at least one of width or height are required" },
      { status: 400 },
    );
  }

  if (!VALID_CROP_MODES.includes(cropMode)) {
    return Response.json(
      { error: `cropMode must be one of: ${VALID_CROP_MODES.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const transformation: Record<string, unknown> = {
      crop: cropMode,
      fetch_format: "auto",
      quality: "auto",
    };

    if (width) transformation.width = width;
    if (height) transformation.height = height;
    if (cropMode === "pad" && background)
      transformation.background = background;

    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [transformation],
    });

    return Response.json({
      success: true,
      publicId,
      settings: { width, height, cropMode, background },
      resizedUrl: result.eager?.[0]?.secure_url,
      output: {
        width: result.eager?.[0]?.width,
        height: result.eager?.[0]?.height,
        bytes: result.eager?.[0]?.bytes,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Resize failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
