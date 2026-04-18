"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, ChevronDown, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useExportStore } from "@/stores/export-store";
import { useToast } from "@/components/ui/toast";

type DataFormat = "DPO" | "Reward Model" | "PPO Prompts" | "SFT" | "Rubric Scores" | "Raw";
type OutputFormat = "JSONL" | "Parquet" | "CSV";
type Destination = "Download" | "S3" | "GCS" | "HF Hub";

const dataFormats: DataFormat[] = ["DPO", "Reward Model", "PPO Prompts", "SFT", "Rubric Scores", "Raw"];
const outputFormats: OutputFormat[] = ["JSONL", "Parquet", "CSV"];
const destinations: Destination[] = ["Download", "S3", "GCS", "HF Hub"];

const campaignOptions = [
  { value: "camp-llama-align", label: "Llama 3 Alignment Campaign" },
  { value: "camp-gpt4-safety", label: "GPT-4 Safety Audit" },
  { value: "camp-arena-q1", label: "Arena Benchmark Q1" },
  { value: "camp-helpfulness-creative", label: "Creative Writing Evaluation" },
  { value: "camp-code-bench", label: "Multi-Language Code Bench" },
];

export default function ExportBuilderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createExport = useExportStore((s) => s.createExport);

  const [dataFormat, setDataFormat] = useState<DataFormat>("DPO");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("JSONL");
  const [campaign, setCampaign] = useState("camp-llama-align");
  const [destination, setDestination] = useState<Destination>("Download");
  const [minAgreement, setMinAgreement] = useState("0.65");

  // Round selections
  const [rounds, setRounds] = useState({ r1: true, r2: true, r3: true });
  const [weights, setWeights] = useState({ r1: "0.2", r2: "0.3", r3: "0.5" });

  // Filters
  const [excludeGoldFails, setExcludeGoldFails] = useState(true);
  const [excludeLowTime, setExcludeLowTime] = useState(true);
  const [excludeFlagged, setExcludeFlagged] = useState(false);

  // Quality gates
  const [gateIaa, setGateIaa] = useState(true);
  const [gateGold, setGateGold] = useState(true);
  const [gateCoverage, setGateCoverage] = useState(false);

  // Provenance summary
  const [provenanceOpen, setProvenanceOpen] = useState(false);

  const matchCount = 28_531;
  const allGatesPassed = gateIaa && gateGold;

  function handleExport() {
    const selectedCampaign = campaignOptions.find((c) => c.value === campaign);
    createExport({
      format: dataFormat as "DPO" | "Reward Model" | "SFT" | "Raw",
      destination: destination as "Download" | "S3" | "GCS" | "HF Hub",
      campaignId: campaign,
      campaignName: selectedCampaign?.label ?? campaign,
      recordCount: matchCount,
      createdBy: "Admin",
    });
    toast("Export created");
    router.push("/exports");
  }

  return (
    <div>
      <PageHeader
        title="Export Data"
        action={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/exports")}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExport} disabled={!allGatesPassed}>
              Export &mdash; Create Snapshot
            </Button>
          </div>
        }
      />

      <div className="stagger-children mt-4 space-y-6">
        {/* Format selector */}
        <div>
          <p className="mb-3 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Data Format
          </p>
          <div className="flex gap-2">
            {dataFormats.map((f) => (
              <button
                key={f}
                onClick={() => setDataFormat(f)}
                className={`rounded-standard px-4 py-2 font-inter text-body-md transition-colors duration-150 ${
                  dataFormat === f
                    ? "bg-deep-teal text-white"
                    : "border border-level-2 text-ink hover:bg-level-1"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Output format */}
        <div>
          <p className="mb-3 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Output Format
          </p>
          <div className="flex gap-2">
            {outputFormats.map((f) => (
              <button
                key={f}
                onClick={() => setOutputFormat(f)}
                className={`rounded-standard px-4 py-2 font-inter text-body-md transition-colors duration-150 ${
                  outputFormat === f
                    ? "bg-deep-teal text-white"
                    : "border border-level-2 text-ink hover:bg-level-1"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Source Data */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Source Data
          </h3>
          <div className="mt-4 space-y-4">
            <Select
              label="Campaign"
              options={campaignOptions}
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
            />
            <div>
              <p className="mb-2 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Rounds
              </p>
              <div className="space-y-2.5">
                {(["r1", "r2", "r3"] as const).map((r, i) => (
                  <div key={r} className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rounds[r]}
                        onChange={(e) =>
                          setRounds({ ...rounds, [r]: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-level-2 text-deep-teal focus:ring-deep-teal"
                      />
                      <span className="font-inter text-body-md text-ink">
                        Round {i + 1}
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-inter text-[12px] text-tertiary-text">
                        Weight:
                      </span>
                      <input
                        type="text"
                        value={weights[r]}
                        onChange={(e) =>
                          setWeights({ ...weights, [r]: e.target.value })
                        }
                        className="h-8 w-16 rounded-standard border border-level-2 bg-level-1 px-2 text-center font-inter text-body-md text-ink focus:border-deep-teal focus:outline-none focus:ring-2 focus:ring-deep-teal/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Filters
          </h3>
          <div className="mt-4 space-y-4">
            <Input
              label="Minimum Agreement"
              value={minAgreement}
              onChange={(e) => setMinAgreement(e.target.value)}
              className="w-40"
              helper="IAA threshold for inclusion"
            />
            <div className="space-y-2">
              {[
                { label: "Exclude gold-standard failures", checked: excludeGoldFails, set: setExcludeGoldFails },
                { label: "Exclude low-time annotations", checked: excludeLowTime, set: setExcludeLowTime },
                { label: "Exclude flagged items", checked: excludeFlagged, set: setExcludeFlagged },
              ].map((f) => (
                <label key={f.label} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={f.checked}
                    onChange={(e) => f.set(e.target.checked)}
                    className="h-4 w-4 rounded border-level-2 text-deep-teal focus:ring-deep-teal"
                  />
                  <span className="font-inter text-body-md text-ink">
                    {f.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Destination */}
        <div>
          <p className="mb-3 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Destination
          </p>
          <div className="flex gap-2">
            {destinations.map((d) => (
              <button
                key={d}
                onClick={() => setDestination(d)}
                className={`rounded-standard px-4 py-2 font-inter text-body-md transition-colors duration-150 ${
                  destination === d
                    ? "bg-deep-teal text-white"
                    : "border border-level-2 text-ink hover:bg-level-1"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Gates */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Quality Gates
          </h3>
          <div className="mt-4 space-y-2.5">
            {[
              { label: "IAA >= 0.65 for all included rounds", checked: gateIaa, set: setGateIaa },
              { label: "Gold accuracy >= 75% for all annotators", checked: gateGold, set: setGateGold },
              { label: "Minimum 3x annotation coverage per item", checked: gateCoverage, set: setGateCoverage },
            ].map((g) => (
              <label key={g.label} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={g.checked}
                  onChange={(e) => g.set(e.target.checked)}
                  className="h-4 w-4 rounded border-level-2 text-deep-teal focus:ring-deep-teal"
                />
                <span className="font-inter text-body-md text-ink">
                  {g.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Data Provenance Summary */}
        <div className="rounded-comfortable border border-level-2 bg-white">
          <button
            type="button"
            onClick={() => setProvenanceOpen(!provenanceOpen)}
            className="flex w-full items-center justify-between p-5"
          >
            <h3 className="font-literata text-label-sm uppercase tracking-[0.5px] text-secondary-text">
              Data Provenance Summary
            </h3>
            <ChevronDown
              className={`h-4 w-4 text-[#6F7A77] transition-transform duration-200 ${
                provenanceOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {provenanceOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-3 border-t border-level-2 px-5 pb-5 pt-4">
                  {/* Summary stats */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-inter text-[12px] font-medium text-[#556260]">
                        Model Versions:
                      </span>
                      <span className="font-inter text-body-md text-ink">
                        claude-3.5-sonnet v1, claude-3.5-sonnet v2, llama-3-70b
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-inter text-[12px] font-medium text-[#556260]">
                        Guideline Versions:
                      </span>
                      <span className="font-inter text-body-md text-ink">
                        v2.1 through v2.3 (3 versions)
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-inter text-[12px] font-medium text-[#556260]">
                        Unique Annotators:
                      </span>
                      <span className="font-inter text-body-md text-ink">
                        24
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-inter text-[12px] font-medium text-[#556260]">
                        QA Coverage:
                      </span>
                      <span className="font-inter text-body-md text-ink">
                        87% human-reviewed, 13% auto-approved only
                      </span>
                    </div>
                  </div>

                  {/* Warning callout */}
                  <div className="flex items-start gap-3 rounded-standard border border-[#D97706] bg-[#FFF7ED] px-3 py-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
                    <p className="font-inter text-[13px] text-ink leading-relaxed">
                      Selected data spans 2 model versions and 3 guideline
                      versions. This may introduce distribution inconsistencies
                      in training.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preview bar */}
        <div className="rounded-comfortable bg-[#ECFDF5] px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-inter text-body-md font-medium text-ink">
                {matchCount.toLocaleString()} annotations match filters
              </span>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: "IAA Gate", passed: gateIaa },
                { label: "Gold Gate", passed: gateGold },
                { label: "Coverage Gate", passed: gateCoverage },
              ].map((g) => (
                <div key={g.label} className="flex items-center gap-1.5">
                  {g.passed ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-error" />
                  )}
                  <span
                    className={`font-inter text-[12px] ${
                      g.passed ? "text-success" : "text-error"
                    }`}
                  >
                    {g.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
