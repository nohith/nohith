import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./contact-schema";

// EmailJS public identifiers — designed to be exposed client-side, safe in code.
const EMAILJS_SERVICE_ID = "service_flkiytg";
const EMAILJS_TEMPLATE_ID = "template_v5odzmn";
const EMAILJS_PUBLIC_KEY = "ZRVWwcqWeJf3WvTXd";

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name, email: data.email, subject: data.subject, message: data.message,
    });

    let emailed = false;
    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name: data.name,
            from_email: data.email,
            reply_to: data.email,
            subject: data.subject,
            message: data.message,
            to_name: "Nohith Raj K",
          },
        }),
      });
      if (response.ok) emailed = true;
      else console.error("EmailJS send failed:", response.status, await response.text());
    } catch (error) {
      console.error("EmailJS request error:", error);
    }

    if (error && !emailed) {
      return { success: false, message: "Your message couldn't be saved. Please try again or email me directly." };
    }
    return { success: true, message: "Message received. Thank you for getting in touch." };
  });
