import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { publicId, totalPages, removePages } = body;
  // removePages: page numbers to drop e.g. [2, 4]
  // totalPages: total page count from upload response

  if (!publicId || !totalPages || !Array.isArray(removePages)) {
    return Response.json(
      { error: "publicId, totalPages and removePages are required" },
      { status: 400 },
    );
  }

  try {
    // Keep all pages except the removed ones
    const keepPages = Array.from(
      { length: totalPages },
      (_, i) => i + 1,
    ).filter((p) => !removePages.includes(p));

    if (keepPages.length === 0) {
      return Response.json(
        { error: "Cannot remove all pages" },
        { status: 400 },
      );
    }

    // Extract kept pages as images, then recombine into PDF
    const tag = `remove_pages_${publicId}_${Date.now()}`;

    const pageImages = await Promise.all(
      keepPages.map((page, index) =>
        cloudinary.uploader.upload(
          cloudinary.url(publicId, { page, format: "jpg" }),
          {
            resource_type: "image",
            tags: [tag],
            public_id: `${publicId}_page_${String(index + 1).padStart(3, "0")}`,
          },
        ),
      ),
    );

    // Combine back into PDF
    const result = await cloudinary.uploader.multi(tag, { format: "pdf" });

    // Cleanup temp images
    await cloudinary.api.delete_resources(pageImages.map((p) => p.public_id));

    return Response.json({
      success: true,
      publicId,
      removedPages: removePages,
      remainingPages: keepPages,
      pdfUrl: result.secure_url,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Remove pages failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
