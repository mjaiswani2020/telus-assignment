"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";

interface QualificationTest {
  id: string;
  name: string;
  status: "Active" | "Draft" | "Archived";
  passRate: number;
  lastUpdated: string;
  questionCount: number;
}

type Row = QualificationTest & Record<string, unknown>;

const mockTests: QualificationTest[] = [
  {
    id: "qt-001",
    name: "General Annotation Certification",
    status: "Active",
    passRate: 78,
    lastUpdated: "2026-04-15",
    questionCount: 40,
  },
  {
    id: "qt-002",
    name: "Safety Evaluation Qualification",
    status: "Active",
    passRate: 65,
    lastUpdated: "2026-04-10",
    questionCount: 30,
  },
  {
    id: "qt-003",
    name: "Code Review Specialist",
    status: "Active",
    passRate: 72,
    lastUpdated: "2026-04-08",
    questionCount: 25,
  },
  {
    id: "qt-004",
    name: "Creative Writing Assessment",
    status: "Draft",
    passRate: 0,
    lastUpdated: "2026-04-12",
    questionCount: 20,
  },
  {
    id: "qt-005",
    name: "Medical Domain Expert",
    status: "Active",
    passRate: 58,
    lastUpdated: "2026-03-28",
    questionCount: 35,
  },
  {
    id: "qt-006",
    name: "Legacy Pairwise Test (v1)",
    status: "Archived",
    passRate: 82,
    lastUpdated: "2026-01-15",
    questionCount: 15,
  },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function QualificationsPage() {
  const columns: { key: string; header: string; className?: string; render?: (item: Row) => React.ReactNode }[] = [
    {
      key: "name",
      header: "Test Name",
      render: (item) => (
        <span className="font-medium text-ink">{item.name}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const variant =
          item.status === "Active"
            ? "active"
            : item.status === "Draft"
              ? "draft"
              : "neutral";
        return (
          <Badge variant={variant} dot>
            {item.status}
          </Badge>
        );
      },
    },
    {
      key: "questionCount",
      header: "Questions",
      render: (item) => (
        <span className="text-ink">{item.questionCount}</span>
      ),
    },
    {
      key: "passRate",
      header: "Pass Rate",
      render: (item) => (
        <span
          className={`font-medium ${
            item.passRate >= 70
              ? "text-success"
              : item.passRate >= 50
                ? "text-caution"
                : item.passRate > 0
                  ? "text-error"
                  : "text-tertiary-text"
          }`}
        >
          {item.passRate > 0 ? `${item.passRate}%` : "--"}
        </span>
      ),
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (item) => (
        <span className="text-tertiary-text">{formatDate(item.lastUpdated)}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Qualifications"
        action={
          <Link href="/qualifications/builder">
            <Button icon={<Plus className="h-4 w-4" />}>New Test</Button>
          </Link>
        }
      />

      <div className="stagger-children mt-4 rounded-comfortable border border-level-2 bg-white">
        <DataTable<Row>
          columns={columns}
          data={mockTests as Row[]}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}
