"use client";

import { useState } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Code,
} from "lucide-react";

interface GuidelinesData {
  content: string;
}

interface GuidelinesProps {
  data: GuidelinesData;
  onChange: (data: GuidelinesData) => void;
}

const defaultGuidelines = `## Annotation Guidelines v2.3

### Overview
You will be comparing two model-generated responses to the same prompt. Your goal is to determine which response better fulfills the user's request.

### Evaluation Criteria

**Helpfulness**: Does the response directly address the user's question or request? Consider completeness, relevance, and actionability.

**Accuracy**: Is the information provided factually correct? Flag any hallucinations or unsupported claims.

**Clarity**: Is the response well-organized and easy to follow? Consider structure, formatting, and language quality.

**Safety**: Does the response avoid harmful, biased, or inappropriate content?

### Rating Scale
- **Much Better**: Clear, significant quality difference
- **Better**: Noticeable improvement across criteria
- **Slightly Better**: Minor edge in one or more dimensions
- **Negligible**: No meaningful difference

### Important Notes
1. Read both responses completely before making a judgment
2. Consider the prompt context carefully
3. If responses are equally good or bad, select "Negligible"
4. Use the justification field to explain your reasoning
5. Flag any content that seems unsafe or inappropriate`;

const toolbarButtons = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Heading1, label: "Heading 1" },
  { icon: Heading2, label: "Heading 2" },
  { icon: List, label: "List" },
  { icon: Code, label: "Code" },
];

export function Guidelines({ data, onChange }: GuidelinesProps) {
  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  const content = data.content || defaultGuidelines;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-inter text-title-lg text-ink">
            Annotation Guidelines
          </h2>
          <p className="mt-1 font-inter text-body-md text-tertiary-text">
            Provide detailed instructions for annotators. Supports Markdown
            formatting.
          </p>
        </div>
        <span className="rounded-tight bg-level-1 border border-level-2 px-2.5 py-1 font-inter text-[12px] font-medium text-secondary-text">
          v2.3
        </span>
      </div>

      {/* Editor */}
      <div className="mt-6 rounded-comfortable border border-level-2 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-level-2 bg-level-1 px-3 py-2">
          {toolbarButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.label}
                type="button"
                title={btn.label}
                onClick={() =>
                  setActiveFormat(
                    activeFormat === btn.label ? null : btn.label
                  )
                }
                className={`flex h-8 w-8 items-center justify-center rounded-tight transition-colors ${
                  activeFormat === btn.label
                    ? "bg-selected-bg text-deep-teal"
                    : "text-secondary-text hover:bg-level-2 hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
          <div className="mx-2 h-5 w-px bg-level-2" />
          <span className="font-inter text-[12px] text-tertiary-text">
            Markdown supported
          </span>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => onChange({ content: e.target.value })}
          className="min-h-[400px] w-full resize-y bg-white px-5 py-4 font-mono text-code-lg text-ink placeholder:text-tertiary-text outline-none"
          placeholder="Write your annotation guidelines here..."
        />
      </div>
    </div>
  );
}

export type { GuidelinesData };
