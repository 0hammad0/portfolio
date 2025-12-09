"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { BlogCard } from "./BlogCard";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/blog";

function BlogPreviewComponent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog?published=true&limit=3");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="blog" className="section bg-background-secondary">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-12 px-2 sm:px-0">
            <p className="text-accent font-mono text-xs sm:text-sm mb-2">From My Blog</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Latest Articles</h2>
            <p className="text-foreground-muted mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              I write about web development, programming tips, and my experiences
              as a developer.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Blog Posts */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-foreground-muted text-sm sm:text-base">No blog posts yet. Check back soon!</p>
          </div>
        )}

        {/* View All Button */}
        {!loading && posts.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}>
                View All Articles
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}

// Memoize to prevent unnecessary re-renders
export const BlogPreview = memo(BlogPreviewComponent);
