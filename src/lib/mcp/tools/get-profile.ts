import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { profile } from "../profile";

const sections = ["overview", "education", "experience", "skills", "services", "projects", "contact", "all"] as const;

export default defineTool({
  name: "get_portfolio",
  title: "Get portfolio information",
  description: "Return Nohith Raj K's public portfolio details for a chosen section, or everything.",
  inputSchema: { section: z.enum(sections).default("all").describe("Which part of the portfolio to return.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ section }) => {
    const p = profile;
    const data =
      section === "overview" ? { name: p.name, location: p.location, headline: p.headline, summary: p.summary }
      : section === "education" ? { education: p.education }
      : section === "experience" ? { experience: p.experience }
      : section === "skills" ? { skills: p.skills }
      : section === "services" ? { services: p.services }
      : section === "projects" ? { projects: p.projects }
      : section === "contact" ? { contact: p.contact, social: p.social, location: p.location }
      : p;
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});
