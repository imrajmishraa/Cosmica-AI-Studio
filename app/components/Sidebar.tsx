"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { cn } from "../lib/utils";
import {
  IconHome,
  IconPhoto,
  IconVideo,
  IconSparkles,
  IconFileText,
  IconLogout,
  IconMenu2,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconExchange,
} from "@tabler/icons-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CommandPalette from "@/components/ui/CommandPalette";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Bind Command + K for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/home",
      icon: <IconHome className="w-5 h-5" />,
      desc: "Vault stats & library",
    },
    {
      name: "Social Share Studio",
      href: "/social-share",
      icon: <IconPhoto className="w-5 h-5" />,
      desc: "Smart platform crop",
    },
    {
      name: "AI Image Studio",
      href: "/ai-image",
      icon: <IconSparkles className="w-5 h-5" />,
      desc: "AI filter workspaces",
    },
    {
      name: "Video Compressor",
      href: "/video-share",
      icon: <IconVideo className="w-5 h-5" />,
      desc: "Compress up to 70MB",
    },
    {
      name: "Image Converter",
      href: "/image-convert",
      icon: <IconExchange className="w-5 h-5" />,
      desc: "Format converter pipeline",
    },
    {
      name: "Document PDF Suite",
      href: "/pdf-suite",
      icon: <IconFileText className="w-5 h-5" />,
      desc: "Visual PDF toolkit",
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-base-200 border-r border-base-content/10 transition-colors duration-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-base-content/10 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <span className="font-extrabold text-sm text-white">C</span>
          </div>
          {!isCollapsed && (
            <span className="font-black text-base tracking-widest bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
              Cosmica
            </span>
          )}
        </Link>

        {/* Collapse button on desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex w-6 h-6 items-center justify-center rounded-lg border border-base-content/10 bg-base-100 hover:bg-base-300 text-base-content/70 hover:text-base-content cursor-pointer transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <IconChevronRight className="w-3.5 h-3.5" />
          ) : (
            <IconChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Quick Search Button */}
      <div className="px-3 py-3 shrink-0">
        <button
          onClick={() => setIsPaletteOpen(true)}
          className={cn(
            "flex items-center gap-2 border border-base-content/10 bg-base-100/50 hover:bg-base-300/80 hover:border-base-content/20 text-base-content/60 hover:text-base-content rounded-xl text-left cursor-pointer transition-all duration-200",
            isCollapsed ? "w-10 h-10 justify-center p-0" : "w-full px-3 py-2 text-xs"
          )}
          title="Search assets & commands (⌘K)"
        >
          <IconSearch className="w-4 h-4 shrink-0 text-primary" />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Quick Search...</span>
              <kbd className="hidden sm:inline-flex bg-base-200 border border-base-content/10 text-[9px] font-mono px-1.5 py-0.5 rounded-md opacity-70">
                ⌘K
              </kbd>
            </div>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative",
                isActive
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/10"
                  : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
              )}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{item.name}</span>
                  <span
                    className={cn(
                      "text-[9px] font-normal leading-none mt-0.5 truncate",
                      isActive ? "text-primary-content/60" : "text-base-content/40 group-hover:text-base-content/65"
                    )}
                  >
                    {item.desc}
                  </span>
                </div>
              )}
              {isCollapsed && (
                <div className="absolute left-16 scale-0 group-hover:scale-100 bg-base-100 border border-base-content/10 shadow-xl rounded-lg px-2.5 py-1.5 text-xs text-base-content font-bold z-50 whitespace-nowrap transition-all duration-150 origin-left">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / Controls */}
      <div className="p-3 border-t border-base-content/10 bg-base-150/10 space-y-3 shrink-0">
        {/* Theme Controller */}
        <div className={cn("flex items-center justify-between", isCollapsed && "justify-center")}>
          {!isCollapsed && <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider pl-1.5">Theme</span>}
          <ThemeToggle />
        </div>

        {/* User profile & signout */}
        {isSignedIn && (
          <div
            className={cn(
              "flex items-center justify-between p-2 rounded-xl bg-base-100/50 border border-base-content/5",
              isCollapsed && "flex-col gap-3 p-1.5 bg-transparent border-none"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  user?.imageUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}`
                }
                alt={user?.fullName || "User"}
                className="w-7 h-7 rounded-full border border-indigo-500/40 object-cover shrink-0"
              />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-base-content truncate">
                    {user?.firstName || "Creator"}
                  </span>
                  <span className="text-[9px] text-base-content/40 truncate">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              )}
            </div>

            <SignOutButton>
              <button
                className="relative flex items-center justify-center p-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer shrink-0"
                title="Logout"
              >
                <IconLogout className="w-3.5 h-3.5" />
              </button>
            </SignOutButton>
          </div>
        )}
      </div>

      {isPaletteOpen && <CommandPalette onClose={() => setIsPaletteOpen(false)} />}
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-base-200/90 backdrop-blur-md border-b border-base-content/10 z-40 flex items-center justify-between px-4 transition-colors">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow shadow-purple-500/20">
            <span className="font-extrabold text-xs text-white">C</span>
          </div>
          <span className="font-extrabold text-sm tracking-wider text-base-content">
            Cosmica Studio
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="p-2 rounded-lg border border-base-content/10 bg-base-100 text-base-content/70 hover:text-base-content cursor-pointer"
            title="Search"
          >
            <IconSearch className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg border border-base-content/10 bg-base-100 text-base-content hover:bg-base-300 cursor-pointer"
            aria-label="Open menu"
          >
            <IconMenu2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          ></div>
          {/* Menu Drawer */}
          <div className="relative flex flex-col w-64 max-w-[80vw] h-full animate-slide-in-left">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-base-300 border border-base-content/10 text-base-content cursor-pointer"
              aria-label="Close menu"
            >
              <IconX className="w-4 h-4" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar Pane */}
      <aside
        className={cn(
          "hidden md:block h-screen sticky top-0 shrink-0 transition-all duration-300 z-30",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
