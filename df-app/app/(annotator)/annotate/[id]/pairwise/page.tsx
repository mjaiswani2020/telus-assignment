"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskHeader } from "@/components/annotator/task-header";
import { ResponsePanel } from "@/components/annotator/response-panel";
import { GuidelinesDrawer } from "@/components/guidelines-drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/cn";

const PROMPT_TEXT = `Write a function that implements merge sort in Python. The function should take a list of integers as input and return a new sorted list. Include proper error handling and type hints.`;

const RESPONSE_A = `Here's an implementation of merge sort with type hints and error handling:

\`\`\`python
def merge_sort(arr: list[int]) -> list[int]:
    """Sort a list of integers using merge sort algorithm."""
    if not isinstance(arr, list):
        raise TypeError("Input must be a list")
    if not all(isinstance(x, int) for x in arr):
        raise ValueError("All elements must be integers")

    if len(arr) <= 1:
        return arr.copy()

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return _merge(left, right)


def _merge(left: list[int], right: list[int]) -> list[int]:
    """Merge two sorted lists into a single sorted list."""
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

This implementation has O(n log n) time complexity and O(n) space complexity. The \`_merge\` helper keeps the main function clean.`;

const RESPONSE_B = `Here's merge sort in Python:

\`\`\`python
def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left_half = merge_sort(arr[:mid])
    right_half = merge_sort(arr[mid:])

    sorted_arr = []
    left_idx, right_idx = 0, 0

    while left_idx < len(left_half) and right_idx < len(right_half):
        if left_half[left_idx] < right_half[right_idx]:
            sorted_arr.append(left_half[left_idx])
            left_idx += 1
        else:
            sorted_arr.append(right_half[right_idx])
            right_idx += 1

    sorted_arr += left_half[left_idx:]
    sorted_arr += right_half[right_idx:]
    return sorted_arr
\`\`\`

You can use it like: \`merge_sort([3, 1, 4, 1, 5, 9, 2, 6])\` which returns \`[1, 1, 2, 3, 4, 5, 6, 9]\`.`;

const PREFERENCE_OPTIONS = [
  { key: "a-better", label: "A is better" },
  { key: "a-slightly", label: "A slightly" },
  { key: "tie", label: "Tie" },
  { key: "b-slightly", label: "B slightly" },
  { key: "b-better", label: "B is better" },
] as const;

type PreferenceKey = (typeof PREFERENCE_OPTIONS)[number]["key"];

export default function PairwisePage() {
  const [preference, setPreference] = useState<PreferenceKey | null>(null);
  const [justification, setJustification] = useState("");
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!preference || justification.length < 20) return;
    // Submit logic would go here
  }, [preference, justification]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === "a" || e.key === "A") setPreference("a-better");
      if (e.key === "b" || e.key === "B") setPreference("b-better");
      if (e.key === "Enter" && preference && justification.length >= 20) handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [preference, justification, handleSubmit]);

  return (
    <>
      <TaskHeader
        taskName="Pairwise Preference"
        subtitle="Llama Helpfulness Eval — Round 3"
        progress={{ current: 47, total: 200 }}
        timer="1:23"
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

        {/* Response panels */}
        <div className="grid grid-cols-2 gap-3">
          <ResponsePanel
            label="A"
            title="Response A"
            content={RESPONSE_A}
            tokenCount={235}
            selected={preference === "a-better" || preference === "a-slightly"}
          />
          <ResponsePanel
            label="B"
            title="Response B"
            content={RESPONSE_B}
            tokenCount={189}
            selected={preference === "b-better" || preference === "b-slightly"}
          />
        </div>

        {/* Preference bar */}
        <div>
          <p className="mb-3 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Which response is better?
          </p>
          <div className="flex gap-1 rounded-comfortable bg-level-1 p-1">
            {PREFERENCE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setPreference(opt.key)}
                className={cn(
                  "flex-1 rounded-standard px-3 py-2.5 font-inter text-label-md font-medium transition-colors duration-150",
                  preference === opt.key
                    ? "bg-deep-teal text-white"
                    : "text-secondary-text hover:bg-white hover:text-ink"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Justification */}
        <div>
          <Textarea
            label="Justification (required)"
            placeholder="Explain your preference in at least 20 characters..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            helper={
              justification.length > 0 && justification.length < 20
                ? `${20 - justification.length} more characters needed`
                : undefined
            }
            error={
              justification.length > 0 && justification.length < 20
                ? "Minimum 20 characters required"
                : undefined
            }
            className="min-h-[120px]"
          />
        </div>

        {/* Submit */}
        <div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!preference || justification.length < 20}
            onClick={handleSubmit}
          >
            Submit &crarr; Enter
          </Button>
        </div>
      </div>

      <GuidelinesDrawer open={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </>
  );
}
