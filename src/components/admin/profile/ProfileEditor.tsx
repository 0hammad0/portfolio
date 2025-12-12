"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  Save,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  User,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  updateAuthorProfile,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  createAboutStats,
  updateAboutStats,
  deleteAboutStats,
} from "../actions/profile-actions";

interface AuthorProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  shortBio: string;
  location: string;
  email: string;
  avatar: string | null;
  resumeUrl: string | null;
  availability: string;
  heroRoles: string[];
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  icon: string;
  order: number;
  visible: boolean;
}

interface AboutStat {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  order: number;
  visible: boolean;
}

interface ProfileEditorProps {
  profile: AuthorProfile | null;
  socialLinks: SocialLink[];
  aboutStats: AboutStat[];
}

export function ProfileEditor({
  profile,
  socialLinks,
  aboutStats,
}: ProfileEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"profile" | "social" | "stats">(
    "profile"
  );

  // Profile state
  const [name, setName] = useState(profile?.name || "");
  const [role, setRole] = useState(profile?.role || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [shortBio, setShortBio] = useState(profile?.shortBio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl || "");
  const [availability, setAvailability] = useState(
    profile?.availability || ""
  );
  const [heroRoles, setHeroRoles] = useState<string[]>(
    profile?.heroRoles || []
  );
  const [newRole, setNewRole] = useState("");

  // Social link state
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialForm, setSocialForm] = useState({
    platform: "",
    url: "",
    label: "",
    icon: "",
  });

  // Stat state
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [statForm, setStatForm] = useState({
    label: "",
    value: 0,
    suffix: "",
  });

  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    startTransition(async () => {
      const result = await updateAuthorProfile({
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        shortBio: shortBio.trim(),
        location: location.trim(),
        email: email.trim(),
        avatar: avatar.trim() || undefined,
        resumeUrl: resumeUrl.trim() || undefined,
        availability: availability.trim(),
        heroRoles,
      });

      if (result.success) {
        toast.success("Profile updated");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    });
  };

  const handleAddHeroRole = () => {
    if (newRole.trim() && !heroRoles.includes(newRole.trim())) {
      setHeroRoles([...heroRoles, newRole.trim()]);
      setNewRole("");
    }
  };

  const handleRemoveHeroRole = (role: string) => {
    setHeroRoles(heroRoles.filter((r) => r !== role));
  };

  // Social link handlers
  const handleSaveSocialLink = async () => {
    if (!socialForm.platform.trim() || !socialForm.url.trim()) {
      toast.error("Platform and URL are required");
      return;
    }

    startTransition(async () => {
      const result = editingSocialId
        ? await updateSocialLink(editingSocialId, socialForm)
        : await createSocialLink(socialForm);

      if (result.success) {
        toast.success(editingSocialId ? "Link updated" : "Link created");
        setEditingSocialId(null);
        setSocialForm({ platform: "", url: "", label: "", icon: "" });
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save link");
      }
    });
  };

  const handleDeleteSocialLink = async (id: string) => {
    if (!confirm("Delete this social link?")) return;

    startTransition(async () => {
      const result = await deleteSocialLink(id);
      if (result.success) {
        toast.success("Link deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete link");
      }
    });
  };

  // Stat handlers
  const handleSaveStat = async () => {
    if (!statForm.label.trim()) {
      toast.error("Label is required");
      return;
    }

    startTransition(async () => {
      const result = editingStatId
        ? await updateAboutStats(editingStatId, statForm)
        : await createAboutStats(statForm);

      if (result.success) {
        toast.success(editingStatId ? "Stat updated" : "Stat created");
        setEditingStatId(null);
        setStatForm({ label: "", value: 0, suffix: "" });
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save stat");
      }
    });
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm("Delete this stat?")) return;

    startTransition(async () => {
      const result = await deleteAboutStats(id);
      if (result.success) {
        toast.success("Stat deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete stat");
      }
    });
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "profile", label: "Profile" },
          { key: "social", label: "Social Links" },
          { key: "stats", label: "About Stats" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              activeTab === tab.key
                ? "bg-accent text-white"
                : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Personal Information
              </h2>
              <button
                onClick={handleSaveProfile}
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
              {/* Avatar */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-background-tertiary flex items-center justify-center">
                      <User className="w-8 h-8 text-foreground-muted" />
                    </div>
                  )}
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="Avatar URL"
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg",
                      "bg-background border border-border",
                      "text-foreground placeholder:text-foreground-muted",
                      "focus:outline-none focus:ring-2 focus:ring-accent"
                    )}
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Full-Stack Developer"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Availability Status
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="Open for opportunities"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              {/* Resume URL */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Resume URL
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="Link to your resume"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              {/* Short Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Short Bio (Hero section)
                </label>
                <input
                  type="text"
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  placeholder="A brief tagline"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              {/* Full Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Bio (About section)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg resize-none",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              {/* Hero Roles */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Typing Effect Roles (Hero section)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddHeroRole()}
                    placeholder="Add a role (press Enter)"
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg",
                      "bg-background border border-border",
                      "text-foreground placeholder:text-foreground-muted",
                      "focus:outline-none focus:ring-2 focus:ring-accent"
                    )}
                  />
                  <button
                    type="button"
                    onClick={handleAddHeroRole}
                    className={cn(
                      "px-4 py-2.5 rounded-lg",
                      "bg-accent text-white",
                      "hover:bg-accent-hover transition-colors"
                    )}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {heroRoles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {heroRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => handleRemoveHeroRole(role)}
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
      )}

      {/* Social Links Tab */}
      {activeTab === "social" && (
        <div className="space-y-6">
          {/* Add/Edit Form */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {editingSocialId ? "Edit Social Link" : "Add Social Link"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={socialForm.platform}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, platform: e.target.value })
                }
                placeholder="Platform (e.g., github)"
                className={cn(
                  "px-4 py-2.5 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-foreground-muted",
                  "focus:outline-none focus:ring-2 focus:ring-accent"
                )}
              />
              <input
                type="url"
                value={socialForm.url}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, url: e.target.value })
                }
                placeholder="URL"
                className={cn(
                  "px-4 py-2.5 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-foreground-muted",
                  "focus:outline-none focus:ring-2 focus:ring-accent"
                )}
              />
              <input
                type="text"
                value={socialForm.label}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, label: e.target.value })
                }
                placeholder="Label"
                className={cn(
                  "px-4 py-2.5 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-foreground-muted",
                  "focus:outline-none focus:ring-2 focus:ring-accent"
                )}
              />
              <input
                type="text"
                value={socialForm.icon}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, icon: e.target.value })
                }
                placeholder="Icon (e.g., Github)"
                className={cn(
                  "px-4 py-2.5 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-foreground-muted",
                  "focus:outline-none focus:ring-2 focus:ring-accent"
                )}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveSocialLink}
                disabled={isPending}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-accent text-white font-medium",
                  "hover:bg-accent-hover transition-colors",
                  "disabled:opacity-50"
                )}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{editingSocialId ? "Update" : "Add"}</span>
              </button>
              {editingSocialId && (
                <button
                  onClick={() => {
                    setEditingSocialId(null);
                    setSocialForm({ platform: "", url: "", label: "", icon: "" });
                  }}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background-tertiary transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Links List */}
          <div className="bg-background-secondary rounded-xl border border-border divide-y divide-border">
            {socialLinks.length === 0 ? (
              <div className="p-6 text-center text-foreground-muted">
                No social links yet
              </div>
            ) : (
              socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{link.platform}</p>
                    <p className="text-sm text-foreground-muted">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingSocialId(link.id);
                        setSocialForm({
                          platform: link.platform,
                          url: link.url,
                          label: link.label,
                          icon: link.icon,
                        });
                      }}
                      className="p-2 text-foreground-muted hover:text-foreground rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSocialLink(link.id)}
                      className="p-2 text-foreground-muted hover:text-red-500 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          {/* Add/Edit Form */}
          <div className="bg-background-secondary rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {editingStatId ? "Edit Stat" : "Add Stat"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={statForm.label}
                onChange={(e) =>
                  setStatForm({ ...statForm, label: e.target.value })
                }
                placeholder="Label (e.g., Years Experience)"
                className={cn(
                  "px-4 py-2.5 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-foreground-muted",
                  "focus:outline-none focus:ring-2 focus:ring-accent"
                )}
              />
              <input
                type="number"
                value={statForm.value}
                onChange={(e) =>
                  setStatForm({ ...statForm, value: parseInt(e.target.value) || 0 })
                }
                placeholder="Value"
                className={cn(
                  "px-4 py-2.5 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-foreground-muted",
                  "focus:outline-none focus:ring-2 focus:ring-accent"
                )}
              />
              <input
                type="text"
                value={statForm.suffix}
                onChange={(e) =>
                  setStatForm({ ...statForm, suffix: e.target.value })
                }
                placeholder="Suffix (e.g., +)"
                className={cn(
                  "px-4 py-2.5 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-foreground-muted",
                  "focus:outline-none focus:ring-2 focus:ring-accent"
                )}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveStat}
                disabled={isPending}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-accent text-white font-medium",
                  "hover:bg-accent-hover transition-colors",
                  "disabled:opacity-50"
                )}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{editingStatId ? "Update" : "Add"}</span>
              </button>
              {editingStatId && (
                <button
                  onClick={() => {
                    setEditingStatId(null);
                    setStatForm({ label: "", value: 0, suffix: "" });
                  }}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background-tertiary transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Stats List */}
          <div className="bg-background-secondary rounded-xl border border-border divide-y divide-border">
            {aboutStats.length === 0 ? (
              <div className="p-6 text-center text-foreground-muted">
                No stats yet
              </div>
            ) : (
              aboutStats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-accent">
                      {stat.value}
                      {stat.suffix}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingStatId(stat.id);
                        setStatForm({
                          label: stat.label,
                          value: stat.value,
                          suffix: stat.suffix || "",
                        });
                      }}
                      className="p-2 text-foreground-muted hover:text-foreground rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStat(stat.id)}
                      className="p-2 text-foreground-muted hover:text-red-500 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
