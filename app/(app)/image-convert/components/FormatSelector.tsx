"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface FormatSelectorProps {
  sourceFormat: string;
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
}

interface FormatOption {
  id: string;
  label: string;
}

const TARGET_FORMATS: FormatOption[] = [
  {
    id: "avif",
    label: "AVIF",
  },
  {
    id: "webp",
    label: "WEBP",
  },
  {
    id: "png",
    label: "PNG",
  },
  {
    id: "jpg",
    label: "JPG",
  },
  {
    id: "gif",
    label: "GIF",
  },
  {
    id: "bmp",
    label: "BMP",
  },
];

export default function FormatSelector({
  sourceFormat,
  selectedFormat,
  onSelectFormat,
}: FormatSelectorProps) {
  // Normalize source format to check against target options
  const normalizedSource = sourceFormat.toLowerCase() === "jpeg" ? "jpg" : sourceFormat.toLowerCase();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[5px] text-center font-medium text-base-content/60 uppercase tracking-normal block mb-2">
          Select Target Format
        </label>
        <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
                  "flex flex-col items-start p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none bg-base-100",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                    : isSameAsSource
                      ? "opacity-35 cursor-not-allowed border-base-content/10 bg-base-200"
                      : "border-base-content/10 hover:border-base-content/25 hover:bg-base-200/50",
                )}
              >
                <div className="flex justify-center w-20">
                  <span className="font-medium text-center content-center text-sm text-base-content tracking-wide">
                    {format.label}
                  </span>
                </div>
                <p className="text-[10px] text-base-content/60 leading-normal font-semibold"></p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
