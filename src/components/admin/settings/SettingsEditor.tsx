"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Save, Plus, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updateSiteSettings } from "../actions/settings-actions";

interface SiteSettings {
  id: string;
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  ogImage: string | null;
  favicon: string | null;
  keywords: string[];
}

interface SettingsEditorProps {
  settings: SiteSettings | null;
}

export function SettingsEditor({ settings }: SettingsEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [siteName, setSiteName] = useState(settings?.siteName || "");
  const [siteTitle, setSiteTitle] = useState(settings?.siteTitle || "");
  const [siteDescription, setSiteDescription] = useState(
    settings?.siteDescription || ""
  );
  const [siteUrl, setSiteUrl] = useState(settings?.siteUrl || "");
  const [ogImage, setOgImage] = useState(settings?.ogImage || "");
  const [favicon, setFavicon] = useState(settings?.favicon || "");
  const [keywords, setKeywords] = useState<string[]>(settings?.keywords || []);
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleSave = () => {
    if (!siteName.trim()) {
      toast.error("Site name is required");
      return;
    }

    startTransition(async () => {
      const result = await updateSiteSettings({
        siteName: siteName.trim(),
        siteTitle: siteTitle.trim(),
        siteDescription: siteDescription.trim(),
        siteUrl: siteUrl.trim(),
        ogImage: ogImage.trim() || undefined,
        favicon: favicon.trim() || undefined,
        keywords,
      });

      if (result.success) {
        toast.success("Settings saved");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-background-secondary rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            General Settings
          </h2>
          <button
            onClick={handleSave}
            disabled={isPending}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-accent text-white font-medium",
              "hover:bg-accent-hover transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Site Name *
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="My Portfolio"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-background border border-border",
                "text-foreground placeholder:text-foreground-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
          </div>

          {/* Site Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="Full-Stack Developer"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-background border border-border",
                "text-foreground placeholder:text-foreground-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
          </div>

          {/* Site URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Site URL
            </label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://example.com"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-background border border-border",
                "text-foreground placeholder:text-foreground-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
          </div>

          {/* Favicon */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Favicon URL
            </label>
            <input
              type="url"
              value={favicon}
              onChange={(e) => setFavicon(e.target.value)}
              placeholder="/favicon.ico"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-background border border-border",
                "text-foreground placeholder:text-foreground-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
          </div>

          {/* Site Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Site Description
            </label>
            <textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={3}
              placeholder="A brief description of your portfolio"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg resize-none",
                "bg-background border border-border",
                "text-foreground placeholder:text-foreground-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-background-secondary rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          SEO Settings
        </h2>

        <div className="space-y-6">
          {/* OG Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Default OG Image URL
            </label>
            <input
              type="url"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://example.com/og-image.png"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-background border border-border",
                "text-foreground placeholder:text-foreground-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
            <p className="text-xs text-foreground-muted mt-1">
              Default image used when sharing on social media
            </p>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              SEO Keywords
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
                placeholder="Add keyword (press Enter)"
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-foreground-muted",
                  "focus:outline-none focus:ring-2 focus:ring-accent"
                )}
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className={cn(
                  "px-4 py-2.5 rounded-lg",
                  "bg-accent text-white",
                  "hover:bg-accent-hover transition-colors"
                )}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
