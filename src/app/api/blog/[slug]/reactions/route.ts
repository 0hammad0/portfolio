import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type ReactionType = "like" | "love" | "fire" | "clap";

// GET - Get reactions for a blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get session ID
    const sessionId = request.cookies.get("reaction_session")?.value;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        likes: true,
        reactions: {
          select: {
            type: true,
            sessionId: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Count reactions by type
    const reactionCounts = post.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get user's reactions
    const userReactions = sessionId
      ? post.reactions
          .filter((r) => r.sessionId === sessionId)
          .map((r) => r.type)
      : [];

    return NextResponse.json({
      totalLikes: post.likes,
      reactions: reactionCounts,
      userReactions,
    });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}

// POST - Add or toggle a reaction
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { type } = (await request.json()) as { type: ReactionType };

    if (!["like", "love", "fire", "clap"].includes(type)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
    }

    // Get or create session ID
    let sessionId = request.cookies.get("reaction_session")?.value;
    const isNewSession = !sessionId;
    if (!sessionId) {
      sessionId = uuidv4();
    }

    // Find the post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if reaction already exists
    const existingReaction = await prisma.blogReaction.findUnique({
      where: {
        postId_sessionId_type: {
          postId: post.id,
          sessionId,
          type,
        },
      },
    });

    let action: "added" | "removed";

    if (existingReaction) {
      // Remove the reaction
      await prisma.blogReaction.delete({
        where: { id: existingReaction.id },
      });

      // Decrement likes count if type is "like"
      if (type === "like") {
        await prisma.blogPost.update({
          where: { slug },
          data: { likes: { decrement: 1 } },
        });
      }

      action = "removed";
    } else {
      // Add the reaction
      await prisma.blogReaction.create({
        data: {
          postId: post.id,
          sessionId,
          type,
        },
      });

      // Increment likes count if type is "like"
      if (type === "like") {
        await prisma.blogPost.update({
          where: { slug },
          data: { likes: { increment: 1 } },
        });
      }

      action = "added";
    }

    // Get updated counts
    const updatedPost = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        likes: true,
        reactions: {
          select: { type: true },
        },
      },
    });

    const reactionCounts = updatedPost?.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) ?? {};

    const response = NextResponse.json({
      action,
      totalLikes: updatedPost?.likes ?? 0,
      reactions: reactionCounts,
    });

    // Set session cookie if new
    if (isNewSession) {
      response.cookies.set("reaction_session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    console.error("Error handling reaction:", error);
    return NextResponse.json(
      { error: "Failed to handle reaction" },
      { status: 500 }
    );
  }
}
