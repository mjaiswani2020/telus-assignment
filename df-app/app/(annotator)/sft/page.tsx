"use client";

import { useState } from "react";
import { TaskHeader } from "@/components/annotator/task-header";
import { GuidelinesDrawer } from "@/components/guidelines-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { cn } from "@/lib/cn";

const REFERENCE_RESPONSE = `When discussing controversial topics, it's important to present multiple perspectives without endorsing harmful viewpoints. A good response should:

1. Acknowledge the complexity of the issue
2. Present well-established facts from credible sources
3. Avoid making definitive moral judgments
4. Encourage the user to form their own informed opinion
5. Redirect toward constructive dialogue when appropriate

For example, when asked about a politically divisive topic, a helpful response might say: "This is a topic where thoughtful people disagree. Here are the main perspectives and the evidence behind each..."`;

export default function SftPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [category, setCategory] = useState("safety");
  const [difficulty, setDifficulty] = useState("medium");
  const [showReference, setShowReference] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  // Simple markdown preview render
  function renderPreview(text: string) {
    if (!text.trim()) {
      return (
        <p className="text-tertiary-text italic">
          Start typing in the response panel to see a preview...
        </p>
      );
    }

    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Headings
      if (line.startsWith("### "))
        return <h4 key={i} className="mt-3 mb-1 font-inter text-body-md font-bold text-ink">{line.slice(4)}</h4>;
      if (line.startsWith("## "))
        return <h3 key={i} className="mt-4 mb-1 font-literata text-title-lg text-ink">{line.slice(3)}</h3>;
      if (line.startsWith("# "))
        return <h2 key={i} className="mt-4 mb-2 font-literata text-headline-sm text-ink">{line.slice(2)}</h2>;
      // Bullets
      if (line.startsWith("- ") || line.startsWith("* "))
        return (
          <li key={i} className="ml-4 list-disc font-inter text-body-md text-ink">
            {line.slice(2)}
          </li>
        );
      // Numbered list
      if (/^\d+\.\s/.test(line))
        return (
          <li key={i} className="ml-4 list-decimal font-inter text-body-md text-ink">
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
      // Code block markers
      if (line.startsWith("```"))
        return <hr key={i} className="my-2 border-level-2" />;
      // Empty line
      if (!line.trim()) return <br key={i} />;
      // Normal paragraph
      return <p key={i} className="font-inter text-body-md text-ink">{line}</p>;
    });
  }

  return (
    <>
      <TaskHeader
        taskName="SFT Data Authoring"
        subtitle="Llama Safety SFT — Round 2"
        progress={{ current: 8, total: 50 }}
        timer="5:30"
        onGuidelines={() => setGuidelinesOpen(true)}
      />

      <div className="stagger-children mx-auto max-w-[1440px] space-y-6 px-8 py-6">
        {/* Category and difficulty */}
        <div className="flex items-center gap-3">
          <Badge variant="safety" animate={false}>Safety</Badge>
          <Badge variant="caution" animate={false}>Medium Difficulty</Badge>
        </div>

        {/* Three column layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left: Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Write Your Prompt
              </p>
              <span className="font-inter text-label-md text-tertiary-text">
                {prompt.length} / 2000
              </span>
            </div>
            <textarea
              className={cn(
                "h-[400px] w-full resize-none rounded-standard border border-level-2 bg-level-1 p-4 font-inter text-body-md text-ink placeholder:text-tertiary-text",
                "focus:border-deep-teal focus:bg-white focus:ring-2 focus:ring-deep-teal/20 focus:outline-none",
                prompt.length > 2000 && "border-error focus:border-error"
              )}
              placeholder="Write a challenging prompt that tests the model's ability to handle safety-sensitive topics..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {prompt.length > 2000 && (
              <p className="font-inter text-[12px] text-error">
                Prompt exceeds 2000 character limit
              </p>
            )}
          </div>

          {/* Center: Response */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Write the Ideal Response &mdash; Raw Input
              </p>
              <span className="font-inter text-label-md text-tertiary-text">
                {response.length} / 4000
              </span>
            </div>
            <textarea
              className={cn(
                "h-[400px] w-full resize-none rounded-standard border border-level-2 bg-level-1 p-4 font-inter text-body-md text-ink placeholder:text-tertiary-text",
                "focus:border-deep-teal focus:bg-white focus:ring-2 focus:ring-deep-teal/20 focus:outline-none",
                response.length > 4000 && "border-error focus:border-error"
              )}
              placeholder="Write the ideal model response using markdown formatting..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            {response.length > 4000 && (
              <p className="font-inter text-[12px] text-error">
                Response exceeds 4000 character limit
              </p>
            )}
          </div>

          {/* Right: Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Markdown Preview
              </p>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="font-inter text-label-md text-success">Live preview</span>
              </span>
            </div>
            <div className="h-[400px] overflow-y-auto rounded-standard border border-level-2 bg-white p-4">
              {renderPreview(response)}
            </div>
          </div>
        </div>

        {/* Collapsible reference */}
        <div>
          <button
            onClick={() => setShowReference(!showReference)}
            className="flex w-full items-center justify-between rounded-comfortable border border-level-2 bg-white px-5 py-3 text-left transition-colors hover:bg-level-1"
          >
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-tertiary-text" />
              <span className="font-inter text-body-md font-medium text-ink">
                Reference Response
              </span>
            </div>
            {showReference ? (
              <ChevronUp className="h-4 w-4 text-tertiary-text" />
            ) : (
              <ChevronDown className="h-4 w-4 text-tertiary-text" />
            )}
          </button>
          {showReference && (
            <div className="mt-1 rounded-comfortable border border-level-2 bg-level-1 p-5">
              <p className="whitespace-pre-wrap font-inter text-body-md text-ink">
                {REFERENCE_RESPONSE}
              </p>
            </div>
          )}
        </div>

        {/* Footer: selects + submit */}
        <div className="flex items-end gap-4 border-t border-level-2 pt-6">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: "safety", label: "Safety" },
              { value: "helpfulness", label: "Helpfulness" },
              { value: "honesty", label: "Honesty" },
              { value: "harmlessness", label: "Harmlessness" },
            ]}
          />
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
              { value: "adversarial", label: "Adversarial" },
            ]}
          />
          <div className="ml-auto">
            <Button
              variant="primary"
              size="md"
              disabled={!prompt.trim() || !response.trim() || prompt.length > 2000 || response.length > 4000}
            >
              Submit SFT Pair
            </Button>
          </div>
        </div>
      </div>

      <GuidelinesDrawer open={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </>
  );
}
