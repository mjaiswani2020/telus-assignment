"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { crossFade } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WizardStepSidebar } from "@/components/admin/wizard-step-sidebar";
import { BasicInfo, type BasicInfoData } from "@/components/admin/wizard-steps/basic-info";
import { Prompts, type PromptsData } from "@/components/admin/wizard-steps/prompts";
import { Models, type ModelsData } from "@/components/admin/wizard-steps/models";
import { Annotation, type AnnotationData } from "@/components/admin/wizard-steps/annotation";
import { Quality, type QualityData } from "@/components/admin/wizard-steps/quality";
import { Guidelines, type GuidelinesData } from "@/components/admin/wizard-steps/guidelines";
import { Review } from "@/components/admin/wizard-steps/review";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TaskType } from "@/data/seed";
import {
  TEMPLATE_TO_TYPE,
  TEMPLATE_METADATA,
  TYPE_DEFAULTS,
  TYPE_FEATURES,
  DEFAULT_GENERATION_PARAMS,
  DEFAULT_SAFETY,
  DEFAULT_EDITING,
  DEFAULT_RANKING,
  DEFAULT_RUBRIC_DIMENSIONS,
  DEFAULT_ARENA,
  DEFAULT_SFT,
  type TypeFeatures,
} from "@/lib/task-type-config";

const TOTAL_STEPS = 7;

