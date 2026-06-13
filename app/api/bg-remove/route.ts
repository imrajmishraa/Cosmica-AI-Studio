import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { publicId, webhook } = body;
  // webhook: optional URL to notify when processing is done

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      background_removal: "cloudinary_ai",
      ...(webhook && { notification_url: webhook }),
    });

    return Response.json({
      success: true,
      publicId,
      status: "processing",
      message: webhook
        ? "Background removal started. You will be notified via webhook when done."
        : "Background removal started. Poll /api/bg-remove/status to check progress.",
      // URL is predictable even before processing finishes
      resultUrl: cloudinary.url(publicId, {
        effect: "e_background_removal",
        format: "png",
      }),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Background removal failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
