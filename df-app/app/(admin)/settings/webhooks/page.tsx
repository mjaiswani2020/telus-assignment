"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsNav } from "@/components/admin/settings-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/toast";

// --- Webhook table types ---
interface Webhook {
  id: string;
  url: string;
  events: string;
  status: "Active" | "Failed";
  lastTriggered: string;
  failures: number;
}

type WebhookRow = Webhook & Record<string, unknown>;

const mockWebhooks: Webhook[] = [
  {
    id: "wh-1",
    url: "https://api.internal/rlhf/callback",
    events: "annotation.completed, review.approved",
    status: "Active",
    lastTriggered: "2 min ago",
    failures: 0,
  },
  {
    id: "wh-2",
    url: "https://ml-pipeline.co/ingest",
    events: "export.ready",
    status: "Active",
    lastTriggered: "1 day ago",
    failures: 2,
  },
  {
    id: "wh-3",
    url: "https://slack.webhook/alerts",
    events: "calibration.triggered, task.updated",
    status: "Failed",
    lastTriggered: "3 days ago",
    failures: 5,
  },
];

// --- Recent deliveries types ---
interface Delivery {
  id: string;
  timestamp: string;
  event: string;
  statusCode: number;
  responseTime: string;
}

type DeliveryRow = Delivery & Record<string, unknown>;

const recentDeliveries: Delivery[] = [
  {
    id: "del-1",
    timestamp: "Apr 18 14:22",
    event: "annotation.completed",
    statusCode: 200,
    responseTime: "145ms",
  },
  {
    id: "del-2",
    timestamp: "Apr 18 14:21",
    event: "review.approved",
    statusCode: 200,
    responseTime: "203ms",
  },
  {
    id: "del-3",
    timestamp: "Apr 18 14:18",
    event: "annotation.completed",
    statusCode: 200,
    responseTime: "132ms",
  },
  {
    id: "del-4",
    timestamp: "Apr 18 13:45",
    event: "calibration.triggered",
    statusCode: 200,
    responseTime: "178ms",
  },
  {
    id: "del-5",
    timestamp: "Apr 17 09:12",
    event: "export.ready",
    statusCode: 500,
    responseTime: "2340ms",
  },
];

export default function WebhooksPage() {
  const { toast } = useToast();

  const webhookColumns: {
    key: string;
    header: string;
    className?: string;
    render?: (item: WebhookRow) => React.ReactNode;
  }[] = [
    {
      key: "url",
      header: "URL",
      render: (item) => (
        <span className="font-mono text-code-sm text-ink">{item.url}</span>
      ),
    },
    {
      key: "events",
      header: "Events",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {(item.events as string).split(", ").map((ev) => (
            <span
              key={ev}
              className="inline-block rounded-tight bg-level-1 px-1.5 py-0.5 font-mono text-[11px] text-secondary-text"
            >
              {ev}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge variant={item.status === "Active" ? "success" : "error"} dot>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "lastTriggered",
      header: "Last Triggered",
      render: (item) => (
        <span className="text-tertiary-text">{item.lastTriggered}</span>
      ),
    },
    {
      key: "failures",
      header: "Failures",
      render: (item) => (
        <span
          className={
            (item.failures as number) > 0 ? "font-medium text-[#DC2626]" : "text-tertiary-text"
          }
        >
          {item.failures as number}
        </span>
      ),
    },
  ];

  const deliveryColumns: {
    key: string;
    header: string;
    className?: string;
    render?: (item: DeliveryRow) => React.ReactNode;
  }[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (item) => (
        <span className="font-mono text-code-sm text-tertiary-text">
          {item.timestamp}
        </span>
      ),
    },
    {
      key: "event",
      header: "Event",
      render: (item) => (
        <span className="font-mono text-code-sm text-ink">{item.event}</span>
      ),
    },
    {
      key: "statusCode",
      header: "Status Code",
      render: (item) => {
        const code = item.statusCode as number;
        return (
          <span
            className={`inline-flex items-center rounded-tight border px-2 py-0.5 font-mono text-[12px] font-semibold ${
              code >= 200 && code < 300
                ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]"
                : "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]"
            }`}
          >
            {code}
          </span>
        );
      },
    },
    {
      key: "responseTime",
      header: "Response Time",
      render: (item) => (
        <span className="text-tertiary-text">{item.responseTime}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        action={
          <Button
            icon={<Plus className="h-4 w-4" />}
            size="sm"
            onClick={() => toast("Add webhook dialog opened", "info")}
          >
            Add Webhook
          </Button>
        }
      />

      <div className="mt-4">
        <SettingsNav />
      </div>

      <div className="stagger-children mt-4 space-y-6">
        {/* Configured Webhooks */}
        <div>
          <h3 className="mb-3 font-inter text-[14px] font-semibold text-ink">
            Configured Webhooks
          </h3>
          <div className="rounded-comfortable border border-level-2 bg-white">
            <DataTable<WebhookRow>
              columns={webhookColumns}
              data={mockWebhooks as WebhookRow[]}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>

        {/* Recent Deliveries */}
        <div>
          <h3 className="mb-3 font-inter text-[14px] font-semibold text-ink">
            Recent Deliveries
          </h3>
          <div className="rounded-comfortable border border-level-2 bg-white">
            <DataTable<DeliveryRow>
              columns={deliveryColumns}
              data={recentDeliveries as DeliveryRow[]}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
