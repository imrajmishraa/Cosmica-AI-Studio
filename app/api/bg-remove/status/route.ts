import cloudinary from "@/app/lib/cloudinary";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicId = searchParams.get("publicId");

  if (!publicId) {
    return Response.json({ error: "publicId is required" }, { status: 400 });
  }

  try {
    const result = await cloudinary.api.resource(publicId, {
      eager: true,
    });

    const processed = result.eager?.find((e: { transformation: string }) =>
      e.transformation?.includes("background_removal"),
    );

    if (processed) {
      return Response.json({
        status: "done",
        resultUrl: processed.secure_url,
        bytes: processed.bytes,
      });
    }

    return Response.json({ status: "processing" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Status check failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
