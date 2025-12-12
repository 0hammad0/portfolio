import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";

async function getMedia() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
  return media;
}

function MediaSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-background-secondary"
          />
        ))}
      </div>
    </div>
  );
}

async function MediaContent() {
  const media = await getMedia();
  return <MediaLibrary media={media} />;
}

export default function AdminMediaPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        <p className="text-foreground-muted mt-1">
          Manage your uploaded images and files
        </p>
      </div>

      {/* Content */}
      <Suspense fallback={<MediaSkeleton />}>
        <MediaContent />
      </Suspense>
    </div>
  );
}
