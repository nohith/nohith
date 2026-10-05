import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";
const valid = { name: "Visitor", email: "visitor@example.com", subject: "Collaboration", message: "Let's discuss a project." };
describe("Contact validation", () => {
  it("accepts a valid inquiry", () => expect(contactSchema.safeParse(valid).success).toBe(true));
  it("rejects invalid email addresses", () => expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false));
  it("rejects blank messages", () => expect(contactSchema.safeParse({ ...valid, message: "   " }).success).toBe(false));
  it("rejects automated honeypot submissions", () => expect(contactSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false));
});