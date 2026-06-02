import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { tag } = body;
  // All images tagged with `tag` get combined into one PDF
  // ordered alphabetically by publicId

  if (!tag) {
    return Response.json({ error: "tag is required" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.multi(tag, {
      format: "pdf",
      transformation: { quality: "auto" },
    });

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
