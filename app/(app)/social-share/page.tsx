"use client";

import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1", label: "Instagram Square", desc: "Perfect for feed posts" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5", label: "Instagram Portrait", desc: "Ideal for taller feed posts" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9", label: "Twitter Post", desc: "Standard feed image layout" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1", label: "Twitter Header", desc: "Profile header banner" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78", label: "Facebook Cover", desc: "Page header layout" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
      // Simulate transformation delay
      const timer = setTimeout(() => {
        setIsTransforming(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedFormat, uploadedImage]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      if (data.publicId) {
        setUploadedImage(data.publicId);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!uploadedImage) return;
    const format = socialFormats[selectedFormat];
    
    // Build direct Cloudinary URL with secure transformations
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh";
    const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_auto,w_${format.width},h_${format.height}/${uploadedImage}`;

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
        alert("Failed to download image. Please try again.");
      });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Social Share Studio
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl">
          Upload any high-res image and automatically format it to match optimal dimensions for social media platforms.
        </p>
      </div>

      {!uploadedImage ? (
        /* Upload Panel */
        <div className="max-w-2xl mx-auto">
          <div className="card bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center hover:border-purple-500/35 transition-colors duration-300">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                {isUploading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  {isUploading ? "Uploading Asset..." : "Upload Studio Image"}
                </h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  Drag and drop your image file here, or click the button below to browse your workspace files.
                </p>
              </div>

              <label className="btn btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 border-none text-white hover:from-purple-700 hover:to-indigo-700 rounded-xl px-6 py-3 cursor-pointer shadow-lg shadow-purple-600/25 mt-4">
                <span>Browse Files</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Workspace Editor Layout */
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Controls - Left Pane */}
          <div className="lg:col-span-4 space-y-6">
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Presets & Cropping
              </h2>

              <div className="space-y-3">
                {Object.keys(socialFormats).map((key) => {
                  const format = socialFormats[key as SocialFormat];
                  const isSelected = selectedFormat === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedFormat(key as SocialFormat)}
                      className={`w-full flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-300 ${
                        isSelected
                          ? "bg-purple-600/10 border-purple-500 text-purple-300 shadow-inner"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-sm text-slate-200">{format.label}</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-400">
                          {format.aspectRatio}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 leading-normal">{format.desc}</span>
                      <span className="text-[10px] text-slate-600 font-mono mt-1">
                        Resolution: {format.width}x{format.height}px
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  className="btn btn-primary w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none text-white shadow-lg shadow-purple-600/20 rounded-xl py-3 font-semibold"
                >
                  Download Optimized Asset
                </button>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="btn btn-outline w-full border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl py-3"
                >
                  Upload New Image
                </button>
              </div>
            </div>
          </div>

          {/* Visualizer Preview - Right Pane */}
          <div className="lg:col-span-8">
            <div className="card bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px]">
              {isTransforming ? (
                /* Glowing Transformation Loader */
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-t-purple-500 border-purple-500/10 animate-spin"></div>
                  <div className="space-y-1">
                    <p className="font-bold text-white">Applying Dynamic Crop...</p>
                    <p className="text-xs text-slate-500">Cloudinary AI-assisted content framing active</p>
                  </div>
                </div>
              ) : (
                /* Dynamic Preview Card */
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 shadow-inner flex items-center justify-center max-w-full overflow-hidden">
                    <div
                      className="relative border border-slate-800 shadow-2xl rounded-xl overflow-hidden bg-slate-900"
                      style={{
                        aspectRatio: socialFormats[selectedFormat].aspectRatio.replace(":", "/"),
                        maxHeight: "450px",
                        maxWidth: "100%",
                      }}
                    >
                      <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="(max-width: 768px) 100vw, 800px"
                        crop="fill"
                        gravity="auto"
                        alt="Transformed Social Media Asset"
                        className="object-cover rounded-xl transition-all duration-500"
                      />
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Transformation Studio Preview</span>
                    <p className="text-xs text-slate-400">
                      Asset cropped intelligently using gravity detection. Ready for download.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
