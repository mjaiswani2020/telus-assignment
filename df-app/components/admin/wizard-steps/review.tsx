"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/stores/task-store";
import { useModelStore } from "@/stores/model-store";
import type { BasicInfoData } from "./basic-info";
import type { PromptsData } from "./prompts";
import type { ModelsData } from "./models";
import type { AnnotationData } from "./annotation";
import type { QualityData } from "./quality";
import type { GuidelinesData } from "./guidelines";

interface ReviewProps {
  basicInfo: BasicInfoData;
  prompts: PromptsData;
  models: ModelsData;
  annotation: AnnotationData;
  quality: QualityData;
  guidelines: GuidelinesData;
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-comfortable border border-level-2 bg-white p-5">
      <h3 className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text mb-4">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-44 shrink-0 font-inter text-body-md text-tertiary-text">
        {label}
      </span>
      <span className="font-inter text-body-md text-ink">{value || "--"}</span>
    </div>
  );
}

export function Review({
  basicInfo,
  prompts,
  models,
  annotation,
  quality,
  guidelines,
}: ReviewProps) {
  const router = useRouter();
  const addTask = useTaskStore((s) => s.addTask);
  const endpoints = useModelStore((s) => s.endpoints);

  const selectedModelNames = models.selectedEndpoints
    .map((id) => endpoints.find((e) => e.id === id))
    .filter(Boolean)
    .map((e) => `${e!.name} (${e!.version})`)
    .join(", ");

  const handleSave = (status: "Draft" | "Active") => {
    addTask({
      id: `task-${Date.now()}`,
      name: basicInfo.name || "Untitled Task",
      type: "Pairwise",
      projectId: basicInfo.projectId || "proj-helpfulness",
      projectName: "Helpfulness Track",
      campaignId: basicInfo.campaignId || "camp-llama-align",
      status,
      annotationCount: 0,
      assignedAnnotators: 0,
      createdAt: new Date().toISOString(),
    });
    router.push("/tasks");
  };

  return (
    <div>
      <h2 className="font-inter text-title-lg text-ink">Review & Launch</h2>
      <p className="mt-1 font-inter text-body-md text-tertiary-text">
        Review all settings before saving or activating this task.
      </p>

      <div className="mt-8 space-y-5">
        <SectionBlock title="Basic Information">
          <Field label="Task Name" value={basicInfo.name} />
          <Field label="Description" value={basicInfo.description} />
          <Field label="Project" value={basicInfo.projectId} />
          <Field label="Campaign" value={basicInfo.campaignId} />
          <Field label="Round" value={basicInfo.roundId} />
          <Field
            label="Skills"
            value={basicInfo.skills.join(", ") || "None"}
          />
        </SectionBlock>

        <SectionBlock title="Prompts">
          <Field label="Source" value={prompts.source} />
          <Field label="Min Length" value={prompts.minLength ? `${prompts.minLength} tokens` : "--"} />
          <Field label="Max Length" value={prompts.maxLength ? `${prompts.maxLength} tokens` : "--"} />
        </SectionBlock>

        <SectionBlock title="Models">
          <Field label="Endpoints" value={selectedModelNames || "None"} />
          <Field label="Response Source" value={models.responseSource} />
          <Field label="Pairing Strategy" value={models.pairingStrategy} />
          <Field
            label="Responses / Task"
            value={models.responsesPerTask || "2"}
          />
        </SectionBlock>

        <SectionBlock title="Annotation">
          <Field label="Preference Scale" value={annotation.preferenceScale} />
          <Field label="Polarity" value={annotation.preferencePolarity} />
          <Field label="Allow Ties" value={annotation.allowTies ? "Yes" : "No"} />
          <Field label="Justification" value={annotation.justification ? "Required" : "No"} />
          <Field label="Safety Labels" value={annotation.safetyLabels ? "Enabled" : "No"} />
          <Field label="Risk Categories" value={annotation.riskCategories ? "Enabled" : "No"} />
          <Field label="Custom Dimensions" value={annotation.customDimensions ? "Enabled" : "No"} />
          <Field label="Min Time" value={annotation.minTime ? `${annotation.minTime}s` : "--"} />
          <Field label="Allow Skip" value={annotation.allowSkip ? "Yes" : "No"} />
          <Field label="Allow Flag" value={annotation.allowFlag ? "Yes" : "No"} />
        </SectionBlock>

        <SectionBlock title="Quality Pipeline">
          <Field label="Gold Insertion" value={`${quality.goldInsertionRate}%`} />
          <Field label="Min Time Threshold" value={quality.minTimeThreshold ? `${quality.minTimeThreshold}s` : "--"} />
          <Field label="Overlap Count" value={quality.overlapCount} />
          <Field label="Review Sample Rate" value={`${quality.reviewSampleRate}%`} />
          <Field label="Min Agreement" value={quality.minAgreementThreshold || "--"} />
          <Field label="Performance Gate" value={quality.performanceGate || "--"} />
        </SectionBlock>

        <SectionBlock title="Guidelines">
          <Field
            label="Content"
            value={
              guidelines.content
                ? `${guidelines.content.split("\n").length} lines`
                : "Not configured"
            }
          />
          <Field label="Version" value="v2.3" />
        </SectionBlock>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center gap-4 border-t border-level-2 pt-6">
        <Button variant="secondary" onClick={() => handleSave("Draft")}>
          Save as Draft
        </Button>
        <Button variant="primary" onClick={() => handleSave("Active")}>
          Activate Task
        </Button>
      </div>
    </div>
  );
}
