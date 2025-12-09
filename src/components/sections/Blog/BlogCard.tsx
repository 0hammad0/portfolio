"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const readTime = estimateReadTime(post.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} className="cursor-pointer">
        <Card hover className="group overflow-hidden h-full flex flex-col">
          {/* Cover Image */}
          <div className="relative h-40 sm:h-48 overflow-hidden bg-background-tertiary">
            <Image
              src={post.coverImage || "/images/blog/placeholder.jpg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Fallback gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background-tertiary -z-10" />
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 flex flex-col flex-1">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="accent" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-foreground-muted text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-foreground-muted">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {readTime} min read
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform text-accent" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
