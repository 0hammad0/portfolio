import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero/Hero";

// Lazy load below-the-fold sections for better initial load
const About = dynamic(() => import("@/components/sections/About/About").then(mod => ({ default: mod.About })), {
  loading: () => <SectionSkeleton />,
});

const Skills = dynamic(() => import("@/components/sections/Skills/Skills").then(mod => ({ default: mod.Skills })), {
  loading: () => <SectionSkeleton />,
});

const ProjectShowcase = dynamic(() => import("@/components/sections/Projects/ProjectShowcase").then(mod => ({ default: mod.ProjectShowcase })), {
  loading: () => <SectionSkeleton className="h-screen" />,
});

const Projects = dynamic(() => import("@/components/sections/Projects/Projects").then(mod => ({ default: mod.Projects })), {
  loading: () => <SectionSkeleton />,
});

const BlogPreview = dynamic(() => import("@/components/sections/Blog/BlogPreview").then(mod => ({ default: mod.BlogPreview })), {
  loading: () => <SectionSkeleton />,
});

const Contact = dynamic(() => import("@/components/sections/Contact/Contact").then(mod => ({ default: mod.Contact })), {
  loading: () => <SectionSkeleton />,
});

// Simple skeleton component for loading states
function SectionSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-background-secondary rounded w-1/4 mx-auto" />
          <div className="h-4 bg-background-secondary rounded w-3/4 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="h-48 bg-background-secondary rounded-xl" />
            <div className="h-48 bg-background-secondary rounded-xl" />
            <div className="h-48 bg-background-secondary rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enable ISR with 1 hour revalidation for better performance
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero loads immediately - above the fold */}
        <Hero />

        {/* Below-the-fold sections are lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<SectionSkeleton className="h-screen" />}>
          <ProjectShowcase />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <BlogPreview />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
