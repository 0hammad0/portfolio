import { Github, Linkedin, Twitter, Mail, Instagram } from "lucide-react";

export interface SocialLink {
  name: string;
  href: string;
  icon: typeof Github;
  label: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: Github,
    label: "View my GitHub profile",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
    label: "Connect on LinkedIn",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
    label: "Follow on Twitter",
  },
  {
    name: "Email",
    href: "mailto:hello@example.com",
    icon: Mail,
    label: "Send me an email",
  },
];
