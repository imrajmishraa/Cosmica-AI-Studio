import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { publicId, pages } = body;
  // pages: array of page numbers e.g. [1, 3, 5]

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  if (!Array.isArray(pages) || pages.length === 0) {
    return Response.json(
      { error: "pages must be a non-empty array of page numbers" },
      { status: 400 },
    );
  }

  try {
    // Extract each page as an image in parallel
    const results = await Promise.all(
      pages.map((page: number) =>
        cloudinary.uploader.explicit(publicId, {
          type: "upload",
          eager: [{ page, format: "jpg", quality: "auto" }],
        }),
      ),
    );

    return Response.json({
      success: true,
      publicId,
      extractedPages: results.map((r, i) => ({
        page: pages[i],
        imageUrl: r.eager?.[0]?.secure_url,
        bytes: r.eager?.[0]?.bytes,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Extract failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
