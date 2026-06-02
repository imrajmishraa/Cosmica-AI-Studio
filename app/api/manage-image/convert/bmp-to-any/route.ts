import { createConvertHandler } from "@/app/lib/convertHandler";


// This file defines the API route for converting BMP images to any supported format using Cloudinary's eager transformations. The POST handler is created using the createConvertHandler function, specifying "bmp" as the source format. This allows clients to send a request with a publicId and targetFormat to convert a PNG image to the desired format.
export const POST = createConvertHandler("bmp");
