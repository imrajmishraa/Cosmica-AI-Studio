import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { fileUrl } = body;

  if (!fileUrl) {
    return Response.json({ error: "fileUrl is required" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.upload(fileUrl, {
      resource_type: "image",
      format: "pdf",
    });

    return Response.json({
      success: true,
      publicId: result.public_id,
      pages: result.pages,
      bytes: result.bytes,
      url: result.secure_url,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
