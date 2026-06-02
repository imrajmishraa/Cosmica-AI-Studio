import cloudinary from "@/app/lib/cloudinary";

const VALID_GRAVITY = ["auto", "face", "faces", "body", "subject"] as const;
const VALID_ASPECT_RATIOS: Record<string, string> = {
  "1:1": "1:1",
  "16:9": "16:9",
  "4:3": "4:3",
  "3:2": "3:2",
  "2:3": "2:3",
  "9:16": "9:16",
  "21:9": "21:9",
};

type Gravity = (typeof VALID_GRAVITY)[number];

export async function POST(request: Request) {
  const body = await request.json();
  const {
    publicId,
    width,
    height,
    aspectRatio, // "16:9", "1:1" etc — optional, overrides height
    gravity = "auto", // what to focus on
    zoom = 1.0, // 0.5 = zoomed out, 1.5 = zoomed in on subject
  } = body;

  // Validation
  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  if (!width) {
    return Response.json({ error: "width is required" }, { status: 400 });
  }

  if (!height && !aspectRatio) {
    return Response.json(
      { error: "Either height or aspectRatio is required" },
      { status: 400 },
    );
  }

  if (aspectRatio && !VALID_ASPECT_RATIOS[aspectRatio]) {
    return Response.json(
      {
        error: `Invalid aspectRatio. Use one of: ${Object.keys(VALID_ASPECT_RATIOS).join(", ")}`,
      },
      { status: 400 },
    );
  }

  if (!VALID_GRAVITY.includes(gravity as Gravity)) {
    return Response.json(
      { error: `gravity must be one of: ${VALID_GRAVITY.join(", ")}` },
      { status: 400 },
    );
  }

  if (zoom < 0.1 || zoom > 2.0) {
    return Response.json(
      { error: "zoom must be between 0.1 and 2.0" },
      { status: 400 },
    );
  }

  try {
    const transformation: Record<string, unknown> = {
      crop: "auto", // Cloudinary AI crop mode
      gravity,
      width,
      zoom,
      fetch_format: "auto",
      quality: "auto",
    };

    // aspectRatio takes priority over raw height
    if (aspectRatio) {
      transformation.aspect_ratio = VALID_ASPECT_RATIOS[aspectRatio];
    } else {
      transformation.height = height;
    }

    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [transformation],
    });

    const originalBytes = result.bytes;
    const croppedBytes = result.eager?.[0]?.bytes ?? originalBytes;

    return Response.json({
      success: true,
      publicId,
      settings: {
        width,
        height: height ?? null,
        aspectRatio: aspectRatio ?? null,
        gravity,
        zoom,
      },
      croppedUrl: result.eager?.[0]?.secure_url,
      output: {
        width: result.eager?.[0]?.width,
        height: result.eager?.[0]?.height,
        bytes: croppedBytes,
      },
      stats: {
        originalBytes,
        croppedBytes,
        savedBytes: originalBytes - croppedBytes,
        savedPercent: `${(((originalBytes - croppedBytes) / originalBytes) * 100).toFixed(1)}%`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Auto crop failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
