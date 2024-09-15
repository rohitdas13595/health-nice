import { z } from "zod";

export const signUpFormSchama = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  phone: z.string(),
});



