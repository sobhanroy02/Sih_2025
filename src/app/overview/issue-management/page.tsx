"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useIssuesStore } from "@/store";

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

export default function Page() {
  const { issues, updateIssue } = useIssuesStore();

  const [status, setStatus] = useState<string>("");
  const [dept, setDept] = useState<string>("");
  const [sort, setSort] = useState<"reportedAt" | "updatedAt">("reportedAt");

  const filtered = useMemo(() => {
    let list = issues.map((i) => ({ ...i, department: mapCategoryToDept(i.category) }));
    if (status) list = list.filter((i) => i.status === status);
    if (dept) list = list.filter((i) => i.department === dept);
    list.sort((a: any, b: any) => new Date(b[sort]).getTime() - new Date(a[sort]).getTime());
    return list;
  }, [issues, status, dept, sort]);

  const statuses: Array<{ v: string; label: string; color: string }> = [
    { v: "open", label: "Open", color: "bg-amber-100 text-amber-800 ring-amber-200" },
    { v: "in-progress", label: "In Progress", color: "bg-sky-100 text-sky-800 ring-sky-200" },
    { v: "resolved", label: "Resolved", color: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
    { v: "closed", label: "Closed", color: "bg-slate-100 text-slate-800 ring-slate-200" },
  ];
  const depts: Dept[] = ["Roads", "Lighting", "Sanitation", "Water", "Parks", "General"];

  function assignIssue(id: string) {
    const val = window.prompt("Assign to (worker id or name):");
    if (val) updateIssue(id, { assignedTo: val, updatedAt: new Date() as any });
  }
  function resolveIssue(id: string) {
    updateIssue(id, { status: "resolved", updatedAt: new Date() as any });
  }

  // Analytics
  const statusCounts = useMemo(() => {
    const map: Record<string, number> = { open: 0, "in-progress": 0, resolved: 0, closed: 0 };
    for (const i of issues) map[i.status] = (map[i.status] || 0) + 1;
    return map;
  }, [issues]);
  const deptCounts = useMemo(() => {
    const m = new Map<Dept, number>();
    for (const i of issues) {
      const d = mapCategoryToDept(i.category);
      m.set(d as Dept, (m.get(d as Dept) || 0) + 1);
    }
    return Array.from(m.entries());
  }, [issues]);

  const NAV_ITEMS = [
    { href: "/overview", label: "Overview" },
    { href: "/overview/issue-management", label: "Issue Management" },
    { href: "/overview/departments", label: "Departments" },
    { href: "/overview/workers", label: "Workers" },
    { href: "/overview/analytics", label: "Analytics" },
    { href: "/overview/notifications", label: "Notifications" },
  ];

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
              <Link key={n.href} href={n.href} className={`text-sm font-medium px-3 py-1.5 rounded-md transition hover:bg-white/10 ${n.href === "/overview/issue-management" ? "bg-white/10" : ""}`}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      {/* Section header (thicker than navbar) */}
      <section className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-semibold text-slate-900">Issue Management</h1>
              <p className="mt-1 text-sm text-slate-600">Track, prioritize, and resolve civic issues efficiently</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Status</label>
              <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                <option value="">All</option>
                {statuses.map(s=>(<option key={s.v} value={s.v}>{s.label}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Department</label>
              <select value={dept} onChange={(e)=>setDept(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                <option value="">All</option>
                {depts.map(d=>(<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Sort by</label>
              <select value={sort} onChange={(e)=>setSort(e.target.value as any)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                <option value="reportedAt">Date reported</option>
                <option value="updatedAt">Last updated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Issue</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Report ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((i) => {
                  const st = statuses.find((s)=>s.v===i.status);
                  const dep = mapCategoryToDept(i.category);
                  return (
                    <tr key={i.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 align-top">
                        <div className="text-sm font-medium text-slate-900 line-clamp-1">{i.title}</div>
                        <div className="mt-0.5 text-xs text-slate-500 line-clamp-1">{i.location.address}</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700 ring-1 ring-slate-200">{i.id}</code>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className="text-sm text-slate-800">{dep}</span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${st?.color}`}>{st?.label}</span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${i.priority==='high' || i.priority==='critical' ? 'bg-rose-100 text-rose-800 ring-rose-200' : i.priority==='medium' ? 'bg-amber-100 text-amber-800 ring-amber-200' : 'bg-emerald-100 text-emerald-800 ring-emerald-200'}`}>{i.priority}</span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/issue/${i.id}`} className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700">View</Link>
                          <button onClick={()=>assignIssue(i.id)} className="inline-flex items-center rounded-lg border border-sky-300 bg-white px-2.5 py-1.5 text-xs font-medium text-sky-700 shadow-sm transition hover:bg-sky-50">Assign</button>
                          <button onClick={()=>resolveIssue(i.id)} className="inline-flex items-center rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100">Resolve</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Issues by Status (bars) */}
          <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Issues by Status</h3>
            {(() => {
              const order: Array<'open'|'in-progress'|'resolved'|'closed'> = ['open','in-progress','resolved','closed'];
              const max = Math.max(1, ...order.map(k => statusCounts[k] ?? 0));
              const total = order.reduce((a,k)=> a + (statusCounts[k] ?? 0), 0);
              const labelMap: Record<string,string> = { 'open':'Open', 'in-progress':'In Progress', 'resolved':'Resolved', 'closed':'Closed' };
              const barClass = (k: string) => (
                k === 'open' ? 'from-amber-300 to-amber-500' :
                k === 'in-progress' ? 'from-sky-300 to-sky-500' :
                k === 'resolved' ? 'from-emerald-300 to-emerald-500' :
                'from-slate-300 to-slate-500'
              );

              // 1) Stacked distribution bar + legend to fill top area
              const dist = (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Total issues</span>
                    <span className="font-semibold text-slate-800">{total}</span>
                  </div>
                  <div className="mt-2 relative h-5 w-full overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                    <div className="absolute inset-0 flex">
                      {order.map((k, idx) => {
                        const v = statusCounts[k] ?? 0;
                        const pct = total === 0 ? 0 : (v / total) * 100;
                        return (
                          <div key={k} className={`h-full bg-gradient-to-r ${barClass(k)}`} style={{ width: `${pct}%` }} aria-label={`${labelMap[k]}: ${v}`} />
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {order.map((k, idx) => {
                      const v = statusCounts[k] ?? 0;
                      const pct = total === 0 ? 0 : Math.round((v / total) * 100);
                      return (
                        <div key={k} className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5 text-[11px] ring-1 ring-slate-200">
                          <span className="inline-flex items-center gap-1">
                            <i className="h-2 w-2 rounded-sm" style={{ background: idx===0? '#F59E0B' : idx===1? '#3B82F6' : idx===2? '#10B981' : '#64748B' }} />
                            {labelMap[k]}
                          </span>
                          <span className="font-medium text-slate-700">{v} • {pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );

              // 2) Individual bars per status
              const rows = (
                <div className="mt-4 space-y-3">
                  {order.map(k => {
                    const v = statusCounts[k] ?? 0;
                    const pct = Math.max(6, Math.round((v / max) * 100));
                    return (
                      <div key={k} className="flex items-center gap-3">
                        <div className="w-28 shrink-0 text-xs font-medium text-slate-600">{labelMap[k]}</div>
                        <div className="relative h-9 w-full overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                          <div className={`h-full bg-gradient-to-r ${barClass(k)} transition-all`} style={{ width: `${pct}%` }} />
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[11px] font-semibold text-slate-700">
                            <span className="opacity-70">{v} issues</span>
                            <span className="opacity-50">{pct}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );

              return (
                <>
                  {dist}
                  {rows}
                </>
              );
            })()}
          </div>

          {/* Issues by Department (donut) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Issues by Department</h3>
            <Donut data={deptCounts} />
            <ul className="mt-3 space-y-1 text-xs text-slate-700">
              {deptCounts.map(([d,c], idx) => (
                <li key={d} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-sm" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />{d}</span>
                  <span className="font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

const PIE_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444", "#14B8A6"];

function Donut({ data }: { data: [string, number][] }) {
  const total = Math.max(1, data.reduce((a, [,v]) => a+v, 0));
  const size = 220;
  const stroke = 26;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="mt-4 flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle r={radius} cx={size/2} cy={size/2} fill="transparent" stroke="#E5E7EB" strokeWidth={stroke} />
        <g transform={`rotate(-90 ${size/2} ${size/2})`}>
          {data.map(([label, value], idx) => {
            const len = (value/total) * circumference;
            const el = (
              <circle
                key={label}
                r={radius}
                cx={size/2}
                cy={size/2}
                fill="transparent"
                stroke={PIE_COLORS[idx % PIE_COLORS.length]}
                strokeWidth={stroke}
                strokeDasharray={`${len} ${circumference-len}`}
                strokeDashoffset={-offset}
                style={{ transition: "stroke-dasharray 600ms ease" }}
              />
            );
            offset += len;
            return el;
          })}
        </g>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-800" style={{ fontSize: 14, fontWeight: 700 }}>{total}</text>
      </svg>
    </div>
  );
}

