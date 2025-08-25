import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Compass } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Gradient blobs (theme-style) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative  flex items-center justify-center px-6 py-24">
        <div className="">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-10 md:p-14 text-center">
            {/* 404 big badge */}
            <div className="inline-flex items-center justify-center mx-auto mb-6 rounded-2xl px-6 py-3 border border-white/30 bg-white/60 backdrop-blur">
              <Compass className="w-5 h-5 mr-2 text-blue-700" />
              <span className="text-sm font-semibold text-gray-600">
                Page Not Found
              </span>
            </div>

            <h1 className="text-7xl md:text-8xl font-extrabold leading-none mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent select-none">
              404
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              Oops! The page you’re looking for doesn’t exist, has moved, or is
              temporarily unavailable.
            </p>

            {/* Divider */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 bg-white/70 hover:bg-white transition-all"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 transition-all transform hover:-translate-y-0.5"
                aria-label="Go to home page"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-40 group-hover:opacity-60 transition-opacity" />
                <span className="relative inline-flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Go Home
                </span>
              </button>
            </div>
          </div>

          {/* Tiny helper text */}
          <p className="text-center text-xs text-gray-500 mt-4">
            If you think this is a mistake, contact support or try again later.
          </p>
        </div>
      </div>
    </section>
  );
}
