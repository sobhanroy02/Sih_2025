"use client";

import React, { useMemo, useState } from "react";
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

type Worker = {
  id: string;
  name: string;
  department: Dept;
  area: string; // e.g., ward or neighborhood
  active: boolean; // online/offline
};

const DEMO_WORKERS: Worker[] = [
  { id: "WKR-1001", name: "Amit Sharma", department: "Roads", area: "Esplanade", active: true },
  { id: "WKR-1002", name: "Sunita Paul", department: "Lighting", area: "Howrah Maidan", active: true },
  { id: "WKR-1003", name: "Rohit Sen", department: "Sanitation", area: "Eco Park", active: false },
  { id: "WKR-1004", name: "Priyanka Das", department: "Water", area: "EM Bypass", active: true },
  { id: "WKR-1005", name: "Arjun Roy", department: "Parks", area: "Park Street", active: false },
  { id: "WKR-1006", name: "Nisha Gupta", department: "General", area: "Salt Lake Sector V", active: true },
];

export default function Page() {
  const { issues, updateIssue } = useIssuesStore();

  // Filters
  const [dept, setDept] = useState<string>("");
  const [allotted, setAllotted] = useState<string>(""); // "yes" | "no" | ""
  const [area, setArea] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const areas = useMemo(() => Array.from(new Set(DEMO_WORKERS.map((w) => w.area))), []);
  const depts: Dept[] = ["Roads", "Lighting", "Sanitation", "Water", "Parks", "General"];

  const workers = DEMO_WORKERS;

  const computed = useMemo(() => {
    // Build assignment map from issues
    const activeStatuses = new Set(["open", "in-progress"]);
    const byWorker = new Map<string, { activeAssigned: number; totalAssigned: number; history: any[]; resolved: number }>();
    for (const w of workers) byWorker.set(w.id, { activeAssigned: 0, totalAssigned: 0, history: [], resolved: 0 });
    for (const i of issues) {
      const wid = i.assignedTo || "";
      if (!wid || !byWorker.has(wid)) continue;
      const rec = byWorker.get(wid)!;
      rec.totalAssigned += 1;
      rec.history.push(i);
      if (activeStatuses.has(i.status)) rec.activeAssigned += 1;
      if (i.status === "resolved" || i.status === "closed") rec.resolved += 1;
    }
    return byWorker;
  }, [issues, workers]);

  const filtered = useMemo(() => {
    return workers.filter((w) => {
      if (dept && w.department !== dept) return false;
      if (area && w.area !== area) return false;
      const rec = computed.get(w.id);
      const isAllotted = (rec?.activeAssigned || 0) > 0;
      if (allotted === "yes" && !isAllotted) return false;
      if (allotted === "no" && isAllotted) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!w.name.toLowerCase().includes(q) && !w.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [workers, dept, area, allotted, computed, search]);

  // Modals
  const [assignWorker, setAssignWorker] = useState<Worker | null>(null);
  const [profileWorker, setProfileWorker] = useState<Worker | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar (same as Issue Management) */}
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
              <Link key={n.href} href={n.href} className={`text-sm font-medium px-3 py-1.5 rounded-md transition hover:bg-white/10 ${n.href === "/overview/workers" ? "bg-white/10" : ""}`}>
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
              <h1 className="font-heading text-xl sm:text-2xl font-semibold text-slate-900">Workers</h1>
              <p className="mt-1 text-sm text-slate-600">Manage field workers and their workload</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Search & Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Department</label>
              <select value={dept} onChange={(e)=>setDept(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                <option value="">All</option>
                {depts.map(d=>(<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Allotted</label>
              <select value={allotted} onChange={(e)=>setAllotted(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                <option value="">All</option>
                <option value="yes">Allotted</option>
                <option value="no">Non-allotted</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Area</label>
              <select value={area} onChange={(e)=>setArea(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                <option value="">All</option>
                {areas.map(a=>(<option key={a} value={a}>{a}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Search</label>
              <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by name or ID" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        {/* Workers table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Worker</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Area</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Assigned</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((w) => {
                  const rec = computed.get(w.id);
                  const isAllotted = (rec?.activeAssigned || 0) > 0;
                  return (
                    <tr key={w.id} className="group hover:bg-slate-50/70">
                      <td className="relative px-4 py-3 align-top border-l-2 border-transparent group-hover:border-sky-400">
                        <button onClick={()=>setProfileWorker(w)} className="text-sm font-medium text-emerald-700 decoration-emerald-300 underline-offset-2 hover:underline">
                          {w.name}
                        </button>
                        <div className="mt-0.5 text-xs text-slate-500 font-mono">{w.id}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-800">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${deptBadge(w.department)}`}>{w.department}</span>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-800">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] ring-1 ring-slate-200">{w.area}</span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${isAllotted? 'bg-sky-100 text-sky-800 ring-sky-200' : 'bg-slate-100 text-slate-800 ring-slate-200'}`}>{isAllotted? 'Yes' : 'No'}</span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${w.active? 'bg-emerald-100 text-emerald-800 ring-emerald-200' : 'bg-slate-100 text-slate-800 ring-slate-200'}`}>{w.active? 'Active' : 'Offline'}</span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-wrap gap-2">
                          <button onClick={()=>setAssignWorker(w)} className="inline-flex items-center rounded-lg border border-sky-300 bg-gradient-to-r from-sky-50 to-blue-50 px-2.5 py-1.5 text-xs font-medium text-sky-700 shadow-sm transition hover:from-sky-100 hover:to-blue-100 hover:shadow-md active:scale-[0.98]">Assign work</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-600">No workers found for the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* helper note */}
        <p className="mt-3 text-xs text-slate-500">Tip: Click a worker name to view assignment history and performance.</p>
      </main>

      {/* Assign modal */}
      {assignWorker && (
        <AssignModal
          worker={assignWorker}
          onClose={() => setAssignWorker(null)}
          onAssign={(issueId) => {
            const issue = issues.find((i) => i.id === issueId.trim());
            if (!issue) return false;
            updateIssue(issue.id, { assignedTo: assignWorker.id, updatedAt: new Date() as any });
            return true;
          }}
          issues={issues}
        />
      )}

      {/* Profile / history modal */}
      {profileWorker && (
        <ProfileModal worker={profileWorker} issues={issues.filter((i) => i.assignedTo === profileWorker.id)} onClose={() => setProfileWorker(null)} />
      )}
    </div>
  );
}

function AssignModal({ worker, onClose, onAssign, issues }: { worker: Worker; onClose: () => void; onAssign: (issueId: string) => boolean; issues: any[] }) {
  const [issueId, setIssueId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const unassigned = useMemo(() => issues.filter((i) => !i.assignedTo && (mapCategoryToDept(i.category) === worker.department)), [issues, worker.department]);

  function handleAssign(id: string) {
    setError("");
    setSuccess("");
    const ok = onAssign(id);
    if (!ok) {
      setError("Invalid issue ID. Please check and try again.");
      return;
    }
    setSuccess("Assigned successfully.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Assign work</h3>
            <p className="text-sm text-slate-600">{worker.name} • {worker.department} • {worker.area}</p>
            <p className="text-[11px] font-mono text-slate-500">ID: {worker.id}</p>
          </div>
          <button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]">Close</button>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Issue ID</label>
            <div className="flex gap-2">
              <input value={issueId} onChange={(e)=>setIssueId(e.target.value)} placeholder="Enter issue ID (e.g., WBGH8K2M9Q1Z)" className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
              <button onClick={()=>handleAssign(issueId)} className="rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:from-emerald-700 hover:to-green-700 active:scale-[0.98]">Assign</button>
            </div>
            {error && <p className="mt-1 text-[12px] text-rose-600">{error}</p>}
            {success && <p className="mt-1 text-[12px] text-emerald-700">{success}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Or pick an unassigned issue ({worker.department})</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {unassigned.slice(0,6).map((i)=> (
                <button key={i.id} onClick={()=>handleAssign(i.id)} className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 text-left text-sm transition hover:border-emerald-400 hover:shadow-sm">
                  <div>
                    <div className="font-medium text-slate-900 line-clamp-1">{i.title}</div>
                    <div className="text-[11px] text-slate-600 line-clamp-1">{i.id} • {i.location?.address}</div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] ring-1 ring-slate-200">{i.priority}</span>
                </button>
              ))}
              {unassigned.length === 0 && <div className="text-xs text-slate-600">No unassigned issues for this department.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ worker, issues, onClose }: { worker: Worker; issues: any[]; onClose: () => void }) {
  const totals = useMemo(() => {
    const active = issues.filter((i) => i.status === "open" || i.status === "in-progress").length;
    const resolved = issues.filter((i) => i.status === "resolved" || i.status === "closed").length;
    return { total: issues.length, active, resolved };
  }, [issues]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{worker.name}</h3>
            <p className="text-sm text-slate-600">{worker.department} • {worker.area} • {worker.active? 'Active' : 'Offline'}</p>
            <p className="text-[11px] font-mono text-slate-500">Worker ID: {worker.id}</p>
          </div>
          <button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]">Close</button>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          <div className="max-h-[70vh] space-y-4 overflow-auto p-6">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200 transition-all hover:shadow-sm">
                <div className="text-[11px] font-medium uppercase tracking-wide text-emerald-700">Total</div>
                <div className="mt-1 text-2xl font-semibold text-emerald-900">{totals.total}</div>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200 transition-all hover:shadow-sm">
                <div className="text-[11px] font-medium uppercase tracking-wide text-amber-700">Active</div>
                <div className="mt-1 text-2xl font-semibold text-amber-900">{totals.active}</div>
              </div>
              <div className="rounded-xl bg-sky-50 p-3 ring-1 ring-sky-200 transition-all hover:shadow-sm">
                <div className="text-[11px] font-medium uppercase tracking-wide text-sky-700">Resolved</div>
                <div className="mt-1 text-2xl font-semibold text-sky-900">{totals.resolved}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800">Assignment history</h4>
              <ul className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200">
                {issues.sort((a,b)=> new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((i) => (
                  <li key={i.id} className="flex items-start justify-between gap-3 p-3 transition hover:bg-slate-50">
                    <div>
                      <div className="text-sm font-medium text-slate-900 line-clamp-1">{i.title}</div>
                      <div className="text-[11px] text-slate-600">{i.id} • {i.location?.address}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${i.status==='resolved'||i.status==='closed' ? 'bg-emerald-100 text-emerald-800 ring-emerald-200' : i.status==='in-progress' ? 'bg-sky-100 text-sky-800 ring-sky-200' : 'bg-amber-100 text-amber-800 ring-amber-200'}`}>{i.status}</span>
                      <span className="text-[11px] text-slate-600">{new Date(i.updatedAt).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
                {issues.length === 0 && <li className="p-3 text-sm text-slate-600">No assignment history.</li>}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 p-6 lg:border-l lg:border-t-0">
            <h4 className="text-sm font-semibold text-slate-800">About this worker</h4>
            <dl className="mt-2 grid grid-cols-1 gap-y-2 text-sm">
              <div className="grid grid-cols-[140px_1fr] gap-2"><dt className="text-slate-500">Name</dt><dd className="text-slate-800">{worker.name}</dd></div>
              <div className="grid grid-cols-[140px_1fr] gap-2"><dt className="text-slate-500">Department</dt><dd className="text-slate-800">{worker.department}</dd></div>
              <div className="grid grid-cols-[140px_1fr] gap-2"><dt className="text-slate-500">Area</dt><dd className="text-slate-800">{worker.area}</dd></div>
              <div className="grid grid-cols-[140px_1fr] gap-2"><dt className="text-slate-500">Status</dt><dd className="text-slate-800">{worker.active? 'Active' : 'Offline'}</dd></div>
              <div className="grid grid-cols-[140px_1fr] gap-2"><dt className="text-slate-500">Current workload</dt><dd className="text-slate-800">{issues.filter((i)=> i.status==='open'||i.status==='in-progress').length} active</dd></div>
              <div className="grid grid-cols-[140px_1fr] gap-2"><dt className="text-slate-500">Resolved</dt><dd className="text-slate-800">{issues.filter((i)=> i.status==='resolved'||i.status==='closed').length}</dd></div>
            </dl>
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-[12px] text-slate-600 ring-1 ring-slate-200">
              Workers can be searched by department, allotment, area, or name/ID. Use the Issue Management page to track progress on assigned reports.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function deptBadge(d: Dept){
  switch(d){
    case 'Roads': return 'bg-amber-100 text-amber-800 ring-amber-200';
    case 'Lighting': return 'bg-sky-100 text-sky-800 ring-sky-200';
    case 'Sanitation': return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
    case 'Water': return 'bg-blue-100 text-blue-800 ring-blue-200';
    case 'Parks': return 'bg-violet-100 text-violet-800 ring-violet-200';
    default: return 'bg-slate-100 text-slate-800 ring-slate-200';
  }
}
