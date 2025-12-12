import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    // Build query
    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (featured === "true") {
      where.featured = true;
    }

    // Fetch from database
    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
      take: limit ? parseInt(limit) : undefined,
    });

    // Transform technologies from JSON string to array
    const transformedProjects = projects.map((project) => ({
      ...project,
      technologies: JSON.parse(project.technologies) as string[],
    }));

    return NextResponse.json(transformedProjects, {
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
