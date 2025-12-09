import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Get view count for a blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { views: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ views: post.views });
  } catch (error) {
    console.error("Error fetching views:", error);
    return NextResponse.json(
      { error: "Failed to fetch views" },
      { status: 500 }
    );
  }
}

// POST - Increment view count
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get session ID from cookie or create new one
    const sessionId = request.cookies.get("session_id")?.value;
    const viewedPosts = request.cookies.get("viewed_posts")?.value;
    const viewedList = viewedPosts ? JSON.parse(viewedPosts) : [];

    // Check if this session has already viewed this post
    if (viewedList.includes(slug)) {
      const post = await prisma.blogPost.findUnique({
        where: { slug },
        select: { views: true },
      });
      return NextResponse.json({ views: post?.views ?? 0, alreadyViewed: true });
    }

    // Increment view count
    const post = await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
      select: { views: true },
    });

    // Update viewed posts cookie
    const newViewedList = [...viewedList, slug];
    const response = NextResponse.json({ views: post.views, alreadyViewed: false });

    response.cookies.set("viewed_posts", JSON.stringify(newViewedList), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: "Failed to increment views" },
      { status: 500 }
    );
  }
}
