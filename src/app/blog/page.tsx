import { Metadata } from "next";
import { BlogList } from "./BlogList";

// Enable ISR with 1 hour revalidation for better performance
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | Portfolio",
  description: "Read my latest articles on web development, programming tips, and tech insights.",
};

export default function BlogPage() {
  return <BlogList />;
}
