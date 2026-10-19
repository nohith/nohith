import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./contact-schema";

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    let saved = false;
    let emailed = false;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
      if (error) console.error("Contact submission could not be saved:", error.message);
      else saved = true;
    } catch (error) {
      console.error("Contact submission database error:", error);
    }

    const serviceId = process.env["EMAILJS_SERVICE_ID"];
    const templateId = process.env["EMAILJS_TEMPLATE_ID"];
    const publicKey = process.env["EMAILJS_PUBLIC_KEY"];
    const privateKey = process.env["EMAILJS_PRIVATE_KEY"];

    if (serviceId && templateId && publicKey) {
      try {
        const payload: Record<string, unknown> = {
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: data.name,
            from_email: data.email,
            reply_to: data.email,
            subject: data.subject,
            message: data.message,
            to_name: "Nohith Raj K",
          },
        };
        if (privateKey) payload.accessToken = privateKey;
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) emailed = true;
        else console.error("EmailJS send failed:", response.status);
      } catch (error) {
        console.error("EmailJS request error:", error);
      }
    } else {
      console.error("EmailJS is not configured: set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY.");
    }

    if (saved && emailed) {
      return { success: true, message: "Message received. Thank you for getting in touch." };
    }
    if (saved) {
      return { success: true, message: "Your message was saved, but the email notification could not be sent. Thank you for getting in touch." };
    }
    if (emailed) {
      return { success: true, message: "Your message was sent, but could not be saved to our database." };
    }
    return { success: false, message: "Your message could not be delivered right now. Please try again or email me directly." };
  });
