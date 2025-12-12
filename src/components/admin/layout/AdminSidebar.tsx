"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/hooks/useTheme";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Lightbulb,
  User,
  Image,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Lightbulb,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: User,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("system");
    }
  };

  const getThemeIcon = () => {
    if (theme === "system") {
      return <Monitor className="w-5 h-5" />;
    } else if (theme === "dark") {
      return <Moon className="w-5 h-5" />;
    } else {
      return <Sun className="w-5 h-5" />;
    }
  };

  const getThemeLabel = () => {
    if (theme === "system") {
      return "System";
    } else if (theme === "dark") {
      return "Dark";
    } else {
      return "Light";
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-background-secondary border-r border-border",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <Link href="/admin" className="font-bold text-lg text-foreground">
            Admin
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors",
            collapsed && "mx-auto"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                    "text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-white"
                      : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={cycleTheme}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg",
            "text-sm text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
          )}
          title={`Theme: ${getThemeLabel()} (click to cycle)`}
        >
          {getThemeIcon()}
          {!collapsed && (
            <span className="flex items-center justify-between flex-1">
              <span>Theme</span>
              <span className="text-xs px-2 py-0.5 rounded bg-background-tertiary">
                {getThemeLabel()}
              </span>
            </span>
          )}
        </button>

        {/* View Site */}
        <Link
          href="/"
          className={cn(
            "flex items-center justify-center gap-2 px-3 py-2 rounded-lg",
            "text-sm text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
          )}
          title="Back to site"
        >
          {!collapsed && <span>View Site</span>}
          {collapsed && <span className="text-xs">Site</span>}
        </Link>
      </div>
    </aside>
  );
}
