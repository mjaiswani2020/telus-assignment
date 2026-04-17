"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Select } from "@/components/ui/select";
import { useTaskStore } from "@/stores/task-store";
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
    Draft: "draft",
    Completed: "complete",
  };
  return map[status] ?? "neutral";
}

function taskTypeVariant(type: TaskType): BadgeVariant {
  return type.toLowerCase() as BadgeVariant;
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Draft", label: "Draft" },
  { value: "Completed", label: "Completed" },
];

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "Pairwise", label: "Pairwise" },
  { value: "Safety", label: "Safety" },
  { value: "SFT", label: "SFT" },
  { value: "Arena", label: "Arena" },
  { value: "Editing", label: "Editing" },
  { value: "Ranking", label: "Ranking" },
  { value: "Rubric", label: "Rubric" },
  { value: "Conversational", label: "Conversational" },
];

export default function TasksPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const getTaskCounts = useTaskStore((s) => s.getTaskCounts);
  const counts = getTaskCounts();

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
      key: "projectName",
      header: "Project",
      render: (t: Task) => (
        <span className="font-inter text-body-md text-secondary-text">
          {t.projectName}
        </span>
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
    {
      key: "createdAt",
      header: "Created",
      render: (t: Task) => formatDate(t.createdAt),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Task Configurations"
        action={
          <div className="flex items-center gap-3">
            <Select options={statusOptions} defaultValue="" className="w-40" />
            <Select options={typeOptions} defaultValue="" className="w-40" />
            <Link href="/tasks/new">
              <Button icon={<Plus className="h-4 w-4" />}>New Task</Button>
            </Link>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="stagger-children mt-6 grid grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={counts.total} />
        <StatCard label="Active" value={counts.active} />
        <StatCard label="Draft" value={counts.draft} />
        <StatCard label="Completed" value={counts.completed} />
      </div>

      {/* Tasks Table */}
      <div className="mt-8 rounded-comfortable border border-level-2 bg-white">
        <DataTable<Task & Record<string, unknown>>
          columns={taskColumns as { key: string; header: string; className?: string; render?: (item: Task & Record<string, unknown>) => React.ReactNode }[]}
          data={tasks as (Task & Record<string, unknown>)[]}
          keyExtractor={(t) => t.id}
        />
      </div>
    </div>
  );
}
