"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils/cn";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";

interface AdminHeaderProps {
  className?: string;
}

export function AdminHeader({ className }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between h-16 px-6 bg-background-secondary border-b border-border",
        className
      )}
    >
      {/* Search */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search..."
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg",
              "bg-background border border-border",
              "text-foreground placeholder:text-foreground-muted",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
              "transition-all duration-200"
            )}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg",
              "text-foreground hover:bg-background-tertiary transition-colors"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              {session?.user?.avatar ? (
                <img
                  src={session.user.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-accent" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-foreground-muted">
                {session?.user?.role || "Administrator"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-foreground-muted" />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-background-secondary border border-border rounded-lg shadow-lg z-50">
                <a
                  href="/admin/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </a>
                <a
                  href="/admin/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </a>
                <hr className="my-2 border-border" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-background-tertiary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
