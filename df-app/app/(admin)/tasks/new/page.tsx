"use client";

import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  GitCompare,
  MessageSquare,
  PenTool,
  Shield,
  Edit3,
  List,
  BarChart,
  Swords,
  Plus,
} from "lucide-react";

const templates = [
  {
    slug: "pairwise-preference",
    name: "Pairwise Preference",
    icon: GitCompare,
    description:
      "Compare two model responses side-by-side. Annotators select which response is better across defined quality dimensions.",
    methodology: "DPO / Reward Modeling",
  },
  {
    slug: "multi-turn-chat",
    name: "Multi-Turn Chat",
    icon: MessageSquare,
    description:
      "Evaluate multi-turn conversations for coherence, helpfulness, and instruction following across dialogue exchanges.",
    methodology: "Conversational RLHF",
  },
  {
    slug: "sft-data-authoring",
    name: "SFT Data Authoring",
    icon: PenTool,
    description:
      "Author high-quality prompt-response pairs for supervised fine-tuning. Includes quality rubrics and style guides.",
    methodology: "Supervised Fine-Tuning",
  },
  {
    slug: "safety-red-teaming",
    name: "Safety / Red-Teaming",
    icon: Shield,
    description:
      "Probe model boundaries with adversarial prompts. Classify harm categories and calibrate refusal thresholds.",
    methodology: "Safety Alignment",
  },
  {
    slug: "response-editing",
    name: "Response Editing",
    icon: Edit3,
    description:
      "Edit and improve model-generated responses inline. Track changes for quality improvement signals.",
    methodology: "SFT / RLHF Hybrid",
  },
  {
    slug: "n-way-ranking",
    name: "N-Way Ranking",
    icon: List,
    description:
      "Rank multiple model responses from best to worst. Supports drag-and-drop ordering with tie detection.",
    methodology: "Reward Model Training",
  },
  {
    slug: "rubric-scoring",
    name: "Rubric Scoring",
    icon: BarChart,
    description:
      "Score responses against multi-dimensional rubrics. Configurable scales, weighted criteria, and justification fields.",
    methodology: "Multi-Dimensional Eval",
  },
  {
    slug: "model-arena",
    name: "Model Arena",
    icon: Swords,
    description:
      "Blind head-to-head model comparisons with Elo rating. Annotators judge without knowing which model produced each response.",
    methodology: "Arena / Elo Ranking",
  },
];

export default function NewTaskPage() {
  return (
    <div>
      <PageHeader
        title="New Task"
        subtitle="Choose a template to get started, or build from scratch."
      />

      <div className="stagger-children mt-8 grid grid-cols-4 gap-5">
        {templates.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.slug}
              className="flex flex-col rounded-comfortable border border-level-2 bg-white p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-standard bg-selected-bg">
                <Icon className="h-5 w-5 text-deep-teal" />
              </div>
              <h3 className="font-inter text-[16px] font-medium text-ink">
                {t.name}
              </h3>
              <p className="mt-1.5 flex-1 font-inter text-[14px] leading-relaxed text-tertiary-text">
                {t.description}
              </p>
              <p className="mt-2 font-inter text-[12px] italic text-tertiary-text">
                {t.methodology}
              </p>
              <Link
                href={`/tasks/new/configure?template=${t.slug}`}
                className="mt-4 block"
              >
                <Button variant="primary" size="sm" className="w-full">
                  Use Template
                </Button>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Start from Scratch */}
      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.2 }}
      >
        <Link href="/tasks/new/configure?template=scratch">
          <div className="flex items-center justify-center gap-3 rounded-comfortable border-2 border-dashed border-level-2 bg-white p-6 transition-colors hover:border-deep-teal hover:bg-selected-bg">
            <Plus className="h-5 w-5 text-tertiary-text" />
            <span className="font-inter text-[14px] font-medium text-secondary-text">
              Start from Scratch
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
