import { createConvertHandler } from "@/app/lib/convertHandler";

// This file defines the API route for converting AVIF images to any supported format using Cloudinary's eager transformations. The POST handler is created using the createConvertHandler function, specifying "avif" as the source format. This allows clients to send a request with a publicId and targetFormat to convert an AVIF image to the desired format.
export const POST = createConvertHandler("avif");
