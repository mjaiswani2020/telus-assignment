"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useCampaignStore } from "@/stores/campaign-store";

const statusVariant: Record<string, BadgeVariant> = {
  Active: "active",
  Complete: "complete",
  Draft: "draft",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function CampaignsPage() {
  const campaigns = useCampaignStore((s) => s.campaigns);

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;
  const completeCampaigns = campaigns.filter((c) => c.status === "Complete").length;
  const totalRounds = campaigns.reduce((sum, c) => sum + c.rounds.length, 0);

  const columns = [
    {
      key: "name",
      header: "Campaign Name",
      render: (c: Record<string, unknown>) => (
        <span className="font-inter text-body-md font-medium text-ink">
          {c.name as string}
        </span>
      ),
    },
    {
      key: "projectId",
      header: "Project",
      render: (c: Record<string, unknown>) => {
        const projectNames: Record<string, string> = {
          "proj-helpfulness": "Helpfulness Track",
          "proj-safety": "Safety Track",
          "proj-code-eval": "Code Evaluation",
        };
        return (
          <span className="font-inter text-body-md text-tertiary-text">
            {projectNames[c.projectId as string] || (c.projectId as string)}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (c: Record<string, unknown>) => (
        <Badge variant={statusVariant[c.status as string] || "neutral"} dot>
          {c.status as string}
        </Badge>
      ),
    },
    {
      key: "rounds",
      header: "Rounds",
      render: (c: Record<string, unknown>) =>
        (c.rounds as Array<unknown>).length,
    },
    {
      key: "totalAnnotations",
      header: "Annotations",
      render: (c: Record<string, unknown>) =>
        (c.totalAnnotations as number).toLocaleString(),
    },
    {
      key: "iaa",
      header: "IAA",
      render: (c: Record<string, unknown>) => (
        <span className="font-mono text-code-sm">
          {(c.iaa as number).toFixed(2)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (c: Record<string, unknown>) =>
        formatDate(c.createdAt as string),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Campaigns"
        subtitle="Alignment Lab"
        action={
          <Button icon={<Plus className="h-4 w-4" />}>New Campaign</Button>
        }
      />

      <div className="stagger-children mt-6 grid grid-cols-4 gap-4">
        <StatCard label="Total Campaigns" value={totalCampaigns} />
        <StatCard label="Active" value={activeCampaigns} />
        <StatCard label="Complete" value={completeCampaigns} />
        <StatCard
          label="Total Rounds"
          value={totalRounds}
        />
      </div>

      <div className="mt-6 rounded-comfortable border border-level-2 bg-white">
        <DataTable
          columns={columns}
          data={campaigns as unknown as Record<string, unknown>[]}
          keyExtractor={(c) => c.id as string}
          onRowClick={(c) => {
            const campaign = c as unknown as { id: string; rounds: Array<{ id: string }> };
            if (campaign.rounds.length > 0) {
              window.location.href = `/campaigns/${campaign.id}/rounds/${campaign.rounds[campaign.rounds.length - 1].id}`;
            }
          }}
        />
      </div>
    </div>
  );
}
