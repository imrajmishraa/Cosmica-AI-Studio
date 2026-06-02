import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    publicId,
    page = 1, // which page to crop
    width,
    height,
    x = 0, // crop start x
    y = 0, // crop start y
  } = body;

  if (!publicId || !width || !height) {
    return Response.json(
      { error: "publicId, width and height are required" },
      { status: 400 },
    );
  }

  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      eager: [
        {
          page,
          width,
          height,
          x,
          y,
          crop: "crop",
          format: "jpg", // crop outputs as image (PDF crop → image)
          quality: "auto",
        },
      ],
    });

    return Response.json({
      success: true,
      publicId,
      settings: { page, width, height, x, y },
      croppedUrl: result.eager?.[0]?.secure_url,
      output: {
        width: result.eager?.[0]?.width,
        height: result.eager?.[0]?.height,
        bytes: result.eager?.[0]?.bytes,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Crop failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
