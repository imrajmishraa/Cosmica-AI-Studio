import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse">
            <span className="font-extrabold text-xl text-white">C</span>
          </div>
          <div>
            <span className="font-bold text-xl tracking-wide bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Cosmica
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-slate-400 hover:text-white font-medium text-sm transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="btn btn-primary btn-sm bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none text-white shadow-lg shadow-purple-600/30 rounded-xl px-4 py-2"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center relative z-10">
        <div className="badge badge-lg bg-purple-950/40 text-purple-400 border border-purple-800/50 backdrop-blur-md px-4 py-2 mb-6 rounded-full font-medium tracking-wide">
          🚀 Next-Gen Digital Asset Hub
        </div>

        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight bg-linear-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent">
          Productivity That Moves <br />
          <span className="bg-linear-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
            Your Creative Workflows
          </span>
        </h1>

        <p className="max-w-2xl mt-6 text-lg text-slate-400 font-normal leading-relaxed">
          Manage, transform, and compress digital media seamlessly from one
          centralized workspace. Perfect for creators, developers, and
          high-performance teams.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link
            href="/home"
            className="btn btn-primary btn-lg bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none text-white shadow-xl shadow-purple-600/30 rounded-xl"
          >
            Enter App Workspace
          </Link>
          <Link
            href="/sign-up"
            className="btn btn-outline btn-lg border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl backdrop-blur-md"
          >
            Create Free Account
          </Link>
        </div>

        {/* Workspace Feature Cards Grid */}
        <section className="w-full mt-24 md:mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              Unified Workspace Capabilities
            </h2>
            <p className="text-slate-400 mt-2">
              Tailored for rapid asset production and sharing
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="card bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-inner">
                <svg
                  className="w-6 h-6"
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
              </div>
              <h3 className="text-xl font-bold text-white">
                Social Share Studio
              </h3>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Upload image assets and automatically crop or transform them on
                the fly using Cloudinary's dynamic optimization engine. Resizes
                instantly into precise layouts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-inner">
                <svg
                  className="w-6 h-6"
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
              </div>
              <h3 className="text-xl font-bold text-white">Video Compressor</h3>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Compress heavy video assets up to 70MB. Leveraging
                high-efficiency codecs to significantly reduce file size while
                keeping visual quality crisp and clear.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 shadow-inner">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">
                Enterprise Security
              </h3>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Secure authentication handled via Clerk integration. Protects
                user uploads and metadata utilizing high-grade server-side
                middlewares and isolated schema adapter endpoints.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-6 h-6 rounded-lg bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
              <span className="font-extrabold text-xs text-white">C</span>
            </div>
            <span className="font-semibold text-slate-300">Cosmica</span>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 Cosmica. Empowered by Cloudinary, Clerk, and Next.js. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
