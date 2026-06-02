"use client";

import React from "react";
import { cn } from "../lib/utils";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Toaster from "@/components/ui/Toaster";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn(inter.className, "min-h-screen flex flex-col justify-between bg-base-300 text-base-content relative overflow-x-hidden transition-colors duration-300")}>
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-28 relative z-10">
          {children}
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
