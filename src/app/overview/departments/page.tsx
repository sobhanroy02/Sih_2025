"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useIssuesStore } from "@/store";

type Dept = "Roads" | "Lighting" | "Sanitation" | "Water" | "Parks" | "General";

const NAV_ITEMS = [
  { href: "/overview", label: "Overview" },
  { href: "/overview/issue-management", label: "Issue Management" },
  { href: "/overview/departments", label: "Departments" },
  { href: "/overview/workers", label: "Workers" },
  { href: "/overview/analytics", label: "Analytics" },
  { href: "/overview/notifications", label: "Notifications" },
];

function mapCategoryToDept(cat: string): Dept {
  switch (cat) {
    case "pothole":
    case "road":
      return "Roads";
    case "streetlight":
      return "Lighting";
    case "garbage":
      return "Sanitation";
    case "water":
      return "Water";
    case "graffiti":
      return "Parks";
    default:
      return "General";
  }
}

const MANAGERS: Record<Dept, { name: string; email: string }> = {
  Roads: { name: "Arindam Saha", email: "arindam.saha@municipality.gov" },
  Lighting: { name: "Priya Banerjee", email: "priya.banerjee@municipality.gov" },
  Sanitation: { name: "Rahul Ghosh", email: "rahul.ghosh@municipality.gov" },
  Water: { name: "Mita Chatterjee", email: "mita.chatterjee@municipality.gov" },
  Parks: { name: "Sourav Mitra", email: "sourav.mitra@municipality.gov" },
  General: { name: "Admin Desk", email: "admin@municipality.gov" },
};

function formatDuration(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return "-";
  const days = Math.floor(ms / (24 * 3600_000));
  const hours = Math.floor((ms % (24 * 3600_000)) / 3600_000);
  if (days <= 0 && hours <= 0) return "<1h";
  return `${days}d ${hours}h`;
}

