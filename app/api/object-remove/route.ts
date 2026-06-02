import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();

  const { publicId, prompt, webhook } = body;

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [
        {
          effect: `gen_remove:prompt_${prompt}`,
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
      prompt,
      status: "processing",
      batchId: result.batch_id,
      resultUrl: cloudinary.url(publicId, {
        effect: `gen_remove:prompt_${prompt}`,
      }),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Object removal failed";

    return Response.json({ error: message }, { status: 500 });
  }
}
