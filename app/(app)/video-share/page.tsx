"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface Video {
  id: string;
  title: string;
  description?: string;
  publicId: string;
  originalSize: string;
  compressedSize: string;
  duration: number;
  createdAt: string;
}

export default function VideoShare() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB Limit

  // Fetch all videos from the API
  const fetchVideos = useCallback(async () => {
    setIsLoadingVideos(true);
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoadingVideos(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        // Pre-fill title with file name without extension
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(cleanName);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 70MB workspace compression limit.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      // Setup progress tracking
      const response = await axios.post("/api/video-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 50;
          setUploadProgress(percent);
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Clear Form
        setFile(null);
        setTitle("");
        setDescription("");
        setUploadProgress(0);
        // Refresh videos gallery
        fetchVideos();
      } else {
        alert("Upload completed but returned an unexpected status.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred while uploading and compressing the video.");
    } finally {
      setIsUploading(false);
    }
  };

  // Utility helpers for formatting video details
  const formatSize = (bytesStr: string) => {
    const bytes = parseFloat(bytesStr);
    if (isNaN(bytes)) return "0.00 MB";
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const calculateSavings = (original: string, compressed: string) => {
    const orig = parseFloat(original);
    const comp = parseFloat(compressed);
    if (isNaN(orig) || isNaN(comp) || orig === 0) return 0;
    const ratio = ((orig - comp) / orig) * 100;
    return Math.max(0, Math.round(ratio));
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Video Compressor & Library
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl">
          Upload video files, compress them using optimized formatting, and organize your files instantly.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Upload Form - Left Pane (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <div className="card bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Workspace Compressor
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Drop Area */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400">Select Video File</span>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors bg-slate-950/20">
                  <svg
                    className="w-6 h-6 text-slate-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-slate-300 text-center truncate max-w-[200px]">
                    {file ? file.name : "Browse .mp4, .mov"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Max file size: 70MB</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Title Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-400">Video Title</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered input-md rounded-xl bg-slate-950/40 border-slate-800 text-slate-100 text-sm focus:border-purple-500 focus:outline-none"
                  required
                  disabled={isUploading}
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-400">Description (Optional)</label>
                <textarea
                  placeholder="Enter brief description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered rounded-xl bg-slate-950/40 border-slate-800 text-slate-100 text-sm focus:border-purple-500 focus:outline-none h-20"
                  disabled={isUploading}
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-purple-400">Compressing & Uploading</span>
                    <span className="text-slate-300">{uploadProgress}%</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full bg-slate-800"
                    value={uploadProgress}
                    max="100"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none text-white shadow-lg shadow-purple-600/20 rounded-xl py-3 mt-4"
                disabled={isUploading || !file}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-xs"></span>
                    Compressing...
                  </span>
                ) : (
                  "Compress & Upload"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Library / Gallery - Right Pane (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Asset Library
            </h2>
            <button
              onClick={fetchVideos}
              className="btn btn-ghost btn-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              disabled={isLoadingVideos}
            >
              <svg
                className={`w-3.5 h-3.5 ${isLoadingVideos ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15.22L21.2 16"
                />
              </svg>
              Sync Library
            </button>
          </div>

          {isLoadingVideos && videos.length === 0 ? (
            /* Loading Grid Skeletons */
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="card bg-slate-900/20 border border-slate-800/40 p-5 rounded-2xl space-y-4">
                  <div className="skeleton h-44 w-full rounded-xl bg-slate-800/40"></div>
                  <div className="skeleton h-5 w-3/4 bg-slate-800/40"></div>
                  <div className="skeleton h-4 w-1/2 bg-slate-800/40"></div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            /* Empty State */
            <div className="card bg-slate-900/10 border border-slate-800/50 p-12 text-center rounded-2xl">
              <div className="flex flex-col items-center gap-4 text-slate-500">
                <svg
                  className="w-12 h-12 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-400">No compressed assets in library</p>
                  <p className="text-xs text-slate-500">Upload a video file to begin compression matching.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Video Gallery Grid */
            <div className="grid gap-6 md:grid-cols-2">
              {videos.map((video) => {
                const savings = calculateSavings(video.originalSize, video.compressedSize);
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh";
                const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${video.publicId}.mp4`;

                return (
                  <div
                    key={video.id}
                    className="card bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 shadow-xl"
                  >
                    {/* HTML5 Video Player Frame */}
                    <div className="aspect-video bg-black relative border-b border-slate-800">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-contain"
                        preload="metadata"
                      />
                      {/* Floating Duration Badge */}
                      <span className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 tracking-wider">
                        {formatDuration(video.duration)}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight truncate">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        )}
                      </div>

                      {/* Video Compression Badge Matrix */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Original</span>
                          <span className="font-mono text-slate-300">{formatSize(video.originalSize)}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Compressed</span>
                          <span className="font-mono text-purple-400 font-bold">{formatSize(video.compressedSize)}</span>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="flex items-center justify-between pt-2">
                        {savings > 0 && (
                          <span className="badge badge-success bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Saved {savings}% Space
                          </span>
                        )}
                        <a
                          href={videoUrl}
                          download={`${video.title.replace(/\s+/g, "_").toLowerCase()}.mp4`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost btn-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 ml-auto"
                        >
                          Download MP4
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
