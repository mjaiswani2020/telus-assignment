"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Download, Eye, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import { useCampaignStore } from "@/stores/campaign-store";
import { useModelStore } from "@/stores/model-store";

function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Active: "active",
    Complete: "complete",
    Draft: "draft",
  };
  return map[status] ?? "neutral";
}

interface CrossRoundRow extends Record<string, unknown> {
  metric: string;
  round1: string;
  round2: string;
  round3: string;
}

export default function CampaignRoundDetailPage() {
  const params = useParams<{ id: string; roundId: string }>();
  const getCampaign = useCampaignStore((s) => s.getCampaign);
  const getRound = useCampaignStore((s) => s.getRound);
  const getRoundProgress = useCampaignStore((s) => s.getRoundProgress);
  const preferenceDistribution = useCampaignStore((s) => s.preferenceDistribution);
  const crossRoundComparisons = useCampaignStore((s) => s.crossRoundComparisons);
  const endpoints = useModelStore((s) => s.endpoints);

  const campaign = getCampaign(params.id);
  const round = getRound(params.id, params.roundId);
  const progressPercent = getRoundProgress(params.id, params.roundId);

  if (!campaign || !round) {
    return (
      <div className="py-20 text-center font-inter text-body-lg text-tertiary-text">
        Round not found.
      </div>
    );
  }

  const modelEndpoints = endpoints.slice(0, 2);

  const crossRoundColumns = [
    {
      key: "metric",
      header: "Metric",
      render: (row: CrossRoundRow) => (
        <span className="font-inter text-body-md font-medium text-ink">
          {row.metric}
        </span>
      ),
    },
    {
      key: "round1",
      header: "Round 1",
      render: (row: CrossRoundRow) => row.round1,
    },
    {
      key: "round2",
      header: "Round 2",
      render: (row: CrossRoundRow) => row.round2,
    },
    {
      key: "round3",
      header: "Round 3",
      render: (row: CrossRoundRow) => (
        <span className="font-inter font-medium text-deep-teal">
          {row.round3}
        </span>
      ),
    },
  ];

  const r1 = crossRoundComparisons[0];
  const r2 = crossRoundComparisons[1];
  const r3 = crossRoundComparisons[2];

  const crossRoundData: CrossRoundRow[] = [
    {
      metric: "IAA (AC2)",
      round1: r1?.iaa.toFixed(2) ?? "\u2014",
      round2: r2?.iaa.toFixed(2) ?? "\u2014",
      round3: r3?.iaa.toFixed(2) ?? "\u2014",
    },
    {
      metric: "Gold Accuracy",
      round1: r1 ? `${r1.goldAccuracy}%` : "\u2014",
      round2: r2 ? `${r2.goldAccuracy}%` : "\u2014",
      round3: r3 ? `${r3.goldAccuracy}%` : "\u2014",
    },
    {
      metric: "Avg Time",
      round1: "3m 12s",
      round2: "2m 48s",
      round3: "2m 35s",
    },
    {
      metric: "Annotations",
      round1: "10,000",
      round2: "15,000",
      round3: round.progress.toLocaleString(),
    },
  ];

  const iaaMetTarget = round.iaa >= round.iaaTarget;

  const prefBars = [
    { label: "Sig. Better", value: preferenceDistribution.significantlyBetter, color: "bg-deep-teal" },
    { label: "Better", value: preferenceDistribution.better, color: "bg-[#059669]" },
    { label: "Slightly", value: preferenceDistribution.slightlyBetter, color: "bg-[#34D399]" },
    { label: "Negligible", value: preferenceDistribution.negligible, color: "bg-level-2" },
  ];

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/projects/${campaign.projectId}`}
        className="mb-4 inline-flex items-center gap-1 font-inter text-body-md text-secondary-text transition-colors hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        {campaign.name}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="font-literata text-[28px] font-semibold text-ink">
          {round.name}
        </h1>
        <Badge variant={statusVariant(round.status)}>
          {round.status.toUpperCase()}
        </Badge>
      </div>

      {/* Progress Cards */}
      <div className="stagger-children mt-6 grid grid-cols-3 gap-4">
        {/* Progress */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
            Progress
          </p>
          <p className="mt-2 font-literata text-display-lg text-ink">
            {progressPercent}%
          </p>
          <ProgressBar
            value={round.progress}
            max={round.target}
            className="mt-3"
            size="md"
          />
          <p className="mt-2 font-inter text-[12px] text-tertiary-text">
            {round.progress.toLocaleString()} / {round.target.toLocaleString()}
          </p>
          <p className="mt-1 font-inter text-[12px] text-tertiary-text">
            ETA: {round.eta}
          </p>
        </div>

        {/* IAA */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
            IAA (AC2)
          </p>
          <p className="mt-2 font-literata text-display-lg text-ink">
            {round.iaa.toFixed(2)}
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            {iaaMetTarget && (
              <Check className="h-4 w-4 text-success" />
            )}
            <span
              className={`font-inter text-[12px] ${
                iaaMetTarget ? "text-success" : "text-caution"
              }`}
            >
              vs target {round.iaaTarget.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Preference Distribution */}
        <div className="rounded-comfortable border border-level-2 bg-white p-5">
          <p className="font-inter text-label-sm uppercase tracking-[0.14em] text-secondary-text">
            Preference Distribution
          </p>
          <div className="mt-4 space-y-3">
            {prefBars.map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <span className="w-16 shrink-0 font-inter text-[12px] text-tertiary-text">
                  {bar.label}
                </span>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-level-1">
                    <motion.div
                      className={`h-full rounded-full ${bar.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <span className="w-8 shrink-0 text-right font-inter text-[12px] text-ink">
                  {bar.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Versions */}
      <div className="mt-8">
        <h3 className="font-inter text-[16px] font-medium text-ink">
          Model Versions
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-4">
          {modelEndpoints.map((ep) => (
            <div
              key={ep.id}
              className="rounded-comfortable border border-level-2 bg-white p-5"
            >
              <p className="font-inter text-body-md font-medium text-ink">
                {ep.name}
              </p>
              <div className="mt-2 space-y-1">
                <p className="font-inter text-[12px] text-tertiary-text">
                  Version:{" "}
                  <span className="font-mono text-code-sm text-ink">
                    {ep.version}
                  </span>
                </p>
                <p className="font-inter text-[12px] text-tertiary-text">
                  Provider:{" "}
                  <span className="text-ink">{ep.provider}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Round Comparison */}
      <div className="mt-8 rounded-comfortable border border-level-2 bg-white">
        <div className="px-5 pt-5 pb-3">
          <h3 className="font-inter text-[16px] font-medium text-ink">
            Cross-Round Comparison
          </h3>
        </div>
        <DataTable<CrossRoundRow>
          columns={crossRoundColumns}
          data={crossRoundData}
          keyExtractor={(row) => row.metric}
        />
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex items-center gap-3">
        <Button icon={<ArrowRight className="h-4 w-4" />}>
          Advance to Review
        </Button>
        <Button
          variant="secondary"
          icon={<Download className="h-4 w-4" />}
        >
          Export Round Data
        </Button>
        <Button variant="ghost" icon={<Eye className="h-4 w-4" />}>
          View Annotations
        </Button>
      </div>
    </div>
  );
}
