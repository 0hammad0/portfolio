import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils/cn";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";

// Optimized for Supabase free tier - reduced parallel queries
async function getDashboardData() {
  // Sequential queries to avoid connection pool exhaustion on free tier
  const projects = await prisma.project.findMany({
    select: { status: true },
  });

  const blogPosts = await prisma.blogPost.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      updatedAt: true,
      views: true,
    },
  });

  const messages = await prisma.contactSubmission.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      subject: true,
      status: true,
      createdAt: true,
    },
  });

  // Calculate stats from fetched data
  const projectCount = projects.length;
  const publishedProjectCount = projects.filter(p => p.status === "PUBLISHED").length;
  const blogCount = blogPosts.length;
  const publishedBlogCount = blogPosts.filter(p => p.status === "PUBLISHED").length;
  const messageCount = messages.length;
  const unreadMessageCount = messages.filter(m => m.status === "UNREAD").length;
  const totalViews = blogPosts.reduce((sum, post) => sum + (post.views || 0), 0);

  return {
    stats: {
      projects: { total: projectCount, published: publishedProjectCount },
      blog: { total: blogCount, published: publishedBlogCount },
      messages: { total: messageCount, unread: unreadMessageCount },
      views: totalViews,
    },
    recentPosts: blogPosts,
    recentMessages: messages,
  };
}

function StatsCard({
  title,
  value,
  subValue,
  icon: Icon,
  href,
  trend,
}: {
  title: string;
  value: number;
  subValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  trend?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "p-6 rounded-xl bg-background-secondary border border-border",
        "hover:border-accent/50 transition-colors group"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            <TrendingUp
              className={cn("w-3 h-3", trend < 0 && "rotate-180")}
            />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-foreground-muted">{title}</p>
      {subValue && (
        <p className="text-xs text-accent mt-2">{subValue}</p>
      )}
    </Link>
  );
}

function QuickAction({
  title,
  href,
  icon: Icon,
}: {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg",
        "bg-background-secondary border border-border",
        "hover:border-accent/50 hover:bg-accent/5 transition-colors group"
      )}
    >
      <div className="p-2 rounded-lg bg-accent/10">
        <Icon className="w-4 h-4 text-accent" />
      </div>
      <span className="text-sm font-medium text-foreground">{title}</span>
      <ArrowRight className="w-4 h-4 text-foreground-muted ml-auto group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-xl bg-background-secondary"
          />
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const { stats, recentPosts, recentMessages } = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Projects"
          value={stats.projects.total}
          subValue={`${stats.projects.published} published`}
          icon={FolderKanban}
          href="/admin/projects"
        />
        <StatsCard
          title="Blog Posts"
          value={stats.blog.total}
          subValue={`${stats.blog.published} published`}
          icon={FileText}
          href="/admin/blog"
        />
        <StatsCard
          title="Messages"
          value={stats.messages.total}
          subValue={stats.messages.unread > 0 ? `${stats.messages.unread} unread` : "All read"}
          icon={MessageSquare}
          href="/admin/messages"
        />
        <StatsCard
          title="Total Views"
          value={stats.views}
          icon={Eye}
          href="/admin/blog"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <QuickAction
              title="New Project"
              href="/admin/projects/new"
              icon={Plus}
            />
            <QuickAction
              title="New Blog Post"
              href="/admin/blog/new"
              icon={Plus}
            />
            <QuickAction
              title="View Messages"
              href="/admin/messages"
              icon={MessageSquare}
            />
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Posts
            </h2>
            <Link
              href="/admin/blog"
              className="text-sm text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.length === 0 ? (
              <p className="text-sm text-foreground-muted py-4">
                No blog posts yet
              </p>
            ) : (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/blog/${post.id}`}
                  className={cn(
                    "block p-3 rounded-lg",
                    "bg-background-secondary border border-border",
                    "hover:border-accent/50 transition-colors"
                  )}
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        post.status === "PUBLISHED"
                          ? "bg-green-500/10 text-green-500"
                          : post.status === "DRAFT"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-gray-500/10 text-gray-500"
                      )}
                    >
                      {post.status.toLowerCase()}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-sm text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-foreground-muted py-4">
                No messages yet
              </p>
            ) : (
              recentMessages.map((message) => (
                <Link
                  key={message.id}
                  href={`/admin/messages/${message.id}`}
                  className={cn(
                    "block p-3 rounded-lg",
                    "bg-background-secondary border border-border",
                    "hover:border-accent/50 transition-colors"
                  )}
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {message.name}
                  </p>
                  <p className="text-xs text-foreground-muted truncate mt-0.5">
                    {message.subject || "No subject"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        message.status === "UNREAD"
                          ? "bg-blue-500/10 text-blue-500"
                          : message.status === "READ"
                          ? "bg-gray-500/10 text-gray-500"
                          : message.status === "REPLIED"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-gray-500/10 text-gray-500"
                      )}
                    >
                      {message.status.toLowerCase()}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-foreground-muted mt-1">
          Welcome back! Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {/* Content */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
