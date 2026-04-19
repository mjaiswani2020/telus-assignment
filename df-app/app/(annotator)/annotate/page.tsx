"use client";

import { HeaderBar } from "@/components/annotator/header-bar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, Clock, Target, Zap } from "lucide-react";
import Link from "next/link";

export default function AnnotatorHomePage() {
  return (
    <>
      <HeaderBar />
      <div className="stagger-children mx-auto max-w-[1440px] space-y-6 px-8 py-8">
        {/* Page heading */}
      <div>
        <h1 className="font-literata text-headline-md text-ink">Welcome back, Marcus</h1>
        <p className="mt-1 font-inter text-body-md text-secondary-text">
          Here is your annotation dashboard for today.
        </p>
      </div>

      {/* Performance cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Today */}
        <div className="rounded-comfortable border border-level-2 bg-white p-4">
          <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
            Today
          </p>
          <p className="mt-2 font-literata text-display-lg text-ink">47</p>
          <ProgressBar value={47} max={60} className="mt-3" />
          <p className="mt-2 font-inter text-label-md text-tertiary-text">Target: 60 tasks</p>
        </div>

        {/* This week */}
        <div className="rounded-comfortable border border-level-2 bg-white p-4">
          <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
            This Week
          </p>
          <p className="mt-2 font-literata text-display-lg text-ink">186</p>
          <ProgressBar value={186} max={300} color="bg-caution" className="mt-3" />
          <p className="mt-2 font-inter text-label-md text-tertiary-text">Target: 300 tasks</p>
        </div>

        {/* Quality */}
        <div className="rounded-comfortable border border-level-2 bg-white p-4">
          <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
            Quality
          </p>
          <div className="mt-2 flex items-end gap-6">
            <div>
              <p className="font-literata text-display-lg text-ink">82%</p>
              <p className="font-inter text-label-md text-tertiary-text">Gold accuracy</p>
            </div>
            <div>
              <p className="font-literata text-display-lg text-ink">0.76</p>
              <p className="font-inter text-label-md text-tertiary-text">Peer IAA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Calibration Banner */}
      <div className="flex items-center justify-between rounded-comfortable border border-[#D97706] bg-[#FEF3C7] px-5 py-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[#D97706]" />
          <span className="font-inter text-body-md font-medium text-[#92400E]">
            Complete your safety calibration to unlock safety task assignments
          </span>
        </div>
        <Link
          href="/annotate/calibration/safety"
          className="inline-flex items-center gap-1 font-inter text-label-md font-semibold text-[#D97706] transition-colors hover:text-[#B45309]"
        >
          Start Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Calibration Cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Triggered Calibration Card */}
        <div className="rounded-comfortable border border-level-2 border-l-[4px] border-l-[#D97706] bg-[#FFFBEB] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#D97706]" />
              <span className="font-inter text-body-lg font-semibold text-ink">
                Calibration Exercise
              </span>
            </div>
            <Badge variant="caution" dot>Required</Badge>
          </div>
          <p className="mt-2 font-inter text-body-md text-secondary-text">
            Your safety task accuracy dropped below 70%. Complete this calibration to
            continue safety assignments.
          </p>
          <p className="mt-1.5 font-inter text-label-md text-tertiary-text">
            5 pre-adjudicated safety comparisons with expert feedback
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-inter text-label-md text-tertiary-text">
              Due: Before next safety task assignment
            </span>
            <Link href="/annotate/calibration/safety">
              <Button variant="primary" size="default">
                Start Calibration
              </Button>
            </Link>
          </div>
        </div>

        {/* Scheduled Calibration Card */}
        <div className="rounded-comfortable border border-level-2 bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary-text" />
              <span className="font-inter text-body-lg font-medium text-ink">
                Weekly Calibration
              </span>
            </div>
            <Badge variant="neutral">3 tasks</Badge>
          </div>
          <p className="mt-2 font-inter text-label-md text-tertiary-text">
            Last completed: Apr 11, 2026 &middot; Next due: Apr 18, 2026
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-[#D97706]" />
              <span className="font-inter text-label-md font-medium text-[#D97706]">
                Streak: 12 weeks
              </span>
            </div>
            <Link href="/annotate/calibration/weekly">
              <Button variant="ghost" size="default">
                Start
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Task Queue */}
      <section className="space-y-3">
        <h2 className="font-literata text-title-lg text-ink">Your Task Queue</h2>

        <div className="space-y-2.5">
          {/* Task 1 - Pairwise */}
          <div className="flex items-center justify-between rounded-comfortable border border-level-2 bg-white px-5 py-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-inter text-body-lg font-medium text-ink">
                  Llama Helpfulness Eval &mdash; Round 3
                </span>
                <Badge variant="pairwise">Pairwise</Badge>
              </div>
              <div className="mt-1 flex items-center gap-2 font-inter text-label-md text-tertiary-text">
                <span>153 tasks remaining</span>
                <span>&middot;</span>
                <Clock className="h-3.5 w-3.5" />
                <span>~20 min est</span>
              </div>
            </div>
            <Link href="/annotate/task-1/pairwise">
              <Button variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
                Start
              </Button>
            </Link>
          </div>

          {/* Task 2 - Safety */}
          <div className="flex items-center justify-between rounded-comfortable border border-level-2 bg-white px-5 py-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-inter text-body-lg font-medium text-ink">
                  Safety Red-Teaming &mdash; Round 5
                </span>
                <Badge variant="safety">Safety</Badge>
              </div>
              <div className="mt-1 flex items-center gap-2 font-inter text-label-md text-tertiary-text">
                <span>38 tasks remaining</span>
                <span>&middot;</span>
                <Clock className="h-3.5 w-3.5" />
                <span>~45 min est</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-caution" />
                <span className="font-inter text-label-md font-medium text-caution">
                  Adversarial testing
                </span>
              </div>
            </div>
            <Link href="/red-team">
              <Button variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                Start
              </Button>
            </Link>
          </div>

          {/* Task 3 - Arena */}
          <div className="flex items-center justify-between rounded-comfortable border border-level-2 bg-white px-5 py-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-inter text-body-lg font-medium text-ink">
                  Arena Eval &mdash; GPT-4 vs Llama 70B
                </span>
                <Badge variant="arena">Arena</Badge>
              </div>
              <div className="mt-1 flex items-center gap-2 font-inter text-label-md text-tertiary-text">
                <span>25 tasks remaining</span>
                <span>&middot;</span>
                <Clock className="h-3.5 w-3.5" />
                <span>~15 min est</span>
              </div>
            </div>
            <Link href="/arena">
              <Button variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                Start
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Qualification Tests */}
      <section className="space-y-3">
        <h2 className="font-literata text-title-lg text-ink">Qualification Tests</h2>

        <div className="rounded-comfortable border border-level-2 bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-inter text-body-lg font-medium text-ink">
                Code Evaluation Certification
              </span>
              <p className="mt-1 font-inter text-label-md text-tertiary-text">
                Unlocks code-related annotation tasks &middot; ~30 min
              </p>
            </div>
            <Link href="/annotate/qualification/code-eval">
              <Button variant="secondary">Take Test</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-3">
        <h2 className="font-literata text-title-lg text-ink">Recent Activity</h2>

        <div className="space-y-2.5 rounded-comfortable border border-level-2 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-inter text-body-md text-ink">
              Completed 12 pairwise tasks in &quot;Llama Helpfulness Eval&quot;
            </span>
            <span className="ml-auto font-inter text-label-md text-tertiary-text">2 hours ago</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-inter text-body-md text-ink">
              Passed Gold Question #47 with correct answer
            </span>
            <span className="ml-auto font-inter text-label-md text-tertiary-text">3 hours ago</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-info" />
            <span className="font-inter text-body-md text-ink">
              Started &quot;Safety Red-Teaming &mdash; Round 5&quot; task batch
            </span>
            <span className="ml-auto font-inter text-label-md text-tertiary-text">Yesterday</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-info" />
            <span className="font-inter text-body-md text-ink">
              Achieved 82% gold accuracy milestone
            </span>
            <span className="ml-auto font-inter text-label-md text-tertiary-text">Yesterday</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-inter text-body-md text-ink">
              Completed 35 tasks for weekly target
            </span>
            <span className="ml-auto font-inter text-label-md text-tertiary-text">2 days ago</span>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
