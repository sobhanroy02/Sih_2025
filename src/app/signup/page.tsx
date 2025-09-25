"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { UserIcon, ShieldCheckIcon, WrenchScrewdriverIcon, EyeIcon, EyeSlashIcon, ClockIcon, BoltIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";

type Role = "citizen" | "admin" | "worker";
type Mode = "signup" | "login";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signup");
  const [role, setRole] = useState<Role>("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm({ mode: "onChange" });

  // Reset fields when mode or role changes
  useEffect(() => { reset(); }, [mode, role, reset]);

  // Prefetch dashboard for snappier post-signup navigation
  useEffect(() => {
    router.prefetch?.('/dashboard');
  }, [router]);

  const onSubmit = async (data: Record<string, unknown>) => {
    console.log("Form submit", mode, role, data);
    // TODO: integrate API; for now, redirect citizen to dashboard on signup
    if (mode === "signup" && role === "citizen") {
      router.replace("/dashboard");
    }
  };

  const roleCards: { id: Role; title: string; desc: string; icon: React.ElementType }[] = [
    { id: "citizen", title: "Citizen", desc: "Report issues and track resolutions in your community", icon: UserIcon },
    { id: "admin", title: "Admin", desc: "Manage issues and coordinate with departments", icon: ShieldCheckIcon },
    { id: "worker", title: "Field Worker", desc: "Receive assignments and update issue status", icon: WrenchScrewdriverIcon },
  ];

  const skillOptions = [
    "Electrical", "Plumbing", "Road Repair", "Waste Collection", "Street Cleaning", "Tree Maintenance", "Traffic Management", "Water Systems", "Lighting", "Parks Maintenance", "Waste Segregation", "Equipment Ops"
  ];

  return (
  <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 animate-[fadeIn_0.6s_ease]">
      {/* Subtle animated orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />

  <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 lg:flex-row lg:items-stretch lg:gap-16 lg:py-20 motion-reduce:animate-none">
        {/* Marketing Side */}
        <section className="flex flex-1 flex-col justify-start lg:justify-center">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
            Join CitiZen Community
          </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Report civic issues, track progress, and help improve your community. Together we can make cities cleaner, safer, and more responsive.
          </p>
          {/* Additional showcase images (Cleanest Cities) */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <figure className="relative h-40 sm:h-44 rounded-xl overflow-hidden ring-1 ring-emerald-200/50 shadow-sm bg-white/60 backdrop-blur-sm group">
              <Image
                src="/cleanest-cities-in-india-1.jpg"
                alt="Clean, green Indian cityscape"
                fill
                sizes="(max-width:640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 scale-105 group-hover:scale-110"
                priority
              />
              <figcaption className="absolute bottom-1 left-1 rounded bg-emerald-700/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">Sustainable Urban Zone</figcaption>
            </figure>
            <figure className="relative h-40 sm:h-44 rounded-xl overflow-hidden ring-1 ring-emerald-200/50 shadow-sm bg-white/60 backdrop-blur-sm group">
              <Image
                src="/cleanest-cities-in-india-2.jpg"
                alt="Modern sustainable Indian city"
                fill
                sizes="(max-width:640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 scale-105 group-hover:scale-110"
              />
              <figcaption className="absolute bottom-1 left-1 rounded bg-emerald-700/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">Eco Infrastructure</figcaption>
            </figure>
          </div>
          {/* City Images */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="group flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white/60 shadow-sm backdrop-blur-sm relative">
                <Image 
                  src="/cleanest-cities-in-india-1.jpg" 
                  alt="Cleanest city in India" 
                  fill 
                  priority
                  placeholder="empty"
                  sizes="(max-width: 640px) 100vw, 50vw" 
                  className="object-cover transition-transform duration-700 scale-105 group-hover:scale-110" 
                />
              </div>
              <div className="group flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white/60 shadow-sm backdrop-blur-sm relative">
                <Image 
                  src="/cleanest-cities-in-india-2.jpg" 
                  alt="Sustainable green Indian city" 
                  fill 
                  placeholder="empty"
                  sizes="(max-width: 640px) 100vw, 50vw" 
                  className="object-cover transition-transform duration-700 scale-105 group-hover:scale-110" 
                />
              </div>
            </div>
          {/* Stats / value props (enhanced) */}
          <div className="mt-12 grid grid-cols-3 gap-5 max-w-md">
            {[
              {
                k: "24/7",
                label: "Reporting",
                icon: ClockIcon,
                grad: "from-emerald-500/90 via-teal-500/80 to-blue-600/90",
                ring: "ring-emerald-400/50",
                glow: "hover:shadow-[0_0_0_3px_rgba(16,185,129,0.35),0_8px_18px_-6px_rgba(16,185,129,0.45)]"
              },
              {
                k: "Fast",
                label: "Response",
                icon: BoltIcon,
                grad: "from-blue-600/90 via-sky-500/80 to-emerald-500/90",
                ring: "ring-blue-400/50",
                glow: "hover:shadow-[0_0_0_3px_rgba(59,130,246,0.35),0_8px_18px_-6px_rgba(56,189,248,0.45)]"
              },
              {
                k: "Better",
                label: "Cities",
                icon: BuildingLibraryIcon,
                grad: "from-emerald-500/90 via-green-500/80 to-lime-500/90",
                ring: "ring-lime-400/50",
                glow: "hover:shadow-[0_0_0_3px_rgba(132,204,22,0.35),0_8px_18px_-6px_rgba(101,163,13,0.45)]"
              }
            ].map(({ k, label, icon: Icon, grad, ring, glow }) => (
              <div
                key={k}
                className={`group relative overflow-hidden rounded-xl p-3.5 text-center ring-1 backdrop-blur-md ${ring} ${glow} transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 feature-card-gradient bg-gradient-to-br ${grad}`}
                tabIndex={0}
                aria-label={`${k} ${label}`}
              >
                {/* soft overlay for contrast */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)] opacity-60 mix-blend-overlay" />
                <div className="relative flex flex-col items-center">
                  <span className="mb-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/30 shadow-inner backdrop-blur-sm text-white group-hover:scale-105 transition">
                    <Icon className="h-5 w-5 drop-shadow" />
                  </span>
                  <p className="text-[13px] font-semibold tracking-wide text-white drop-shadow-sm leading-tight">
                    {k}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-50/90 group-hover:text-white">
                    {label}
                  </p>
                  <span className="mt-2 h-0.5 w-6 rounded-full bg-white/40 group-hover:bg-white/70 transition" />
                </div>
                {/* subtle animated border shimmer */}
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-white/40 transition" />
              </div>
            ))}
          </div>
        </section>

        {/* Auth Rectangle */}
  <section className="shimmer relative flex w-full max-w-xl flex-col rounded-2xl border border-emerald-400/40 bg-emerald-50/20 backdrop-blur-lg lg:w-[48%] transition shadow-[0_4px_20px_-4px_rgba(16,185,129,0.18)] hover:shadow-[0_6px_30px_-4px_rgba(16,185,129,0.28)]">
    {/* Refined overlays: reduced milkiness for sharper text */}
    <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-200/25 via-emerald-100/10 to-emerald-300/20" />
    <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/25 ring-offset-0" />
    {/* Removed strong radial white wash */}
          {/* Mode Switch */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="inline-flex overflow-hidden rounded-full bg-slate-100 p-1 text-sm font-medium">
              {["signup","login"].map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m as Mode)}
                  className={`relative rounded-full px-5 py-2 transition text-slate-600 ${mode===m ? "bg-white shadow-sm text-emerald-600" : "hover:text-slate-900"}`}
                  type="button"
                >
                  {m === "signup" ? "Sign Up" : "Log In"}
                </button>
              ))}
            </div>
            <span className="text-xs font-medium tracking-wide text-slate-500">Secure & Private</span>
          </div>

          <div className="px-6 py-6 overflow-y-auto max-h-[calc(100vh-8rem)] custom-scrollbar">
            {/* Choose Role */}
            <h2 className="text-lg font-semibold font-heading text-blue-900">Choose your role</h2>
            <p className="mt-1 mb-4 text-sm text-slate-800">Select how you'll use CitiZen.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
              {roleCards.map(rc => {
                const ActiveIcon = rc.icon;
                const active = role === rc.id;
                return (
                  <button
                    key={rc.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRole(rc.id)}
                    className={`role-card group relative flex flex-col rounded-xl p-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 ${active ? 'active' : ''}`}
                  >
                    <span className="relative mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 ring-1 ring-white/30 backdrop-blur-sm shadow-inner text-emerald-100 group-hover:scale-105 group-active:scale-95 transition-transform">
                      <ActiveIcon className={`h-5 w-5 drop-shadow-sm ${active ? 'text-white' : 'text-emerald-50/80 group-hover:text-white'}`} />
                      <span className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/5 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </span>
                    <span className={`font-medium text-sm tracking-wide relative z-10 ${active ? 'text-white drop-shadow' : 'text-slate-900 group-hover:text-white'}`}>{rc.title}</span>
                    <span className={`mt-1 text-[11px] leading-snug relative z-10 ${active ? 'text-emerald-50/90' : 'text-slate-600 group-hover:text-emerald-50/90'}`}>{rc.desc}</span>
                    <span className="pointer-events-none absolute bottom-2 left-3 h-0.5 w-6 rounded-full bg-white/30 opacity-0 group-hover:opacity-80 transition-opacity" />
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {mode === "signup" ? (
                <SignupFields 
                  role={role} 
                  register={register} 
                  errors={errors}
                  showPassword={showPassword} 
                  setShowPassword={setShowPassword} 
                  showConfirmPassword={showConfirmPassword} 
                  setShowConfirmPassword={setShowConfirmPassword} 
                  getValues={getValues}
                />
              ) : (
                <LoginFields role={role} register={register} errors={errors} showPassword={showPassword} setShowPassword={setShowPassword} />
              )}

              {mode === "signup" && (
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    {...register("terms", { required: "You must accept the terms" })} 
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" 
                  />
                  <label className="text-xs leading-relaxed text-slate-800">
                    I agree to the <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                  </label>
                </div>
              )}
              {errors.terms && <p className="text-xs font-medium text-red-600">{String(errors.terms.message)}</p>}

              <Button type="submit" size="lg" className="w-full rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 py-5 text-base font-semibold shadow-md shadow-emerald-500/30 transition hover:from-emerald-500 hover:to-blue-500 hover:shadow-lg hover:shadow-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
                {mode === "signup" ? "Create Account" : "Log In"}
              </Button>

              {mode === "login" && (
                <div className="text-center space-y-4">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Or continue with</div>
                  <button type="button" className="inline-flex items-center justify-center gap-3 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-400 hover:shadow hover:text-emerald-600">
                    <svg width="20" height="20" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.128 32.91 28.005 37 22 37c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.059 0 5.863 1.08 8.074 2.877l5.657-5.657C32.676 5.343 27.584 3 22 3 10.402 3 1 12.402 1 24s9.402 21 21 21 21-9.402 21-21c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 17.961 13 22 13c3.059 0 5.863 1.08 8.074 2.877l5.657-5.657C32.676 5.343 27.584 3 22 3 15.055 3 8.88 6.872 6.306 14.691z"/><path fill="#4CAF50" d="M22 45c5.917 0 11.026-2.262 14.787-5.923l-6.808-5.727C28.005 37 22.882 32.91 22 32.91c-5.968 0-10.995-4.047-12.767-9.607l-6.6 5.079C5.127 39.556 12.838 45 22 45z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.091 2.91-6.108 7-13.303 7-.882 0-1.995-.09-3.139-.293l-.01.01 6.808 5.727C28.005 37 33.128 32.91 35.303 28H24"/></svg>
                    Continue with Google
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.35); border-radius: 9999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.55); }
        @keyframes fadeIn { from { opacity:0; transform: translateY(12px);} to { opacity:1; transform: translateY(0);} }
        /* Shimmer border animation */
        @keyframes shimmerSweep { 
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes slowGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.35), 0 4px 14px -4px rgba(16,185,129,0.45); }
          50% { box-shadow: 0 0 0 3px rgba(16,185,129,0.20), 0 6px 20px -4px rgba(16,185,129,0.55); }
        }
        @keyframes cardShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 110% 100%; }
          100% { background-position: 0% 0%; }
        }
        .role-card { 
          position: relative; 
          border: 1px solid rgba(148,163,184,0.35);
          background: linear-gradient(140deg, rgba(255,255,255,0.55), rgba(255,255,255,0.35));
          overflow: hidden;
          transition: border-color .5s, transform .5s, background .6s;
        }
        .role-card:before, .role-card:after {
          content: ""; position: absolute; inset: 0; pointer-events:none; transition: opacity .6s; 
        }
        .role-card:before { background:
          radial-gradient(circle at 15% 20%, rgba(16,185,129,0.35), transparent 60%),
          radial-gradient(circle at 85% 80%, rgba(59,130,246,0.28), transparent 65%);
          opacity:.35; mix-blend-mode: plus-lighter;
        }
        .role-card:after { background: linear-gradient(115deg, rgba(16,185,129,0.25), rgba(59,130,246,0.25), rgba(16,185,129,0.15)); background-size:180% 180%; opacity:0; }
        .role-card:hover { border-color: rgba(16,185,129,0.55); transform: translateY(-4px); }
        .role-card:hover:after { opacity:.9; animation: cardShift 9s ease-in-out infinite; }
        .role-card:active { transform: translateY(-1px) scale(.985); }
        .role-card.active { 
          border-color: rgba(16,185,129,0.8);
          background: linear-gradient(150deg, rgba(16,185,129,0.35), rgba(56,189,248,0.30), rgba(16,185,129,0.30));
          background-size: 180% 180%;
          animation: cardShift 12s linear infinite, pulseGlow 6s ease-in-out infinite;
        }
        .role-card.active:after { opacity:1; mix-blend-mode:overlay; }
        .role-card.active:before { opacity:.55; }
        .role-card:focus-visible { outline:none; border-color: rgba(16,185,129,0.85); }
        @media (prefers-reduced-motion: reduce) { 
          .role-card, .role-card.active { animation:none; }
          .role-card:after { animation:none; }
        }
        .feature-card-gradient { background-size: 180% 180%; animation: slowGradient 14s ease-in-out infinite; }
        .shimmer { position: relative; }
        .shimmer:before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          padding: 1.5px; 
          border-radius: 1rem; 
          background: linear-gradient(120deg,
            rgba(16,185,129,0.0) 0%,
            rgba(16,185,129,0.22) 12%,
            rgba(59,130,246,0.28) 28%,
            rgba(16,185,129,0.0) 45%,
            rgba(16,185,129,0.22) 62%,
            rgba(16,185,129,0.0) 100%
          );
          background-size: 220% 180%;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor; /* Safari */
          animation: shimmerSweep 11s linear infinite;
          pointer-events: none;
          filter: drop-shadow(0 0 4px rgba(16,185,129,0.25));
        }
        /* Subtle ease & slow drift for sophisticated effect */
        .shimmer:hover:before { animation-play-state: paused; filter: drop-shadow(0 0 6px rgba(16,185,129,0.35)); }
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) { .shimmer:before { animation: none; } }
        @media (prefers-reduced-motion: reduce) { .feature-card-gradient { animation: none; } }
      `}</style>
    </div>
  );
}

// --- Component: Signup Fields ---
interface SignupFieldsProps {
  role: Role;
  register: ReturnType<typeof useForm>["register"];
  errors: Record<string, any>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  getValues: ReturnType<typeof useForm>["getValues"];
}

function LabelStar({ text }: { text: string }) {
  return <span>{text} <span className="text-red-500" title="Required">*</span></span>;
}

function FieldError({ name, errors }: { name: string; errors: Record<string, any> }) {
  if (!errors || !errors[name]) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{String(errors[name].message || 'Required')}</p>;
}

function SignupFields({ role, register, errors, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, getValues }: SignupFieldsProps) {
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };
  return (
    <div className="space-y-10">
      {/* Basic Info */}
      <div>
  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-900">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label={<LabelStar text="Full Name" />} placeholder="Your full name" {...register("fullName", { required: "Full name is required" })} />
          <Input label={<LabelStar text="Email Address" />} type="email" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
          <div className="flex flex-col gap-2">
            <Input label={<LabelStar text="Phone Number" />} placeholder="+91" {...register("phone", { required: "Phone number required" })} />
          </div>
          {/* Avatar upload (optional) */}
            <div className="flex flex-col gap-1">
            <label className="mb-1 block text-sm font-medium text-slate-800">Profile Photo <span className="text-xs font-normal text-slate-500">(optional)</span></label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => document.getElementById('avatar-input')?.click()}
                className="relative h-14 w-14 overflow-hidden rounded-full border border-emerald-200 bg-white/70 flex items-center justify-center text-[10px] font-medium text-emerald-500 hover:bg-emerald-100 transition"
              >
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  'Add'
                )}
              </button>
              <input id="avatar-input" hidden type="file" accept="image/*" onChange={onAvatarChange} />
              {avatarPreview && (
                <button type="button" onClick={() => setAvatarPreview(null)} className="text-xs text-red-500 hover:underline">Remove</button>
              )}
            </div>
          </div>
          {role === "admin" && <Input label={<LabelStar text="Admin ID" />} placeholder="Admin ID" {...register("adminId", { required: "Admin ID required" })} />}
          {role === "worker" && <Input label={<LabelStar text="Worker ID" />} placeholder="Worker ID" {...register("workerId", { required: "Worker ID required" })} />}
          {role === "worker" && (
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700"><LabelStar text="Skill Specialization" /></label>
              <select multiple {...(register("skills", { required: "Select at least one skill" }) as any)} className="h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                {["Electrical","Plumbing","Road Repair","Waste Collection","Street Cleaning","Tree Maintenance","Traffic Management","Lighting","Water","Parks"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <p className="mt-1 text-[11px] text-slate-600">Hold Ctrl / Cmd to select multiple skills.</p>
              <FieldError name="skills" errors={errors} />
            </div>
          )}
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldError name="fullName" errors={errors} />
          <FieldError name="email" errors={errors} />
          <FieldError name="phone" errors={errors} />
          {role === "admin" && <FieldError name="adminId" errors={errors} />}
          {role === "worker" && <FieldError name="workerId" errors={errors} />}
        </div>
      </div>

      {/* Location */}
      <div>
  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-900">Location / Department</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Input label={<LabelStar text="Municipality" />} placeholder="Municipality" {...register("municipality", { required: "Municipality required" })} />
          <Input label={<LabelStar text="City" />} placeholder="City" {...register("city", { required: "City required" })} />
          {role !== "admin" && <Input label={<LabelStar text="Ward Number" />} placeholder="Ward" {...register("ward", { required: "Ward required" })} />}
          {role === "admin" && <Input label={<LabelStar text="Department" />} placeholder="Department" {...register("department", { required: "Department required" })} />}
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FieldError name="municipality" errors={errors} />
          <FieldError name="city" errors={errors} />
          {role !== "admin" && <FieldError name="ward" errors={errors} />}
          {role === "admin" && <FieldError name="department" errors={errors} />}
        </div>
      </div>

      {/* Security */}
      <div>
  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-900">Security</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label={<LabelStar text="Set Password" />}
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            {...register("password", { required: "Password required", minLength: { value: 6, message: "Min 6 chars" } })}
            rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}</button>}
          />
          <Input
            label={<LabelStar text="Confirm Password" />}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repeat password"
            {...register("confirmPassword", { required: "Confirm password", validate: (val: any) => val === getValues("password") || "Passwords do not match" })}
            rightIcon={<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}</button>}
          />
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldError name="password" errors={errors} />
          <FieldError name="confirmPassword" errors={errors} />
        </div>
      </div>
    </div>
  );
}

// --- Component: Login Fields ---
interface LoginFieldsProps {
  role: Role;
  register: ReturnType<typeof useForm>["register"];
  errors: Record<string, any>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
}

function LoginFields({ role, register, errors, showPassword, setShowPassword }: LoginFieldsProps) {
  const idLabel = role === "citizen" ? "User ID or Email" : role === "admin" ? "Admin ID or Email" : "Worker ID or Email";
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Credentials</h3>
        <div className="space-y-6">
          <Input label={<LabelStar text={idLabel} />} placeholder="Enter ID or email" {...register("identifier", { required: "Identifier required" })} />
          <Input
            label={<LabelStar text="Password" />}
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            {...register("password", { required: "Password required" })}
            rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}</button>}
          />
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldError name="identifier" errors={errors} />
          <FieldError name="password" errors={errors} />
        </div>
      </div>
    </div>
  );
}