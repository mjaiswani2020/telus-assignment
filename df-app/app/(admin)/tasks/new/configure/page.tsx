"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { crossFade } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { WizardStepSidebar } from "@/components/admin/wizard-step-sidebar";
import { BasicInfo, type BasicInfoData } from "@/components/admin/wizard-steps/basic-info";
import { Prompts, type PromptsData } from "@/components/admin/wizard-steps/prompts";
import { Models, type ModelsData } from "@/components/admin/wizard-steps/models";
import { Annotation, type AnnotationData } from "@/components/admin/wizard-steps/annotation";
import { Quality, type QualityData } from "@/components/admin/wizard-steps/quality";
import { Guidelines, type GuidelinesData } from "@/components/admin/wizard-steps/guidelines";
import { Review } from "@/components/admin/wizard-steps/review";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL_STEPS = 7;

export default function ConfigureWizardPage() {
  const [step, setStep] = useState(1);

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
    source: "annotator",
    categories: [],
    minLength: "",
    maxLength: "",
  });

  // Step 3 -- Models
  const [models, setModels] = useState<ModelsData>({
    selectedEndpoints: [],
    responseSource: "live",
    pairingStrategy: "different",
    responsesPerTask: "2",
  });

  // Step 4 -- Annotation
  const [annotation, setAnnotation] = useState<AnnotationData>({
    preferenceScale: "4-point",
    preferencePolarity: "a-vs-b",
    allowTies: true,
    justification: true,
    safetyLabels: false,
    riskCategories: false,
    customDimensions: false,
    minTime: "45",
    allowSkip: true,
    allowFlag: true,
  });

  // Step 5 -- Quality
  const [quality, setQuality] = useState<QualityData>({
    goldInsertionRate: 10,
    minTimeThreshold: "45",
    overlapCount: "3",
    reviewSampleRate: 25,
    minAgreementThreshold: "0.70",
    performanceGate: "0.80",
    preset: "production",
  });

  // Step 6 -- Guidelines
  const [guidelines, setGuidelines] = useState<GuidelinesData>({
    content: "",
  });

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfo data={basicInfo} onChange={setBasicInfo} />;
      case 2:
        return <Prompts data={prompts} onChange={setPrompts} />;
      case 3:
        return <Models data={models} onChange={setModels} />;
      case 4:
        return <Annotation data={annotation} onChange={setAnnotation} />;
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
