"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TASK_TYPES = [
  "Pairwise",
  "Safety",
  "SFT",
  "Conversational",
  "Editing",
  "Ranking",
  "Rubric",
  "Arena",
] as const;

const ALL_SKILLS = [
  "General",
  "Safety",
  "Code",
  "Creative",
  "Medical",
];

const difficultyOptions = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: "Expert", label: "Expert" },
];

const tierOptions = [
  { value: "All", label: "All" },
  { value: "Tier 2+", label: "Tier 2+" },
  { value: "Tier 3 Only", label: "Tier 3 Only" },
];

interface RoutingConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function RoutingConfigModal({
  open,
  onClose,
  onSave,
}: RoutingConfigModalProps) {
  const [ruleName, setRuleName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Safety"]);
  const [goldAccuracy, setGoldAccuracy] = useState(70);
  const [minIAA, setMinIAA] = useState(0.65);
  const [maxDifficulty, setMaxDifficulty] = useState("Hard");
  const [annotatorTier, setAnnotatorTier] = useState("All");
  const [testResult, setTestResult] = useState<string | null>(null);

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function removeSkill(skill: string) {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  }

  function addSkill(skill: string) {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill]);
    }
  }

  function handleTestRule() {
    setTestResult("14 annotators would match");
  }

  function handleSave() {
    onSave();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Configure Routing Rule" className="max-w-xl">
      <div className="flex flex-col gap-5">
        {/* Rule Name */}
        <Input
          label="Rule Name"
          placeholder="e.g. Safety Tasks"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
        />

        {/* Task Types — multi-select checkboxes */}
        <div className="flex flex-col gap-1.5">
          <span className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Task Types
          </span>
          <div className="grid grid-cols-4 gap-2">
            {TASK_TYPES.map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-2 rounded-standard border border-level-2 px-3 py-2 transition-colors hover:bg-level-1"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                  className="h-4 w-4 rounded border-level-3 text-deep-teal accent-[#005151]"
                />
                <span className="font-inter text-body-md text-ink">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Required Skills — tag input */}
        <div className="flex flex-col gap-1.5">
          <span className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Required Skills
          </span>
          <div className="flex flex-wrap items-center gap-2 rounded-standard border border-level-2 bg-level-1 px-3 py-2 min-h-[40px]">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-tight bg-[#E6F2F2] px-2 py-0.5 font-inter text-label-sm text-[#005151]"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-[#B3D9D9] transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {ALL_SKILLS.filter((s) => !selectedSkills.includes(s)).map(
              (skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="rounded-tight border border-dashed border-level-3 px-2 py-0.5 font-inter text-label-sm text-tertiary-text hover:border-deep-teal hover:text-deep-teal transition-colors"
                >
                  + {skill}
                </button>
              )
            )}
          </div>
        </div>

        {/* Minimum Gold Accuracy — range slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
              Minimum Gold Accuracy
            </span>
            <span className="font-inter text-body-md font-medium text-ink">
              {goldAccuracy}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={goldAccuracy}
            onChange={(e) => setGoldAccuracy(Number(e.target.value))}
            className="w-full accent-[#005151] h-2"
          />
          <div className="flex justify-between font-inter text-[11px] text-tertiary-text">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Minimum IAA — range slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
              Minimum IAA
            </span>
            <span className="font-inter text-body-md font-medium text-ink">
              {minIAA.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(minIAA * 100)}
            onChange={(e) => setMinIAA(Number(e.target.value) / 100)}
            className="w-full accent-[#005151] h-2"
          />
          <div className="flex justify-between font-inter text-[11px] text-tertiary-text">
            <span>0.00</span>
            <span>1.00</span>
          </div>
        </div>

        {/* Max Difficulty */}
        <Select
          label="Max Difficulty"
          options={difficultyOptions}
          value={maxDifficulty}
          onChange={(e) => setMaxDifficulty(e.target.value)}
        />

        {/* Annotator Tier */}
        <Select
          label="Annotator Tier"
          options={tierOptions}
          value={annotatorTier}
          onChange={(e) => setAnnotatorTier(e.target.value)}
        />

        {/* Test Rule */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleTestRule}>
            Test Rule
          </Button>
          {testResult && (
            <span className="font-inter text-body-md text-[#059669] font-medium">
              {testResult}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-level-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Rule
          </Button>
        </div>
      </div>
    </Modal>
  );
}
