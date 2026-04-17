"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { useExportStore } from "@/stores/export-store";
import type { ExportRecord } from "@/data/seed";

type Row = ExportRecord & Record<string, unknown>;

const formatVariant: Record<string, "pairwise" | "caution" | "sft" | "neutral"> = {
  DPO: "pairwise",
  "Reward Model": "caution",
  SFT: "sft",
  Raw: "neutral",
};

const destVariant: Record<string, "info" | "success" | "caution" | "neutral"> = {
  S3: "info",
  "HF Hub": "success",
  GCS: "caution",
  Download: "neutral",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ExportsPage() {
  const exports = useExportStore((s) => s.exports);

  const columns: { key: string; header: string; className?: string; render?: (item: Row) => React.ReactNode }[] = [
    {
      key: "version",
      header: "Version",
      render: (item) => (
        <span className="font-mono text-code-sm text-ink">{item.version}</span>
      ),
    },
    {
      key: "format",
      header: "Format",
      render: (item) => (
        <Badge variant={formatVariant[item.format] ?? "neutral"}>
          {item.format}
        </Badge>
      ),
    },
    {
      key: "recordCount",
      header: "Records",
      render: (item) => (
        <span className="text-ink">{item.recordCount.toLocaleString()}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (item) => (
        <span className="text-tertiary-text">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: "createdBy",
      header: "By",
      render: (item) => (
        <span className="text-secondary-text">{item.createdBy}</span>
      ),
    },
    {
      key: "destination",
      header: "Destination",
      render: (item) => (
        <Badge variant={destVariant[item.destination] ?? "neutral"}>
          {item.destination}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const variant =
          item.status === "Complete"
            ? "success"
            : item.status === "In Progress"
              ? "info"
              : "error";
        return (
          <Badge variant={variant} dot>
            {item.status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Export History"
        action={
          <Link href="/exports/new">
            <Button icon={<Plus className="h-4 w-4" />}>New Export</Button>
          </Link>
        }
      />

      <div className="stagger-children mt-6 rounded-comfortable border border-level-2 bg-white">
        <DataTable<Row>
          columns={columns}
          data={exports as Row[]}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}
