"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { ArrowLeft, Calendar, Clock, Share2, User, Copy, Check, Eye } from "lucide-react";
import { ViewCounter } from "@/components/ui/ViewCounter";
import { ReactionButton } from "@/components/ui/ReactionButton";
import { useSound } from "@/providers/SoundProvider";
import type { BlogPost } from "@/types/blog";

interface BlogPostContentProps {
  post: BlogPost;
}

// Code Block Component with Syntax Highlighting
function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") || "text";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom style overrides for vscDarkPlus
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: '#1e1e1e',
      margin: 0,
      padding: '1rem',
      paddingTop: '2.5rem',
      fontSize: '13px',
      lineHeight: '1.6',
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
      fontSize: '13px',
    },
  };

  return (
    <div className="group relative my-4 -mx-4 sm:mx-0 sm:rounded-lg overflow-hidden border-y sm:border border-[#3d3d3d]">
      {/* Header with language + copy */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-1.5 bg-[#2d2d2d] border-b border-[#3d3d3d] z-10">
        <span className="text-[11px] font-medium text-[#858585] uppercase tracking-wide">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all duration-200",
            copied
              ? "bg-green-500/20 text-green-400"
              : "text-[#858585] hover:text-white hover:bg-[#3d3d3d]"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Syntax highlighted code */}
      <SyntaxHighlighter
        language={language}
        style={customStyle}
        showLineNumbers={code.split('\n').length > 3}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: '#6e7681',
          textAlign: 'right',
        }}
        wrapLines
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: '#1e1e1e',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
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

// Progress bar component
function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}


// Table of contents (extracted from markdown headers)
function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>("");

  // Extract heading info - memoized to prevent unnecessary effect re-runs
  const headingData = useMemo(() => {
    const headings = content.match(/^##\s+.+$/gm) || [];
    return headings.map((heading) => {
      const text = heading.replace(/^##\s+/, "");
      const id = text.toLowerCase().replace(/\s+/g, "-");
      return { text, id };
    });
  }, [content]);

  useEffect(() => {
    if (headingData.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66% 0px",
        threshold: 0,
      }
    );

    // Observe all heading elements
    headingData.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headingData.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headingData]);

  if (headingData.length < 2) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="hidden xl:block sticky top-24 h-fit"
    >
      <div className="p-4 rounded-xl bg-background-secondary border border-border">
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-foreground-muted">
          Contents
        </h4>
        <nav className="space-y-2">
          {headingData.map(({ text, id }, index) => {
            const isActive = activeId === id;
            return (
              <a
                key={index}
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={cn(
                  "block text-sm transition-colors py-1 border-l-2 pl-3",
                  isActive
                    ? "text-accent border-accent font-medium"
                    : "text-foreground-muted border-border hover:text-accent hover:border-accent"
                )}
              >
                {text}
              </a>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const readTime = estimateReadTime(post.content);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const { playSound } = useSound();

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleShare = async () => {
    playSound("click");
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      playSound("success");
    }
  };

  return (
    <>
      <ReadingProgress />
      <Header />

      <main className="min-h-screen">
        <article>
          {/* Hero */}
          <div ref={heroRef} className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
            <motion.div
              style={{ y: heroY }}
              className="absolute inset-0"
            >
              <Image
                src={post.coverImage || "/images/blog/placeholder.jpg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

            {/* Hero content */}
            <motion.div
              style={{ opacity: heroOpacity }}
              className="absolute inset-0 flex items-end"
            >
              <Container>
                <div className="pb-8 sm:pb-12 md:pb-16 max-w-4xl px-1 sm:px-0">
                  {/* Back link */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link
                      href="/blog"
                      onClick={() => playSound("click")}
                      className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-foreground-muted hover:text-accent transition-colors mb-4 sm:mb-6 min-h-[44px]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Back to Blog
                    </Link>
                  </motion.div>

                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4"
                  >
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="accent">
                        {tag}
                      </Badge>
                    ))}
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                  >
                    {post.title}
                  </motion.h1>

                  {/* Meta */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap items-center gap-3 sm:gap-6 text-foreground-muted"
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                      </div>
                      <span className="text-xs sm:text-sm">Author</span>
                    </span>
                    <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {readTime} min read
                    </span>
                    <ViewCounter slug={post.slug} className="text-xs sm:text-sm" />
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:text-accent transition-colors ml-auto min-h-[44px]"
                    >
                      <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Share
                    </button>
                  </motion.div>
                </div>
              </Container>
            </motion.div>
          </div>

          {/* Content */}
          <div className="relative -mt-6 sm:-mt-8 md:-mt-12 pb-12 sm:pb-20">
            <div className="px-0 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-6xl">
              <div className="grid xl:grid-cols-[200px_1fr_200px] gap-0 sm:gap-8">
                {/* Left sidebar - Table of Contents */}
                <TableOfContents content={post.content} />

                {/* Main content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-background rounded-none sm:rounded-2xl p-4 sm:p-6 md:p-10 lg:p-12 border-y sm:border border-border shadow-xl shadow-black/5"
                >
                  {/* Excerpt */}
                  <p className="text-base sm:text-lg md:text-xl text-foreground-muted mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Article content */}
                  <div className="blog-content">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-8 sm:mt-10 mb-3 sm:mb-4">{children}</h1>
                        ),
                        h2: ({ children }) => {
                          const text = String(children);
                          const id = text.toLowerCase().replace(/\s+/g, "-");
                          return (
                            <h2 id={id} className="text-xl sm:text-2xl font-bold text-foreground mt-10 sm:mt-12 mb-3 sm:mb-4 scroll-mt-24">
                              {children}
                            </h2>
                          );
                        },
                        h3: ({ children }) => (
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground mt-6 sm:mt-8 mb-2 sm:mb-3">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-foreground-muted leading-relaxed mb-6">{children}</p>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} className="text-accent hover:underline">{children}</a>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">{children}</strong>
                        ),
                        code: ({ className, children, ...props }) => {
                          // Check if it's inside a pre tag (code block) or inline
                          const isCodeBlock = className?.includes("language-");
                          if (isCodeBlock) {
                            return (
                              <CodeBlock className={className}>
                                {children}
                              </CodeBlock>
                            );
                          }
                          // Inline code
                          return (
                            <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-sm font-mono">
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => {
                          // Just pass through - the code component handles the styling
                          return <>{children}</>;
                        },
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-accent bg-accent/5 sm:rounded-r-lg py-3 px-4 sm:px-6 my-6 -mx-4 sm:mx-0 italic">
                            {children}
                          </blockquote>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside text-foreground-muted mb-6 space-y-2">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside text-foreground-muted mb-6 space-y-2">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-foreground-muted">{children}</li>
                        ),
                        hr: () => <hr className="border-border my-8" />,
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                  </div>

                  {/* Reactions section */}
                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-foreground-muted mb-2">Did you enjoy this article?</p>
                        <ReactionButton slug={post.slug} />
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          leftIcon={<Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Article footer */}
                  <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border mb-8 sm:mb-16">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" size="sm">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/blog">
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                          >
                            More Articles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right sidebar - empty for symmetry on xl screens */}
                <div className="hidden xl:block" />
              </div>
            </div>
          </div>

          {/* Related posts section could go here */}
        </article>
      </main>

      <Footer />
    </>
  );
}
