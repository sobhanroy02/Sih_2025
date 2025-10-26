"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useNotificationsStore } from "@/store";

const NAV_ITEMS = [
  { href: "/overview", label: "Overview" },
  { href: "/overview/issue-management", label: "Issue Management" },
  { href: "/overview/departments", label: "Departments" },
  { href: "/overview/workers", label: "Workers" },
  { href: "/overview/analytics", label: "Analytics" },
  { href: "/overview/notifications", label: "Notifications" },
];

type NotifType = "info" | "success" | "warning" | "error";

export default function Page() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationsStore();

  // Filters
  const [type, setType] = useState<"" | NotifType>("");
  const [read, setRead] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...notifications];
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (type) list = list.filter((n) => n.type === type);
    if (read === "unread") list = list.filter((n) => !n.read);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q));
    }
    return list;
  }, [notifications, type, read, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { info: 0, success: 0, warning: 0, error: 0 };
    for (const n of notifications) map[n.type] = (map[n.type] || 0) + 1;
    return map;
  }, [notifications]);

  function badge(type: NotifType) {
    switch (type) {
      case "success": return "bg-emerald-100 text-emerald-800 ring-emerald-200";
      case "warning": return "bg-amber-100 text-amber-800 ring-amber-200";
      case "error": return "bg-rose-100 text-rose-800 ring-rose-200";
      default: return "bg-sky-100 text-sky-800 ring-sky-200";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800/40 bg-[#010B11] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1">
            <Image src="/icons/logo.png" alt="CitiZen" width={32} height={32} className="h-8 w-8 object-contain" />
            <div className="leading-tight">
              <div className="font-heading text-lg font-semibold tracking-tight">CitiZen</div>
              <div className="text-[11px] text-slate-300">Admin panel</div>
            </div>
          </div>
          <div className="hidden gap-4 md:flex">
            {NAV_ITEMS.map((n) => (
              <Link key={n.href} href={n.href} className={`text-sm font-medium px-3 py-1.5 rounded-md transition hover:bg-white/10 ${n.href === "/overview/notifications" ? "bg-white/10" : ""}`}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Header strip */}
      <section className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-semibold text-slate-900">Notifications</h1>
              <p className="mt-1 text-sm text-slate-600">Keep track of important updates</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs ring-1 ring-slate-200">Unread: <b>{unreadCount}</b></span>
              <button onClick={() => markAllAsRead()} className="inline-flex items-center rounded-lg border border-emerald-300 bg-gradient-to-r from-white to-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:from-emerald-50 hover:to-white hover:shadow-md active:scale-[0.98]">Mark all as read</button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Filter bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Type</label>
              <select value={type} onChange={(e)=>setType(e.target.value as any)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                <option value="">All</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Read</label>
              <select value={read} onChange={(e)=>setRead(e.target.value as any)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                <option value="all">All</option>
                <option value="unread">Unread</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Search</label>
              <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search in title or message" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
            </div>
            <div className="flex items-end">
              <div className="grid w-full grid-cols-4 gap-2 text-[11px]">
                <span className="rounded-lg bg-sky-50 px-2 py-1 text-center ring-1 ring-sky-200">Info {counts.info}</span>
                <span className="rounded-lg bg-emerald-50 px-2 py-1 text-center ring-1 ring-emerald-200">Success {counts.success}</span>
                <span className="rounded-lg bg-amber-50 px-2 py-1 text-center ring-1 ring-amber-200">Warn {counts.warning}</span>
                <span className="rounded-lg bg-rose-50 px-2 py-1 text-center ring-1 ring-rose-200">Error {counts.error}</span>
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-6 space-y-3">
          {filtered.map((n) => (
            <article key={n.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 inline-flex h-7 shrink-0 items-center justify-center rounded-md px-2 text-[11px] font-semibold ring-1 ${badge(n.type)}`}>
                  {n.type.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900">{n.title}</h3>
                    <time className="shrink-0 text-[11px] text-slate-500" dateTime={String(n.createdAt)}>{new Date(n.createdAt).toLocaleString()}</time>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-700">{n.message}</p>
                  {n.actionUrl && (
                    <div className="mt-2">
                      <a href={n.actionUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-emerald-700 underline-offset-2 hover:underline">Open link</a>
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {!n.read && <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" title="Unread" />}
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)} className="rounded-lg border border-emerald-300 bg-gradient-to-r from-white to-emerald-50 px-2.5 py-1.5 text-[11px] font-medium text-emerald-700 shadow-sm transition hover:from-emerald-50 hover:to-white hover:shadow-md active:scale-[0.98]">Mark read</button>
                    )}
                    <button onClick={() => removeNotification(n.id)} className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]">Remove</button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-slate-600">No notifications match your filters.</p>
              <p className="text-xs text-slate-500">Try clearing search or switching type to "All".</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
