"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import React from "react";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8">
      {/* Decorative subtle gradient or pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,197,94,0.08),transparent_60%)]" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center animate-fade-in">
        {/* Logo (box removed, enlarged image) */}
        <img
          src="/icons/logo.png"
          alt="CitiZen Logo"
          className="mb-10 h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 animate-float will-change-transform motion-reduce:animate-none object-contain select-none drop-shadow-lg"
          draggable={false}
        />

        {/* Heading */}
        <h1 className="bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl font-heading drop-shadow-sm">
          Welcome to CitiZen
        </h1>

        {/* Tagline */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-600">
          A simple, transparent way to report civic issues and see real progress in your community.
        </p>

        {/* Get Started Button */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center rounded-full bg-green-600 px-10 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-green-500 hover:shadow-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600" />
          </Link>
          <p className="text-sm text-gray-500">
            New here? <span className="font-medium text-gray-700">You can create an account from the sign-in page.</span>
          </p>
        </div>

        {/* Feature boxes */}
        <div className="mt-16 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              title: "Report",
              desc: "Capture issues instantly with photos & precise location.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5.25h4.5L9 3h6l1.5 2.25H21v14.25H3V5.25Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9.75a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
                  />
                </svg>
              ),
            },
            {
              title: "Track",
              desc: "Stay informed with real-time status & updates.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l3.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              ),
            },
            {
              title: "Resolve",
              desc: "See accountability and verified resolutions.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              ),
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 will-change-transform hover:shadow-lg hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-sm"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-md ring-1 ring-black/5">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 font-heading">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {f.desc}
              </p>
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-2 ring-emerald-400 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Small gradient glow bottom */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-t-full bg-gradient-to-t from-emerald-200/40 via-blue-200/20 to-transparent blur-2xl" />

      {/* Simple CSS keyframes defined inline via Tailwind's arbitrary values if not already existing */}
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.9s ease-out both; }
        /* Default (desktop) float */
        .animate-float { animation: float 5s ease-in-out infinite; }
        /* Reduce vertical travel on small screens */
        @media (max-width: 640px) { .animate-float { animation: floatMobile 5s ease-in-out infinite; } }
        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in { animation: fadeInReduced 0.01s linear both; }
          .animate-float { animation: none; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes fadeInReduced { from { opacity: 0;} to { opacity: 1;} }
        @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        @keyframes floatMobile { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-4px);} }
      `}</style>
    </main>
  );
}
