"use client";

import { motion } from "framer-motion";
import { fadeSlideUp } from "@/lib/animations";

export interface ProvenanceNode {
  title: string;
  details: string[];
  timestamp: string;
}

interface ProvenancePanelProps {
  nodes: ProvenanceNode[];
}

export function ProvenancePanel({ nodes }: ProvenancePanelProps) {
  return (
    <div className="relative pl-6">
      {/* Vertical connecting line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#B3D9D9]" />

      <div className="space-y-5">
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            className="relative"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.06 }}
          >
            {/* Teal circle */}
            <div className="absolute -left-6 top-[5px] h-3.5 w-3.5 rounded-full border-2 border-[#005151] bg-white" />

            {/* Content */}
            <div>
              <p className="font-inter text-body-md font-semibold text-ink">
                {node.title}
              </p>
              {node.details.map((detail, j) => (
                <p
                  key={j}
                  className="mt-0.5 font-inter text-[13px] text-[#556260] leading-relaxed"
                >
                  {detail}
                </p>
              ))}
              <p className="mt-1 font-inter text-[11px] text-[#6F7A77]">
                {node.timestamp}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Mock provenance data for a typical review item */
export const mockProvenanceNodes: ProvenanceNode[] = [
  {
    title: "Prompt Source",
    details: ["Human-written by Annotator Pool A, Batch 3"],
    timestamp: "Apr 10, 2026 09:14 UTC",
  },
  {
    title: "Model Response Generation",
    details: [
      "claude-3.5-sonnet @ temp 0.8",
      "2 responses generated in 3.2s",
    ],
    timestamp: "Apr 10, 2026 09:14 UTC",
  },
  {
    title: "Guideline Version",
    details: ["v2.3 \u2014 Added code evaluation examples"],
    timestamp: "Active since Apr 15, 2026",
  },
  {
    title: "Annotation",
    details: [
      "Marcus T. \u00b7 Tier 2 \u00b7 Gold Accuracy 82%",
      "Completed in 94 seconds",
    ],
    timestamp: "Apr 10, 2026 09:16 UTC",
  },
  {
    title: "QA Review",
    details: [
      "Auto-screen: Passed (all 4 checks)",
      "Human review by Sarah C. \u2014 Approved",
    ],
    timestamp: "Apr 10, 2026 14:22 UTC",
  },
];
