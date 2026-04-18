"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/stores/task-store";
import { useProjectStore } from "@/stores/project-store";
import { useCampaignStore } from "@/stores/campaign-store";
import { useModelStore } from "@/stores/model-store";
import { AlertCircle } from "lucide-react";
import { AnnotatorPreview } from "./annotator-preview";
import type { TaskType } from "@/data/seed";
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
  taskType: TaskType | null;
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
  taskType,
}: ReviewProps) {
  const router = useRouter();
  const addTask = useTaskStore((s) => s.addTask);
  const projects = useProjectStore((s) => s.projects);
  const campaigns = useCampaignStore((s) => s.campaigns);
  const endpoints = useModelStore((s) => s.endpoints);
  const [errors, setErrors] = useState<string[]>([]);

  // Resolve display names
  const projectName =
    projects.find((p) => p.id === basicInfo.projectId)?.name || basicInfo.projectId;
  const campaignName =
    campaigns.find((c) => c.id === basicInfo.campaignId)?.name || basicInfo.campaignId;

  const selectedModelNames = models.selectedEndpoints
    .map((id) => endpoints.find((e) => e.id === id))
    .filter(Boolean)
    .map((e) => `${e!.name} (${e!.version})`)
    .join(", ");

  const polarityLabels: Record<string, string> = {
    "pick-better": "Pick the better response",
    "pick-worse": "Pick the worse response (red-teaming)",
    "position-blind": "Position-blind (randomized labels)",
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!basicInfo.name.trim()) errs.push("Task name is required");
    if (!basicInfo.projectId) errs.push("Project must be selected");
    if (!basicInfo.campaignId) errs.push("Campaign must be selected");
    if (!taskType) errs.push("Task type must be selected");
    if (
      models.pairingStrategy === "different" &&
      models.selectedEndpoints.length < 2
    ) {
      errs.push(
        '"Different models" pairing requires at least 2 model endpoints'
      );
    }
    return errs;
  };

  const handleSave = (status: "Draft" | "Active") => {
    if (status === "Active") {
      const errs = validate();
      if (errs.length > 0) {
        setErrors(errs);
        return;
      }
    }
    setErrors([]);

    addTask({
      id: `task-${Date.now()}`,
      name: basicInfo.name || "Untitled Task",
      type: taskType || "Pairwise",
      projectId: basicInfo.projectId || "proj-helpfulness",
      projectName: projectName || "Helpfulness Track",
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

      {/* Annotator Preview */}
      <div className="mt-8">
        <AnnotatorPreview
          taskType={taskType}
          basicInfo={basicInfo}
          annotation={annotation}
        />
      </div>

      <div className="mt-6 space-y-5">
        <SectionBlock title="Basic Information">
          <Field label="Task Name" value={basicInfo.name} />
          <Field label="Description" value={basicInfo.description} />
          <div className="flex items-baseline gap-2">
            <span className="w-44 shrink-0 font-inter text-body-md text-tertiary-text">
              Task Type
            </span>
            {taskType ? (
              <Badge variant={taskType.toLowerCase() as "pairwise"}>
                {taskType}
              </Badge>
            ) : (
              <span className="font-inter text-body-md text-ink">--</span>
            )}
          </div>
          <Field label="Project" value={projectName} />
          <Field label="Campaign" value={campaignName} />
          <Field label="Round" value={basicInfo.roundId || "--"} />
          <Field
            label="Skills"
            value={basicInfo.skills.join(", ") || "None"}
          />
        </SectionBlock>

        <SectionBlock title="Prompts">
          <Field label="Source" value={prompts.source} />
          <Field
            label="Min Length"
            value={prompts.minLength ? `${prompts.minLength} tokens` : "--"}
          />
          <Field
            label="Max Length"
            value={prompts.maxLength ? `${prompts.maxLength} tokens` : "--"}
          />
        </SectionBlock>

        <SectionBlock title="Models">
          <Field label="Endpoints" value={selectedModelNames || "None"} />
          <Field label="Response Source" value={models.responseSource} />
          <Field label="Pairing Strategy" value={models.pairingStrategy} />
          <Field
            label="Responses / Task"
            value={models.responsesPerTask || "2"}
          />
          {models.generationParams.temperature && (
            <Field
              label="Temperature"
              value={models.generationParams.temperature}
            />
          )}
          {models.generationParams.maxTokens && (
            <Field
              label="Max Tokens"
              value={models.generationParams.maxTokens}
            />
          )}
        </SectionBlock>

        <SectionBlock title="Annotation">
          {/* Comparison types: scale, polarity, ties */}
          {taskType && ["Pairwise", "Conversational", "Safety", "Arena"].includes(taskType) && (
            <>
              <Field label="Preference Scale" value={annotation.preferenceScale} />
              <Field label="Polarity" value={polarityLabels[annotation.preferencePolarity] || annotation.preferencePolarity} />
              <Field label="Allow Ties" value={annotation.allowTies ? "Yes" : "No"} />
              <Field label="Justification" value={annotation.justification ? "Required" : "No"} />
            </>
          )}
          {/* SFT-specific */}
          {taskType === "SFT" && (
            <>
              <Field label="Prompt Char Limit" value={annotation.sftConfig.promptCharLimit} />
              <Field label="Response Char Limit" value={annotation.sftConfig.responseCharLimit} />
              <Field label="Reference Response" value={annotation.sftConfig.showReferenceResponse ? "Shown" : "Hidden"} />
              <Field label="Difficulty Levels" value={annotation.sftConfig.difficultyLevels.join(", ")} />
            </>
          )}
          {/* Editing-specific */}
          {taskType === "Editing" && (
            <>
              <Field label="Editing Mode" value={annotation.editingConfig.editingMode === "minimal" ? "Minimal Correction" : "Substantial Rewrite"} />
              <Field label="Diff View" value={annotation.editingConfig.showDiffView ? "Enabled" : "Disabled"} />
            </>
          )}
          {/* Ranking-specific */}
          {taskType === "Ranking" && (
            <>
              <Field label="Responses to Rank" value={annotation.rankingConfig.responsesToRank} />
              <Field label="Ranking Method" value={annotation.rankingConfig.rankingMethod === "full" ? "Full Ordering" : `Top-${annotation.rankingConfig.topK}`} />
              <Field label="Allow Tied Ranks" value={annotation.rankingConfig.allowTiedRanks ? "Yes" : "No"} />
            </>
          )}
          {/* Rubric-specific */}
          {taskType === "Rubric" && (
            <Field label="Scoring Dimensions" value={`${annotation.rubricDimensions.length} dimensions`} />
          )}
          {/* Arena-specific */}
          {taskType === "Arena" && (
            <>
              <Field label="Blind Evaluation" value={annotation.arenaConfig.blindEvaluation ? "Yes" : "No"} />
              <Field label="Reveal After Submit" value={annotation.arenaConfig.revealModelsAfterSubmit ? "Yes" : "No"} />
              <Field label="Matchmaking" value={annotation.arenaConfig.matchmaking} />
              <Field label="Initial Elo" value={annotation.arenaConfig.initialElo} />
            </>
          )}
          {/* Safety-specific */}
          {taskType === "Safety" && (
            <>
              <Field label="Content Warnings" value={annotation.safetyConfig.contentWarnings ? "Enabled" : "No"} />
              <Field label="Break Timer" value={`${annotation.safetyConfig.breakTimerInterval} min`} />
              <Field label="Risk Categories" value={`${annotation.safetyConfig.riskCategories.length} categories`} />
              <Field label="Attack Vectors" value={`${annotation.safetyConfig.attackVectors.length} vectors`} />
            </>
          )}
          {/* Multi-turn */}
          {taskType === "Conversational" && (
            <>
              <Field label="Min Turns" value={annotation.multiTurnConfig.minTurns} />
              <Field label="Max Turns" value={annotation.multiTurnConfig.maxTurns} />
              <Field label="Per-Turn Preference" value={annotation.multiTurnConfig.perTurnPreference ? "Yes" : "No"} />
            </>
          )}
          {/* Common */}
          <Field label="Min Time" value={annotation.minTime ? `${annotation.minTime}s` : "--"} />
          <Field label="Allow Skip" value={annotation.allowSkip ? "Yes" : "No"} />
          <Field label="Allow Flag" value={annotation.allowFlag ? "Yes" : "No"} />
        </SectionBlock>

        <SectionBlock title="Quality Pipeline">
          <Field
            label="Gold Insertion"
            value={`${quality.goldInsertionRate}%`}
          />
          <Field
            label="Min Time Threshold"
            value={
              quality.minTimeThreshold
                ? `${quality.minTimeThreshold}s`
                : "--"
            }
          />
          <Field label="Overlap Count" value={quality.overlapCount} />
          <Field
            label="Review Sample Rate"
            value={`${quality.reviewSampleRate}%`}
          />
          <Field
            label="Min Agreement"
            value={quality.minAgreementThreshold || "--"}
          />
          <Field
            label="Performance Gate"
            value={quality.performanceGate || "--"}
          />
        </SectionBlock>

        <SectionBlock title="Guidelines">
          <Field
            label="Content"
            value={
              guidelines.content
                ? `${guidelines.content.split("\n").length} lines`
                : "Default guidelines"
            }
          />
          <Field label="Version" value="v2.3" />
        </SectionBlock>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="mt-6 rounded-comfortable border border-error/30 bg-[#FEF2F2] p-4">
          <div className="flex items-center gap-2 text-error">
            <AlertCircle className="h-4 w-4" />
            <span className="font-inter text-[13px] font-medium">
              Please fix the following before activating:
            </span>
          </div>
          <ul className="mt-2 space-y-1 pl-6">
            {errors.map((err) => (
              <li
                key={err}
                className="font-inter text-[13px] text-error list-disc"
              >
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

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
