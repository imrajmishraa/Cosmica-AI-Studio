import cloudinary from "@/app/lib/cloudinary";

type ChromaSubsampling = "4:2:0" | "4:2:2" | "4:4:4";

const VALID_QUALITY_PRESETS = [
  "auto",
  "auto:low",
  "auto:eco",
  "auto:good",
  "auto:best",
] as const;
const VALID_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

export async function POST(request: Request) {
  const body = await request.json();

  const {
    publicId,
    quality, // 1–100 or "auto", "auto:low", "auto:eco", "auto:good", "auto:best"
    format, // output format (optional)
    progressive, // true/false — progressive JPEG rendering
    chromaSubsampling, // "4:2:0" | "4:2:2" | "4:4:4"
  } = body;

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  // Quality validation
  const isNumericQuality =
    typeof quality === "number" && quality >= 1 && quality <= 100;
  const isPresetQuality = VALID_QUALITY_PRESETS.includes(quality);

  if (quality !== undefined && !isNumericQuality && !isPresetQuality) {
    return Response.json(
      {
        error:
          "quality must be 1–100 or one of: auto, auto:low, auto:eco, auto:good, auto:best",
      },
      { status: 400 },
    );
  }

  // Format validation
  if (format && !VALID_FORMATS.includes(format)) {
    return Response.json(
      { error: `Unsupported format. Use one of: ${VALID_FORMATS.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const transformation: Record<string, unknown> = {
      quality: quality ?? "auto",
    };

    if (format) transformation.fetch_format = format;
    if (progressive) transformation.flags = "progressive";
    if (chromaSubsampling) transformation.chroma = chromaSubsampling;

    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [transformation],
    });

    return Response.json({
      success: true,
      publicId,
      settings: { quality, format, progressive, chromaSubsampling },
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
