import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { tag, publicIds } = body;
  // All images tagged with `tag` get combined into one PDF
  // ordered alphabetically by publicId

  if (!tag) {
    return Response.json({ error: "tag is required" }, { status: 400 });
  }

  try {
    // If publicIds are provided, tag them with `tag` first
    if (Array.isArray(publicIds) && publicIds.length > 0) {
      await Promise.all(
        publicIds.map((id: string) =>
          cloudinary.uploader.add_tag(tag, [id]),
        ),
      );
    }

    const result = await cloudinary.uploader.multi(tag, {
      format: "pdf",
      transformation: { quality: "auto" },
    });

    // Cleanup tag from images after compilation is done
    if (Array.isArray(publicIds) && publicIds.length > 0) {
      await Promise.all(
        publicIds.map((id: string) =>
          cloudinary.uploader.remove_tag(tag, [id]),
        ),
      );
    }

    return Response.json({
      success: true,
      tag,
      pdfUrl: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "PDF creation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
