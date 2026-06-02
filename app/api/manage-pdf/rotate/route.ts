import cloudinary from "@/app/lib/cloudinary";

const VALID_ANGLES = [90, 180, 270] as const;
type Angle = (typeof VALID_ANGLES)[number];

export async function POST(request: Request) {
  const body = await request.json();
  const { publicId, angle } = body;

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  if (!VALID_ANGLES.includes(angle as Angle)) {
    return Response.json(
      { error: "angle must be 90, 180, or 270" },
      { status: 400 },
    );
  }

  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [{ angle, format: "pdf" }],
    });

    return Response.json({
      success: true,
      publicId,
      angle,
      rotatedUrl: result.eager?.[0]?.secure_url,
      bytes: result.eager?.[0]?.bytes,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Rotate failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
