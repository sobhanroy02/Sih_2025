"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useIssuesStore } from "@/store";

const NAV_ITEMS = [
  { href: "/overview", label: "Overview" },
  { href: "/overview/issue-management", label: "Issue Management" },
  { href: "/overview/departments", label: "Departments" },
  { href: "/overview/workers", label: "Workers" },
  { href: "/overview/analytics", label: "Analytics" },
  { href: "/overview/notifications", label: "Notifications" },
];

type Dept = "Roads" | "Lighting" | "Sanitation" | "Water" | "Parks" | "General";
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

function formatDuration(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return "-";
  const days = Math.floor(ms / (24 * 3600_000));
  const hours = Math.floor((ms % (24 * 3600_000)) / 3600_000);
  if (days <= 0 && hours <= 0) return "<1h";
  return `${days}d ${hours}h`;
}

export default function Page() {
  const issues = useIssuesStore((s) => s.issues);

  // Range controls
  const [range, setRange] = useState<"7d" | "14d" | "30d" | "custom">("30d");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [useDemo, setUseDemo] = useState<boolean>(false);

  const { start, end, days } = useMemo(() => {
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
        const t = start; start = end; end = t;
      }
    } else {
      const len = range === "7d" ? 7 : range === "14d" ? 14 : 30;
      end = new Date(today);
      start = new Date(today);
      start.setDate(start.getDate() - (len - 1));
    }
    const days: Date[] = [];
    const cursor = new Date(start);
    while (cursor.getTime() <= end.getTime()) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    if (days.length === 0) days.push(new Date(today));
    return { start, end, days };
  }, [range, customStart, customEnd]);

  // Data in range
  const inRange = useMemo(() => {
    const created = issues.filter((i) => {
      const t = new Date(i.reportedAt).setHours(0, 0, 0, 0);
      return t >= start.getTime() && t <= end.getTime();
    });
    const resolved = issues.filter((i) => {
      if (!(i.status === "resolved" || i.status === "closed")) return false;
      const t = new Date(i.updatedAt).setHours(0, 0, 0, 0);
      return t >= start.getTime() && t <= end.getTime();
    });
    return { created, resolved };
  }, [issues, start, end]);

  // KPI metrics
  const kpis = useMemo(() => {
    const total = inRange.created.length;
    const done = inRange.resolved.length;
    const avgMs = inRange.resolved.length
      ? inRange.resolved.reduce((a, i) => a + (new Date(i.updatedAt).getTime() - new Date(i.reportedAt).getTime()), 0) / inRange.resolved.length
      : 0;
    const SLA_MS = 48 * 3600_000;
    const slaHits = inRange.resolved.filter((i) => (new Date(i.updatedAt).getTime() - new Date(i.reportedAt).getTime()) <= SLA_MS).length;
    const slaPct = done > 0 ? Math.round((slaHits / done) * 100) : 0;
    return { total, done, avgMs, slaPct };
  }, [inRange]);

  // Charts
  const timeSeries = useMemo(() => {
    if (useDemo) {
      const byDayCreated = days.map((_, i) => Math.max(0, Math.round(7 + 3 * Math.sin(i / 2) + ((i % 3) - 1))));
      const byDayResolved = days.map((_, i) => Math.max(0, byDayCreated[i] - (1 + (i % 2))));
      return { byDayCreated, byDayResolved };
    }
    const byDayCreated = days.map((d) => inRange.created.filter((i) => new Date(i.reportedAt).setHours(0,0,0,0) === d.getTime()).length);
    const byDayResolved = days.map((d) => inRange.resolved.filter((i) => new Date(i.updatedAt).setHours(0,0,0,0) === d.getTime()).length);
    return { byDayCreated, byDayResolved };
  }, [days, inRange, useDemo]);

  const byDept = useMemo(() => {
    const m = new Map<Dept, number>();
    for (const i of inRange.created) {
      const d = mapCategoryToDept(i.category);
      m.set(d, (m.get(d) || 0) + 1);
    }
    const entries = Array.from(m.entries());
    const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
    return { entries, total };
  }, [inRange.created]);

  const byStatus = useMemo(() => {
    const map: Record<string, number> = { open: 0, "in-progress": 0, resolved: 0, closed: 0 };
    for (const i of issues) map[i.status] = (map[i.status] || 0) + 1;
    return map;
  }, [issues]);

  const byPriority = useMemo(() => {
    const map: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const i of issues) map[i.priority] = (map[i.priority] || 0) + 1;
    return map;
  }, [issues]);

  const avgByDept = useMemo(() => {
    const buckets = new Map<Dept, number[]>();
    for (const i of issues) {
      if (!(i.status === "resolved" || i.status === "closed")) continue;
      const d = mapCategoryToDept(i.category);
      const ms = new Date(i.updatedAt).getTime() - new Date(i.reportedAt).getTime();
      if (ms > 0) buckets.set(d, [...(buckets.get(d) || []), ms]);
    }
    const rows = Array.from(buckets.entries()).map(([d, arr]) => ({ d, avgMs: arr.reduce((a, b) => a + b, 0) / arr.length }));
    rows.sort((a, b) => a.avgMs - b.avgMs);
    return rows;
  }, [issues]);

  const topReporters = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of issues) map.set(i.reportedBy, (map.get(i.reportedBy) || 0) + 1);
    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5);
  }, [issues]);

  const topLocations = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of issues) map.set(i.location?.address || "-", (map.get(i.location?.address || "-") || 0) + 1);
    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5);
  }, [issues]);

  const assignmentsByWorker = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of issues) if (i.assignedTo) map.set(i.assignedTo, (map.get(i.assignedTo) || 0) + 1);
    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5);
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
              <Link key={n.href} href={n.href} className={`text-sm font-medium px-3 py-1.5 rounded-md transition hover:bg-white/10 ${n.href === "/overview/analytics" ? "bg-white/10" : ""}`}>
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
              <h1 className="font-heading text-xl sm:text-2xl font-semibold text-slate-900">Analytics</h1>
              <p className="mt-1 text-sm text-slate-600">Deep dive into performance and trends</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Controls + KPIs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
              {["7d","14d","30d","custom"].map((r) => (
                <button key={r} onClick={() => setRange(r as any)} className={`rounded-md px-2.5 py-1 transition ${range===r?"bg-white text-emerald-700 shadow-sm":"text-slate-700 hover:text-slate-900"}`}>{String(r).toUpperCase()}</button>
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
              Use demo data (time series)
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(() => {
              const cards = [
                { label: "Created (range)", value: kpis.total, ring: "ring-emerald-300/60", grad: "from-emerald-500/10 via-emerald-400/10 to-transparent" },
                { label: "Resolved (range)", value: kpis.done, ring: "ring-sky-300/60", grad: "from-sky-500/10 via-blue-400/10 to-transparent" },
                { label: "Avg. Resolution", value: formatDuration(kpis.avgMs), ring: "ring-amber-300/60", grad: "from-amber-500/10 via-yellow-400/10 to-transparent" },
                { label: "SLA Compliance", value: `${kpis.slaPct}%`, ring: "ring-violet-300/60", grad: "from-violet-500/10 via-fuchsia-400/10 to-transparent" },
              ];
              return cards.map((c) => (
                <div key={c.label} className={`relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${c.ring}`}>
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.grad}`} />
                  <div className="relative">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{c.label}</div>
                    <div className="mt-1 text-3xl font-semibold text-slate-900">{c.value as any}</div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Charts grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Line chart */}
          <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Issues Created vs Resolved</h3>
            <LineChart labels={days} series={[timeSeries.byDayCreated, timeSeries.byDayResolved]} colors={["#10B981", "#3B82F6"]} />
            <div className="mt-2 flex gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{ background: "#10B981" }} /> Created</span>
              <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{ background: "#3B82F6" }} /> Resolved</span>
            </div>
          </div>

          {/* Department donut */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Issues by Department</h3>
            <DonutChart data={byDept.entries} total={byDept.total} />
            <ul className="mt-4 space-y-1 text-xs text-slate-700">
              {byDept.entries.map(([dept, count], idx) => (
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

        {/* Distribution: Status and Priority */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Status Distribution</h3>
            <div className="mt-4 space-y-3">
              {(["open","in-progress","resolved","closed"] as const).map((k) => {
                const v = byStatus[k] ?? 0;
                const max = Math.max(1, ...Object.values(byStatus));
                const pct = Math.max(6, Math.round((v / max) * 100));
                const grad = k==='open'? 'from-amber-300 to-amber-500' : k==='in-progress'? 'from-sky-300 to-sky-500' : k==='resolved'? 'from-emerald-300 to-emerald-500' : 'from-slate-300 to-slate-500';
                const label = k==='in-progress'? 'In Progress' : k[0].toUpperCase()+k.slice(1);
                return (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-28 shrink-0 text-xs font-medium text-slate-600">{label}</div>
                    <div className="relative h-9 w-full overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                      <div className={`h-full bg-gradient-to-r ${grad} transition-all`} style={{ width: `${pct}%` }} />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[11px] font-semibold text-slate-700">
                        <span className="opacity-70">{v} issues</span>
                        <span className="opacity-50">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Priority Distribution</h3>
            <div className="mt-4 space-y-3">
              {(["low","medium","high","critical"] as const).map((k) => {
                const v = byPriority[k] ?? 0;
                const max = Math.max(1, ...Object.values(byPriority));
                const pct = Math.max(6, Math.round((v / max) * 100));
                const grad = k==='low'? 'from-emerald-300 to-emerald-500' : k==='medium'? 'from-amber-300 to-amber-500' : k==='high'? 'from-rose-300 to-rose-500' : 'from-fuchsia-300 to-fuchsia-500';
                const label = k[0].toUpperCase()+k.slice(1);
                return (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-28 shrink-0 text-xs font-medium text-slate-600">{label}</div>
                    <div className="relative h-9 w-full overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                      <div className={`h-full bg-gradient-to-r ${grad} transition-all`} style={{ width: `${pct}%` }} />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[11px] font-semibold text-slate-700">
                        <span className="opacity-70">{v} issues</span>
                        <span className="opacity-50">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Avg Resolution by Department */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Average Resolution Time by Department</h3>
          <div className="mt-4 space-y-3">
            {avgByDept.length === 0 && <p className="text-sm text-slate-600">No resolved issues yet.</p>}
            {avgByDept.map(({ d, avgMs }) => {
              const ms = Math.max(1, ...avgByDept.map((x) => x.avgMs));
              const pct = Math.max(6, Math.round((avgMs / ms) * 100));
              return (
                <div key={d} className="flex items-center gap-3">
                  <div className="w-32 shrink-0 text-xs font-medium text-slate-600">{d}</div>
                  <div className="relative h-9 w-full overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                    <div className="h-full bg-gradient-to-r from-violet-300 to-violet-500 transition-all" style={{ width: `${pct}%` }} />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[11px] font-semibold text-slate-700">
                      <span className="opacity-70">{formatDuration(avgMs)}</span>
                      <span className="opacity-50">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top lists */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Top Reporters</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {topReporters.map(([user, count]) => (
                <li key={user} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                  <span className="truncate">{user}</span>
                  <span className="font-mono text-slate-700">{count}</span>
                </li>
              ))}
              {topReporters.length === 0 && <li className="text-slate-600">No reporters yet.</li>}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Top Locations</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {topLocations.map(([loc, count]) => (
                <li key={loc} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                  <span className="truncate">{loc}</span>
                  <span className="font-mono text-slate-700">{count}</span>
                </li>
              ))}
              {topLocations.length === 0 && <li className="text-slate-600">No locations yet.</li>}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Assignments by Worker</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {assignmentsByWorker.map(([wid, count]) => (
                <li key={wid} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                  <span className="truncate">{wid}</span>
                  <span className="font-mono text-slate-700">{count}</span>
                </li>
              ))}
              {assignmentsByWorker.length === 0 && <li className="text-slate-600">No assignments yet.</li>}
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
