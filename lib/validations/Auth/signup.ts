import { z } from "zod";


// Sign Up
export const SignUpSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type SignUpIndex = z.infer<typeof SignUpSchema>;

