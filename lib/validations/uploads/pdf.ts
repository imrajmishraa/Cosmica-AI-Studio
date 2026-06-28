import { z } from "zod";

const MAX_PDF_SIZE = 4 * 1024 * 1024; // 4 MB

export const pdfSchema = z
  .instanceof(File, {
    message: "Please select a PDF file.",
  })
  .refine((file) => file.size <= MAX_PDF_SIZE, {
    message: "PDF size must be 4 MB or less.",
  })
  .refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed.",
  })
  .refine((file) => file.name.toLowerCase().endsWith(".pdf"), {
    message: "Invalid PDF file.",
  });
