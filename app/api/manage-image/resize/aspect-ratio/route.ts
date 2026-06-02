import cloudinary from "@/app/lib/cloudinary";

const ASPECT_RATIO_PRESETS: Record<string, string> = {
  "16:9": "16:9", // video / hero banners
  "4:3": "4:3", // classic photo
  "1:1": "1:1", // square / social media
  "3:2": "3:2", // standard photo
  "2:3": "2:3", // portrait / Pinterest
  "9:16": "9:16", // mobile / stories
  "21:9": "21:9", // ultrawide / cinematic
};

export async function POST(request: Request) {
  const body = await request.json();
  const {
    publicId,
    aspectRatio, // "16:9", "1:1" etc.
    width, // anchor width (height auto-calculated)
    gravity = "auto", // where to crop from
  } = body;

  if (!publicId || !aspectRatio || !width) {
    return Response.json(
      { error: "publicId, aspectRatio and width are required" },
      { status: 400 },
    );
  }

  if (!ASPECT_RATIO_PRESETS[aspectRatio]) {
    return Response.json(
      {
        error: `Invalid aspectRatio. Use one of: ${Object.keys(ASPECT_RATIO_PRESETS).join(", ")}`,
      },
      { status: 400 },
    );
  }

  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [
        {
          width,
          aspect_ratio: ASPECT_RATIO_PRESETS[aspectRatio],
          crop: "fill",
          gravity,
          fetch_format: "auto",
          quality: "auto",
        },
      ],
    });

    return Response.json({
      success: true,
      publicId,
      settings: { aspectRatio, width, gravity },
      croppedUrl: result.eager?.[0]?.secure_url,
      output: {
        width: result.eager?.[0]?.width,
        height: result.eager?.[0]?.height,
        bytes: result.eager?.[0]?.bytes,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Aspect ratio crop failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
