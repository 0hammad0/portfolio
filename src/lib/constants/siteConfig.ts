export const siteConfig = {
  name: "Portfolio",
  title: "Full-Stack Developer",
  description: "Personal portfolio showcasing my work, skills, and experience as a full-stack developer.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/opengraph-image.png",
  links: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "mailto:hello@example.com",
  },
  author: {
    name: "Your Name",
    role: "Full-Stack Developer",
    bio: "Passionate developer creating elegant solutions to complex problems. Specializing in React, Next.js, and modern web technologies.",
    location: "Your City, Country",
  },
  keywords: [
    "full-stack developer",
    "web developer",
    "react developer",
    "next.js",
    "typescript",
    "portfolio",
  ],
};
