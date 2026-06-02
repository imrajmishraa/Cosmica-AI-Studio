import { createConvertHandler } from "@/app/lib/convertHandler";

// This file defines the API route for converting WEBP images to any supported format using Cloudinary's eager transformations. The POST handler is created using the createConvertHandler function, specifying "webp" as the source format. This allows clients to send a request with a publicId and targetFormat to convert a JPG image to the desired format.
export const POST = createConvertHandler("webp");
