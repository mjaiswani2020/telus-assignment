"use client";

import { HeaderBar } from "@/components/annotator/header-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Hourglass } from "lucide-react";
import { cn } from "@/lib/cn";

const qualifications = [
  { name: "General Annotation", status: "passed", date: "Jan 15, 2026" },
  { name: "Pairwise Preference", status: "passed", date: "Feb 3, 2026" },
  { name: "Safety Red-Teaming", status: "passed", date: "Mar 12, 2026" },
  { name: "Code Evaluation", status: "pending", date: "In progress" },
  { name: "Medical Domain", status: "failed", date: "Mar 28, 2026" },
];

const taskBreakdown = [
  { type: "Pairwise", count: 412, avgTime: "1:32", iaa: 0.81 },
  { type: "Safety", count: 156, avgTime: "2:45", iaa: 0.74 },
  { type: "SFT Authoring", count: 89, avgTime: "5:12", iaa: 0.69 },
  { type: "Ranking", count: 102, avgTime: "3:01", iaa: 0.77 },
  { type: "Arena", count: 88, avgTime: "0:52", iaa: 0.83 },
];

export default function ProfilePage() {
  return (
    <>
      <HeaderBar />
      <div className="stagger-children mx-auto max-w-[1440px] px-8 py-8 space-y-6">
        {/* Profile header */}
      <div className="flex items-center gap-5 rounded-comfortable border border-level-2 bg-white px-5 py-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B45309] text-white">
          <span className="font-inter text-[20px] font-bold">MT</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-literata text-headline-md text-ink">Marcus Thompson</h1>
            <Badge variant="active" dot>Active</Badge>
          </div>
          <p className="mt-0.5 font-inter text-body-md text-secondary-text">
            Annotator since January 2026 &middot; Tier 2 &middot; English, Spanish
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Gold Accuracy" value={82} format="percent" trend={{ value: "+3%", direction: "up" }} />
        <StatCard label="Peer IAA" value="0.76" trend={{ value: "+0.04", direction: "up" }} />
        <StatCard label="Tasks (30D)" value={847} trend={{ value: "+12%", direction: "up" }} />
        <StatCard label="Quality Trend" value="Improving" trend={{ value: "Consistent", direction: "up" }} />
      </div>

      {/* Skills & Qualifications */}
      <div className="space-y-3">
        <h2 className="font-literata text-title-lg text-ink">Skills &amp; Qualifications</h2>
        <div className="rounded-comfortable border border-level-2 bg-white">
          {qualifications.map((qual, idx) => (
            <div
              key={qual.name}
              className={cn(
                "flex items-center justify-between px-5 py-3",
                idx < qualifications.length - 1 && "border-b border-level-2"
              )}
            >
              <div className="flex items-center gap-3">
                {qual.status === "passed" && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ECFDF5] text-success">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                {qual.status === "failed" && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FEF2F2] text-error">
                    <X className="h-4 w-4" />
                  </span>
                )}
                {qual.status === "pending" && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFFBEB] text-caution">
                    <Hourglass className="h-4 w-4" />
                  </span>
                )}
                <span className="font-inter text-body-md text-ink">{qual.name}</span>
              </div>
              <span className="font-inter text-label-md text-tertiary-text">{qual.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task Breakdown */}
      <div className="space-y-3">
        <h2 className="font-literata text-title-lg text-ink">Task Breakdown</h2>
        <div className="overflow-hidden rounded-comfortable border border-level-2 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-level-2 bg-level-1">
                <th className="px-5 py-3 text-left font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                  Task Type
                </th>
                <th className="px-5 py-3 text-right font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                  Count
                </th>
                <th className="px-5 py-3 text-right font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                  Avg Time
                </th>
                <th className="px-5 py-3 text-right font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                  IAA
                </th>
              </tr>
            </thead>
            <tbody>
              {taskBreakdown.map((row, idx) => (
                <tr
                  key={row.type}
                  className={cn(
                    idx < taskBreakdown.length - 1 && "border-b border-level-2"
                  )}
                >
                  <td className="px-5 py-3 font-inter text-body-md text-ink">{row.type}</td>
                  <td className="px-5 py-3 text-right font-inter text-body-md text-ink">
                    {row.count}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-body-md text-ink">
                    {row.avgTime}
                  </td>
                  <td className="px-5 py-3 text-right font-inter text-body-md text-ink">
                    {row.iaa.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Earnings */}
      <div className="space-y-3">
        <h2 className="font-literata text-title-lg text-ink">Earnings</h2>
        <div className="rounded-comfortable border border-level-2 bg-white p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
                Pay Model
              </p>
              <p className="mt-1 font-inter text-body-lg font-medium text-ink">Per-task + Quality Bonus</p>
            </div>
            <div>
              <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
                Base Rate
              </p>
              <p className="mt-1 font-inter text-body-lg font-medium text-ink">$0.45 / task</p>
            </div>
            <div>
              <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
                Quality Bonus
              </p>
              <p className="mt-1 font-inter text-body-lg font-medium text-ink">+15% (Gold &gt; 80%)</p>
            </div>
          </div>
          <hr className="my-4 border-level-2" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
                April 2026 (MTD)
              </p>
              <p className="mt-1 font-literata text-headline-sm text-ink">$1,247.50</p>
              <p className="font-inter text-label-md text-tertiary-text">
                Based on 847 tasks at blended rate
              </p>
            </div>
            <div>
              <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
                Year-to-Date
              </p>
              <p className="mt-1 font-literata text-headline-sm text-ink">$4,892.30</p>
              <p className="font-inter text-label-md text-tertiary-text">
                Jan &ndash; Apr 2026
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
