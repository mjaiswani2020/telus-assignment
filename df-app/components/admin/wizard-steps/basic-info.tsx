"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { TaskType } from "@/data/seed";
import { TASK_TYPE_INFO } from "@/lib/task-type-config";
import { useProjectStore } from "@/stores/project-store";
import { useCampaignStore } from "@/stores/campaign-store";

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
  taskType: TaskType | null;
  onTaskTypeChange: (type: TaskType) => void;
  isFromTemplate: boolean;
}

const TASK_TYPES: TaskType[] = [
  "Pairwise",
  "Conversational",
  "SFT",
  "Safety",
  "Editing",
  "Ranking",
  "Rubric",
  "Arena",
];

export function BasicInfo({
  data,
  onChange,
  taskType,
  onTaskTypeChange,
  isFromTemplate,
}: BasicInfoProps) {
  const [skillInput, setSkillInput] = useState("");

  const projects = useProjectStore((s) => s.projects);
  const getCampaignsByProject = useCampaignStore((s) => s.getCampaignsByProject);

  // Derive campaign options from selected project
  const campaigns = data.projectId
    ? getCampaignsByProject(data.projectId)
    : [];
  const campaignOptions = campaigns.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // Derive round options from selected campaign
  const selectedCampaign = campaigns.find((c) => c.id === data.campaignId);
  const roundOptions = [
    { value: "new", label: "Create new round" },
    ...(selectedCampaign?.rounds.map((r) => ({
      value: r.id,
      label: r.name,
    })) || []),
  ];

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

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

  const handleProjectChange = (projectId: string) => {
    onChange({ ...data, projectId, campaignId: "", roundId: "" });
  };

  const handleCampaignChange = (campaignId: string) => {
    onChange({ ...data, campaignId, roundId: "" });
  };

  return (
    <div>
      <h2 className="font-inter text-title-lg text-ink">Basic Information</h2>
      <p className="mt-1 font-inter text-body-md text-tertiary-text">
        Define the core details for this annotation task.
      </p>

      {/* Task Type Selector (scratch mode) or Badge (template mode) */}
      {!isFromTemplate ? (
        <div className="mt-6">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Task Type
          </label>
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {TASK_TYPES.map((type) => {
              const info = TASK_TYPE_INFO[type];
              const Icon = info.icon;
              const isSelected = taskType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onTaskTypeChange(type)}
                  className={`flex flex-col items-start rounded-comfortable border p-3.5 text-left transition-colors ${
                    isSelected
                      ? "border-deep-teal bg-selected-bg"
                      : "border-level-2 bg-white hover:border-level-3"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`h-4 w-4 ${
                        isSelected ? "text-deep-teal" : "text-tertiary-text"
                      }`}
                    />
                    <span className="font-inter text-[13px] font-medium text-ink">
                      {info.label}
                    </span>
                  </div>
                  <p className="mt-1 font-inter text-[11px] text-tertiary-text">
                    {info.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        taskType && (
          <div className="mt-6 flex items-center gap-2">
            <span className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
              Task Type
            </span>
            <Badge variant={taskType.toLowerCase() as "pairwise"}>
              {TASK_TYPE_INFO[taskType].label}
            </Badge>
          </div>
        )
      )}

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
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
          onChange={(e) => handleProjectChange(e.target.value)}
        />

        <Select
          label="Campaign"
          options={campaignOptions}
          placeholder={
            data.projectId ? "Select a campaign" : "Select a project first"
          }
          value={data.campaignId}
          onChange={(e) => handleCampaignChange(e.target.value)}
          disabled={!data.projectId}
        />

        <Select
          label="Round"
          options={roundOptions}
          placeholder={
            data.campaignId ? "Select a round" : "Select a campaign first"
          }
          value={data.roundId}
          onChange={(e) => onChange({ ...data, roundId: e.target.value })}
          disabled={!data.campaignId}
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
