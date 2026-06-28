import { z } from "zod";

const MAX_VIDEO_SIZE = 68 * 1024 * 1024; // 68 MB

export const videoSchema = z
  .instanceof(File)
  .nullable()
  .refine((file) => !file || file.size <= MAX_VIDEO_SIZE, {
    message: "Video size must be 68 MB or less.",
  })
  .refine(
    (file) =>
      !file ||
      [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-matroska",
      ].includes(file.type),
    {
      message: "Only MP4, WebM, OGG, MOV, AVI, and MKV videos are allowed.",
    },
  );
