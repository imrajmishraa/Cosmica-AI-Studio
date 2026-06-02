import cloudinary from "@/app/lib/cloudinary"

const SUPPORTED_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "heif",
  "gif",
  "bmp",
  "tiff",
] as const;

export function createConvertHandler(sourceFormat: string) {
  return async function POST(request: Request) {
    const body = await request.json();
    const { publicId, targetFormat } = body;

    if (!publicId || !targetFormat) {
      return Response.json(
        { error: "publicId and targetFormat are required" },
        { status: 400 },
      );
    }

    const normalizedTarget = targetFormat.toLowerCase();
    const normalizedSource = sourceFormat.toLowerCase();

    if (!SUPPORTED_FORMATS.includes(normalizedTarget)) {
      return Response.json(
        { error: `Unsupported target format: ${targetFormat}` },
        { status: 400 },
      );
    }

    if (normalizedSource === normalizedTarget) {
      return Response.json(
        { error: "Source and target formats are the same" },
        { status: 400 },
      );
    }

    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        type: "upload",
        eager: [{ format: normalizedTarget }],
      });

      return Response.json({
        success: true,
        publicId,
        sourceFormat: normalizedSource,
        targetFormat: normalizedTarget,
        transformedUrl: result.eager?.[0]?.secure_url,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Conversion failed";
      return Response.json({ error: message }, { status: 500 });
    }
  };
}
