export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

// Main navigation items (Contact is a separate CTA button)
export const navigationItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
];

export const footerLinks: NavItem[] = [
  { label: "Blog", href: "/blog" },
  { label: "Privacy", href: "/privacy" },
];
