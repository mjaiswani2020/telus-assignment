"use client";

import { useState } from "react";
import { HeaderBar } from "@/components/annotator/header-bar";
import { ResponsePanel } from "@/components/annotator/response-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

const STAGES = [
  { label: "Instructions", complete: true },
  { label: "Calibration", active: true },
  { label: "Solo", complete: false },
  { label: "Results", complete: false },
];

const PROMPT_TEXT = `Write a function to check if a binary tree is balanced. A balanced tree is defined as one where the depth of the two subtrees of every node never differs by more than one.`;

const CODE_A = `Here's an efficient O(n) solution:

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_balanced(root: TreeNode | None) -> bool:
    def check(node: TreeNode | None) -> int:
        if node is None:
            return 0

        left_height = check(node.left)
        if left_height == -1:
            return -1

        right_height = check(node.right)
        if right_height == -1:
            return -1

        if abs(left_height - right_height) > 1:
            return -1

        return max(left_height, right_height) + 1

    return check(root) != -1
\`\`\`

This uses a bottom-up approach that short-circuits on finding an imbalance, achieving O(n) time and O(h) space where h is the tree height.`;

const CODE_B = `Here's my solution:

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_balanced(root):
    if root is None:
        return True

    def height(node):
        if node is None:
            return 0
        return 1 + max(height(node.left), height(node.right))

    left_h = height(root.left)
    right_h = height(root.right)

    return (abs(left_h - right_h) <= 1 and
            is_balanced(root.left) and
            is_balanced(root.right))
\`\`\`

Checks each node by computing left and right subtree heights and recursively verifying balance. Simple and readable approach.`;

export default function QualificationPage() {
  const [answer, setAnswer] = useState<"a" | "b" | null>(null);

  return (
    <>
      <HeaderBar />
      <div className="stagger-children mx-auto max-w-[1440px] px-8 py-8 space-y-4">
        {/* Segmented progress bar */}
      <div className="flex gap-2">
        {STAGES.map((stage, idx) => (
          <div key={stage.label} className="flex-1">
            <div
              className={cn(
                "h-2 rounded-full",
                stage.complete
                  ? "bg-deep-teal"
                  : stage.active
                    ? "bg-deep-teal/60"
                    : "bg-level-2"
              )}
            />
            <p
              className={cn(
                "mt-1 text-center font-inter text-label-sm",
                stage.active ? "font-medium text-ink" : "text-tertiary-text"
              )}
            >
              {idx + 1}. {stage.label}
            </p>
          </div>
        ))}
      </div>

      {/* Calibration badge */}
      <div className="flex justify-center">
        <Badge variant="pairwise">Calibration Question</Badge>
      </div>

      {/* Instructions */}
      <div>
        <p className="text-center font-inter text-body-md text-secondary-text">
          Compare the two code responses below and select which one is better.
          Consider correctness, efficiency, readability, and best practices.
        </p>
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

      {/* Two code response panels */}
      <div className="grid grid-cols-2 gap-3">
        <ResponsePanel
          label="A"
          title="Response A"
          content={CODE_A}
          tokenCount={187}
          selected={answer === "a"}
        />
        <ResponsePanel
          label="B"
          title="Response B"
          content={CODE_B}
          tokenCount={152}
          selected={answer === "b"}
        />
      </div>

      {/* Answer buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant={answer === "a" ? "primary" : "secondary"}
          size="md"
          onClick={() => setAnswer("a")}
        >
          A is better
        </Button>
        <Button
          variant={answer === "b" ? "primary" : "secondary"}
          size="md"
          onClick={() => setAnswer("b")}
        >
          B is better
        </Button>
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between border-t border-level-2 pt-6">
        <Button variant="ghost" size="default" icon={<ChevronLeft className="h-4 w-4" />}>
          Previous
        </Button>

        <span className="font-inter text-label-md text-tertiary-text">
          Stage 2: 8 of 12 questions completed
        </span>

        <Button
          variant="primary"
          size="default"
          iconRight={<ChevronRight className="h-4 w-4" />}
          disabled={!answer}
        >
          Next Question
        </Button>
      </div>
      </div>
    </>
  );
}
