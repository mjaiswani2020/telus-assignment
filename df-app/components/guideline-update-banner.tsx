"use client";

import { Info, X } from "lucide-react";

interface GuidelineUpdateBannerProps {
  onDismiss: () => void;
  onReview: () => void;
}

export function GuidelineUpdateBanner({
  onDismiss,
  onReview,
}: GuidelineUpdateBannerProps) {
  return (
    <div className="flex items-center justify-between rounded-standard border border-[#2563EB] bg-[#EFF6FF] px-4 py-3">
      <div className="flex items-center gap-3">
        <Info className="h-5 w-5 shrink-0 text-[#2563EB]" />
        <p className="font-inter text-body-md text-ink">
          Guidelines updated to v2.4 &mdash; 2 new edge cases added to Safety
          section.{" "}
          <button
            onClick={onReview}
            className="font-medium text-[#2563EB] hover:underline"
          >
            Review changes &rarr;
          </button>
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 rounded-tight p-1 text-[#2563EB] transition-colors hover:bg-[#2563EB]/10"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
