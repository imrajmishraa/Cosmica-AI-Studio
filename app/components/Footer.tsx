"use client";

import React, { useState } from "react";
import { toast } from "@/app/store/Toast";
import {
  IconSend,
  IconMail,
  IconChevronRight,
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconSparkles,
} from "@tabler/icons-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Trigger high-fidelity platform toast
    toast(`Successfully subscribed! Welcome aboard: ${email}`, "success");
    setEmail("");
  };

  return (
    <footer className="w-full border-t border-base-content/10 bg-base-200/60 pt-16 pb-8 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Bottom Socials & Metadata Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-xs text-base-content/60 font-semibold">
              © 2026 Cosmica. All rights reserved.
            </p>
            <p className="text-[10px] text-base-content/40 leading-normal">
              Empowered by Cloudinary, Clerk, and Next.js. Engineered for high
              performance digital teams.
            </p>
          </div>

          {/* Social Links & Mock Regulatory */}
          <div className="flex items-center gap-5 justify-center">
            <div className="flex items-center gap-3 border-r border-base-content/10 pr-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-base-content/50 hover:text-base-content transition-colors duration-200 cursor-pointer"
                title="Github Workspace Repository"
              >
                <IconBrandGithub className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-base-content/50 hover:text-base-content transition-colors duration-200 cursor-pointer"
                title="Twitter Dev Stream"
              >
                <IconBrandTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-base-content/50 hover:text-base-content transition-colors duration-200 cursor-pointer"
                title="LinkedIn Workspace Page"
              >
                <IconBrandLinkedin className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-semibold text-base-content/50">
              <a
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <span className="opacity-30">•</span>
              <a href="/terms" className="hover:text-primary transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
