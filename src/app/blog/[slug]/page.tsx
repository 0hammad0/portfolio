import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostContent } from "./BlogPostContent";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  JsonLd,
} from "@/lib/structured-data";
import { siteConfig } from "@/lib/constants/siteConfig";

// Sample blog posts data (same as API, for SSR)
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

\`\`\`javascript
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

## Memoization

Use React.memo, useMemo, and useCallback strategically to prevent unnecessary re-renders.

\`\`\`javascript
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data.name}</div>;
});

function Parent() {
  const processedData = useMemo(() =>
    expensiveCalculation(data), [data]
  );

  return <MemoizedComponent data={processedData} />;
}
\`\`\`

## Virtual Lists

For long lists, consider using virtualization libraries like react-window or react-virtuoso. This renders only visible items, dramatically improving performance.

## Conclusion

Performance optimization is an ongoing process. Profile your app, identify bottlenecks, and apply these techniques strategically.
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

The App Router provides a new way to build applications with React Server Components. Files in the app directory are Server Components by default.

\`\`\`
app/
  layout.tsx    # Root layout
  page.tsx      # Home page
  about/
    page.tsx    # About page
\`\`\`

## Server Components

By default, components in the app directory are Server Components. This means they run on the server and reduce client-side JavaScript.

\`\`\`javascript
// This runs on the server
async function BlogPosts() {
  const posts = await db.posts.findMany();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

## Streaming

Next.js 14 supports streaming with Suspense, allowing for progressive rendering of your UI.

## Conclusion

Next.js 14 is a game-changer for React development. The App Router and Server Components provide better performance and developer experience.
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

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\`

## The :has() Selector

The :has() selector is a parent selector that enables powerful styling patterns.

\`\`\`css
/* Style a form that has an invalid input */
form:has(input:invalid) {
  border: 2px solid red;
}

/* Style a card that has an image */
.card:has(img) {
  padding-top: 0;
}
\`\`\`

## CSS Grid Subgrid

Subgrid allows nested grids to align with their parent grid.

\`\`\`css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  grid-column: span 3;
  display: grid;
  grid-template-columns: subgrid;
}
\`\`\`

## Conclusion

Modern CSS is incredibly powerful. These features can simplify your code and create more robust layouts.
`,
    coverImage: "/images/blog/modern-css.jpg",
    tags: ["CSS", "Web Development", "Frontend"],
    published: true,
    publishedAt: new Date("2024-03-10").toISOString(),
    createdAt: new Date("2024-03-10").toISOString(),
    updatedAt: new Date("2024-03-10").toISOString(),
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = sampleBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found | Blog",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export async function generateStaticParams() {
  return sampleBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = sampleBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Generate structured data for SEO
  const blogPostSchema = generateBlogPostSchema({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    tags: post.tags,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd data={blogPostSchema} />
      <JsonLd data={breadcrumbSchema} />
      <BlogPostContent post={post} />
    </>
  );
}
