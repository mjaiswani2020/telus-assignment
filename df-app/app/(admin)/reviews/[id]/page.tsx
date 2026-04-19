"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReviewStore } from "@/stores/review-store";
import { useToast } from "@/components/ui/toast";
import {
  ProvenancePanel,
  mockProvenanceNodes,
} from "@/components/admin/provenance-panel";

// Mock review detail data keyed by review item
const mockDetails: Record<
  string,
  {
    prompt: string;
    responseA: string;
    responseB: string;
    choice: string;
    justification: string;
    annotator: string;
  }
> = {
  default: {
    prompt:
      "Explain the difference between supervised fine-tuning (SFT) and reinforcement learning from human feedback (RLHF). When would you use each approach, and what are the trade-offs?",
    responseA:
      "SFT involves training a model on curated input-output pairs to learn specific behaviors. It's straightforward and works well when you have high-quality demonstration data. RLHF, on the other hand, uses human preference judgments to train a reward model, which then guides the policy model through reinforcement learning. SFT is typically used as a first stage, while RLHF refines the model's outputs to better align with human preferences. The main trade-off is that SFT requires expert-written responses, while RLHF can leverage comparative judgments which are easier to collect.",
    responseB:
      "Supervised fine-tuning and RLHF are both methods for aligning language models. SFT teaches the model by example -- you show it good responses and it learns to mimic them. RLHF is more nuanced: humans rank model outputs, a reward model learns these preferences, and then PPO or DPO optimizes the language model against this reward signal. You'd typically use SFT first to get a reasonable baseline, then apply RLHF to polish the model's behavior. Trade-offs include: SFT needs expensive expert demonstrations but is stable to train; RLHF can capture subtler preferences but introduces reward hacking risks and training instability.",
    choice: "Response B",
    justification:
      "Response B provides a more complete explanation with specific technical details (mentioning PPO and DPO by name) and offers a clearer discussion of the trade-offs. It also better addresses the 'when would you use each' part of the question with the sequential pipeline description.",
    annotator: "Marcus T.",
  },
};

// Mock peer comparison data
const mockPeerAnnotations = [
  {
    annotator: "Sarah K.",
    choice: "Response B",
    confidence: 85,
    timeSpent: "2m 14s",
  },
  {
    annotator: "James L.",
    choice: "Response B",
    confidence: 78,
    timeSpent: "1m 52s",
  },
  {
    annotator: "Elena R.",
    choice: "Response A",
    confidence: 62,
    timeSpent: "3m 08s",
  },
];

