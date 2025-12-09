import { NextResponse } from "next/server";

// Sample blog posts data (in production, this would come from database)
const sampleBlogPosts = [
  {
    id: "1",
    title: "Building Performant React Applications",
    slug: "building-performant-react-applications",
    excerpt: "Learn the best practices for optimizing React applications, from code splitting to memoization.",
    content: `# Building Performant React Applications

React is a powerful library, but without proper optimization, your applications can become slow. In this post, we'll explore key strategies to improve performance.

## Code Splitting

Code splitting is one of the most effective ways to improve initial load times. Use dynamic imports and React.lazy for route-based splitting.

## Memoization

Use React.memo, useMemo, and useCallback strategically to prevent unnecessary re-renders.

## Virtual Lists

For long lists, consider using virtualization libraries like react-window or react-virtuoso.
`,
    coverImage: "/images/blog/react-performance.jpg",
    tags: ["React", "Performance", "JavaScript"],
    published: true,
    publishedAt: new Date("2024-01-15").toISOString(),
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
  },
  {
    id: "2",
    title: "Getting Started with Next.js 14",
    slug: "getting-started-nextjs-14",
    excerpt: "A comprehensive guide to building modern web applications with Next.js 14 and the App Router.",
    content: `# Getting Started with Next.js 14

Next.js 14 brings exciting new features and improvements. Let's explore how to get started.

## The App Router

The App Router provides a new way to build applications with React Server Components.

## Server Components

By default, components in the app directory are Server Components. This means they run on the server and reduce client-side JavaScript.

## Streaming

Next.js 14 supports streaming with Suspense, allowing for progressive rendering of your UI.
`,
    coverImage: "/images/blog/nextjs-14.jpg",
    tags: ["Next.js", "React", "Web Development"],
    published: true,
    publishedAt: new Date("2024-02-20").toISOString(),
    createdAt: new Date("2024-02-20").toISOString(),
    updatedAt: new Date("2024-02-20").toISOString(),
  },
  {
    id: "3",
    title: "Modern CSS Techniques You Should Know",
    slug: "modern-css-techniques",
    excerpt: "Explore modern CSS features like Container Queries, CSS Grid, and the :has() selector.",
    content: `# Modern CSS Techniques You Should Know

CSS has evolved significantly. Here are some modern techniques that can improve your styling workflow.

## Container Queries

Container queries allow you to style elements based on their container's size rather than the viewport.

## The :has() Selector

The :has() selector is a parent selector that enables powerful styling patterns.

## CSS Grid Subgrid

Subgrid allows nested grids to align with their parent grid.
`,
    coverImage: "/images/blog/modern-css.jpg",
    tags: ["CSS", "Web Development", "Frontend"],
    published: true,
    publishedAt: new Date("2024-03-10").toISOString(),
    createdAt: new Date("2024-03-10").toISOString(),
    updatedAt: new Date("2024-03-10").toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const limit = searchParams.get("limit");
    const published = searchParams.get("published");

    let posts = [...sampleBlogPosts];

    // Filter by published status
    if (published === "true") {
      posts = posts.filter((p) => p.published);
    }

    // Filter by tag if requested
    if (tag) {
      posts = posts.filter((p) =>
        p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      );
    }

    // Sort by published date (newest first)
    posts.sort((a, b) =>
      new Date(b.publishedAt || b.createdAt).getTime() -
      new Date(a.publishedAt || a.createdAt).getTime()
    );

    // Limit results if requested
    if (limit) {
      posts = posts.slice(0, parseInt(limit));
    }

    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
