"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PipelinePreset = "lightweight" | "production" | "research";

interface QualityData {
  goldInsertionRate: number;
  minTimeThreshold: string;
  overlapCount: string;
  reviewSampleRate: number;
  minAgreementThreshold: string;
  performanceGate: string;
  preset: PipelinePreset | null;
}

interface QualityProps {
  data: QualityData;
  onChange: (data: QualityData) => void;
}

const presets: { value: PipelinePreset; label: string; config: Partial<QualityData> }[] = [
  {
    value: "lightweight",
    label: "Lightweight",
    config: {
      goldInsertionRate: 5,
      minTimeThreshold: "20",
      overlapCount: "1",
      reviewSampleRate: 10,
      minAgreementThreshold: "0.60",
      performanceGate: "0.70",
    },
  },
  {
    value: "production",
    label: "Production",
    config: {
      goldInsertionRate: 10,
      minTimeThreshold: "45",
      overlapCount: "3",
      reviewSampleRate: 25,
      minAgreementThreshold: "0.70",
      performanceGate: "0.80",
    },
  },
  {
    value: "research",
    label: "Research-grade",
    config: {
      goldInsertionRate: 15,
      minTimeThreshold: "60",
      overlapCount: "5",
      reviewSampleRate: 50,
      minAgreementThreshold: "0.80",
      performanceGate: "0.85",
    },
  },
];

export function Quality({ data, onChange }: QualityProps) {
  const applyPreset = (preset: PipelinePreset) => {
    const config = presets.find((p) => p.value === preset)?.config;
    if (config) {
      onChange({ ...data, ...config, preset });
    }
  };

  return (
    <div>
      <h2 className="font-inter text-title-lg text-ink">Quality Pipeline</h2>
      <p className="mt-1 font-inter text-body-md text-tertiary-text">
        Configure quality assurance gates and review parameters.
      </p>

      {/* Pipeline Presets */}
      <div className="mt-8">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Pipeline Preset
        </label>
        <div className="mt-3 flex gap-3">
          {presets.map((p) => (
            <Button
              key={p.value}
              variant={data.preset === p.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => applyPreset(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Gold Standard Insertion Rate */}
      <div className="mt-8">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Gold Standard Insertion Rate
        </label>
        <div className="mt-2">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={data.goldInsertionRate}
              onChange={(e) =>
                onChange({
                  ...data,
                  goldInsertionRate: Number(e.target.value),
                  preset: null,
                })
              }
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-level-2 accent-deep-teal"
            />
            <span className="w-12 text-right font-inter text-body-md font-medium text-ink">
              {data.goldInsertionRate}%
            </span>
          </div>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">
            Percentage of items that are gold-standard checks (0--20%)
          </p>
        </div>
      </div>

      {/* Min Time Threshold & Overlap Count */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <Input
          label="Min Time Threshold (s)"
          type="number"
          placeholder="45"
          value={data.minTimeThreshold}
          onChange={(e) =>
            onChange({ ...data, minTimeThreshold: e.target.value, preset: null })
          }
          helper="Flags annotations below this time"
        />
        <div className="flex flex-col gap-1.5">
          <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Overlap Count
          </label>
          <div className="mt-0.5">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={Number(data.overlapCount) || 1}
              onChange={(e) =>
                onChange({
                  ...data,
                  overlapCount: e.target.value,
                  preset: null,
                })
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-level-2 accent-deep-teal"
            />
            <div className="flex justify-between mt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`font-inter text-[11px] ${
                    Number(data.overlapCount) === n
                      ? "font-medium text-deep-teal"
                      : "text-tertiary-text"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
          <p className="font-inter text-[12px] text-tertiary-text">
            Number of annotators per item
          </p>
        </div>
      </div>

      {/* Review Sample Rate */}
      <div className="mt-6">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Review Sample Rate
        </label>
        <div className="mt-2 flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={data.reviewSampleRate}
            onChange={(e) =>
              onChange({
                ...data,
                reviewSampleRate: Number(e.target.value),
                preset: null,
              })
            }
            className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-level-2 accent-deep-teal"
          />
          <span className="w-12 text-right font-inter text-body-md font-medium text-ink">
            {data.reviewSampleRate}%
          </span>
        </div>
        <p className="mt-1 font-inter text-[12px] text-tertiary-text">
          Percentage of annotations sent to lead reviewer (0--100%)
        </p>
      </div>

      {/* Agreement & Performance Thresholds */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <Input
          label="Min Agreement Threshold"
          type="number"
          step="0.01"
          placeholder="0.70"
          value={data.minAgreementThreshold}
          onChange={(e) =>
            onChange({
              ...data,
              minAgreementThreshold: e.target.value,
              preset: null,
            })
          }
          helper="Minimum inter-annotator agreement (0-1)"
        />
        <Input
          label="Performance Gate Threshold"
          type="number"
          step="0.01"
          placeholder="0.80"
          value={data.performanceGate}
          onChange={(e) =>
            onChange({
              ...data,
              performanceGate: e.target.value,
              preset: null,
            })
          }
          helper="Gold accuracy threshold to continue annotating"
        />
      </div>
    </div>
  );
}

export type { QualityData, PipelinePreset };
