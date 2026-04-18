"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Clock,
  ScanSearch,
  Pencil,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsNav } from "@/components/admin/settings-nav";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/cn";
import { fadeSlideUp } from "@/lib/animations";

// --- Data Residency ---
interface Region {
  id: string;
  name: string;
  description: string;
}

const regions: Region[] = [
  { id: "us-east", name: "US-East", description: "Virginia, USA" },
  { id: "eu-west", name: "EU-West", description: "Frankfurt, Germany" },
  { id: "asia-pacific", name: "Asia-Pacific", description: "Tokyo, Japan" },
];

// --- Compliance Checklist ---
interface ComplianceStandard {
  id: string;
  name: string;
  status: string;
  variant: "caution" | "success" | "neutral" | "info";
}

type ComplianceRow = ComplianceStandard & Record<string, unknown>;

const complianceStandards: ComplianceStandard[] = [
  { id: "soc2", name: "SOC 2 Type II", status: "In Progress", variant: "caution" },
  { id: "gdpr", name: "GDPR", status: "Compliant", variant: "success" },
  { id: "hipaa", name: "HIPAA", status: "Not Applicable", variant: "neutral" },
  { id: "iso", name: "ISO 27001", status: "Planned", variant: "info" },
];

// --- Export Audit Log ---
interface AuditExport {
  id: string;
  date: string;
  user: string;
  format: string;
  records: string;
  qualityGates: string;
}

type AuditRow = AuditExport & Record<string, unknown>;

const auditExports: AuditExport[] = [
  {
    id: "exp-1",
    date: "Apr 17",
    user: "Sarah C.",
    format: "DPO/JSONL",
    records: "2,400",
    qualityGates: "IAA>0.70",
  },
  {
    id: "exp-2",
    date: "Apr 15",
    user: "Dr. Kim",
    format: "Raw/Parquet",
    records: "8,200",
    qualityGates: "None",
  },
  {
    id: "exp-3",
    date: "Apr 12",
    user: "Sarah C.",
    format: "Reward Model/JSONL",
    records: "3,100",
    qualityGates: "Gold>80%",
  },
];

export default function CompliancePage() {
  const [selectedRegion, setSelectedRegion] = useState("us-east");
  const [piiEnabled, setPiiEnabled] = useState(true);

  const complianceColumns: {
    key: string;
    header: string;
    render?: (item: ComplianceRow) => React.ReactNode;
  }[] = [
    {
      key: "name",
      header: "Standard",
      render: (item) => (
        <span className="font-medium text-ink">{item.name}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge variant={item.variant as "caution" | "success" | "neutral" | "info"}>
          {item.status}
        </Badge>
      ),
    },
  ];

  const auditColumns: {
    key: string;
    header: string;
    render?: (item: AuditRow) => React.ReactNode;
  }[] = [
    {
      key: "date",
      header: "Date",
      render: (item) => (
        <span className="text-tertiary-text">{item.date}</span>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (item) => (
        <span className="font-medium text-ink">{item.user}</span>
      ),
    },
    {
      key: "format",
      header: "Format",
      render: (item) => (
        <span className="font-mono text-code-sm text-secondary-text">
          {item.format}
        </span>
      ),
    },
    {
      key: "records",
      header: "Records",
      render: (item) => (
        <span className="text-ink">{item.records}</span>
      ),
    },
    {
      key: "qualityGates",
      header: "Quality Gates",
      render: (item) => {
        if (item.qualityGates === "None") {
          return <span className="text-tertiary-text">None</span>;
        }
        return (
          <span className="flex items-center gap-1 font-medium text-[#059669]">
            {item.qualityGates}{" "}
            <span className="text-[#059669]">&#10003;</span>
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="mt-4">
        <SettingsNav />
      </div>

      <div className="stagger-children mt-4 space-y-6">
        {/* Data Residency */}
        <div>
          <h3 className="mb-3 font-inter text-[14px] font-semibold text-ink">
            Data Residency
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {regions.map((region) => {
              const isSelected = selectedRegion === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-comfortable border p-4 text-left transition-all duration-150",
                    isSelected
                      ? "border-[#2563EB] bg-[#EFF6FF] ring-2 ring-[#2563EB]/20"
                      : "border-level-2 bg-white hover:border-level-3"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-[#2563EB] bg-[#2563EB]"
                        : "border-level-3 bg-white"
                    )}
                  >
                    {isSelected && (
                      <span className="block h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Globe
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "text-[#2563EB]" : "text-tertiary-text"
                        )}
                      />
                      <span className="font-inter text-[14px] font-medium text-ink">
                        {region.name}
                      </span>
                    </div>
                    <p className="mt-0.5 font-inter text-[12px] text-tertiary-text">
                      {region.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Retention Policy & PII Detection */}
        <div className="grid grid-cols-2 gap-3">
          {/* Retention Policy */}
          <motion.div
            className="rounded-comfortable border border-level-2 bg-white p-4"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#005151]" />
                <span className="font-inter text-[14px] font-medium text-ink">
                  Retention Policy
                </span>
              </div>
              <button className="rounded-tight p-1 text-tertiary-text transition-colors hover:bg-level-1 hover:text-ink">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-3 font-literata text-[24px] font-semibold text-ink">
              365 days
            </p>
            <p className="mt-1 font-inter text-[12px] text-tertiary-text">
              Annotations archived after retention period
            </p>
          </motion.div>

          {/* PII Detection */}
          <motion.div
            className="rounded-comfortable border border-level-2 bg-white p-4"
            variants={fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <ScanSearch className="h-4 w-4 text-[#005151]" />
                <span className="font-inter text-[14px] font-medium text-ink">
                  PII Detection
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-inter text-[12px] text-tertiary-text">
                  Auto-scan
                </span>
                <button
                  onClick={() => setPiiEnabled(!piiEnabled)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200",
                    piiEnabled ? "bg-[#059669]" : "bg-level-3"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200",
                      piiEnabled
                        ? "translate-x-[18px]"
                        : "translate-x-[3px]"
                    )}
                  />
                </button>
              </div>
            </div>
            <p className="mt-3 font-inter text-[13px] text-ink">
              3 annotations flagged this month
            </p>
            <button className="mt-1 flex items-center gap-1 font-inter text-[12px] font-medium text-[#005151] hover:underline">
              Review
              <ExternalLink className="h-3 w-3" />
            </button>
          </motion.div>
        </div>

        {/* Compliance Checklist */}
        <div>
          <h3 className="mb-3 font-inter text-[14px] font-semibold text-ink">
            Compliance Checklist
          </h3>
          <div className="rounded-comfortable border border-level-2 bg-white">
            <DataTable<ComplianceRow>
              columns={complianceColumns}
              data={complianceStandards as ComplianceRow[]}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>

        {/* Export Audit Log */}
        <div>
          <h3 className="mb-3 font-inter text-[14px] font-semibold text-ink">
            Export Audit Log
          </h3>
          <div className="rounded-comfortable border border-level-2 bg-white">
            <DataTable<AuditRow>
              columns={auditColumns}
              data={auditExports as AuditRow[]}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
