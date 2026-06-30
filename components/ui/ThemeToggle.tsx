"use client";

import React, { useState, useEffect } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const [activeTheme, setActiveTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("cosmica-theme") || "dark";
    setActiveTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    setActiveTheme(nextTheme);
    localStorage.setItem("cosmica-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Prevent hydration mismatch by rendering a skeleton placeholder
  if (!mounted) {
    return (
      <div className="w-14 h-8 bg-base-350/20 border border-base-content/10 rounded-full animate-pulse shrink-0"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative w-14 h-8 bg-base-100 border border-base-content/10 hover:border-base-content/20 rounded-full flex items-center justify-between px-1.5 cursor-pointer shadow-inner transition-all shrink-0"
      aria-label="Toggle Theme"
      title={activeTheme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {/* Sun Icon (Left background) */}
      <IconSun className={cn("w-3.5 h-3.5 transition-opacity duration-200", activeTheme === "light" ? "opacity-20" : "opacity-55 text-base-content")} />

      {/* Moon Icon (Right background) */}
      <IconMoon className={cn("w-3.5 h-3.5 transition-opacity duration-200", activeTheme === "dark" ? "opacity-20" : "opacity-55 text-base-content")} />

      {/* Sliding Indicator Knob */}
      <div
        className={cn(
          "absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ease-out pointer-events-none",
          activeTheme === "light"
            ? "translate-x-0 bg-linear-to-tr from-amber-400 to-orange-500 text-white"
            : "translate-x-6 bg-linear-to-tr from-indigo-500 to-purple-600 text-white"
        )}
      >
        {activeTheme === "light" ? (
          <IconSun className="w-3.5 h-3.5" />
        ) : (
          <IconMoon className="w-3.5 h-3.5" />
        )}
      </div>
    </button>
  );
}

