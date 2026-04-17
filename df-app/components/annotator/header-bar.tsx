"use client";

import Link from "next/link";

export function HeaderBar() {
  return (
    <header className="flex h-14 items-center justify-between bg-deep-teal px-6">
      {/* Left: branding */}
      <div className="flex items-center gap-3">
        <span className="font-inter text-[15px] font-bold tracking-[0.08em] text-white">
          <span className="opacity-70">DF</span>{"  "}DATAFORGE
        </span>
        <span className="rounded-tight border border-white/50 px-2 py-0.5 font-inter text-[11px] font-medium uppercase tracking-[0.5px] text-white">
          ANNOTATOR
        </span>
      </div>

      {/* Right: profile */}
      <div className="flex items-center gap-3">
        <Link
          href="/annotate/profile"
          className="rounded-standard border border-white/50 px-3 py-1.5 font-inter text-[13px] font-medium text-white transition-colors hover:bg-white/10"
        >
          My Profile
        </Link>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <span className="font-inter text-[13px] font-medium text-white">M</span>
        </div>
        <span className="font-inter text-[14px] text-white">Marcus T.</span>
      </div>
    </header>
  );
}
