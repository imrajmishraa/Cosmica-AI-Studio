"use client";

import React from "react";
import { IconDownload, IconVideo, IconRefresh } from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import { cn } from "@/app/lib/utils";

interface UploadedFile {
  publicId: string;
  url: string;
  name: string;
  size: number;
  format: string;
}

interface VideoPreviewProps {
  uploadedFile: UploadedFile | null;
  convertedUrl: string | null;
  targetFormat: string;
  isProcessing: boolean;
  onConvert: () => void;
}

export default function VideoPreview({
  uploadedFile,
  convertedUrl,
  targetFormat,
  isProcessing,
  onConvert,
}: VideoPreviewProps) {
  const handleDownload = () => {
    if (!convertedUrl || !uploadedFile) return;

    toast("Preparing converted video for download...", "info");
    const cleanName = uploadedFile.name.replace(/\.[^/.]+$/, "");
    const filename = `${cleanName}_converted.${targetFormat}`;

    fetch(convertedUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch video data");
        return res.blob();
      })
      .then((blob) => {
        const localUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = localUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(localUrl);
        toast(`Downloaded: ${filename}`, "success");
      })
      .catch((err) => {
        console.error("Direct download failed, opening in new tab:", err);
        const link = document.createElement("a");
        link.href = convertedUrl;
        link.setAttribute("target", "_blank");
        link.click();
      });
  };

  if (!uploadedFile) {
    return (
      <div className="flex-1 bg-white rounded-2xl border border-[#e5e7eb] min-h-[400px] flex items-center justify-center p-6 text-center select-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px]">
        <div className="max-w-xs space-y-2.5">
          <div className="w-12 h-12 rounded-full bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-center mx-auto opacity-75">
            <IconVideo className="w-5 h-5 text-[#9ca3af]" />
          </div>
          <p className="text-xs font-bold text-[#111827]">Workspace Visualizer Idle</p>
          <p className="text-[10px] text-[#4b5563] leading-normal font-semibold">
            Upload a video file to start format conversion operations and preview output changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm min-h-[450px]">
      {/* Visualizer Toolbar */}
      <div className="h-12 border-b border-[#e5e7eb] bg-white px-4 flex items-center justify-between z-10 shrink-0 text-[#111827] text-[11px] font-bold">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-amber-500 animate-pulse" : convertedUrl ? "bg-emerald-500 animate-pulse" : "bg-[#e63946] animate-pulse")}></span>
          <span>Video Visualizer Canvas</span>
        </div>
      </div>

      {/* Main Viewport (remains dark for professional video preview contrast) */}
      <div className="flex-1 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] bg-[size:16px_16px] bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative select-none min-h-[280px]">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full border-3 border-t-[#e63946] border-white/10 animate-spin"></div>
            <div className="space-y-0.5">
              <p className="font-bold text-white text-xs">Transforming Video Format...</p>
              <p className="text-[9px] text-white/50">Eager rendering pipeline executing on Cloudinary Server</p>
            </div>
          </div>
        ) : convertedUrl ? (
          <div className="w-full h-full flex flex-col justify-center items-center gap-4 max-w-xl">
            <div className="text-[9px] text-[#e63946] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Resulting Video Output</span>
              <span className="bg-[#e63946]/20 text-[#e63946] px-1.5 py-0.2 rounded font-mono text-[8px]">{targetFormat.toUpperCase()}</span>
            </div>
            
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-900/60 relative flex items-center justify-center shadow-lg">
              <video src={convertedUrl} controls className="w-full h-full object-contain" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50">
              <IconVideo className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="font-extrabold text-white text-xs">Ready for Conversion</p>
              <p className="text-[9px] text-white/50 leading-normal">
                Choose your desired target format in the options panel, then click convert to execute video transformations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-[#e5e7eb] bg-[#f8f9fa] shrink-0 flex flex-col sm:flex-row gap-2">
        {convertedUrl ? (
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="flex-1 btn bg-emerald-600 hover:bg-emerald-700 text-white border-none flex items-center justify-center gap-1.5 rounded-xl shadow-sm cursor-pointer font-extrabold text-xs"
          >
            <IconDownload className="w-4 h-4" />
            Download Converted Video
          </button>
        ) : (
          <button
            onClick={onConvert}
            disabled={isProcessing || !targetFormat}
            className="flex-1 btn bg-[#e63946] hover:bg-[#c82333] text-white border-none flex items-center justify-center gap-1.5 rounded-xl shadow-sm cursor-pointer font-extrabold text-xs"
          >
            {isProcessing ? (
              <span className="loading loading-spinner loading-xs text-white"></span>
            ) : (
              <>
                <IconRefresh className="w-4 h-4 animate-spin-slow" />
                Convert Video Format
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