/* ---------- Auto-check result row ---------- */
function AutoCheckRow({
  label,
  passed,
  detail,
}: {
  label: string;
  passed: boolean | "warning";
  detail?: string;
}) {
  const icon =
    passed === true ? (
      <CheckCircle2 className="h-4 w-4 text-[#059669]" />
    ) : passed === "warning" ? (
      <AlertTriangle className="h-4 w-4 text-[#D97706]" />
    ) : (
      <XCircle className="h-4 w-4 text-[#DC2626]" />
    );

  const statusText =
    passed === true ? "Passed" : passed === "warning" ? "Warning" : "Failed";
  const statusColor =
    passed === true
      ? "text-[#059669]"
      : passed === "warning"
        ? "text-[#D97706]"
        : "text-[#DC2626]";

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-body-md font-medium text-ink">
            {label}
          </span>
          <span className={`font-inter text-[12px] font-medium ${statusColor}`}>
            {statusText}
          </span>
        </div>
        {detail && (
          <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const reviewId = params.id as string;
  const item = useReviewStore((s) => s.getItem(reviewId));
  const approve = useReviewStore((s) => s.approve);
  const reject = useReviewStore((s) => s.reject);
  const reassign = useReviewStore((s) => s.reassign);
  const escalate = useReviewStore((s) => s.escalate);

  if (!item) {
    return (
      <div className="py-20 text-center">
        <p className="font-inter text-body-lg text-tertiary-text">
          Review item not found.
        </p>
        <Link href="/reviews" className="mt-4 inline-block text-deep-teal hover:underline">
          Back to Review Queue
        </Link>
      </div>
    );
  }

  const detail = {
    ...mockDetails.default,
    annotator: item.flaggedBy,
  };
  const priorityVariant =
    item.priority === "High" ? "error" : item.priority === "Medium" ? "caution" : "neutral";

  // Derive auto-check details from item data
  const autoCheckDetails = [
    {
      label: "Gold Standard",
      passed: item.autoChecks.gold as boolean | "warning",
      detail: item.autoChecks.gold
        ? undefined
        : "3rd failure in last 50 items — declining accuracy pattern",
    },
    {
      label: "Time Threshold",
      passed: item.autoChecks.time as boolean | "warning",
      detail: item.autoChecks.time
        ? undefined
        : "23s < 45s minimum for this task type",
    },
    {
      label: "IAA Check",
      passed: item.autoChecks.iaa as boolean | "warning",
      detail: item.autoChecks.iaa
        ? undefined
        : "Disagrees with majority of peer annotators",
    },
    {
      label: "Consistency",
      passed: item.autoChecks.consistency
        ? (true as boolean | "warning")
        : ("warning" as boolean | "warning"),
      detail: item.autoChecks.consistency
        ? undefined
        : "Disagrees with 2/3 peers on this item",
    },
  ];

  const failedChecks = [
    !item.autoChecks.gold && "gold accuracy",
    !item.autoChecks.time && "time threshold",
    !item.autoChecks.iaa && "IAA agreement",
    !item.autoChecks.consistency && "response consistency",
  ].filter(Boolean);

  const suggestedAction =
    failedChecks.length >= 2
      ? "Reassign — annotator shows multiple quality signals requiring intervention"
      : item.tier === "escalated"
        ? "Escalate to senior reviewer — content requires policy-level adjudication"
        : "Review and adjudicate — single auto-check flag, likely addressable";

  return (
    <div>
      {/* Back link */}
      <Link
        href="/reviews"
        className="inline-flex items-center gap-1.5 font-inter text-body-md text-deep-teal hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Review Queue
      </Link>

      {/* Review header */}
      <motion.div
        className="mt-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="font-literata text-[28px] font-semibold text-ink">
          {item.title}
        </h1>
        <Badge variant={item.source === "Annotator" ? "flagged" : "caution"}>
          {item.source === "Annotator" ? "Flagged" : "Auto"}
        </Badge>
        <Badge variant={priorityVariant}>{item.priority}</Badge>
        <Badge variant={item.tier === "escalated" ? "error" : "caution"}>
          {item.tier === "escalated" ? "Escalated" : "Human Review"}
        </Badge>
      </motion.div>
      <p className="mt-2 font-inter text-body-md text-tertiary-text">
        {item.description}
      </p>

      <div className="stagger-children mt-4 space-y-4">
        {/* ── Automated Analysis Section ── */}
        <motion.div
          className="rounded-comfortable border border-level-2 bg-white p-5"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Automated Analysis
          </p>

          {/* Auto-check results */}
          <div className="mt-3 divide-y divide-level-2">
            {autoCheckDetails.map((check) => (
              <AutoCheckRow
                key={check.label}
                label={check.label}
                passed={check.passed}
                detail={check.detail}
              />
            ))}
          </div>

          {/* Confidence score */}
          <div className="mt-3 flex items-center gap-3 rounded-standard bg-level-1 px-3 py-2.5">
            <span className="font-inter text-[12px] text-tertiary-text">
              Confidence Score:
            </span>
            <span
              className={`font-inter text-body-md font-semibold ${
                item.confidence >= 70
                  ? "text-[#059669]"
                  : item.confidence >= 50
                    ? "text-[#D97706]"
                    : "text-[#DC2626]"
              }`}
            >
              {item.confidence}%
            </span>
          </div>

          {/* Suggested action */}
          <div className="mt-3 flex items-start gap-3 rounded-standard border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
            <div>
              <p className="font-inter text-[12px] font-medium text-[#D97706]">
                Suggested Action
              </p>
              <p className="mt-0.5 font-inter text-[13px] text-ink">
                {suggestedAction}
              </p>
            </div>
          </div>

          {/* Similar Annotations / Peer comparison */}
          <div className="mt-4">
            <p className="mb-2 font-inter text-[12px] font-medium uppercase tracking-[0.5px] text-secondary-text">
              Similar Annotations (Peer Comparison)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {mockPeerAnnotations.map((peer) => (
                <div
                  key={peer.annotator}
                  className="rounded-standard border border-level-2 bg-level-1 px-3 py-2.5"
                >
                  <p className="font-inter text-[12px] font-medium text-ink">
                    {peer.annotator}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge
                      variant={
                        peer.choice === detail.choice ? "success" : "caution"
                      }
                      animate={false}
                    >
                      {peer.choice}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="font-inter text-[11px] text-tertiary-text">
                      {peer.confidence}% confidence
                    </span>
                    <span className="font-inter text-[11px] text-tertiary-text">
                      {peer.timeSpent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Prompt card */}
        <div className="rounded-comfortable bg-level-1 px-3 py-2.5">
          <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Prompt
          </p>
          <p className="mt-2 font-inter text-body-md text-ink leading-relaxed">
            {detail.prompt}
          </p>
        </div>

        {/* Two response panels */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-comfortable border border-level-2 bg-white p-4">
            <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
              Response A
            </p>
            <p className="mt-3 font-inter text-[13px] text-ink leading-relaxed">
              {detail.responseA}
            </p>
          </div>
          <div className="rounded-comfortable border border-level-2 bg-white p-4">
            <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
              Response B
            </p>
            <p className="mt-3 font-inter text-[13px] text-ink leading-relaxed">
              {detail.responseB}
            </p>
          </div>
        </div>

        {/* Annotator's choice */}
        <div className="rounded-comfortable border border-level-2 bg-white p-4">
          <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Annotator&apos;s Choice
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-inter text-body-md font-medium text-ink">
              {detail.annotator}
            </span>
            <span className="text-tertiary-text">chose</span>
            <Badge variant="info">{detail.choice}</Badge>
          </div>
          <p className="mt-3 font-inter text-[13px] text-tertiary-text leading-relaxed">
            {detail.justification}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => {
              approve(reviewId);
              toast("Annotation approved");
              router.push("/reviews");
            }}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              reject(reviewId);
              toast("Annotation rejected", "error");
              router.push("/reviews");
            }}
          >
            Reject
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const reviewers = ["Sarah K.", "Priya M.", "James L.", "Elena R.", "Tom H."];
              const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
              reassign(reviewId, reviewer);
              toast(`Reassigned to ${reviewer}`, "info");
              router.push("/reviews");
            }}
          >
            Reassign
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              escalate(reviewId);
              toast("Escalated to senior reviewer", "warning");
              router.push("/reviews");
            }}
          >
            Escalate
          </Button>
        </div>

        {/* ── Unit 17: Automated Safety Classification (only for safety/red-team items) ── */}
        {(item.taskType === "Safety") && (
          <motion.div
            className="rounded-comfortable border border-level-2 bg-white p-5"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.12 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="h-5 w-5 text-[#DC2626]" />
              <p className="font-literata text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Automated Safety Classification
              </p>
            </div>

            <div className="space-y-3">
              {/* AI-predicted category */}
              <div className="flex items-center justify-between rounded-standard bg-[#F7F8F8] px-4 py-3">
                <span className="font-inter text-[13px] text-tertiary-text">AI-Predicted Category</span>
                <div className="flex items-center gap-2">
                  <span className="font-inter text-[14px] font-medium text-ink">Hate Speech</span>
                  <span className="inline-flex items-center rounded-tight border border-[#B3D9D9] bg-[#E6F2F2] px-2 py-0.5 font-inter text-label-sm font-medium text-[#005151]">
                    87% confidence
                  </span>
                </div>
              </div>

              {/* Severity */}
              <div className="flex items-center justify-between rounded-standard bg-[#F7F8F8] px-4 py-3">
                <span className="font-inter text-[13px] text-tertiary-text">Severity</span>
                <span className="inline-flex items-center rounded-tight border border-[#FECACA] bg-[#FEF2F2] px-2 py-0.5 font-inter text-label-sm font-medium text-[#DC2626]">
                  High
                </span>
              </div>

              {/* Match indicator */}
              <div className="flex items-center justify-between rounded-standard bg-[#F7F8F8] px-4 py-3">
                <span className="font-inter text-[13px] text-tertiary-text">Annotator Agreement</span>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-[#059669]" />
                  <span className="font-inter text-[14px] font-medium text-[#059669]">
                    Agrees with annotator
                  </span>
                </div>
              </div>
            </div>

            {/* Model info */}
            <p className="mt-3 font-inter text-[11px] text-tertiary-text">
              Classification model: safety-classifier-v3, trained on 240K examples
            </p>
          </motion.div>
        )}

        {/* ── Data Provenance Section ── */}
        <motion.div
          className="rounded-comfortable border border-level-2 bg-white p-5"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <p className="mb-4 font-literata text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Data Provenance
          </p>
          <ProvenancePanel nodes={mockProvenanceNodes} />
        </motion.div>
      </div>
    </div>
  );
}
