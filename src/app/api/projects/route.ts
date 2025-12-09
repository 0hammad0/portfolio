import { NextResponse } from "next/server";

// Sample projects data (in production, this would come from database)
const sampleProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    description: "A full-featured e-commerce platform with cart, checkout, and payment integration.",
    longDescription: "Built a complete e-commerce solution with user authentication, product management, shopping cart, and Stripe payment integration.",
    imageUrl: "/images/projects/ecommerce.jpg",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe"],
    githubUrl: "https://github.com/example/ecommerce",
    liveUrl: "https://ecommerce-demo.vercel.app",
    featured: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Task Management App",
    slug: "task-management",
    description: "A collaborative task management application with real-time updates and team features.",
    longDescription: "Real-time task management with WebSocket support, team collaboration, and advanced filtering.",
    imageUrl: "/images/projects/tasks.jpg",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
    githubUrl: "https://github.com/example/tasks",
    liveUrl: "https://tasks-demo.vercel.app",
    featured: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "AI Content Generator",
    slug: "ai-content-generator",
    description: "An AI-powered content generation tool using OpenAI's GPT models.",
    longDescription: "Content generation platform leveraging OpenAI API for blog posts, social media content, and more.",
    imageUrl: "/images/projects/ai-content.jpg",
    technologies: ["Next.js", "OpenAI API", "Tailwind CSS", "Supabase"],
    githubUrl: "https://github.com/example/ai-content",
    liveUrl: "https://ai-content-demo.vercel.app",
    featured: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Portfolio Website",
    slug: "portfolio-website",
    description: "A modern portfolio website with animations and dark mode support.",
    longDescription: "Personal portfolio built with Next.js, GSAP animations, and a custom CMS.",
    imageUrl: "/images/projects/portfolio.jpg",
    technologies: ["Next.js", "GSAP", "Framer Motion", "Tailwind CSS"],
    githubUrl: "https://github.com/example/portfolio",
    liveUrl: "https://portfolio-demo.vercel.app",
    featured: false,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Weather Dashboard",
    slug: "weather-dashboard",
    description: "A weather dashboard with location-based forecasts and interactive charts.",
    longDescription: "Weather application with geolocation, 7-day forecasts, and beautiful data visualizations.",
    imageUrl: "/images/projects/weather.jpg",
    technologies: ["React", "Chart.js", "Weather API", "Geolocation"],
    githubUrl: "https://github.com/example/weather",
    liveUrl: "https://weather-demo.vercel.app",
    featured: false,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Chat Application",
    slug: "chat-application",
    description: "Real-time chat application with rooms, direct messages, and file sharing.",
    longDescription: "Full-featured chat platform with WebRTC video calls, file sharing, and message reactions.",
    imageUrl: "/images/projects/chat.jpg",
    technologies: ["Next.js", "Socket.io", "WebRTC", "Redis"],
    githubUrl: "https://github.com/example/chat",
    liveUrl: "https://chat-demo.vercel.app",
    featured: false,
    order: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    let projects = [...sampleProjects];

    // Filter by featured if requested
    if (featured === "true") {
      projects = projects.filter((p) => p.featured);
    }

    // Sort by order
    projects.sort((a, b) => a.order - b.order);

    // Limit results if requested
    if (limit) {
      projects = projects.slice(0, parseInt(limit));
    }

    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
