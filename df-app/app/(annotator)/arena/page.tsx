"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TaskHeader } from "@/components/annotator/task-header";
import { ResponsePanel } from "@/components/annotator/response-panel";
import { GuidelinesDrawer } from "@/components/guidelines-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

const PROMPT_TEXT = `Write a Python function that finds all pairs of numbers in a list that sum to a given target. The function should handle duplicates correctly and return unique pairs only.`;

const MODEL_A_CONTENT = `Here's an efficient solution using a hash set approach:

\`\`\`python
from typing import List, Tuple, Set

def find_pairs(nums: List[int], target: int) -> List[Tuple[int, int]]:
    """Find all unique pairs that sum to target."""
    seen: Set[int] = set()
    pairs: Set[Tuple[int, int]] = set()

    for num in nums:
        complement = target - num
        if complement in seen:
            # Always store smaller number first for uniqueness
            pair = (min(num, complement), max(num, complement))
            pairs.add(pair)
        seen.add(num)

    return sorted(list(pairs))
\`\`\`

**Time complexity:** O(n) average case
**Space complexity:** O(n)

This approach:
1. Uses a set to track numbers we've seen
2. For each number, checks if its complement exists
3. Stores pairs in normalized order (smaller first) to avoid duplicates
4. Returns sorted results for deterministic output`;

const MODEL_B_CONTENT = `Here's how to find all pairs summing to a target:

\`\`\`python
def find_pairs(nums, target):
    """
    Find unique pairs in nums that sum to target.
    Returns list of tuples sorted in ascending order.
    """
    nums_sorted = sorted(nums)
    left, right = 0, len(nums_sorted) - 1
    result = []

    while left < right:
        current_sum = nums_sorted[left] + nums_sorted[right]

        if current_sum == target:
            pair = (nums_sorted[left], nums_sorted[right])
            if pair not in result:
                result.append(pair)
            left += 1
            right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return result
\`\`\`

Uses the two-pointer technique on a sorted array. Time is O(n log n) due to sorting, space is O(1) extra (not counting output). Clean and readable approach that naturally handles the sorted output requirement.`;

type Preference = "a" | "tie" | "b" | null;

export default function ArenaPage() {
  const [preference, setPreference] = useState<Preference>(null);
  const [submitted, setSubmitted] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [progress, setProgress] = useState(12);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!preference) return;
    setSubmitted(true);
    setProgress((p) => p + 1);
    toast("Verdict submitted — models revealed!", "success");
  };

  return (
    <>
      <TaskHeader
        taskName="Model Arena"
        subtitle="Blind Model Comparison"
        progress={{ current: progress, total: 100 }}
        timer="0:48"
        onGuidelines={() => setGuidelinesOpen(true)}
      />

      <div className="stagger-children mx-auto max-w-[1440px] space-y-4 px-8 py-6">
        {/* Blind badge */}
        <div className="flex justify-center">
          <Badge variant="arena" animate={false}>
            Blind &mdash; model identities hidden
          </Badge>
        </div>

        {/* Prompt */}
        <div>
          <p className="mb-2 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Prompt
          </p>
          <div className="rounded-comfortable bg-level-1 px-5 py-4">
            <p className="font-inter text-body-md text-ink">{PROMPT_TEXT}</p>
          </div>
        </div>

        {/* Response panels */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <ResponsePanel
              label="A"
              title="Model A"
              content={MODEL_A_CONTENT}
              tokenCount={198}
              selected={preference === "a"}
            />
            {submitted && preference === "a" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2 rounded-standard bg-[#ECFDF5] px-3 py-2 border border-[#A7F3D0]"
              >
                <span className="font-inter text-label-md font-bold text-success">Winner</span>
                <span className="font-inter text-label-md text-ink">GPT-4-Turbo</span>
              </motion.div>
            )}
            {submitted && preference !== "a" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 rounded-standard bg-level-1 px-3 py-2"
              >
                <span className="font-inter text-label-md text-secondary-text">GPT-4-Turbo</span>
              </motion.div>
            )}
          </div>
          <div className="relative">
            <ResponsePanel
              label="B"
              title="Model B"
              content={MODEL_B_CONTENT}
              tokenCount={172}
              selected={preference === "b"}
            />
            {submitted && preference === "b" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2 rounded-standard bg-[#ECFDF5] px-3 py-2 border border-[#A7F3D0]"
              >
                <span className="font-inter text-label-md font-bold text-success">Winner</span>
                <span className="font-inter text-label-md text-ink">Llama-3-70B</span>
              </motion.div>
            )}
            {submitted && preference !== "b" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 rounded-standard bg-level-1 px-3 py-2"
              >
                <span className="font-inter text-label-md text-secondary-text">Llama-3-70B</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Preference buttons */}
        {!submitted ? (
          <div className="flex justify-center gap-3">
            <Button
              variant={preference === "a" ? "primary" : "secondary"}
              size="md"
              onClick={() => setPreference("a")}
              className={cn(
                preference === "a" && "bg-[#B45309] border-[#B45309] hover:bg-[#92400E]"
              )}
            >
              A is better
            </Button>
            <Button
              variant={preference === "tie" ? "primary" : "secondary"}
              size="md"
              onClick={() => setPreference("tie")}
              className={cn(
                preference === "tie" && "bg-[#B45309] border-[#B45309] hover:bg-[#92400E]"
              )}
            >
              Tie
            </Button>
            <Button
              variant={preference === "b" ? "primary" : "secondary"}
              size="md"
              onClick={() => setPreference("b")}
              className={cn(
                preference === "b" && "bg-[#B45309] border-[#B45309] hover:bg-[#92400E]"
              )}
            >
              B is better
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-inter text-body-md text-success font-medium">
              Submitted! Model identities revealed above.
            </p>
          </div>
        )}

        {/* Footer note */}
        <div className="text-center">
          <p className="font-inter text-label-md text-tertiary-text">
            {submitted
              ? "Model identities have been revealed."
              : "Models revealed after submit"}
          </p>
        </div>

        {/* Submit button */}
        {!submitted && (
          <div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!preference}
              onClick={handleSubmit}
            >
              Submit Verdict
            </Button>
          </div>
        )}
      </div>

      <GuidelinesDrawer open={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </>
  );
}
