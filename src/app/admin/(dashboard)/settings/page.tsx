import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { SettingsEditor } from "@/components/admin/settings/SettingsEditor";

async function getSettingsData() {
  const settings = await prisma.siteSettings.findFirst();

  return settings
    ? {
        ...settings,
        keywords: JSON.parse(settings.keywords) as string[],
      }
    : null;
}

function SettingsSkeleton() {
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

async function SettingsContent() {
  const settings = await getSettingsData();

  return <SettingsEditor settings={settings} />;
}

export default function AdminSettingsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground-muted mt-1">
          Configure site settings and SEO
        </p>
      </div>

      {/* Content */}
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
