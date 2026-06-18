"use client";

import React, { useState } from "react";
import { IconExchange, IconSettings, IconAlertTriangle, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import VideoUploader from "./components/VideoUploader";
import VideoFormatSelector from "./components/VideoFormatSelector";
import VideoPreview from "./components/VideoPreview";
import { toast } from "@/app/store/Toast";

interface UploadedFile {
  publicId: string;
  url: string;
  name: string;
  size: number;
  format: string;
}

export default function VideoConvertPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>("mp4");
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Advanced Configurations State for Video
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [videoCodec, setVideoCodec] = useState("h264");
  const [audioCodec, setAudioCodec] = useState("aac");
  const [fps, setFps] = useState("30");
  const [videoBitrate, setVideoBitrate] = useState("2m");
  const [quality, setQuality] = useState("auto");
  const [stripMetadata, setStripMetadata] = useState(false);

  const handleUploadSuccess = (file: UploadedFile) => {
    setUploadedFile(file);
    setConvertedUrl(null);
    setErrorMsg(null);

    const srcFmt = file.format.toLowerCase();
    if (srcFmt === "mp4") {
      setTargetFormat("webm");
    } else {
      setTargetFormat("mp4");
    }
  };

  const handleClear = () => {
    setUploadedFile(null);
    setConvertedUrl(null);
    setTargetFormat("mp4");
    setErrorMsg(null);
    setVideoCodec("h264");
    setAudioCodec("aac");
    setFps("30");
    setVideoBitrate("2m");
    setQuality("auto");
    setStripMetadata(false);
  };

  const handleConvert = async () => {
    if (!uploadedFile) return;

    setIsConverting(true);
    setConvertedUrl(null);
    setErrorMsg(null);
    toast("Converting video format...", "info");

    try {
      const response = await fetch(`/api/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId: uploadedFile.publicId,
          sourceType: "video",
          targetFormat: targetFormat,
          videoCodec: videoCodec,
          audioCodec: audioCodec,
          fps: fps,
          videoBitrate: videoBitrate,
          quality: quality,
          stripMetadata: stripMetadata,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setConvertedUrl(data.transformedUrl);
        toast(`Video converted successfully to ${targetFormat.toUpperCase()}!`, "success");
      } else {
        throw new Error(data.error || "Video conversion failed");
      }
    } catch (err: any) {
      console.error("Video conversion error:", err);
      const msg = err.message || "Failed to convert video format.";
      setErrorMsg(msg);
      toast(msg, "error");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div data-theme="light" className="bg-[#f8f9fa] text-[#4b5563] min-h-screen p-6 space-y-6 pb-10 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-white border border-[#e5e7eb] p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between gap-6 shadow-xs">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#e63946] uppercase bg-[#e63946]/10 px-2.5 py-1 rounded-lg border border-[#e63946]/20">
            <IconExchange className="w-3.5 h-3.5" />
            Video Conversion Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827]">
            Video Format Converter Studio
          </h1>
          <p className="text-xs md:text-sm text-[#4b5563] max-w-2xl leading-relaxed font-semibold">
            Convert video files instantly using Cloudinary's high-speed video transcoding.
            Upload your source file, choose the target format, adjust configurations, and download the result.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Controls Panel */}
        <div className="lg:col-span-5 bg-white border border-[#e5e7eb] rounded-2xl p-5 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#e5e7eb]">
            <IconSettings className="w-5 h-5 text-[#e63946]" />
            <h2 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Video Configuration
            </h2>
          </div>

          {/* Section 1: Upload Source */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider block">
              Source Video Asset
            </label>
            <VideoUploader
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              uploadedFile={uploadedFile}
              onUploadSuccess={handleUploadSuccess}
              onClear={handleClear}
            />
          </div>

          {/* Section 2: Format Selector (shown only after upload) */}
          {uploadedFile && (
            <div className="pt-4 border-t border-[#e5e7eb] animate-fade-in space-y-4">
              <VideoFormatSelector
                sourceFormat={uploadedFile.format}
                selectedFormat={targetFormat}
                onSelectFormat={setTargetFormat}
              />

              {/* Advanced Settings Collapsible */}
              <div className="border border-[#e5e7eb] rounded-xl bg-[#f8f9fa] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-[#4b5563] hover:bg-[#e5e7eb]/45 cursor-pointer select-none transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <IconSettings className="w-4 h-4 text-[#e63946]" />
                    Advanced Settings (Optional)
                  </span>
                  {showAdvanced ? <IconChevronUp className="w-4 h-4 text-[#4b5563]" /> : <IconChevronDown className="w-4 h-4 text-[#4b5563]" />}
                </button>

                {showAdvanced && (
                  <div className="p-4 border-t border-[#e5e7eb] space-y-4 bg-white text-xs animate-fade-in">
                    
                    {/* Video Codec & Audio Codec */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider block">
                          Video Codec
                        </label>
                        <select
                          value={videoCodec}
                          onChange={(e) => setVideoCodec(e.target.value)}
                          className="select select-bordered select-sm w-full bg-white border-[#e5e7eb] focus:border-[#e63946] focus:ring-[#e63946] rounded-lg text-xs text-[#111827] font-semibold"
                        >
                          <option value="h264">H.264 (Default)</option>
                          <option value="h265">H.265 (HEVC)</option>
                          <option value="vp9">VP9 (WebM)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider block">
                          Audio Codec
                        </label>
                        <select
                          value={audioCodec}
                          onChange={(e) => setAudioCodec(e.target.value)}
                          className="select select-bordered select-sm w-full bg-white border-[#e5e7eb] focus:border-[#e63946] focus:ring-[#e63946] rounded-lg text-xs text-[#111827] font-semibold"
                        >
                          <option value="aac">AAC (Standard)</option>
                          <option value="mp3">MP3</option>
                        </select>
                      </div>
                    </div>

                    {/* Frame Rate & Video Bitrate */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider block">
                          Frame Rate (FPS)
                        </label>
                        <select
                          value={fps}
                          onChange={(e) => setFps(e.target.value)}
                          className="select select-bordered select-sm w-full bg-white border-[#e5e7eb] focus:border-[#e63946] focus:ring-[#e63946] rounded-lg text-xs text-[#111827] font-semibold"
                        >
                          <option value="24">24 FPS (Cinema)</option>
                          <option value="30">30 FPS (Standard)</option>
                          <option value="60">60 FPS (Smooth)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider block">
                          Video Bitrate
                        </label>
                        <select
                          value={videoBitrate}
                          onChange={(e) => setVideoBitrate(e.target.value)}
                          className="select select-bordered select-sm w-full bg-white border-[#e5e7eb] focus:border-[#e63946] focus:ring-[#e63946] rounded-lg text-xs text-[#111827] font-semibold"
                        >
                          <option value="1m">1 Mbps (Medium)</option>
                          <option value="2m">2 Mbps (High)</option>
                          <option value="5m">5 Mbps (Max)</option>
                        </select>
                      </div>
                    </div>

                    {/* Video Quality & Strip Metadata */}
                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider block">
                          Quality (CRF)
                        </label>
                        <select
                          value={quality}
                          onChange={(e) => setQuality(e.target.value)}
                          className="select select-bordered select-sm w-full bg-white border-[#e5e7eb] focus:border-[#e63946] focus:ring-[#e63946] rounded-lg text-xs text-[#111827] font-semibold"
                        >
                          <option value="auto">Auto (Adaptive)</option>
                          <option value="80">80 (High)</option>
                          <option value="60">60 (Eco)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1 pt-3">
                        <label className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider block select-none">
                          Metadata options
                        </label>
                        <label className="label cursor-pointer p-0 justify-start gap-3">
                          <input
                            type="checkbox"
                            checked={stripMetadata}
                            onChange={(e) => setStripMetadata(e.target.checked)}
                            className="checkbox checkbox-error checkbox-sm rounded [--chkbg:#e63946] [--chkfg:white]"
                          />
                          <span className="label-text text-[10px] font-bold text-[#4b5563] select-none">Strip Video Metadata</span>
                        </label>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 3: Error Notification */}
          {errorMsg && (
            <div className="alert alert-error text-xs rounded-xl flex items-start gap-2 py-3 px-4 shadow-sm text-error-content bg-error/15 border border-error/20">
              <IconAlertTriangle className="w-4 h-4 shrink-0 text-error mt-0.5" />
              <div className="leading-normal">
                <span className="font-bold">Conversion Error:</span> {errorMsg}
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Visualizer */}
        <div className="lg:col-span-7">
          <VideoPreview
            uploadedFile={uploadedFile}
            convertedUrl={convertedUrl}
            targetFormat={targetFormat}
            isProcessing={isConverting}
            onConvert={handleConvert}
          />
        </div>
      </div>
    </div>
  );
}
