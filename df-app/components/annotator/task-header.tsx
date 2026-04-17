"use client";

import { useState } from "react";
import { BookOpen, Flag, SkipForward, Timer } from "lucide-react";
import { cn } from "@/lib/cn";

interface TaskHeaderProps {
  taskName: string;
  subtitle?: string;
  progress: { current: number; total: number };
  timer?: string;
  onGuidelines?: () => void;
  onFlag?: () => void;
  onSkip?: () => void;
  className?: string;
}

export function TaskHeader({
  taskName,
  subtitle,
  progress,
  timer = "0:00",
  onGuidelines,
  onFlag,
  onSkip,
  className,
}: TaskHeaderProps) {
  return (
    <header className={cn("flex items-center justify-between bg-deep-teal px-6 py-3", className)}>
      {/* Left: task info */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[15px] font-bold tracking-[0.08em] text-white">
              <span className="opacity-70">DF</span>{"  "}DATAFORGE
            </span>
          </div>
          <p className="mt-0.5 font-inter text-[13px] text-white/60">{taskName}</p>
          {subtitle && (
            <p className="font-inter text-[12px] text-white/50">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Center: progress */}
      <div className="flex items-center gap-6">
        <span className="font-inter text-[14px] text-white/70">
          {progress.current} / {progress.total}
        </span>
        <div className="flex items-center gap-1.5 text-white/70">
          <Timer className="h-4 w-4" />
          <span className="font-mono text-[14px]">{timer}</span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGuidelines}
          className="flex items-center gap-1.5 rounded-standard border border-white/40 px-3 py-1.5 font-inter text-[13px] font-medium text-white transition-colors hover:bg-white/10"
        >
          <BookOpen className="h-4 w-4" />
          Guidelines
        </button>
        <button
          onClick={onFlag}
          className="flex items-center gap-1.5 rounded-standard border border-white/40 px-3 py-1.5 font-inter text-[13px] font-medium text-white transition-colors hover:bg-white/10"
        >
          <Flag className="h-4 w-4" />
          Flag
        </button>
        <button
          onClick={onSkip}
          className="flex items-center gap-1.5 rounded-standard border border-white/40 px-3 py-1.5 font-inter text-[13px] font-medium text-white transition-colors hover:bg-white/10"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </button>
      </div>
    </header>
  );
}
