"use client";

import React, { useMemo, useState } from "react";
import { ChartBarIcon, CheckBadgeIcon, ClockIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore, useIssuesStore } from "@/store";

const NAV_ITEMS = [
  { href: "/overview", label: "Overview" },
  { href: "/overview/issue-management", label: "Issue Management" },
  { href: "/overview/departments", label: "Departments" },
  { href: "/overview/workers", label: "Workers" },
  { href: "/overview/analytics", label: "Analytics" },
  { href: "/overview/notifications", label: "Notifications" },
];

function formatDuration(ms: number) {
  const days = Math.floor(ms / (24 * 3600_000));
  const hours = Math.floor((ms % (24 * 3600_000)) / 3600_000);
  if (Number.isNaN(days) || Number.isNaN(hours)) return "-";
  if (days <= 0 && hours <= 0) return "<1h";
  return `${days}d ${hours}h`;
}

export default function OverviewPage() {
  const user = useAuthStore((s) => s.user);
  const issues = useIssuesStore((s) => s.issues);

  // Chart controls
  const [range, setRange] = useState<"7d" | "14d" | "30d" | "custom">("14d");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [useDemo, setUseDemo] = useState<boolean>(true);

  const metrics = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter((i) => i.status === "resolved").length;
    const resolvedIssues = issues.filter((i) => i.status === "resolved");
    const avgMs =
      resolvedIssues.length > 0
        ?
          resolvedIssues.reduce((acc, i) => acc + (new Date(i.updatedAt).getTime() - new Date(i.reportedAt).getTime()), 0) /
          resolvedIssues.length
        : 0;
    const now = Date.now();
    const activeSince = now - 30 * 24 * 3600_000;
    const activeCitizens = new Set(
      issues
        .filter((i) => new Date(i.reportedAt).getTime() >= activeSince)
        .map((i) => i.reportedBy)
    ).size;
    return { total, resolved, avgMs, activeCitizens };
  }, [issues]);

  const timeSeries = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start: Date;
    let end: Date;
    if (range === "custom" && customStart && customEnd) {
      start = new Date(customStart);
      end = new Date(customEnd);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      if (end < start) {
        const t = start; start = end; end = t; // swap if user reversed
      }
    } else {
      const len = range === "7d" ? 7 : range === "30d" ? 30 : 14;
      end = new Date(today);
      start = new Date(today);
      start.setDate(start.getDate() - (len - 1));
    }

    // Build day buckets inclusive of both ends
    const days: Date[] = [];
    const cursor = new Date(start);
    while (cursor.getTime() <= end.getTime()) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    if (days.length === 0) {
      days.push(new Date(today));
    }

    if (useDemo) {
      // Deterministic demo data so it doesn't flicker
      const byDayCreated = days.map((_, i) => Math.max(0, Math.round(8 + 4 * Math.sin(i / 2) + ((i % 3) - 1))));
      const byDayResolved = days.map((_, i) => Math.max(0, byDayCreated[i] - (1 + (i % 2))));
      return { days, byDayCreated, byDayResolved };
    }

    const byDayCreated: number[] = days.map((d) =>
      issues.filter((i) => new Date(i.reportedAt).setHours(0, 0, 0, 0) === d.getTime()).length
    );
    const byDayResolved: number[] = days.map((d) =>
      issues.filter((i) => i.status === "resolved" && new Date(i.updatedAt).setHours(0, 0, 0, 0) === d.getTime()).length
    );
    return { days, byDayCreated, byDayResolved };
  }, [issues, range, customStart, customEnd, useDemo]);

  const deptPie = useMemo(() => {
    const mapCategoryToDept = (cat: string) => {
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
    };
    const counts = new Map<string, number>();
    for (const i of issues) {
      const d = mapCategoryToDept(i.category);
      counts.set(d, (counts.get(d) || 0) + 1);
    }
    const entries = Array.from(counts.entries());
    const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
    return { entries, total };
  }, [issues]);

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
              <Link key={n.href} href={n.href} className={`text-sm font-medium px-3 py-1.5 rounded-md transition hover:bg-white/10 ${n.href === "/overview" ? "bg-white/10" : ""}`}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Admin info bar */}
      <section className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:py-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full ring-1 ring-slate-200 bg-slate-100">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name || "Admin"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">Admin</div>
              )}
            </div>
            <div className="flex flex-1 flex-col sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-semibold text-slate-900">Overview</h1>
                <p className="mt-1 text-sm text-slate-600">
                  {user?.name || "Admin"} • {user?.department || "Department"} • {user?.city || "City"}
                </p>
                <p className="text-[12px] text-slate-500">Admin ID: <span className="font-mono">{user?.id || "-"}</span></p>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-300">Verified: {user?.verified ? "Yes" : "No"}</span>
                {user?.phone && <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">{user.phone}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* KPI cards (enhanced) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(() => {
            const styles: Record<string, { ring: string; grad: string; iconWrap: string; icon: string; foot?: string }>= {
              emerald: { ring: "ring-emerald-300/60", grad: "from-emerald-500/15 via-emerald-400/10 to-transparent", iconWrap: "bg-emerald-50 ring-emerald-200/60", icon: "text-emerald-600", foot: "All time" },
              blue: { ring: "ring-sky-300/60", grad: "from-sky-500/15 via-blue-400/10 to-transparent", iconWrap: "bg-sky-50 ring-sky-200/60", icon: "text-sky-600", foot: "All time" },
              amber: { ring: "ring-amber-300/60", grad: "from-amber-500/15 via-yellow-400/10 to-transparent", iconWrap: "bg-amber-50 ring-amber-200/60", icon: "text-amber-600", foot: "Target < 48h" },
              violet: { ring: "ring-violet-300/60", grad: "from-violet-500/15 via-fuchsia-400/10 to-transparent", iconWrap: "bg-violet-50 ring-violet-200/60", icon: "text-violet-600", foot: "Last 30 days" },
            };
            const cards = [
              { key: "total", label: "Total Issues", value: metrics.total, color: "emerald" as const, Icon: ChartBarIcon },
              { key: "resolved", label: "Resolved Issues", value: metrics.resolved, color: "blue" as const, Icon: CheckBadgeIcon },
              { key: "avg", label: "Avg. Resolution Time", value: formatDuration(metrics.avgMs), color: "amber" as const, Icon: ClockIcon },
              { key: "citizens", label: "Active Citizens", value: metrics.activeCitizens, color: "violet" as const, Icon: UserGroupIcon },
            ];
            const targetMs = 48 * 3600_000;
            const pct = Math.max(5, Math.min(100, Math.round((metrics.avgMs / targetMs) * 100)));
            return cards.map(({ key, label, value, color, Icon }) => (
              <div key={key} className={`relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 transition will-change-transform hover:-translate-y-0.5 hover:shadow-md ${styles[color].ring}`}>
                {/* soft gradient wash */}
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles[color].grad}`} />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
                    <div className="mt-1 text-3xl font-semibold text-slate-900">{value as any}</div>
                  </div>
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${styles[color].iconWrap}`}>
                    <Icon className={`h-5 w-5 ${styles[color].icon}`} />
                  </span>
                </div>

                {/* Footer / extra visual */}
                {key === "avg" ? (
                  <div className="relative mt-4">
                    <div className="h-2 w-full rounded-full bg-slate-100" />
                    <div className="-mt-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400" style={{ width: `${pct}%` }} />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                      <span>{styles[color].foot}</span>
                      <span>{pct}% of 48h</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-[11px] font-medium text-slate-600">{styles[color].foot}</div>
                )}

                {/* top accent */}
                <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-white/0 via-black/0 to-black/0">
                  <span className="block h-full w-full bg-gradient-to-r from-white/10 via-black/0 to-white/10" />
                </div>
              </div>
            ));
          })()}
        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Line chart */}
          <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Issues Created vs Resolved</h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
                  {(["7d","14d","30d","custom"] as const).map(r => (
                    <button key={r} onClick={() => setRange(r)} type="button" className={`px-2.5 py-1 rounded-md transition ${range===r?"bg-white shadow-sm text-emerald-700":"text-slate-600 hover:text-slate-900"}`}>{r.toUpperCase()}</button>
                  ))}
                </div>
                {range === "custom" && (
                  <div className="flex items-center gap-2 text-xs">
                    <input type="date" value={customStart} onChange={(e)=>setCustomStart(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1 focus:border-emerald-500 focus:ring-emerald-500" />
                    <span className="text-slate-500">to</span>
                    <input type="date" value={customEnd} onChange={(e)=>setCustomEnd(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1 focus:border-emerald-500 focus:ring-emerald-500" />
                  </div>
                )}
                <label className="ml-2 inline-flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" checked={useDemo} onChange={(e)=>setUseDemo(e.target.checked)} className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  Use demo data
                </label>
              </div>
            </div>
            <LineChart labels={timeSeries.days} series={[timeSeries.byDayCreated, timeSeries.byDayResolved]} colors={["#10B981", "#3B82F6"]} />
            <div className="mt-2 flex gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{ background: "#10B981" }} /> Created</span>
              <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{ background: "#3B82F6" }} /> Resolved</span>
            </div>
          </div>

          {/* Pie chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Issues by Department</h3>
            <DonutChart data={deptPie.entries} total={deptPie.total} />
            <ul className="mt-4 space-y-1 text-xs text-slate-700">
              {deptPie.entries.map(([dept, count], idx) => (
                <li key={dept} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <i className="h-2 w-2 rounded-sm" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    {dept}
                  </span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function LineChart({ labels, series, colors }: { labels: Date[]; series: number[][]; colors: string[] }) {
  const width = 800;
  const height = 220;
  const padding = 28;
  const maxY = Math.max(1, ...series.flat());
  const xStep = (width - padding * 2) / Math.max(1, labels.length - 1);
  const yScale = (v: number) => height - padding - (v / maxY) * (height - padding * 2);
  const xScale = (i: number) => padding + i * xStep;

  const paths = series.map((data, si) => {
    const d = data.map((v, i) => `${i === 0 ? "M" : "L"}${xScale(i)},${yScale(v)}`).join(" ");
    return <path key={si} d={d} fill="none" stroke={colors[si]} strokeWidth={2} strokeLinecap="round" />;
  });

  const gridY = Array.from({ length: 4 }).map((_, i) => {
    const y = padding + ((height - padding * 2) / 3) * i;
    return <line key={i} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <rect x={0} y={0} width={width} height={height} fill="white" />
      {gridY}
      {paths}
    </svg>
  );
}

const PIE_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444", "#14B8A6"];

function DonutChart({ data, total }: { data: [string, number][]; total: number }) {
  const size = 220;
  const stroke = 26;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const arcs = data.map(([label, value], idx) => {
    const ratio = value / total;
    const length = ratio * circumference;
    const arc = (
      <circle
        key={label}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        fill="transparent"
        stroke={PIE_COLORS[idx % PIE_COLORS.length]}
        strokeWidth={stroke}
        strokeDasharray={`${length} ${circumference - length}`}
        strokeDashoffset={-offset}
        style={{ transition: "stroke-dasharray 600ms ease" }}
      />
    );
    offset += length;
    return arc;
  });
  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle r={radius} cx={size / 2} cy={size / 2} fill="transparent" stroke="#E5E7EB" strokeWidth={stroke} />
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>{arcs}</g>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-800" style={{ fontSize: 14, fontWeight: 700 }}>{total}</text>
      </svg>
    </div>
  );
}
