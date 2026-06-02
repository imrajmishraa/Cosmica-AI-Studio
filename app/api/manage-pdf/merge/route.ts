import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { publicIds, mergeTag } = body;
  // Step 1: tag all PDFs with mergeTag
  // Step 2: use multi() to combine them into one PDF

  if (!Array.isArray(publicIds) || publicIds.length < 2) {
    return Response.json(
      { error: "publicIds must be an array of at least 2 items" },
      { status: 400 },
    );
  }

  if (!mergeTag) {
    return Response.json({ error: "mergeTag is required" }, { status: 400 });
  }

  try {
    // Tag all PDFs with the merge tag
    await Promise.all(
      publicIds.map((id: string) =>
        cloudinary.uploader.add_tag(mergeTag, [id]),
      ),
    );

    // Combine all tagged PDFs into one
    const result = await cloudinary.uploader.multi(mergeTag, {
      format: "pdf",
      transformation: { quality: "auto" },
    });

    // Clean up merge tag after done
    await Promise.all(
      publicIds.map((id: string) =>
        cloudinary.uploader.remove_tag(mergeTag, [id]),
      ),
    );

    return Response.json({
      success: true,
      mergedPdfUrl: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes,
      mergedCount: publicIds.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Merge failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
