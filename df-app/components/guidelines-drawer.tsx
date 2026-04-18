"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { ChevronDown, User, ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  guidelineVersions,
  edgeCases,
  type GuidelineVersion,
  type GuidelineChange,
} from "@/data/guideline-versions";

interface GuidelinesDrawerProps {
  open: boolean;
  onClose: () => void;
}

// Simulates whether the annotator has viewed the latest version
const LAST_VIEWED_VERSION = "v2.2";

const drawerTabs = [
  { id: "guidelines", label: "Guidelines" },
  { id: "changelog", label: "Changelog" },
  { id: "edge-cases", label: "Edge Cases" },
  { id: "effectiveness", label: "Effectiveness" },
];

const changeBadgeVariant: Record<GuidelineChange["type"], "success" | "caution" | "error"> = {
  added: "success",
  modified: "caution",
  removed: "error",
};

const changeBadgeLabel: Record<GuidelineChange["type"], string> = {
  added: "Added",
  modified: "Modified",
  removed: "Removed",
};

const categoryBadgeVariant: Record<string, "safety" | "pairwise" | "sft" | "info" | "neutral"> = {
  Safety: "safety",
  Helpfulness: "pairwise",
  Coding: "sft",
  Clarity: "info",
  Accuracy: "neutral",
};

