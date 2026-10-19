import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./contact-schema";

// EmailJS public identifiers are intended to be exposed to the browser.
const EMAILJS_SERVICE_ID = "service_flkiytg";
const EMAILJS_TEMPLATE_ID = "template_v5odzmn";
const EMAILJS_PUBLIC_KEY = "ZRVWwcqWeJf3WvTXd";

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

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          accessToken: process.env["EMAILJS_PRIVATE_KEY"],
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
      else console.error("EmailJS send failed:", response.status);
    } catch (error) {
      console.error("EmailJS request error:", error);
    }

    if (saved && emailed) {
      return { success: true, message: "Message received. Thank you for getting in touch." };
    }
    if (saved) {
      return {
        success: true,
        message: "Your message was saved, but the email notification could not be sent. Thank you for getting in touch.",
      };
    }
    if (emailed) {
      return {
        success: true,
        message: "Your message was sent, but could not be saved to our database.",
      };
    }
    return {
      success: false,
      message: "Your message could not be delivered right now. Please try again or email me directly.",
    };
  });
