// Public portfolio facts exposed over MCP. Never include contact submissions.
export const profile = {
  name: "Nohith Raj K",
  location: "Bengaluru, India",
  headline: "Computer Science Graduate · Business Sales Executive · Technical Support · Technology & Automation Enthusiast",
  summary: "Computer Science graduate working where technology meets people, with experience in business sales and technical support plus hands-on work in image processing, embedded systems, data analysis and automation.",
  contact: { email: "nohithraj89@gmail.com", phone: "+91 82177 43238" },
  social: {
    linkedin: "https://www.linkedin.com/in/nohith-raj-7b0ba4189",
    github: "https://github.com/nohith",
    instagram: "https://www.instagram.com/nohith_rajuuu",
    x: "https://x.com/nohith4",
    youtube: "https://www.youtube.com/@nohithraj3684",
  },
  education: [
    { years: "2016 — 2020", title: "Bachelor of Technology — Computer Science", school: "GITAM University, Bengaluru", score: "CGPA 7 / 10" },
    { years: "2014 — 2016", title: "Pre-University Course — PCMB", school: "Vidyadri PU College, Vijaypur", score: "72.16%" },
    { years: "2014", title: "Secondary School", school: "The Crescent School, Sidlaghatta", score: "85.6%" },
  ],
  experience: [{
    role: "Business Sales Executive", company: "CODULAR", type: "Full-time",
    responsibilities: ["Managing and scaling sales operations", "Qualifying incoming technical inquiries", "Understanding client requirements", "Communicating product capabilities", "Connecting requirements with technical execution", "Streamlining internal sales workflows", "Building sustainable client relationships", "Converting conversations into opportunities"],
  }],
  skills: {
    technical: ["Python", "Linux", "SQL", "Advanced Excel", "Microsoft Office", "PowerPoint", "Image Processing", "Data Analysis", "Embedded Systems", "Automation Technologies"],
    professional: ["Communication", "Negotiation", "Technical Support", "Sales Consulting", "Problem Solving", "Quick Learning", "Client Interaction"],
  },
  services: [
    { name: "Sales Consulting", description: "Connecting business requirements with technical capabilities through clear consultation." },
    { name: "Technical Support", description: "Understanding technical problems and communicating practical solutions." },
    { name: "Custom Business Applications", description: "Bespoke software built around your workflows and business logic." },
    { name: "Billing & POS Systems", description: "POS for retail, restaurants and services with inventory sync, payments and reporting." },
    { name: "Progressive Web Apps", description: "Fast web apps with offline support and push notifications." },
    { name: "High-Performance Hosting", description: "Managed, scalable cloud hosting for uptime, security and speed." },
  ],
  projects: [
    { title: "Face Recognition & Emotion Detection", category: "Computer vision", description: "Face recognition and emotion detection using image-processing techniques to identify facial patterns and classify expressions.", technologies: ["Image Processing", "Computer Vision", "Pattern Recognition", "Emotion Classification"] },
    { title: "IoT-Based Crop Field Monitoring System", category: "IoT & embedded systems", description: "Arduino-based agricultural monitoring with alerts to help farmers detect and prevent animal intrusion.", technologies: ["Arduino", "IoT", "Sensor Integration", "Alert Systems", "Embedded Systems"] },
  ],
};
