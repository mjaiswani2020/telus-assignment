"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { useProjectStore } from "@/stores/project-store";
import { useCampaignStore } from "@/stores/campaign-store";
import { useTaskStore } from "@/stores/task-store";
import type { Campaign } from "@/data/seed";
import type { Task, TaskType } from "@/data/seed";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Active: "active",
    Complete: "complete",
    Draft: "draft",
    Completed: "complete",
  };
  return map[status] ?? "neutral";
}

function taskTypeVariant(type: TaskType): BadgeVariant {
  return type.toLowerCase() as BadgeVariant;
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const getProject = useProjectStore((s) => s.getProject);
  const getCampaignsByProject = useCampaignStore((s) => s.getCampaignsByProject);
  const getTasksByProject = useTaskStore((s) => s.getTasksByProject);

  const project = getProject(params.id);

  if (!project) {
    return (
      <div className="py-20 text-center font-inter text-body-lg text-tertiary-text">
        Project not found.
      </div>
    );
  }

  const campaigns = getCampaignsByProject(project.id);
  const tasks = getTasksByProject(project.id);

  const campaignColumns = [
    {
      key: "name",
      header: "Campaign Name",
      render: (c: Campaign) => (
        <span className="font-inter text-body-md font-medium text-ink">
          {c.name}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c: Campaign) => (
        <Badge variant={statusVariant(c.status)} dot>
          {c.status}
        </Badge>
      ),
    },
    {
      key: "rounds",
      header: "Rounds",
      render: (c: Campaign) => c.rounds.length,
    },
    {
      key: "totalAnnotations",
      header: "Annotations",
      render: (c: Campaign) => c.totalAnnotations.toLocaleString(),
    },
    {
      key: "iaa",
      header: "IAA",
      render: (c: Campaign) =>
        c.iaa > 0 ? c.iaa.toFixed(2) : "\u2014",
    },
    {
      key: "createdAt",
      header: "Created",
      render: (c: Campaign) => formatDate(c.createdAt),
    },
  ];

  const taskColumns = [
    {
      key: "name",
      header: "Task Name",
      render: (t: Task) => (
        <span className="font-inter text-body-md font-medium text-ink">
          {t.name}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (t: Task) => (
        <Badge variant={taskTypeVariant(t.type)}>{t.type}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t: Task) => (
        <Badge variant={statusVariant(t.status)} dot>
          {t.status}
        </Badge>
      ),
    },
    {
      key: "annotationCount",
      header: "Annotations",
      render: (t: Task) => t.annotationCount.toLocaleString(),
    },
  ];

  function handleCampaignClick(c: Campaign) {
    const activeRound = c.rounds.find((r) => r.status === "Active") ?? c.rounds[0];
    if (activeRound) {
      router.push(`/campaigns/${c.id}/rounds/${activeRound.id}`);
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Link
        href="/projects"
        className="mb-4 inline-flex items-center gap-1 font-inter text-body-md text-secondary-text transition-colors hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        Projects
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-literata text-[28px] font-semibold text-ink">
            {project.name}
          </h1>
          <Badge variant={statusVariant(project.status)} dot>
            {project.status}
          </Badge>
        </div>
        <Button>New Campaign</Button>
      </div>

      {/* Stat Cards */}
      <div className="stagger-children mt-4 grid grid-cols-3 gap-3">
        <StatCard label="Campaigns" value={project.campaignCount} />
        <StatCard label="Active Rounds" value={project.activeRounds} />
        <StatCard label="Total Annotations" value={project.totalAnnotations} />
      </div>

      {/* Campaigns Table */}
      <div className="mt-4 rounded-comfortable border border-level-2 bg-white">
        <div className="px-5 pt-5 pb-3">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Campaigns
          </h3>
        </div>
        <DataTable<Campaign & Record<string, unknown>>
          columns={campaignColumns as { key: string; header: string; className?: string; render?: (item: Campaign & Record<string, unknown>) => React.ReactNode }[]}
          data={campaigns as (Campaign & Record<string, unknown>)[]}
          onRowClick={(c) => handleCampaignClick(c as unknown as Campaign)}
          keyExtractor={(c) => c.id}
        />
      </div>

      {/* Task Configurations Table */}
      <div className="mt-4 rounded-comfortable border border-level-2 bg-white">
        <div className="px-5 pt-5 pb-3">
          <h3 className="font-inter text-[14px] font-semibold text-ink">
            Task Configurations
          </h3>
        </div>
        <DataTable<Task & Record<string, unknown>>
          columns={taskColumns as { key: string; header: string; className?: string; render?: (item: Task & Record<string, unknown>) => React.ReactNode }[]}
          data={tasks as (Task & Record<string, unknown>)[]}
          keyExtractor={(t) => t.id}
        />
      </div>
    </div>
  );
}
