import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { SkillsManager } from "@/components/admin/skills/SkillsManager";

async function getSkillsData() {
  const [categories, skills] = await Promise.all([
    prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.skill.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return { categories, skills };
}

function SkillsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-background-secondary rounded-xl p-6">
          <div className="h-6 bg-background-tertiary rounded w-32 mb-4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-12 bg-background-tertiary rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

async function SkillsContent() {
  const { categories, skills } = await getSkillsData();

  return <SkillsManager categories={categories} skills={skills} />;
}

export default function AdminSkillsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Skills</h1>
        <p className="text-foreground-muted mt-1">
          Manage your skill categories and proficiency levels
        </p>
      </div>

      {/* Content */}
      <Suspense fallback={<SkillsSkeleton />}>
        <SkillsContent />
      </Suspense>
    </div>
  );
}
