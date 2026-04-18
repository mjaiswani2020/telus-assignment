"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReviewStore } from "@/stores/review-store";
import { useToast } from "@/components/ui/toast";

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
      </motion.div>
      <p className="mt-2 font-inter text-body-md text-tertiary-text">
        {item.description}
      </p>

      <div className="stagger-children mt-4 space-y-4">
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
      </div>
    </div>
  );
}