export default function Page() {
  const issues = useIssuesStore((s) => s.issues);

  const { kpis, rows } = useMemo(() => {
    const SLA_MS = 48 * 3600_000; // 48h target
    const departments: Dept[] = ["Roads", "Lighting", "Sanitation", "Water", "Parks", "General"];

    const byDept = new Map<Dept, any>();
    for (const d of departments) byDept.set(d, { name: d, open: 0, inProgress: 0, resolved: 0, total: 0, resolvedWithinSLA: 0, avgMs: 0, resolvedDurations: [] as number[] });

    for (const i of issues) {
      const d = mapCategoryToDept(i.category);
      const rec = byDept.get(d)!;
      rec.total += 1;
      if (i.status === "open") rec.open += 1;
      else if (i.status === "in-progress") rec.inProgress += 1;
      else if (i.status === "resolved" || i.status === "closed") rec.resolved += 1;
      if (i.status === "resolved" || i.status === "closed") {
        const ms = new Date(i.updatedAt).getTime() - new Date(i.reportedAt).getTime();
        if (ms > 0) rec.resolvedDurations.push(ms);
        if (ms > 0 && ms <= SLA_MS) rec.resolvedWithinSLA += 1;
      }
    }

    const rows = Array.from(byDept.values()).map((r: any) => {
      const avgMs = r.resolvedDurations.length ? r.resolvedDurations.reduce((a: number, b: number) => a + b, 0) / r.resolvedDurations.length : 0;
      const slaPct = r.resolved > 0 ? Math.round((r.resolvedWithinSLA / r.resolved) * 100) : 0;
      return { ...r, avgMs, slaPct } as { name: Dept; open: number; inProgress: number; resolved: number; total: number; avgMs: number; slaPct: number };
    });

    const openTotal = rows.reduce((a, r) => a + r.open, 0);
    const inProgTotal = rows.reduce((a, r) => a + r.inProgress, 0);
    const resolvedTotal = rows.reduce((a, r) => a + r.resolved, 0);
    const allResolved = rows.reduce((a, r) => a + r.resolved, 0) || 0;
    const allWithin = rows.reduce((a, r) => a + Math.round((r.slaPct / 100) * r.resolved), 0);
    const slaOverall = allResolved > 0 ? Math.round((allWithin / allResolved) * 100) : 0;

    return {
      kpis: { openTotal, inProgTotal, resolvedTotal, slaOverall },
      rows,
    };
  }, [issues]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar (same as Overview) */}
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
              <Link key={n.href} href={n.href} className={`text-sm font-medium px-3 py-1.5 rounded-md transition hover:bg-white/10 ${n.href === "/overview/departments" ? "bg-white/10" : ""}`}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Section header strip */}
      <section className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-semibold text-slate-900">Departments</h1>
              <p className="mt-1 text-sm text-slate-600">Monitor department performance and workloads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* KPI mini-cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Open */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-amber-300/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-400/10 to-transparent" />
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-amber-400/10 blur-2xl" />
            <div className="relative">
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Open</div>
              <div className="mt-1 text-3xl font-semibold text-slate-900">{kpis.openTotal}</div>
            </div>
          </div>
          {/* In Progress */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sky-300/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/10 via-blue-400/10 to-transparent" />
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-sky-400/10 blur-2xl" />
            <div className="relative">
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">In Progress</div>
              <div className="mt-1 text-3xl font-semibold text-slate-900">{kpis.inProgTotal}</div>
            </div>
          </div>
          {/* Resolved */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-emerald-300/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-400/10 to-transparent" />
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-400/10 blur-2xl" />
            <div className="relative">
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Resolved</div>
              <div className="mt-1 text-3xl font-semibold text-slate-900">{kpis.resolvedTotal}</div>
            </div>
          </div>
          {/* SLA Compliance */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-violet-300/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-400/10 to-transparent" />
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-violet-400/10 blur-2xl" />
            <div className="relative">
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">SLA Compliance</div>
              <div className="mt-1 flex items-baseline gap-2 text-3xl font-semibold text-slate-900">
                {kpis.slaOverall}<span className="text-base font-medium text-slate-600">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Departments table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Manager</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">In Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Resolved</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">SLA</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Avg. Resolve Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((r) => {
                  const mgr = MANAGERS[r.name];
                  const slaBadge = r.slaPct >= 80 ? "bg-emerald-100 text-emerald-800 ring-emerald-200" : r.slaPct >= 50 ? "bg-amber-100 text-amber-800 ring-amber-200" : "bg-rose-100 text-rose-800 ring-rose-200";
                  return (
                    <tr key={r.name} className="group hover:bg-slate-50/70">
                      <td className="relative px-4 py-3 align-top border-l-2 border-transparent group-hover:border-emerald-400">
                        <div className="text-sm font-medium text-slate-900">{r.name}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{r.total} total issues</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="text-sm text-slate-800">{mgr?.name}</div>
                        <div className="text-xs text-slate-500">{mgr?.email}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-800">{r.inProgress}</td>
                      <td className="px-4 py-3 align-top text-sm text-slate-800">{r.resolved}</td>
                      <td className="px-4 py-3 align-top">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${slaBadge}`}>{r.slaPct}%</span>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-800">{formatDuration(r.avgMs)}</td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/overview/issue-management?dept=${encodeURIComponent(r.name)}`} className="inline-flex items-center rounded-lg border border-emerald-300 bg-gradient-to-r from-white to-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:from-emerald-50 hover:to-white hover:shadow-md active:scale-[0.98]">View issues</Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optional: workload snapshot */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Backlog by Department</h3>
          <div className="mt-4 space-y-3">
            {rows.map((r) => {
              const backlog = r.open + r.inProgress;
              const max = Math.max(1, ...rows.map((x) => x.open + x.inProgress));
              const pct = Math.max(6, Math.round((backlog / max) * 100));
              return (
                <div key={r.name} className="flex items-center gap-3">
                  <div className="w-28 shrink-0 text-xs font-medium text-slate-600">{r.name}</div>
                  <div className="relative h-8 w-full overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                    <div className="h-full bg-gradient-to-r from-amber-300 via-yellow-300 to-sky-400 transition-all" style={{ width: `${pct}%` }} />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[11px] font-semibold text-slate-700">
                      <span className="opacity-70">{backlog} open/in-progress</span>
                      <span className="opacity-50">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