function ConfigureWizardInner() {
  const searchParams = useSearchParams();
  const templateSlug = searchParams.get("template") || "scratch";
  const templateMeta = TEMPLATE_METADATA[templateSlug] ?? null;
  const initialType = TEMPLATE_TO_TYPE[templateSlug] ?? null;
  const isFromTemplate = templateSlug !== "scratch" && initialType !== null;

  const [step, setStep] = useState(1);
  const [taskType, setTaskType] = useState<TaskType | null>(initialType);

  // Resolve defaults based on task type
  const defaults = taskType ? TYPE_DEFAULTS[taskType] : {};
  const features: TypeFeatures = taskType
    ? TYPE_FEATURES[taskType]
    : TYPE_FEATURES["Pairwise"]; // fallback for scratch before selection

  // Step 1 -- Basic Info
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    name: "",
    description: "",
    projectId: "",
    campaignId: "",
    roundId: "",
    skills: [],
  });

  // Step 2 -- Prompts
  const [prompts, setPrompts] = useState<PromptsData>({
    source: (defaults.prompts?.source as PromptsData["source"]) || "annotator",
    categories: [],
    minLength: "",
    maxLength: "",
    modelGenConfig: { model: "", seedTopics: "", count: "" },
    mixedConfig: { humanProportion: "", modelProportion: "" },
  });

  // Step 3 -- Models
  const [models, setModels] = useState<ModelsData>({
    selectedEndpoints: [],
    responseSource: (defaults.models?.responseSource as ModelsData["responseSource"]) || "live",
    pairingStrategy: defaults.models?.pairingStrategy || "different",
    responsesPerTask: defaults.models?.responsesPerTask || "2",
    generationParams: { ...DEFAULT_GENERATION_PARAMS },
    cachedDatasetRef: "",
  });

  // Step 4 -- Annotation
  const [annotation, setAnnotation] = useState<AnnotationData>({
    preferenceScale: (defaults.annotation?.preferenceScale as AnnotationData["preferenceScale"]) || "4-point",
    preferencePolarity: defaults.annotation?.preferencePolarity || "pick-better",
    allowTies: defaults.annotation?.allowTies ?? true,
    justification: defaults.annotation?.justification ?? true,
    safetyLabels: defaults.annotation?.safetyLabels ?? false,
    riskCategories: defaults.annotation?.riskCategories ?? false,
    customDimensions: defaults.annotation?.customDimensions ?? false,
    minTime: defaults.annotation?.minTime || "45",
    allowSkip: true,
    allowFlag: true,
    customScaleLabels: [],
    customDimensionsList: [],
    multiTurnConfig: { minTurns: "3", maxTurns: "8", perTurnPreference: true, allowUndo: true },
    safetyConfig: { ...DEFAULT_SAFETY },
    editingConfig: { ...DEFAULT_EDITING },
    rankingConfig: { ...DEFAULT_RANKING },
    rubricDimensions: [...DEFAULT_RUBRIC_DIMENSIONS],
    arenaConfig: { ...DEFAULT_ARENA },
    sftConfig: { ...DEFAULT_SFT },
  });

  // Step 5 -- Quality
  const [quality, setQuality] = useState<QualityData>({
    goldInsertionRate: 10,
    minTimeThreshold: "45",
    overlapCount: "3",
    reviewSampleRate: 25,
    minAgreementThreshold: "0.70",
    performanceGate: "0.80",
    preset: (defaults.quality?.preset as QualityData["preset"]) || "production",
  });

  // Step 6 -- Guidelines
  const [guidelines, setGuidelines] = useState<GuidelinesData>({
    content: "",
  });

  // Handle task type change (from scratch selector or template)
  const handleTaskTypeChange = (type: TaskType) => {
    setTaskType(type);
    // Apply type defaults to annotation and models
    const d = TYPE_DEFAULTS[type];
    if (d.annotation) {
      setAnnotation((prev) => ({
        ...prev,
        preferenceScale: (d.annotation?.preferenceScale as AnnotationData["preferenceScale"]) || prev.preferenceScale,
        preferencePolarity: d.annotation?.preferencePolarity || prev.preferencePolarity,
        allowTies: d.annotation?.allowTies ?? prev.allowTies,
        justification: d.annotation?.justification ?? prev.justification,
        safetyLabels: d.annotation?.safetyLabels ?? prev.safetyLabels,
        riskCategories: d.annotation?.riskCategories ?? prev.riskCategories,
        customDimensions: d.annotation?.customDimensions ?? prev.customDimensions,
      }));
    }
    if (d.models) {
      setModels((prev) => ({
        ...prev,
        pairingStrategy: d.models?.pairingStrategy || prev.pairingStrategy,
        responsesPerTask: d.models?.responsesPerTask || prev.responsesPerTask,
        responseSource: (d.models?.responseSource as ModelsData["responseSource"]) || prev.responseSource,
      }));
    }
    if (d.prompts) {
      setPrompts((prev) => ({
        ...prev,
        source: (d.prompts?.source as PromptsData["source"]) || prev.source,
      }));
    }
  };

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BasicInfo
            data={basicInfo}
            onChange={setBasicInfo}
            taskType={taskType}
            onTaskTypeChange={handleTaskTypeChange}
            isFromTemplate={isFromTemplate}
          />
        );
      case 2:
        return <Prompts data={prompts} onChange={setPrompts} />;
      case 3:
        return <Models data={models} onChange={setModels} features={features} />;
      case 4:
        return (
          <Annotation
            data={annotation}
            onChange={setAnnotation}
            features={features}
          />
        );
      case 5:
        return <Quality data={quality} onChange={setQuality} />;
      case 6:
        return <Guidelines data={guidelines} onChange={setGuidelines} />;
      case 7:
        return (
          <Review
            basicInfo={basicInfo}
            prompts={prompts}
            models={models}
            annotation={annotation}
            quality={quality}
            guidelines={guidelines}
            taskType={taskType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-0 -mx-8 -mb-8 min-h-[calc(100vh-64px)]">
      <WizardStepSidebar currentStep={step} onStepClick={setStep} />

      <div className="flex flex-1 flex-col">
        {/* Template indicator */}
        {templateMeta && (
          <div className="flex items-center gap-2 border-b border-level-2 bg-level-1 px-8 py-2.5">
            <templateMeta.icon className="h-4 w-4 text-deep-teal" />
            <span className="font-inter text-[13px] font-medium text-ink">
              Template: {templateMeta.name}
            </span>
            <Badge variant="info">{templateMeta.methodology}</Badge>
          </div>
        )}
        {!templateMeta && taskType && (
          <div className="flex items-center gap-2 border-b border-level-2 bg-level-1 px-8 py-2.5">
            <span className="font-inter text-[13px] font-medium text-ink">
              Custom Task
            </span>
            <Badge variant="neutral">{taskType}</Badge>
          </div>
        )}

        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={crossFade}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {step < TOTAL_STEPS && (
          <div className="sticky bottom-0 flex items-center justify-between border-t border-level-2 bg-white px-8 py-4">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={step === 1}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i + 1 === step
                      ? "w-6 bg-deep-teal"
                      : i + 1 < step
                      ? "w-1.5 bg-deep-teal"
                      : "w-1.5 bg-level-2"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="primary"
              onClick={goNext}
              iconRight={<ChevronRight className="h-4 w-4" />}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfigureWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <span className="font-inter text-body-md text-tertiary-text">
            Loading...
          </span>
        </div>
      }
    >
      <ConfigureWizardInner />
    </Suspense>
  );
}
