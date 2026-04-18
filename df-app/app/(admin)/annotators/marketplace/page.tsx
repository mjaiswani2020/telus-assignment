"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

// ---- Mock expert data ----

interface Expert {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  domains: { label: string; variant: "safety" | "sft" | "pairwise" | "editing" | "ranking" | "rubric" }[];
  languages: string;
  rate: string;
  rating: number;
  projects: number;
  availability: { label: string; available: boolean };
}

const EXPERTS: Expert[] = [
  {
    id: "exp-1",
    name: "Dr. Sarah Chen",
    initials: "SC",
    avatarColor: "#005151",
    domains: [
      { label: "Medical", variant: "safety" },
      { label: "Legal", variant: "rubric" },
    ],
    languages: "English, Mandarin",
    rate: "$35/hr",
    rating: 4.8,
    projects: 12,
    availability: { label: "Available now", available: true },
  },
  {
    id: "exp-2",
    name: "Marcus Johnson",
    initials: "MJ",
    avatarColor: "#7C3AED",
    domains: [
      { label: "Code", variant: "sft" },
      { label: "Financial", variant: "pairwise" },
    ],
    languages: "English",
    rate: "$42/hr",
    rating: 4.9,
    projects: 18,
    availability: { label: "Available now", available: true },
  },
  {
    id: "exp-3",
    name: "Ana Rodriguez",
    initials: "AR",
    avatarColor: "#DB2777",
    domains: [
      { label: "Legal", variant: "rubric" },
      { label: "Medical", variant: "safety" },
      { label: "Financial", variant: "pairwise" },
    ],
    languages: "English, Spanish",
    rate: "$38/hr",
    rating: 4.7,
    projects: 9,
    availability: { label: "Available May 1", available: false },
  },
  {
    id: "exp-4",
    name: "Raj Patel",
    initials: "RP",
    avatarColor: "#2563EB",
    domains: [
      { label: "Code", variant: "sft" },
    ],
    languages: "English, Hindi",
    rate: "$45/hr",
    rating: 4.9,
    projects: 24,
    availability: { label: "Available now", available: true },
  },
  {
    id: "exp-5",
    name: "Keiko Nakamura",
    initials: "KN",
    avatarColor: "#059669",
    domains: [
      { label: "Medical", variant: "safety" },
    ],
    languages: "English, Japanese",
    rate: "$32/hr",
    rating: 4.6,
    projects: 7,
    availability: { label: "Available May 1", available: false },
  },
  {
    id: "exp-6",
    name: "Thomas Weber",
    initials: "TW",
    avatarColor: "#B45309",
    domains: [
      { label: "Financial", variant: "pairwise" },
      { label: "Legal", variant: "rubric" },
    ],
    languages: "English, German",
    rate: "$40/hr",
    rating: 4.8,
    projects: 15,
    availability: { label: "Available now", available: true },
  },
];

const domainOptions = [
  { value: "all", label: "All Domains" },
  { value: "Medical", label: "Medical" },
  { value: "Legal", label: "Legal" },
  { value: "Financial", label: "Financial" },
  { value: "Code", label: "Code" },
];

const languageOptions = [
  { value: "all", label: "All Languages" },
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "Mandarin", label: "Mandarin" },
  { value: "Hindi", label: "Hindi" },
  { value: "Japanese", label: "Japanese" },
  { value: "German", label: "German" },
];

const rateOptions = [
  { value: "all", label: "Any Rate" },
  { value: "30", label: "Under $30/hr" },
  { value: "40", label: "Under $40/hr" },
  { value: "50", label: "Under $50/hr" },
];

export default function MarketplacePage() {
  const { toast } = useToast();
  const [domainFilter, setDomainFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [rateFilter, setRateFilter] = useState("all");

  const filtered = EXPERTS.filter((exp) => {
    if (domainFilter !== "all" && !exp.domains.some((d) => d.label === domainFilter)) return false;
    if (languageFilter !== "all" && !exp.languages.includes(languageFilter)) return false;
    if (availableOnly && !exp.availability.available) return false;
    if (rateFilter !== "all") {
      const maxRate = parseInt(rateFilter);
      const expRate = parseInt(exp.rate.replace(/[^0-9]/g, ""));
      if (expRate >= maxRate) return false;
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Expert Marketplace"
        subtitle="Browse and invite specialist annotators"
      />

      {/* ---- Filter Bar ---- */}
      <div className="mt-6 flex items-end gap-3 flex-wrap">
        <div className="w-[160px]">
          <Select
            label="Domain"
            options={domainOptions}
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          />
        </div>
        <div className="w-[160px]">
          <Select
            label="Language"
            options={languageOptions}
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          />
        </div>
        <div className="w-[160px]">
          <Select
            label="Rate Range"
            options={rateOptions}
            value={rateFilter}
            onChange={(e) => setRateFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 pb-0.5">
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
              availableOnly ? "bg-[#059669]" : "bg-level-3"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 mt-0.5 ${
                availableOnly ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="font-inter text-[13px] text-ink">Available only</span>
        </div>
      </div>

      {/* ---- Expert Cards Grid ---- */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {filtered.map((expert, idx) => (
          <motion.div
            key={expert.id}
            className="rounded-comfortable border border-[#EBEEED] bg-white p-5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-inter text-[14px] font-medium text-white"
                style={{ backgroundColor: expert.avatarColor }}
              >
                {expert.initials}
              </div>
              <div>
                <p className="font-inter text-[14px] font-semibold text-ink">
                  {expert.name}
                </p>
              </div>
            </div>

            {/* Domain Badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              {expert.domains.map((d) => (
                <Badge key={d.label} variant={d.variant}>
                  {d.label}
                </Badge>
              ))}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1.5 mb-4">
              <p className="font-inter text-[13px] text-secondary-text">
                <span className="text-tertiary-text">Languages:</span> {expert.languages}
              </p>
              <div className="flex items-center justify-between">
                <p className="font-inter text-[13px] text-secondary-text">
                  <span className="text-tertiary-text">Rate:</span>{" "}
                  <span className="font-semibold text-ink">{expert.rate}</span>
                </p>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-[#D97706] fill-[#D97706]" />
                  <span className="font-inter text-[13px] font-medium text-ink">
                    {expert.rating}/5
                  </span>
                </div>
              </div>
              <p className="font-inter text-[13px] text-secondary-text">
                <span className="text-tertiary-text">Past projects:</span> {expert.projects} projects
              </p>
            </div>

            {/* Availability + Action */}
            <div className="flex items-center justify-between">
              <Badge
                variant={expert.availability.available ? "success" : "neutral"}
                dot
              >
                {expert.availability.label}
              </Badge>
              <Button
                variant="secondary"
                size="compact"
                onClick={() =>
                  toast(`Invitation sent to ${expert.name}`, "success")
                }
              >
                Invite to Project
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <p className="font-inter text-[14px] text-secondary-text">
            No experts match your filters. Try adjusting the criteria.
          </p>
        </div>
      )}
    </div>
  );
}
