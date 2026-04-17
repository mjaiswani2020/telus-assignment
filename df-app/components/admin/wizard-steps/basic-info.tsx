"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { X } from "lucide-react";

const projectOptions = [
  { value: "proj-helpfulness", label: "Helpfulness Track" },
  { value: "proj-safety", label: "Safety Track" },
  { value: "proj-code-eval", label: "Code Evaluation" },
];

const campaignOptions = [
  { value: "camp-llama-align", label: "Llama 3 Alignment Campaign" },
  { value: "camp-gpt4-safety", label: "GPT-4 Safety Audit" },
  { value: "camp-arena-q1", label: "Arena Benchmark Q1" },
  { value: "camp-helpfulness-creative", label: "Creative Writing Evaluation" },
  { value: "camp-code-bench", label: "Multi-Language Code Bench" },
];

const roundOptions = [
  { value: "new", label: "Create new round" },
  { value: "round-3", label: "Round 3 -- Post-DPO Checkpoint" },
  { value: "round-cw2", label: "Round 2 -- Poetry & Style" },
];

const availableSkills = [
  "General",
  "Safety",
  "Medical",
  "Creative",
  "Code",
  "Legal",
  "Math",
  "Science",
];

interface BasicInfoData {
  name: string;
  description: string;
  projectId: string;
  campaignId: string;
  roundId: string;
  skills: string[];
}

interface BasicInfoProps {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
}

export function BasicInfo({ data, onChange }: BasicInfoProps) {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      onChange({ ...data, skills: [...data.skills, trimmed] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const filteredSuggestions = availableSkills.filter(
    (s) =>
      !data.skills.includes(s) &&
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      skillInput.length > 0
  );

  return (
    <div>
      <h2 className="font-inter text-title-lg text-ink">Basic Information</h2>
      <p className="mt-1 font-inter text-body-md text-tertiary-text">
        Define the core details for this annotation task.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
        <div className="col-span-2">
          <Input
            label="Task Name"
            placeholder="e.g., Helpfulness Pairwise -- Round 4"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        </div>

        <div className="col-span-2">
          <Textarea
            label="Description"
            placeholder="Describe the goal and scope of this task..."
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
          />
        </div>

        <Select
          label="Project"
          options={projectOptions}
          placeholder="Select a project"
          value={data.projectId}
          onChange={(e) => onChange({ ...data, projectId: e.target.value })}
        />

        <Select
          label="Campaign"
          options={campaignOptions}
          placeholder="Select a campaign"
          value={data.campaignId}
          onChange={(e) => onChange({ ...data, campaignId: e.target.value })}
        />

        <Select
          label="Round"
          options={roundOptions}
          placeholder="Select a round"
          value={data.roundId}
          onChange={(e) => onChange({ ...data, roundId: e.target.value })}
        />

        {/* Skills tag input */}
        <div className="flex flex-col gap-1.5">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Required Skills
          </label>
          <div className="flex min-h-[40px] flex-wrap items-center gap-1.5 rounded-standard border border-level-2 bg-level-1 px-3 py-2 transition-colors focus-within:border-deep-teal focus-within:bg-white focus-within:ring-2 focus-within:ring-deep-teal/20">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-tight bg-selected-bg px-2 py-0.5 font-inter text-[12px] font-medium text-deep-teal"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-0.5 hover:text-error"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              className="min-w-[80px] flex-1 bg-transparent font-inter text-body-md text-ink placeholder:text-tertiary-text outline-none"
              placeholder={
                data.skills.length === 0 ? "Type a skill and press Enter" : ""
              }
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />
          </div>
          {filteredSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {filteredSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="rounded-tight border border-level-2 bg-white px-2 py-0.5 font-inter text-[12px] text-secondary-text transition-colors hover:border-deep-teal hover:text-deep-teal"
                >
                  + {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export type { BasicInfoData };
