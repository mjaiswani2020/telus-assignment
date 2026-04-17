"use client";

import { ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <div className="flex items-center justify-end gap-3 px-8 py-4">
      <button className="flex items-center gap-1.5 rounded-standard border border-level-2 px-3 py-1.5 font-inter text-body-md text-ink hover:bg-level-1 transition-colors duration-150">
        Alignment Lab
        <ChevronDown className="h-4 w-4 text-tertiary-text" />
      </button>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deep-teal">
        <span className="font-inter text-[14px] font-medium text-white">P</span>
      </div>
    </div>
  );
}
