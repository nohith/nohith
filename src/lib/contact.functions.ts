import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./contact-schema";

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name, email: data.email, subject: data.subject, message: data.message,
    });
    if (error) return { success: false, message: "Your message couldn't be saved. Please try again or email me directly." };
    return { success: true, message: "Message received. Thank you for getting in touch." };
  });