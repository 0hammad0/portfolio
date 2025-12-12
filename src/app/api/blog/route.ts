import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const limit = searchParams.get("limit");
    const published = searchParams.get("published");

    // Build query
    const where: Record<string, unknown> = {};

    if (published === "true") {
      where.status = "PUBLISHED";
      where.published = true;
    }

    // Fetch from database
    let posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    // Filter by tag if requested (tags are stored as JSON string)
    if (tag) {
      posts = posts.filter((post) => {
        const tags = JSON.parse(post.tags) as string[];
        return tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase());
      });
    }

    // Transform tags from JSON string to array
    const transformedPosts = posts.map((post) => ({
      ...post,
      tags: JSON.parse(post.tags) as string[],
    }));

    return NextResponse.json(transformedPosts, {
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
