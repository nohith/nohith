import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(255),
  subject: z.string().trim().min(1, "Please enter a subject.").max(150),
  message: z.string().trim().min(1, "Please enter a message.").max(3000),
  website: z.string().max(0).optional(),
});