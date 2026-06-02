import cloudinary from "@/app/lib/cloudinary";

const VALID_GRAVITY = [
  "center",
  "north",
  "south",
  "east",
  "west",
  "north_east",
  "north_west",
  "south_east",
  "south_west",
] as const;

export async function POST(request: Request) {
  const body = await request.json();
  const {
    publicId,
    text, // watermark text e.g. "CONFIDENTIAL"
    opacity = 30, // 0–100
    gravity = "center",
    fontSize = 60,
    color = "grey",
  } = body;

  if (!publicId || !text) {
    return Response.json(
      { error: "publicId and text are required" },
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
          overlay: {
            font_family: "Arial",
            font_size: fontSize,
            text,
          },
          color,
          opacity,
          gravity,
          format: "pdf",
        },
      ],
    });

    return Response.json({
      success: true,
      publicId,
      settings: { text, opacity, gravity, fontSize, color },
      watermarkedUrl: result.eager?.[0]?.secure_url,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Watermark failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
