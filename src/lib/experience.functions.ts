import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  deviceType: z.string().trim().min(1).max(40),
  screen: z.string().trim().max(40),
  connection: z.string().trim().max(40),
  reducedMotion: z.boolean(),
  lowData: z.boolean(),
  note: z.string().trim().max(300).optional().default(""),
});

export const getExperienceTips = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { ok: false as const, error: "AI is not configured." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        instructions:
          "You help visitors get the best experience on Nohith Raj K's portfolio website (single page: hero portrait backdrop, about, education, experience, skills, services, software solutions, projects, contact form). Given the visitor's device and browsing conditions, give 3-5 short, practical, personalized tips (one line each, as a '- ' bulleted list) about how to browse it comfortably: orientation, which sections to jump to via the menu, data/motion considerations, contacting via one-tap phone/email. No intro, no fake claims, under 120 words.",
        input: `Device: ${data.deviceType}\nScreen: ${data.screen}\nConnection: ${data.connection}\nPrefers reduced motion: ${data.reducedMotion}\nData saver: ${data.lowData}\nVisitor note: ${data.note || "none"}`,
      }),
    });
    if (!res.ok || !res.body) {
      const msg = res.status === 429 ? "Too many requests — try again shortly." : res.status === 402 ? "AI credits are exhausted right now." : `AI request failed (${res.status}).`;
      return { ok: false as const, error: msg };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "", text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const l of lines) {
        if (!l.startsWith("data:")) continue;
        try {
          const ev = JSON.parse(l.slice(5).trim());
          if (ev.type === "response.output_text.delta") text += ev.delta;
        } catch { /* ignore */ }
      }
    }
    if (!text.trim()) return { ok: false as const, error: "No recommendations were returned." };
    return { ok: true as const, tips: text.split("\n").map((t) => t.replace(/^[-*•\d.\s]+/, "").trim()).filter(Boolean) };
  });
