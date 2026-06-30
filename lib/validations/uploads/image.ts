import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const imageSchema = z
  .instanceof(File, {
    message: "Please select an image.",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Image size must be 4 MB or less.",
  })
  .refine(
    (file) =>
      [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ].includes(file.type),
    {
      message: "Only JPEG, PNG, WebP, and GIF images are allowed.",
    },
  );

  
