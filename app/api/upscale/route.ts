import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { publicId, webhook } = body;

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [
        {
          effect: "upscale",
        },
      ],
      eager_async: true,
      ...(webhook && {
        eager_notification_url: webhook,
      }),
    });

    return Response.json({
      success: true,
      publicId,
      status: "processing",
      batchId: result.batch_id,
      resultUrl: cloudinary.url(publicId, {
        effect: "upscale",
      }),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upscale failed";

    return Response.json({ error: message }, { status: 500 });
  }
}
