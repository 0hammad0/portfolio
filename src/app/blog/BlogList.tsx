"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { Calendar, Clock, ArrowRight, Search, BookOpen, Sparkles } from "lucide-react";
import type { BlogPost } from "@/types/blog";

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Featured Post Hero Component
function FeaturedPost({ post }: { post: BlogPost }) {
  const readTime = estimateReadTime(post.content);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-background-secondary border border-border"
      >
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-48 sm:h-64 lg:h-96 overflow-hidden">
            <Image
              src={post.coverImage || "/images/blog/placeholder.jpg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent lg:bg-gradient-to-l" />

            {/* Featured badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-medium bg-accent text-white rounded-full">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Featured
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-4 sm:p-6 lg:p-10 flex flex-col justify-center">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-4 group-hover:text-accent transition-colors duration-300">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-foreground-muted mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 lg:line-clamp-4 text-sm sm:text-base">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-foreground-muted">
              <span className="flex items-center gap-1 sm:gap-1.5">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="flex items-center gap-1 sm:gap-1.5">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {readTime} min read
              </span>
            </div>

            {/* Read more */}
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-accent font-medium text-sm sm:text-base">
              <span>Read Article</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Blog Card Component
function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-50px", once: true });
  const readTime = estimateReadTime(post.content);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <article className="relative h-full rounded-lg sm:rounded-xl overflow-hidden bg-background-secondary border border-border transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
          {/* Image */}
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <Image
              src={post.coverImage || "/images/blog/placeholder.jpg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-secondary via-transparent to-transparent" />

            {/* Reading time badge */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full">
                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {readTime} min
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-5">
            {/* Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] sm:text-xs font-medium text-accent bg-accent/10 px-1.5 sm:px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-foreground-muted text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border/50">
              <span className="text-[10px] sm:text-xs text-foreground-muted flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="text-accent text-xs sm:text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Read
                <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

// Loading skeleton
function BlogCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-background-secondary border border-border animate-pulse">
      <div className="h-48 bg-background-tertiary" />
      <div className="p-5">
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-16 bg-background-tertiary rounded" />
          <div className="h-5 w-12 bg-background-tertiary rounded" />
        </div>
        <div className="h-6 w-3/4 bg-background-tertiary rounded mb-2" />
        <div className="h-4 w-full bg-background-tertiary rounded mb-1" />
        <div className="h-4 w-2/3 bg-background-tertiary rounded mb-4" />
        <div className="h-4 w-24 bg-background-tertiary rounded" />
      </div>
    </div>
  );
}

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  // Get unique tags from all posts
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).sort();

  // Filter posts by search query
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  // Get featured post (first post) and rest
  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = selectedTag
          ? `/api/blog?published=true&tag=${encodeURIComponent(selectedTag)}`
          : "/api/blog?published=true";
        const res = await fetch(url);
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
  }, [selectedTag]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20">
        <Container>
          {/* Header */}
          <div ref={headerRef} className="mb-8 sm:mb-12 px-2 sm:px-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-accent bg-accent/10 rounded-full">
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Blog
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                Thoughts & <span className="text-gradient">Ideas</span>
              </h1>
              <p className="text-foreground-muted max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4 sm:px-0">
                Exploring web development, sharing insights, and documenting my journey as a developer.
              </p>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-3 sm:gap-4 items-stretch md:flex-row md:items-center md:justify-between"
            >
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 sm:py-2.5 rounded-lg text-sm sm:text-base",
                    "bg-background-secondary border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
                    "transition-all duration-200",
                    "min-h-[44px]"
                  )}
                />
              </div>

              {/* Tag filters */}
              <div className="flex flex-wrap justify-start md:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={cn(
                    "px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap min-h-[36px] sm:min-h-[38px]",
                    selectedTag === null
                      ? "bg-accent text-white"
                      : "bg-background-secondary text-foreground-muted hover:text-foreground border border-border hover:border-accent/50"
                  )}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap min-h-[36px] sm:min-h-[38px]",
                      selectedTag === tag
                        ? "bg-accent text-white"
                        : "bg-background-secondary text-foreground-muted hover:text-foreground border border-border hover:border-accent/50"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-6 sm:space-y-8">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-background-secondary border border-border animate-pulse">
                <div className="grid lg:grid-cols-2">
                  <div className="h-48 sm:h-64 lg:h-96 bg-background-tertiary" />
                  <div className="p-4 sm:p-6 lg:p-10 space-y-3 sm:space-y-4">
                    <div className="flex gap-2">
                      <div className="h-5 sm:h-6 w-14 sm:w-16 bg-background-tertiary rounded" />
                      <div className="h-5 sm:h-6 w-16 sm:w-20 bg-background-tertiary rounded" />
                    </div>
                    <div className="h-8 sm:h-10 w-3/4 bg-background-tertiary rounded" />
                    <div className="h-3 sm:h-4 w-full bg-background-tertiary rounded" />
                    <div className="h-3 sm:h-4 w-2/3 bg-background-tertiary rounded" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(3)].map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Featured Post */}
          {!loading && featuredPost && (
            <div className="mb-8 sm:mb-12">
              <FeaturedPost post={featuredPost} />
            </div>
          )}

          {/* Other Posts Grid */}
          {!loading && otherPosts.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-6 sm:w-8 h-[2px] bg-accent" />
                More Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {otherPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-20"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-background-secondary flex items-center justify-center">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-foreground-muted" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-foreground-muted text-sm sm:text-base px-4">
                {searchQuery
                  ? `No posts matching "${searchQuery}"`
                  : selectedTag
                  ? `No posts with tag "${selectedTag}"`
                  : "Check back soon for new content!"}
              </p>
              {(searchQuery || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag(null);
                  }}
                  className="mt-4 text-accent hover:underline text-sm sm:text-base min-h-[44px]"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
