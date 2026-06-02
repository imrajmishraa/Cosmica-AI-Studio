import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    publicId,
    minWidth = 200, // smallest breakpoint
    maxWidth = 1920, // largest breakpoint
    maxImages = 5, // how many sizes to generate (2–20)
    quality = "auto",
  } = body;

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  if (maxImages < 2 || maxImages > 20) {
    return Response.json(
      { error: "maxImages must be between 2 and 20" },
      { status: 400 },
    );
  }

  if (minWidth >= maxWidth) {
    return Response.json(
      { error: "minWidth must be less than maxWidth" },
      { status: 400 },
    );
  }

  try {
    const result = await cloudinary.api.resource(publicId, {
      responsive_breakpoints: {
        create_derived: true,
        bytes_step: 20000, // min size diff between breakpoints
        min_width: minWidth,
        max_width: maxWidth,
        max_images: maxImages,
        transformation: { fetch_format: "auto", quality },
      },
    });

    const breakpoints = result.responsive_breakpoints?.[0]?.breakpoints ?? [];

    // ready-to-use srcset string
    const srcset = breakpoints
      .map(
        (bp: { secure_url: string; width: number }) =>
          `${bp.secure_url} ${bp.width}w`,
      )
      .join(", ");

    return Response.json({
      success: true,
      publicId,
      settings: { minWidth, maxWidth, maxImages },
      srcset,
      breakpoints: breakpoints.map(
        (bp: {
          secure_url: string;
          width: number;
          height: number;
          bytes: number;
        }) => ({
          url: bp.secure_url,
          width: bp.width,
          height: bp.height,
          bytes: bp.bytes,
        }),
      ),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Breakpoints generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
