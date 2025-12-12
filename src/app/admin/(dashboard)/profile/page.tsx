import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { ProfileEditor } from "@/components/admin/profile/ProfileEditor";

async function getProfileData() {
  const [profile, socialLinks, aboutStats] = await Promise.all([
    prisma.authorProfile.findFirst(),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.aboutStats.findMany({ orderBy: { order: "asc" } }),
  ]);

  return {
    profile: profile
      ? {
          ...profile,
          heroRoles: JSON.parse(profile.heroRoles) as string[],
        }
      : null,
    socialLinks,
    aboutStats,
  };
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="bg-background-secondary rounded-xl p-6">
        <div className="h-6 bg-background-tertiary rounded w-32 mb-4" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-background-tertiary rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function ProfileContent() {
  const { profile, socialLinks, aboutStats } = await getProfileData();

  return (
    <ProfileEditor
      profile={profile}
      socialLinks={socialLinks}
      aboutStats={aboutStats}
    />
  );
}

export default function AdminProfilePage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-foreground-muted mt-1">
          Manage your personal information and social links
        </p>
      </div>

      {/* Content */}
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
