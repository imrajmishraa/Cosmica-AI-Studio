"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface VideoFormatSelectorProps {
  sourceFormat: string;
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
}

interface FormatOption {
  id: string;
  label: string;
  badge?: string;
  badgeClass?: string;
  desc: string;
}

const TARGET_FORMATS: FormatOption[] = [
  {
    id: "mp4",
    label: "MP4",
    badge: "Recommended",
    badgeClass: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    desc: "Universal standard, highly compatible video format.",
  },
  {
    id: "webm",
    label: "WEBM",
    badge: "Web Native",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    desc: "Optimized format specifically designed for HTML5 browser players.",
  },
  {
    id: "mov",
    label: "MOV",
    badge: "Apple QuickTime",
    badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    desc: "High quality QuickTime container, ideal for editing workspaces.",
  },
  {
    id: "avi",
    label: "AVI",
    badge: "Legacy",
    badgeClass: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    desc: "Microsoft standard container, supports various codecs.",
  },
  {
    id: "mkv",
    label: "MKV",
    badge: "Matroska",
    badgeClass: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    desc: "Open container holding unlimited streams (subtitles/audio).",
  },
];

export default function VideoFormatSelector({
  sourceFormat,
  selectedFormat,
  onSelectFormat,
}: VideoFormatSelectorProps) {
  const normalizedSource = sourceFormat.toLowerCase();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-bold text-base-content/60 uppercase tracking-wider block mb-2">
          Select Target Video Format
        </label>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {TARGET_FORMATS.map((format) => {
            const isSameAsSource = format.id === normalizedSource;
            const isSelected = format.id === selectedFormat;

            return (
              <button
                key={format.id}
                type="button"
                disabled={isSameAsSource}
                onClick={() => onSelectFormat(format.id)}
                className={cn(
                  "flex flex-col items-start p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 select-none bg-base-100",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                    : isSameAsSource
                    ? "opacity-35 cursor-not-allowed border-base-content/10 bg-base-200"
                    : "border-base-content/10 hover:border-base-content/25 hover:bg-base-200/50"
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-extrabold text-sm text-base-content tracking-wide">
                    {format.label}
                  </span>
                  {format.badge && (
                    <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md", format.badgeClass)}>
                      {isSameAsSource ? "Current" : format.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-base-content/60 leading-normal font-semibold">
                  {format.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
