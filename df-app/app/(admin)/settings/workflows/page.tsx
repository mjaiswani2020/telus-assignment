"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Bot,
  PenLine,
  ShieldCheck,
  Download,
  ChevronRight,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsNav } from "@/components/admin/settings-nav";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { fadeSlideUp } from "@/lib/animations";

interface WorkflowNode {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const workflowNodes: WorkflowNode[] = [
  { id: "prompt", label: "Prompt", icon: <MessageSquare className="h-5 w-5" /> },
  {
    id: "model-response",
    label: "Model Response",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    id: "annotation",
    label: "Annotation",
    icon: <PenLine className="h-5 w-5" />,
  },
  {
    id: "qa-review",
    label: "QA Review",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  { id: "export", label: "Export", icon: <Download className="h-5 w-5" /> },
];

interface CustomizationPoint {
  id: string;
  afterNode: string;
  label: string;
  defaultOn: boolean;
}

const customizationPoints: CustomizationPoint[] = [
  {
    id: "peer-review",
    afterNode: "annotation",
    label: "Add peer review step?",
    defaultOn: false,
  },
  {
    id: "adjudication",
    afterNode: "qa-review",
    label: "Add senior adjudication?",
    defaultOn: false,
  },
  {
    id: "auto-training",
    afterNode: "export",
    label: "Auto-trigger training?",
    defaultOn: true,
  },
];

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Available";
}

const templates: WorkflowTemplate[] = [
  {
    id: "standard",
    name: "Standard (Anthropic-style)",
    description:
      "Lightweight QA, weekly iterations, spot-check review",
    status: "Active",
  },
  {
    id: "rigorous",
    name: "Rigorous (Meta-style)",
    description:
      "Full content manager review, 4-stage vetting, formal QA",
    status: "Available",
  },
];

export default function WorkflowsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    customizationPoints.forEach((cp) => {
      init[cp.id] = cp.defaultOn;
    });
    return init;
  });

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="mt-4">
        <SettingsNav />
      </div>

      <div className="stagger-children mt-4 space-y-6">
        {/* Workflow Visualization */}
        <div>
          <h3 className="mb-4 font-inter text-[14px] font-semibold text-ink">
            Current Workflow
          </h3>
          <motion.div
            className="rounded-comfortable border border-level-2 bg-white p-6"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            {/* Nodes flow */}
            <div className="flex items-center justify-between gap-2">
              {workflowNodes.map((node, index) => {
                const customization = customizationPoints.find(
                  (cp) => cp.afterNode === node.id
                );
                return (
                  <div key={node.id} className="flex items-center gap-2">
                    {/* Node box */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-14 w-28 flex-col items-center justify-center rounded-comfortable border border-level-2 bg-[#F7F8F8] transition-colors hover:border-[#005151]">
                        <span className="text-[#005151]">{node.icon}</span>
                        <span className="mt-1 font-inter text-[11px] font-medium text-ink">
                          {node.label}
                        </span>
                      </div>
                      {/* Customization toggle beneath the node */}
                      {customization && (
                        <div className="flex flex-col items-center gap-1 rounded-standard border border-dashed border-level-3 bg-level-1 px-2 py-1.5">
                          <span className="font-inter text-[10px] text-tertiary-text text-center leading-tight">
                            {customization.label}
                          </span>
                          <button
                            onClick={() => handleToggle(customization.id)}
                            className={cn(
                              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200",
                              toggles[customization.id]
                                ? "bg-[#059669]"
                                : "bg-level-3"
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200",
                                toggles[customization.id]
                                  ? "translate-x-[18px]"
                                  : "translate-x-[3px]"
                              )}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Arrow connector */}
                    {index < workflowNodes.length - 1 && (
                      <ChevronRight className="h-5 w-5 shrink-0 text-level-3" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Saved Templates */}
        <div>
          <h3 className="mb-3 font-inter text-[14px] font-semibold text-ink">
            Saved Templates
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "rounded-comfortable border p-4 transition-all",
                  template.status === "Active"
                    ? "border-[#005151] bg-[#E6F2F2]"
                    : "border-level-2 bg-white hover:border-level-3"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Zap
                      className={cn(
                        "h-4 w-4",
                        template.status === "Active"
                          ? "text-[#005151]"
                          : "text-tertiary-text"
                      )}
                    />
                    <span className="font-inter text-[14px] font-medium text-ink">
                      {template.name}
                    </span>
                  </div>
                  <Badge
                    variant={
                      template.status === "Active" ? "success" : "neutral"
                    }
                  >
                    {template.status}
                  </Badge>
                </div>
                <p className="mt-2 font-inter text-[12px] text-secondary-text">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
