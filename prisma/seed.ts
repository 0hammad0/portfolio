import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@portfolio.com" },
    update: {},
    create: {
      email: "admin@portfolio.com",
      name: "Admin",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create site settings
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: "default-settings" },
    update: {},
    create: {
      id: "default-settings",
      siteName: "Portfolio",
      siteTitle: "Full-Stack Developer",
      siteDescription: "A modern portfolio showcasing my work and skills",
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      keywords: JSON.stringify(["developer", "portfolio", "full-stack", "react", "nextjs"]),
    },
  });
  console.log("Created site settings");

  // Create author profile
  const authorProfile = await prisma.authorProfile.upsert({
    where: { id: "default-author" },
    update: {},
    create: {
      id: "default-author",
      name: "John Doe",
      role: "Full-Stack Developer",
      bio: "I'm a full-stack developer with a passion for creating beautiful, performant web applications. With expertise in React, Next.js, and Node.js, I build modern solutions that solve real problems.",
      shortBio: "Building the web, one component at a time.",
      location: "San Francisco, CA",
      email: "hello@example.com",
      availability: "Open for opportunities",
      heroRoles: JSON.stringify([
        "Full-Stack Developer",
        "React Specialist",
        "TypeScript Enthusiast",
        "Problem Solver",
      ]),
    },
  });
  console.log("Created author profile");

  // Create social links
  const socialLinks = [
    { platform: "github", url: "https://github.com", label: "GitHub", icon: "Github", order: 0 },
    { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn", icon: "Linkedin", order: 1 },
    { platform: "twitter", url: "https://twitter.com", label: "Twitter", icon: "Twitter", order: 2 },
    { platform: "email", url: "mailto:hello@example.com", label: "Email", icon: "Mail", order: 3 },
  ];

  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: `social-${link.platform}` },
      update: link,
      create: { id: `social-${link.platform}`, ...link },
    });
  }
  console.log("Created social links");

  // Create skill categories and skills
  const categories = [
    {
      id: "cat-frontend",
      name: "Frontend",
      icon: "Monitor",
      order: 0,
      skills: [
        { name: "React", proficiency: 95, icon: "react" },
        { name: "Next.js", proficiency: 90, icon: "nextjs" },
        { name: "TypeScript", proficiency: 90, icon: "typescript" },
        { name: "Tailwind CSS", proficiency: 95, icon: "tailwind" },
        { name: "Framer Motion", proficiency: 80, icon: "framer" },
      ],
    },
    {
      id: "cat-backend",
      name: "Backend",
      icon: "Server",
      order: 1,
      skills: [
        { name: "Node.js", proficiency: 85, icon: "nodejs" },
        { name: "Express", proficiency: 85, icon: "express" },
        { name: "PostgreSQL", proficiency: 80, icon: "postgresql" },
        { name: "Prisma", proficiency: 85, icon: "prisma" },
        { name: "REST APIs", proficiency: 90, icon: "api" },
      ],
    },
    {
      id: "cat-tools",
      name: "Tools & DevOps",
      icon: "Wrench",
      order: 2,
      skills: [
        { name: "Git", proficiency: 90, icon: "git" },
        { name: "Docker", proficiency: 75, icon: "docker" },
        { name: "AWS", proficiency: 70, icon: "aws" },
        { name: "Figma", proficiency: 75, icon: "figma" },
        { name: "Testing", proficiency: 80, icon: "test" },
      ],
    },
  ];

  for (const category of categories) {
    const { skills, ...categoryData } = category;

    await prisma.skillCategory.upsert({
      where: { id: category.id },
      update: categoryData,
      create: categoryData,
    });

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      await prisma.skill.upsert({
        where: { id: `skill-${category.id}-${i}` },
        update: { ...skill, categoryId: category.id, order: i },
        create: { id: `skill-${category.id}-${i}`, ...skill, categoryId: category.id, order: i },
      });
    }
  }
  console.log("Created skill categories and skills");

  // Create tech stack items
  const techStack = [
    { name: "React", icon: "react", url: "https://react.dev", order: 0 },
    { name: "Next.js", icon: "nextjs", url: "https://nextjs.org", order: 1 },
    { name: "TypeScript", icon: "typescript", url: "https://typescriptlang.org", order: 2 },
    { name: "Node.js", icon: "nodejs", url: "https://nodejs.org", order: 3 },
    { name: "PostgreSQL", icon: "postgresql", url: "https://postgresql.org", order: 4 },
    { name: "Tailwind", icon: "tailwind", url: "https://tailwindcss.com", order: 5 },
    { name: "Prisma", icon: "prisma", url: "https://prisma.io", order: 6 },
    { name: "Git", icon: "git", url: "https://git-scm.com", order: 7 },
  ];

  for (const item of techStack) {
    await prisma.techStackItem.upsert({
      where: { id: `tech-${item.name.toLowerCase()}` },
      update: item,
      create: { id: `tech-${item.name.toLowerCase()}`, ...item },
    });
  }
  console.log("Created tech stack items");

  // Create about stats
  const stats = [
    { label: "Years Experience", value: 5, suffix: "+", order: 0 },
    { label: "Projects Completed", value: 50, suffix: "+", order: 1 },
    { label: "Happy Clients", value: 30, suffix: "+", order: 2 },
  ];

  for (const stat of stats) {
    await prisma.aboutStats.upsert({
      where: { id: `stat-${stat.order}` },
      update: stat,
      create: { id: `stat-${stat.order}`, ...stat },
    });
  }
  console.log("Created about stats");

  // Create sample projects
  const projects = [
    {
      id: "proj-1",
      title: "E-Commerce Platform",
      slug: "e-commerce-platform",
      description: "A full-featured e-commerce platform with cart, checkout, and payment integration.",
      longDescription: "Built a comprehensive e-commerce solution featuring product catalog, shopping cart, secure checkout with Stripe integration, user authentication, order management, and admin dashboard. Implemented real-time inventory tracking and email notifications.",
      imageUrl: "/images/projects/ecommerce.jpg",
      technologies: JSON.stringify(["Next.js", "TypeScript", "Prisma", "Stripe", "Tailwind CSS"]),
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: true,
      order: 0,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      id: "proj-2",
      title: "Task Management App",
      slug: "task-management-app",
      description: "A collaborative task management application with real-time updates.",
      longDescription: "Developed a Kanban-style task management application with drag-and-drop functionality, real-time collaboration using WebSockets, team workspaces, and detailed analytics. Features include task assignments, due dates, labels, and activity tracking.",
      imageUrl: "/images/projects/taskapp.jpg",
      technologies: JSON.stringify(["React", "Node.js", "Socket.io", "MongoDB", "Redux"]),
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: true,
      order: 1,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      id: "proj-3",
      title: "AI Content Generator",
      slug: "ai-content-generator",
      description: "An AI-powered content generation tool using GPT-4.",
      longDescription: "Created an AI content generation platform leveraging OpenAI's GPT-4 API. Features include blog post generation, SEO optimization suggestions, tone adjustment, multiple language support, and content templates for various use cases.",
      imageUrl: "/images/projects/ai-generator.jpg",
      technologies: JSON.stringify(["Next.js", "OpenAI API", "Tailwind CSS", "PostgreSQL"]),
      githubUrl: "https://github.com",
      featured: true,
      order: 2,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: project,
      create: project,
    });
  }
  console.log("Created sample projects");

  // Create sample blog posts
  const blogPosts = [
    {
      id: "post-1",
      title: "Building Performant React Applications",
      slug: "building-performant-react-applications",
      excerpt: "Learn the best practices for building fast and efficient React applications.",
      content: `# Building Performant React Applications

Performance is crucial for modern web applications. In this post, we'll explore various techniques to optimize your React applications.

## 1. Use React.memo Wisely

React.memo is a higher-order component that memoizes your component, preventing unnecessary re-renders.

\`\`\`tsx
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
\`\`\`

## 2. Optimize State Management

Keep state as local as possible and avoid unnecessary global state.

## 3. Lazy Loading

Use dynamic imports to split your code and load components only when needed.

\`\`\`tsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));
\`\`\`

## Conclusion

By following these practices, you can significantly improve your application's performance.`,
      coverImage: "/images/blog/react-performance.jpg",
      tags: JSON.stringify(["React", "Performance", "JavaScript"]),
      published: true,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
      readingTime: 5,
    },
    {
      id: "post-2",
      title: "Getting Started with Next.js 15",
      slug: "getting-started-with-nextjs-15",
      excerpt: "A comprehensive guide to building applications with Next.js 15.",
      content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements. Let's explore what's new.

## App Router

The App Router provides a new way to build applications with improved routing capabilities.

## Server Components

React Server Components are now fully supported, allowing for better performance.

## Turbopack

The new bundler offers significantly faster build times.

## Conclusion

Next.js 15 is a major step forward for React development.`,
      coverImage: "/images/blog/nextjs-15.jpg",
      tags: JSON.stringify(["Next.js", "React", "Web Development"]),
      published: true,
      status: "PUBLISHED" as const,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      readingTime: 8,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: post,
      create: post,
    });
  }
  console.log("Created sample blog posts");

  // Create navigation items
  const navItems = [
    { id: "nav-home", label: "Home", href: "/", type: "main", order: 0 },
    { id: "nav-about", label: "About", href: "/#about", type: "main", order: 1 },
    { id: "nav-skills", label: "Skills", href: "/#skills", type: "main", order: 2 },
    { id: "nav-projects", label: "Projects", href: "/#projects", type: "main", order: 3 },
    { id: "nav-blog", label: "Blog", href: "/blog", type: "main", order: 4 },
    { id: "nav-contact", label: "Contact", href: "/#contact", type: "main", order: 5 },
    { id: "nav-footer-blog", label: "Blog", href: "/blog", type: "footer", order: 0 },
    { id: "nav-footer-privacy", label: "Privacy", href: "/privacy", type: "footer", order: 1 },
  ];

  for (const item of navItems) {
    await prisma.navigationItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log("Created navigation items");

  console.log("Seed completed successfully!");
  console.log("\n========================================");
  console.log("Admin Login Credentials:");
  console.log("Email: admin@portfolio.com");
  console.log("Password: Admin@123");
  console.log("========================================\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
