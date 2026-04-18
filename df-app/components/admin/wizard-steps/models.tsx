"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useModelStore } from "@/stores/model-store";
import { Check, Circle } from "lucide-react";

type ResponseSource = "live" | "cached" | "mixed";

interface ModelsData {
  selectedEndpoints: string[];
  responseSource: ResponseSource;
  pairingStrategy: string;
  responsesPerTask: string;
}

interface ModelsProps {
  data: ModelsData;
  onChange: (data: ModelsData) => void;
}

const responseSourceOptions: { value: ResponseSource; label: string }[] = [
  { value: "live", label: "Live inference" },
  { value: "cached", label: "Cached responses" },
  { value: "mixed", label: "Mixed (live + cached)" },
];

const pairingOptions = [
  { value: "same", label: "Same model (self-play)" },
  { value: "different", label: "Different models" },
  { value: "mixed", label: "Mixed pairing" },
];

export function Models({ data, onChange }: ModelsProps) {
  const endpoints = useModelStore((s) => s.endpoints);

  const toggleEndpoint = (id: string) => {
    const next = data.selectedEndpoints.includes(id)
      ? data.selectedEndpoints.filter((e) => e !== id)
      : [...data.selectedEndpoints, id];
    onChange({ ...data, selectedEndpoints: next });
  };

  return (
    <div>
      <h2 className="font-inter text-title-lg text-ink">Model Configuration</h2>
      <p className="mt-1 font-inter text-body-md text-tertiary-text">
        Select model endpoints and configure response generation.
      </p>

      {/* Model Endpoint Selection */}
      <div className="mt-8">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Model Endpoints
        </label>
        <div className="mt-3 space-y-2">
          {endpoints.map((ep) => {
            const isSelected = data.selectedEndpoints.includes(ep.id);
            return (
              <button
                key={ep.id}
                type="button"
                onClick={() => toggleEndpoint(ep.id)}
                className={`flex w-full items-center gap-3 rounded-standard border p-3.5 text-left transition-colors ${
                  isSelected
                    ? "border-deep-teal bg-selected-bg"
                    : "border-level-2 bg-white hover:border-level-3"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-tight border-2 transition-colors ${
                    isSelected
                      ? "border-deep-teal bg-deep-teal"
                      : "border-level-2"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-inter text-[14px] font-medium text-ink">
                      {ep.name}
                    </span>
                    <span className="font-inter text-[12px] text-tertiary-text">
                      {ep.version}
                    </span>
                    <span
                      className={`ml-auto flex items-center gap-1 font-inter text-[12px] ${
                        ep.health === "Up"
                          ? "text-success"
                          : ep.health === "Slow"
                          ? "text-caution"
                          : "text-error"
                      }`}
                    >
                      <Circle className="h-2 w-2 fill-current" />
                      {ep.health}
                    </span>
                  </div>
                  <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
                    {ep.provider} -- {ep.latencyMs}ms avg latency
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Response Source */}
      <div className="mt-8">
        <label className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
          Response Source
        </label>
        <div className="mt-3 flex gap-3">
          {responseSourceOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...data, responseSource: opt.value })}
              className={`flex items-center gap-2 rounded-standard border px-4 py-2.5 transition-colors ${
                data.responseSource === opt.value
                  ? "border-deep-teal bg-selected-bg text-deep-teal"
                  : "border-level-2 text-secondary-text hover:border-level-3"
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
                  data.responseSource === opt.value
                    ? "border-deep-teal"
                    : "border-level-2"
                }`}
              >
                {data.responseSource === opt.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-deep-teal" />
                )}
              </span>
              <span className="font-inter text-[13px] font-medium">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pairing Strategy & Responses per Task */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <Select
          label="Pairing Strategy"
          options={pairingOptions}
          value={data.pairingStrategy}
          onChange={(e) =>
            onChange({ ...data, pairingStrategy: e.target.value })
          }
        />
        <Input
          label="Responses Per Task"
          type="number"
          placeholder="2"
          value={data.responsesPerTask}
          onChange={(e) =>
            onChange({ ...data, responsesPerTask: e.target.value })
          }
          helper="Number of model responses shown per annotation item"
        />
      </div>
    </div>
  );
}

export type { ModelsData, ResponseSource };
