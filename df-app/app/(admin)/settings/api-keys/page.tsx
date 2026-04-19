"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsNav } from "@/components/admin/settings-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/toast";

// Mock API key data
interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  createdAt: string;
  lastUsed: string;
  status: "Active" | "Revoked";
}

type Row = ApiKey & Record<string, unknown>;

const mockApiKeys: ApiKey[] = [
  {
    id: "key-001",
    name: "Production Pipeline",
    keyPreview: "df_live_sk...7x4m",
    createdAt: "2026-03-01",
    lastUsed: "2026-04-17",
    status: "Active",
  },
  {
    id: "key-002",
    name: "Staging Environment",
    keyPreview: "df_live_sk...b2nq",
    createdAt: "2026-02-15",
    lastUsed: "2026-04-16",
    status: "Active",
  },
  {
    id: "key-003",
    name: "CI/CD Runner",
    keyPreview: "df_live_sk...h9ek",
    createdAt: "2026-01-20",
    lastUsed: "2026-04-15",
    status: "Active",
  },
  {
    id: "key-004",
    name: "Old Integration",
    keyPreview: "df_live_sk...m3pv",
    createdAt: "2025-12-10",
    lastUsed: "2026-02-28",
    status: "Revoked",
  },
];

interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT";
  path: string;
  description: string;
}

type EndpointRow = ApiEndpoint & Record<string, unknown>;

const apiEndpoints: ApiEndpoint[] = [
  {
    id: "ep-1",
    method: "POST",
    path: "/api/v1/annotations",
    description: "Submit annotation data",
  },
  {
    id: "ep-2",
    method: "GET",
    path: "/api/v1/tasks",
    description: "List task configurations",
  },
  {
    id: "ep-3",
    method: "POST",
    path: "/api/v1/exports",
    description: "Trigger data export",
  },
  {
    id: "ep-4",
    method: "GET",
    path: "/api/v1/annotators",
    description: "List annotator profiles",
  },
  {
    id: "ep-5",
    method: "PUT",
    path: "/api/v1/tasks/:id",
    description: "Update task config",
  },
  {
    id: "ep-6",
    method: "GET",
    path: "/api/v1/metrics",
    description: "Retrieve quality metrics",
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
  POST: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  PUT: "bg-[#FFF7ED] text-[#D97706] border-[#FED7AA]",
};

export default function ApiKeysPage() {
  const { toast } = useToast();

  const columns: {
    key: string;
    header: string;
    className?: string;
    render?: (item: Row) => React.ReactNode;
  }[] = [
    {
      key: "name",
      header: "Name",
      render: (item) => (
        <span className="font-medium text-ink">{item.name}</span>
      ),
    },
    {
      key: "keyPreview",
      header: "Key",
      render: (item) => (
        <span className="font-mono text-code-sm text-secondary-text">
          {item.keyPreview}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (item) => (
        <span className="text-tertiary-text">{item.createdAt}</span>
      ),
    },
    {
      key: "lastUsed",
      header: "Last Used",
      render: (item) => (
        <span className="text-tertiary-text">{item.lastUsed}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge variant={item.status === "Active" ? "success" : "neutral"} dot>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) =>
        item.status === "Active" ? (
          <button
            onClick={() => toast(`Key "${item.name}" revoked`, "warning")}
            className="font-inter text-body-md text-error hover:underline"
          >
            Revoke
          </button>
        ) : (
          <span className="font-inter text-body-md text-tertiary-text">--</span>
        ),
    },
  ];

  const endpointColumns: {
    key: string;
    header: string;
    className?: string;
    render?: (item: EndpointRow) => React.ReactNode;
  }[] = [
    {
      key: "method",
      header: "Method",
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-tight border px-2 py-0.5 font-mono text-[12px] font-semibold ${methodColors[item.method]}`}
        >
          {item.method}
        </span>
      ),
    },
    {
      key: "path",
      header: "Path",
      render: (item) => (
        <span className="font-mono text-code-sm text-ink">{item.path}</span>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (item) => (
        <span className="text-secondary-text">{item.description}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="mt-4">
        <SettingsNav />
      </div>

      <div className="stagger-children mt-4 space-y-4">
        {/* API Keys section */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-inter text-[14px] font-semibold text-ink">
              API Keys
            </h3>
            <Button
              icon={<Plus className="h-4 w-4" />}
              size="sm"
              onClick={() => toast("New API key created", "success")}
            >
              Create Key
            </Button>
          </div>
          <div className="mt-4 rounded-comfortable border border-level-2 bg-white">
            <DataTable<Row>
              columns={columns}
              data={mockApiKeys as Row[]}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>

        {/* API Usage */}
        <div>
          <h3 className="mb-4 font-inter text-[14px] font-semibold text-ink">
            API Usage
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Requests" value={142531} />
            <StatCard label="Avg Latency" value="230ms" />
            <StatCard label="Error Rate" value="0.02%" />
          </div>
        </div>

        {/* API Reference */}
        <div>
          <h3 className="mb-4 font-inter text-[14px] font-semibold uppercase tracking-[0.5px] text-ink">
            API Reference
          </h3>
          <div className="rounded-comfortable border border-level-2 bg-white">
            <DataTable<EndpointRow>
              columns={endpointColumns}
              data={apiEndpoints as EndpointRow[]}
              keyExtractor={(item) => item.id}
            />
          </div>
          <p className="mt-3 font-inter text-[12px] text-tertiary-text">
            Rate limit: 1,000 requests/minute per API key
          </p>
        </div>
      </div>
    </div>
  );
}
