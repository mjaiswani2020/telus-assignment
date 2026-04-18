"use client";

import { useState, useCallback } from "react";
import { TaskHeader } from "@/components/annotator/task-header";
import { GuidelinesDrawer } from "@/components/guidelines-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface RankItem {
  id: string;
  label: string;
  title: string;
  preview: string;
  tokenCount: number;
}

const PROMPT_TEXT = `Explain the concept of "technical debt" to a non-technical project manager, including why it matters and how to manage it.`;

const initialItems: RankItem[] = [
  {
    id: "a",
    label: "A",
    title: "Response A",
    preview:
      "Technical debt is like taking a shortcut when building something — it gets you there faster now, but you'll need to go back and fix it later. In software, it happens when developers choose a quick solution instead of the best one, often due to time pressure. Over time, this accumulates and makes the codebase harder to maintain...",
    tokenCount: 245,
  },
  {
    id: "b",
    label: "B",
    title: "Response B",
    preview:
      "Technical debt refers to the implied cost of additional rework caused by choosing an easy (limited) solution now instead of using a better approach that would take longer. It was coined by Ward Cunningham in 1992. The metaphor relates to financial debt: just as financial debt accrues interest, technical debt accrues maintenance overhead...",
    tokenCount: 312,
  },
  {
    id: "c",
    label: "C",
    title: "Response C",
    preview:
      "Think of your software like a house. When builders cut corners — skipping proper foundations, using cheap materials — the house still stands, but problems compound. Technical debt works the same way. Every shortcut in code creates future work: bugs get harder to fix, features take longer to add, and eventually the team spends more time fighting old code than building new things...",
    tokenCount: 198,
  },
  {
    id: "d",
    label: "D",
    title: "Response D",
    preview:
      "Technical debt is when developers write code that works but isn't ideal. It needs to be refactored later. You should track it and schedule time to address it. Use tools like SonarQube to measure it. Allocate 20% of sprint capacity to debt reduction. Have regular code reviews to prevent new debt.",
    tokenCount: 156,
  },
];

export default function RankPage() {
  const [items, setItems] = useState<RankItem[]>(initialItems);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  const moveUp = useCallback((index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setItems((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  return (
    <>
      <TaskHeader
        taskName="Response Ranking"
        subtitle="N-Way Ranking"
        progress={{ current: 8, total: 40 }}
        timer="3:01"
        onGuidelines={() => setGuidelinesOpen(true)}
      />

      <div className="stagger-children mx-auto max-w-[1440px] space-y-4 px-8 py-6">
        {/* Prompt */}
        <div>
          <p className="mb-2 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Prompt
          </p>
          <div className="rounded-comfortable bg-level-1 px-5 py-4">
            <p className="font-inter text-body-md text-ink">{PROMPT_TEXT}</p>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <p className="font-inter text-body-md font-medium text-ink">
            Drag responses to rank them (1 = best, 4 = worst):
          </p>
        </div>

        {/* Ranking cards */}
        <div className="space-y-2.5">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-4 rounded-comfortable border bg-white px-5 py-4 transition-all duration-150",
                index === 0
                  ? "border-l-4 border-l-deep-teal border-t-level-2 border-r-level-2 border-b-level-2"
                  : "border-level-2"
              )}
            >
              {/* Rank number */}
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-inter text-[14px] font-bold",
                  index === 0
                    ? "bg-deep-teal text-white"
                    : "bg-level-1 text-secondary-text"
                )}
              >
                {index + 1}
              </span>

              {/* Up/Down buttons */}
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className={cn(
                    "rounded-tight p-1 transition-colors",
                    index === 0
                      ? "text-level-2 cursor-not-allowed"
                      : "text-secondary-text hover:bg-level-1 hover:text-ink"
                  )}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === items.length - 1}
                  className={cn(
                    "rounded-tight p-1 transition-colors",
                    index === items.length - 1
                      ? "text-level-2 cursor-not-allowed"
                      : "text-secondary-text hover:bg-level-1 hover:text-ink"
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Response content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-teal font-inter text-[11px] font-bold text-white">
                    {item.label}
                  </span>
                  <span className="font-inter text-body-md font-medium text-ink">
                    {item.title}
                  </span>
                  <Badge variant="neutral" animate={false} className="ml-auto">
                    {item.tokenCount} tokens
                  </Badge>
                </div>
                <p className="mt-2 font-inter text-body-md text-secondary-text line-clamp-2">
                  {item.preview}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div>
          <Button variant="primary" size="lg" className="w-full">
            Submit Ranking &crarr; Enter
          </Button>
        </div>
      </div>

      <GuidelinesDrawer open={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </>
  );
}
