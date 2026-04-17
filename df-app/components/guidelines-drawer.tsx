"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

interface GuidelinesDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function GuidelinesDrawer({ open, onClose }: GuidelinesDrawerProps) {
  return (
    <Modal open={open} onClose={onClose} title="Annotation Guidelines" position="right">
      <div className="space-y-6">
        {/* Version info */}
        <div className="flex items-center gap-3">
          <Badge variant="info" animate={false}>v2.3</Badge>
          <span className="font-inter text-label-md text-tertiary-text">
            Last updated: April 10, 2026
          </span>
        </div>

        {/* Rendered guidelines content */}
        <div className="space-y-4 font-inter text-body-md text-ink">
          <h3 className="font-literata text-title-lg text-ink">1. Overview</h3>
          <p>
            You are evaluating model-generated responses for helpfulness, accuracy, and safety.
            Each task presents a user prompt and one or more candidate responses. Your job is to
            select the response that best satisfies the evaluation criteria outlined below.
          </p>

          <h3 className="font-literata text-title-lg text-ink">2. Evaluation Criteria</h3>
          <ul className="ml-4 list-disc space-y-2 text-body-md text-ink">
            <li>
              <strong>Helpfulness:</strong> Does the response directly address the user&apos;s
              request? Does it provide actionable, relevant information?
            </li>
            <li>
              <strong>Accuracy:</strong> Are factual claims correct? Are code examples functional
              and free of bugs?
            </li>
            <li>
              <strong>Safety:</strong> Does the response avoid harmful, biased, or misleading
              content?
            </li>
            <li>
              <strong>Clarity:</strong> Is the response well-organized and easy to understand?
            </li>
          </ul>

          <h3 className="font-literata text-title-lg text-ink">3. Preference Scale</h3>
          <p>When comparing two responses, use the following scale:</p>
          <ul className="ml-4 list-disc space-y-2 text-body-md text-ink">
            <li><strong>A is better:</strong> Response A is clearly superior across most criteria.</li>
            <li><strong>A slightly better:</strong> Response A has marginal advantages.</li>
            <li><strong>Tie:</strong> Both responses are roughly equivalent in quality.</li>
            <li><strong>B slightly better:</strong> Response B has marginal advantages.</li>
            <li><strong>B is better:</strong> Response B is clearly superior across most criteria.</li>
          </ul>

          <h3 className="font-literata text-title-lg text-ink">4. Code Evaluation</h3>
          <p>When responses contain code, pay special attention to:</p>
          <pre className="overflow-x-auto rounded-standard bg-level-1 p-3 font-mono text-code-sm">
{`// Check for:
// 1. Correctness — does it compile/run?
// 2. Edge cases — are boundary conditions handled?
// 3. Efficiency — is the time/space complexity reasonable?
// 4. Readability — are variable names clear?`}
          </pre>

          <h3 className="font-literata text-title-lg text-ink">5. Flagging Issues</h3>
          <p>
            Use the <strong>Flag</strong> button if you encounter any of the following:
          </p>
          <ul className="ml-4 list-disc space-y-2 text-body-md text-ink">
            <li>Prompt is ambiguous or incomplete</li>
            <li>Both responses are clearly harmful or unsafe</li>
            <li>Technical error prevents proper evaluation</li>
            <li>Response appears to be duplicated or truncated</li>
          </ul>

          <h3 className="font-literata text-title-lg text-ink">6. Justification Requirements</h3>
          <p>
            All preference selections require a written justification of at least 20 characters.
            Explain your reasoning clearly, referencing specific aspects of each response. Avoid
            vague statements like &quot;A is better.&quot;
          </p>
        </div>
      </div>
    </Modal>
  );
}
