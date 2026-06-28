import { z } from "zod";

// Sign In
export const SignInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type SignInIndex = z.infer<typeof SignInSchema>;
