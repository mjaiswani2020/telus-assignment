"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { useModelStore } from "@/stores/model-store";
import { useToast } from "@/components/ui/toast";
import type { ModelEndpoint } from "@/data/seed";

type Row = ModelEndpoint & Record<string, unknown>;

export default function ModelsPage() {
  const endpoints = useModelStore((s) => s.endpoints);
  const { toast } = useToast();

  const columns: { key: string; header: string; className?: string; render?: (item: Row) => React.ReactNode }[] = [
    {
      key: "name",
      header: "Name",
      render: (item) => (
        <span className="font-medium text-ink">{item.name}</span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      render: (item) => (
        <span className="text-secondary-text">{item.provider}</span>
      ),
    },
    {
      key: "version",
      header: "Version",
      render: (item) => (
        <span className="font-mono text-code-sm">{item.version}</span>
      ),
    },
    {
      key: "health",
      header: "Health",
      render: (item) => {
        const variant =
          item.health === "Up"
            ? "success"
            : item.health === "Slow"
              ? "caution"
              : "error";
        return (
          <Badge variant={variant} dot>
            {item.health}
          </Badge>
        );
      },
    },
    {
      key: "activeTasks",
      header: "Tasks",
      render: (item) => <span>{item.activeTasks}</span>,
    },
    {
      key: "latencyMs",
      header: "Latency",
      render: (item) => (
        <span className={item.latencyMs > 1000 ? "font-medium text-error" : "text-ink"}>
          {item.latencyMs.toLocaleString()}ms
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Model Endpoints"
        action={
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => toast("Endpoint creation coming soon", "info")}
          >
            Add Endpoint
          </Button>
        }
      />

      <div className="stagger-children mt-6 rounded-comfortable border border-level-2 bg-white">
        <DataTable<Row>
          columns={columns}
          data={endpoints as Row[]}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}
