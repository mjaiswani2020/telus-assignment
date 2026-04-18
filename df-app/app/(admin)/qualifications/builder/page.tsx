"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

const stages = [
  {
    id: 1,
    name: "Guidelines Review",
    description: "Read and acknowledge annotation guidelines",
    type: "Acknowledgment",
  },
  {
    id: 2,
    name: "Practice Round",
    description: "Complete 10 practice annotations with feedback",
    type: "Practice",
  },
  {
    id: 3,
    name: "Gold Standard Test",
    description: "Answer 20 gold-standard questions",
    type: "Assessment",
  },
  {
    id: 4,
    name: "Calibration Session",
    description: "Group calibration on edge cases",
    type: "Calibration",
  },
];

const questionTypeOptions = [
  { value: "pairwise", label: "Pairwise Comparison" },
  { value: "likert", label: "Likert Scale Rating" },
  { value: "classification", label: "Classification" },
  { value: "freetext", label: "Free-text Justification" },
  { value: "ranking", label: "Response Ranking" },
];

const recertOptions = [
  { value: "30", label: "Every 30 days" },
  { value: "60", label: "Every 60 days" },
  { value: "90", label: "Every 90 days" },
  { value: "never", label: "No recertification" },
];

export default function QualificationBuilderPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["pairwise", "likert"]);
  const [passThreshold, setPassThreshold] = useState(75);
  const [recertInterval, setRecertInterval] = useState("90");

  function toggleType(value: string) {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  }

  function handleSave() {
    if (!testName.trim()) {
      toast("Please enter a test name", "error");
      return;
    }
    toast("Qualification test saved", "success");
    router.push("/qualifications");
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/qualifications"
        className="inline-flex items-center gap-1.5 font-inter text-body-md text-deep-teal hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Qualifications
      </Link>

      <div className="mt-4">
        <PageHeader
          title="Qualification Builder"
          action={
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.push("/qualifications")}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Test
              </Button>
            </div>
          }
        />
      </div>

      <div className="stagger-children mt-4 space-y-4">
        {/* Basic Info */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Basic Information
          </h3>
          <div className="mt-4 space-y-4">
            <Input
              label="Test Name"
              placeholder="e.g., Safety Evaluation Qualification"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
            <Textarea
              label="Description"
              placeholder="Describe the purpose and scope of this qualification test..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Stage Configuration */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Stage Configuration
          </h3>
          <p className="mt-1 font-inter text-[13px] text-tertiary-text">
            Qualification tests follow a 4-stage pipeline
          </p>
          <div className="mt-4 space-y-2.5">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className="flex items-start gap-4 rounded-standard border border-level-2 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-deep-teal font-inter text-[13px] font-medium text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-inter text-body-md font-medium text-ink">
                      {stage.name}
                    </span>
                    <Badge variant="neutral">{stage.type}</Badge>
                  </div>
                  <p className="mt-1 font-inter text-[12px] text-tertiary-text">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Types */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Question Types
          </h3>
          <p className="mt-1 font-inter text-[13px] text-tertiary-text">
            Select which question formats to include
          </p>
          <div className="mt-4 space-y-2">
            {questionTypeOptions.map((qt) => (
              <label key={qt.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(qt.value)}
                  onChange={() => toggleType(qt.value)}
                  className="h-4 w-4 rounded border-level-2 text-deep-teal focus:ring-deep-teal"
                />
                <span className="font-inter text-body-md text-ink">{qt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Thresholds */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Pass Threshold & Recertification
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Pass Threshold
              </label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={5}
                  value={passThreshold}
                  onChange={(e) => setPassThreshold(Number(e.target.value))}
                  className="h-2 w-64 cursor-pointer appearance-none rounded-full bg-level-2 accent-deep-teal"
                />
                <span className="font-inter text-body-md font-medium text-ink">
                  {passThreshold}%
                </span>
              </div>
              <p className="mt-1 font-inter text-[12px] text-tertiary-text">
                Annotators must score at or above this threshold to qualify
              </p>
            </div>
            <Select
              label="Recertification Interval"
              options={recertOptions}
              value={recertInterval}
              onChange={(e) => setRecertInterval(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