export function GuidelinesDrawer({ open, onClose }: GuidelinesDrawerProps) {
  const [selectedVersion, setSelectedVersion] = useState(guidelineVersions[0].version);
  const [activeTab, setActiveTab] = useState("guidelines");
  const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);

  const currentVersion = guidelineVersions.find((v) => v.version === selectedVersion) ?? guidelineVersions[0];
  const isNew = selectedVersion !== LAST_VIEWED_VERSION && guidelineVersions.findIndex((v) => v.version === selectedVersion) < guidelineVersions.findIndex((v) => v.version === LAST_VIEWED_VERSION);

  return (
    <Modal open={open} onClose={onClose} title="Annotation Guidelines" position="right">
      <div className="space-y-5">
        {/* ---- Version Selector ---- */}
        <div className="space-y-2">
          <div className="relative">
            <button
              onClick={() => setVersionDropdownOpen(!versionDropdownOpen)}
              className={cn(
                "flex w-full items-center justify-between rounded-standard border border-level-2 bg-level-1 px-3 py-2 font-inter text-body-md text-ink transition-colors",
                "hover:border-level-3",
                versionDropdownOpen && "border-[#005151] ring-2 ring-[#005151]/20"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-medium">{currentVersion.version}</span>
                <span className="text-tertiary-text">&mdash;</span>
                <span className="text-secondary-text">Updated {currentVersion.date}</span>
                {isNew && (
                  <span className="ml-1 inline-flex items-center gap-1 rounded-tight bg-[#E6F2F2] px-1.5 py-0.5 font-inter text-[10px] font-semibold uppercase tracking-wider text-[#005151]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#005151]" />
                    NEW
                  </span>
                )}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-tertiary-text transition-transform duration-150",
                  versionDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown menu */}
            {versionDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-standard border border-level-2 bg-white shadow-lg">
                {guidelineVersions.map((v) => (
                  <button
                    key={v.version}
                    onClick={() => {
                      setSelectedVersion(v.version);
                      setVersionDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2.5 text-left font-inter text-body-md transition-colors",
                      "hover:bg-level-1",
                      v.version === selectedVersion
                        ? "bg-[#E6F2F2] text-[#005151] font-medium"
                        : "text-ink"
                    )}
                  >
                    <span className="font-medium">{v.version}</span>
                    <span className="text-tertiary-text">&mdash;</span>
                    <span className="text-secondary-text">{v.date}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Attribution line */}
          <div className="flex items-center gap-3 font-inter text-label-sm text-tertiary-text">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              Updated by {currentVersion.author}
            </span>
            <span className="text-level-3">&middot;</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Approved by {currentVersion.approver}
            </span>
          </div>
        </div>

        {/* ---- Tab Navigation ---- */}
        <Tabs
          tabs={drawerTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />

        {/* ---- Tab Content ---- */}
        {activeTab === "guidelines" && <GuidelinesContent />}
        {activeTab === "changelog" && <ChangelogContent version={currentVersion} />}
        {activeTab === "edge-cases" && <EdgeCasesContent currentVersion={selectedVersion} />}
        {activeTab === "effectiveness" && <EffectivenessContent />}
      </div>
    </Modal>
  );
}

/* ===== Guidelines Tab (existing content, unchanged) ===== */
function GuidelinesContent() {
  return (
    <div className="space-y-4 font-inter text-body-md text-ink">
      <h3 className="font-literata text-title-lg text-ink">1. Overview</h3>
      <p>
        You are evaluating model-generated responses for helpfulness, accuracy, and safety.
        Each task presents a user prompt and one or more candidate responses. Your job is to
        select the response that best satisfies the evaluation criteria outlined below.
      </p>

      <h3 className="font-literata text-title-lg text-ink">2. Evaluation Criteria</h3>
      <ul className="ml-4 list-disc space-y-2 text-body-md text-ink">
        <li>
          <strong>Helpfulness:</strong> Does the response directly address the user&apos;s
          request? Does it provide actionable, relevant information?
        </li>
        <li>
          <strong>Accuracy:</strong> Are factual claims correct? Are code examples functional
          and free of bugs?
        </li>
        <li>
          <strong>Safety:</strong> Does the response avoid harmful, biased, or misleading
          content?
        </li>
        <li>
          <strong>Clarity:</strong> Is the response well-organized and easy to understand?
        </li>
      </ul>

      <h3 className="font-literata text-title-lg text-ink">3. Preference Scale</h3>
      <p>When comparing two responses, use the following scale:</p>
      <ul className="ml-4 list-disc space-y-2 text-body-md text-ink">
        <li><strong>A is better:</strong> Response A is clearly superior across most criteria.</li>
        <li><strong>A slightly better:</strong> Response A has marginal advantages.</li>
        <li><strong>Tie:</strong> Both responses are roughly equivalent in quality.</li>
        <li><strong>B slightly better:</strong> Response B has marginal advantages.</li>
        <li><strong>B is better:</strong> Response B is clearly superior across most criteria.</li>
      </ul>

      <h3 className="font-literata text-title-lg text-ink">4. Code Evaluation</h3>
      <p>When responses contain code, pay special attention to:</p>
      <pre className="overflow-x-auto rounded-standard bg-level-1 p-3 font-mono text-code-sm">
{`// Check for:
// 1. Correctness — does it compile/run?
// 2. Edge cases — are boundary conditions handled?
// 3. Efficiency — is the time/space complexity reasonable?
// 4. Readability — are variable names clear?`}
      </pre>

      <h3 className="font-literata text-title-lg text-ink">5. Flagging Issues</h3>
      <p>
        Use the <strong>Flag</strong> button if you encounter any of the following:
      </p>
      <ul className="ml-4 list-disc space-y-2 text-body-md text-ink">
        <li>Prompt is ambiguous or incomplete</li>
        <li>Both responses are clearly harmful or unsafe</li>
        <li>Technical error prevents proper evaluation</li>
        <li>Response appears to be duplicated or truncated</li>
      </ul>

      <h3 className="font-literata text-title-lg text-ink">6. Justification Requirements</h3>
      <p>
        All preference selections require a written justification of at least 20 characters.
        Explain your reasoning clearly, referencing specific aspects of each response. Avoid
        vague statements like &quot;A is better.&quot;
      </p>
    </div>
  );
}

/* ===== Changelog Tab ===== */
function ChangelogContent({ version }: { version: GuidelineVersion }) {
  return (
    <div className="space-y-3">
      {/* Version summary */}
      <div className="rounded-standard border border-level-2 bg-level-1 px-4 py-3">
        <p className="font-inter text-body-md text-secondary-text">
          <span className="font-medium text-ink">{version.version}</span> &mdash; {version.summary}
        </p>
      </div>

      {/* Change entries */}
      <div className="space-y-2">
        {version.changes.map((change, i) => (
          <div
            key={`${version.version}-${i}`}
            className="rounded-standard border border-level-2 bg-white p-4 transition-colors hover:border-level-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-inter text-label-md font-medium text-ink">
                {change.section}
              </span>
              <Badge variant={changeBadgeVariant[change.type]} animate={false}>
                {changeBadgeLabel[change.type]}
              </Badge>
            </div>
            <p className="font-inter text-body-md text-secondary-text">
              {change.description}
            </p>
            <p className="mt-2 font-inter text-label-sm text-tertiary-text">
              {change.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Effectiveness Tab ===== */
const disagreementSections = [
  { section: "3.2 Borderline Safety Cases", disagreement: 28, color: "#DC2626" },
  { section: "5.1 Code Evaluation", disagreement: 22, color: "#D97706" },
  { section: "2.4 Preference Scale", disagreement: 15, color: "#059669" },
  { section: "4.1 Factual Accuracy", disagreement: 8, color: "#059669" },
];

function EffectivenessContent() {
  return (
    <div className="space-y-4">
      {/* IAA Impact Card */}
      <div className="rounded-standard border border-level-2 bg-white p-4">
        <h4 className="mb-3 font-inter text-label-md font-medium text-ink">
          IAA Impact
        </h4>
        <div className="flex items-center gap-3">
          <div className="font-inter text-body-md text-secondary-text">
            Before v2.3: <span className="font-medium text-ink">0.63</span>
          </div>
          <span className="text-tertiary-text">&rarr;</span>
          <div className="font-inter text-body-md text-secondary-text">
            After v2.3: <span className="font-medium text-ink">0.71</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-tight bg-[#ECFDF5] px-2 py-0.5 font-inter text-label-sm font-semibold text-[#059669]">
            <TrendingUp className="h-3.5 w-3.5" />
            +13%
          </span>
        </div>
      </div>

      {/* Sections with Highest Disagreement */}
      <div className="rounded-standard border border-level-2 bg-white p-4">
        <h4 className="mb-3 font-inter text-label-md font-medium text-ink">
          Sections with Highest Disagreement
        </h4>
        <div className="space-y-2.5">
          {disagreementSections.map((item, i) => (
            <div key={item.section} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-inter text-label-sm font-medium text-tertiary-text w-4">
                  {i + 1}.
                </span>
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-inter text-body-md text-ink">
                  {item.section}
                </span>
              </div>
              <span className="font-inter text-label-sm font-medium text-secondary-text">
                {item.disagreement}% disagreement
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Improvements */}
      <div className="rounded-standard border border-[#D97706] bg-[#FFF7ED] p-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
          <div>
            <h4 className="mb-1 font-inter text-label-md font-medium text-ink">
              Suggested Improvements
            </h4>
            <p className="font-inter text-body-md text-secondary-text">
              Section 3.2 &ldquo;Borderline Safety&rdquo; has 28% disagreement &mdash; consider
              adding 2&ndash;3 more worked examples
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Edge Cases Tab ===== */
function EdgeCasesContent({ currentVersion }: { currentVersion: string }) {
  return (
    <div className="space-y-3">
      {edgeCases.map((ec) => (
        <div
          key={ec.id}
          className="rounded-standard border border-level-2 bg-white p-4 transition-colors hover:border-level-3"
        >
          {/* Header: title + category badge */}
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-inter text-label-md font-medium text-ink">
              {ec.title}
            </h4>
            <Badge
              variant={categoryBadgeVariant[ec.category] ?? "neutral"}
              animate={false}
            >
              {ec.category}
            </Badge>
          </div>

          {/* Scenario */}
          <p className="mb-3 font-inter text-body-md text-secondary-text leading-relaxed">
            {ec.scenario}
          </p>

          {/* Expert Decision */}
          <div className="mb-3 rounded-tight border-l-2 border-[#005151] bg-[#E6F2F2] px-3 py-2">
            <p className="font-inter text-label-sm font-medium uppercase tracking-wider text-[#005151]">
              Expert Decision
            </p>
            <p className="mt-1 font-inter text-body-md text-ink">
              {ec.expertDecision}
            </p>
          </div>

          {/* Source */}
          <div className="flex items-center justify-between">
            <p className="font-inter text-label-sm text-tertiary-text">
              Added from: {ec.source}
            </p>
            {ec.addedInVersion === currentVersion && (
              <span className="inline-flex items-center gap-1 rounded-tight bg-[#E6F2F2] px-1.5 py-0.5 font-inter text-[10px] font-semibold uppercase tracking-wider text-[#005151]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#005151]" />
                New in {ec.addedInVersion}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
