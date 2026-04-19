"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore, type Difficulty } from "@/stores/session-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  AlertTriangle,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Difficulty helpers                                                 */
/* ------------------------------------------------------------------ */

const difficultyConfig: Record<
  Difficulty,
  { color: string; bg: string; border: string; dot: string }
> = {
  Easy: {
    color: "text-[#059669]",
    bg: "bg-[#ECFDF5]",
    border: "border-[#A7F3D0]",
    dot: "bg-[#059669]",
  },
  Medium: {
    color: "text-[#D97706]",
    bg: "bg-[#FFF7ED]",
    border: "border-[#FED7AA]",
    dot: "bg-[#D97706]",
  },
  Hard: {
    color: "text-[#EA580C]",
    bg: "bg-[#FFF7ED]",
    border: "border-[#FDBA74]",
    dot: "bg-[#EA580C]",
  },
  Expert: {
    color: "text-[#DC2626]",
    bg: "bg-[#FEF2F2]",
    border: "border-[#FECACA]",
    dot: "bg-[#DC2626]",
  },
};

/* ------------------------------------------------------------------ */
/*  Circular progress ring                                             */
/* ------------------------------------------------------------------ */

function PerformanceRing({
  correct,
  total,
  size = 80,
  strokeWidth = 6,
}: {
  correct: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? correct / total : 0;
  const offset = circumference - ratio * circumference;

  const ringColor =
    ratio >= 0.8
      ? "#059669"
      : ratio >= 0.6
        ? "#D97706"
        : "#DC2626";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EBEEED"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-literata text-[18px] font-semibold leading-tight text-ink">
          {correct}/{total}
        </span>
        <span className="font-inter text-[10px] uppercase tracking-wider text-tertiary-text">
          Gold
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cohort comparison bar                                              */
/* ------------------------------------------------------------------ */

function CohortBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const percent = Math.round(value * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-inter text-[11px] font-medium text-secondary-text">{label}</span>
        <span className="font-inter text-[11px] font-semibold text-ink">{percent}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#EBEEED]">
        <motion.div
          className="h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini performance dot (collapsed state)                             */
/* ------------------------------------------------------------------ */

function MiniDot({ ratio }: { ratio: number }) {
  const color = ratio >= 0.8 ? "bg-[#059669]" : ratio >= 0.6 ? "bg-[#D97706]" : "bg-[#DC2626]";
  return <span className={cn("block h-2 w-2 rounded-full", color)} />;
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                         */
/* ------------------------------------------------------------------ */

const panelVariants = {
  collapsed: { width: 40, transition: { duration: 0.22, ease: "easeInOut" as const } },
  expanded: { width: 280, transition: { duration: 0.22, ease: "easeInOut" as const } },
};

const contentVariants = {
  hidden: { opacity: 0, transition: { duration: 0.1 } },
  visible: { opacity: 1, transition: { duration: 0.18, delay: 0.08 } },
};

export function QualityFeedbackPanel() {
  const [expanded, setExpanded] = useState(false);

  const {
    sessionAnnotations,
    goldCorrect,
    goldTotal,
    avgTimeSeconds,
    streak,
    teamAvgGoldAccuracy,
    currentDifficulty,
    showCalibrationNudge,
    calibrationMessage,
    dismissCalibrationNudge,
    getGoldAccuracy,
  } = useSessionStore();

  const goldAccuracy = getGoldAccuracy();
  const dc = difficultyConfig[currentDifficulty];

  return (
    <motion.div
      className="fixed right-0 top-[57px] bottom-0 z-40 flex border-l border-[#EBEEED] bg-[#F7F8F8] shadow-sm"
      variants={panelVariants}
      initial="collapsed"
      animate={expanded ? "expanded" : "collapsed"}
    >
      {/* ------ Collapsed strip ------ */}
      <div
        className={cn(
          "flex w-10 shrink-0 flex-col items-center gap-3 pt-4 cursor-pointer",
          expanded && "border-r border-[#EBEEED]"
        )}
        onClick={() => setExpanded(!expanded)}
        title={expanded ? "Collapse quality panel" : "Expand quality panel"}
      >
        {/* Toggle icon */}
        <span className="flex h-6 w-6 items-center justify-center rounded-standard text-tertiary-text hover:text-ink transition-colors">
          {expanded ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </span>

        {/* Rotated "Quality" label */}
        <span
          className="font-inter text-[10px] font-semibold uppercase tracking-[0.08em] text-secondary-text"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Quality
        </span>

        {/* Mini difficulty badge */}
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold",
            dc.bg,
            dc.color
          )}
          title={currentDifficulty}
        >
          {currentDifficulty[0]}
        </span>

        {/* Mini performance dot */}
        <MiniDot ratio={goldAccuracy} />
      </div>

      {/* ------ Expanded content ------ */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="flex-1 overflow-y-auto overflow-x-hidden"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="space-y-5 p-4">
              {/* ---- Header ---- */}
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#005151]" />
                <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-[#005151]">
                  Quality Feedback
                </span>
              </div>

              {/* ---- Difficulty indicator ---- */}
              <div>
                <p className="mb-1.5 font-inter text-[10px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                  Task Difficulty
                </p>
                <Badge
                  variant={
                    currentDifficulty === "Easy"
                      ? "success"
                      : currentDifficulty === "Medium"
                        ? "caution"
                        : currentDifficulty === "Hard"
                          ? "caution"
                          : "error"
                  }
                  animate={false}
                  dot
                >
                  {currentDifficulty}
                </Badge>
              </div>

              {/* ---- Session performance ring ---- */}
              <div>
                <p className="mb-2 font-inter text-[10px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                  Gold Accuracy
                </p>
                <div className="flex justify-center rounded-standard border border-[#EBEEED] bg-white p-4">
                  <PerformanceRing correct={goldCorrect} total={goldTotal} />
                </div>
              </div>

              {/* ---- Cohort comparison ---- */}
              <div>
                <p className="mb-2 font-inter text-[10px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                  Cohort Comparison
                </p>
                <div className="space-y-2.5 rounded-standard border border-[#EBEEED] bg-white p-3">
                  <CohortBar
                    label="You"
                    value={goldAccuracy}
                    color="#005151"
                  />
                  <CohortBar
                    label="Team Avg"
                    value={teamAvgGoldAccuracy}
                    color="#94A3B8"
                  />
                </div>
              </div>

              {/* ---- Calibration nudge ---- */}
              <AnimatePresence>
                {showCalibrationNudge && (
                  <motion.div
                    className="rounded-standard border border-[#FDE68A] bg-[#FFFBEB] p-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D97706]" />
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-[11px] font-semibold text-[#92400E]">
                          Calibration Nudge
                        </p>
                        <p className="mt-0.5 font-inter text-[11px] leading-[16px] text-[#92400E]">
                          {calibrationMessage}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissCalibrationNudge();
                        }}
                        className="shrink-0 rounded-tight p-0.5 text-[#D97706] hover:bg-[#FEF3C7] transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ---- Session stats footer ---- */}
              <div>
                <p className="mb-2 font-inter text-[10px] font-medium uppercase tracking-[0.06em] text-tertiary-text">
                  Session Stats
                </p>
                <div className="space-y-2 rounded-standard border border-[#EBEEED] bg-white p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3 w-3 text-tertiary-text" />
                      <span className="font-inter text-[11px] text-secondary-text">Today</span>
                    </div>
                    <span className="font-inter text-[12px] font-semibold text-ink">
                      {sessionAnnotations}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-tertiary-text" />
                      <span className="font-inter text-[11px] text-secondary-text">Avg Time</span>
                    </div>
                    <span className="font-inter text-[12px] font-semibold text-ink">
                      {Math.floor(avgTimeSeconds / 60)}m {avgTimeSeconds % 60}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Flame className="h-3 w-3 text-[#EA580C]" />
                      <span className="font-inter text-[11px] text-secondary-text">Streak</span>
                    </div>
                    <span className="font-inter text-[12px] font-semibold text-ink">
                      {streak}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
