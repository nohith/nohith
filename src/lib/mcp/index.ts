import { defineMcp } from "@lovable.dev/mcp-js";
import getPortfolio from "./tools/get-profile";

export default defineMcp({
  name: "nohith-raj-portfolio",
  title: "Nohith Raj Portfolio",
  version: "0.1.0",
  instructions: "Public portfolio of Nohith Raj K. Use `get_portfolio` to read his profile, education, experience, skills, services, projects and contact details.",
  tools: [getPortfolio],
});
