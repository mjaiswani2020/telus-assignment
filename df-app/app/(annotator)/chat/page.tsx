"use client";

import { useState, useCallback } from "react";
import { TaskHeader } from "@/components/annotator/task-header";
import { ResponsePanel } from "@/components/annotator/response-panel";
import { GuidelinesDrawer } from "@/components/guidelines-drawer";
import { QualityFeedbackPanel } from "@/components/annotator/quality-feedback-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useReviewStore } from "@/stores/review-store";
import { Send, GitBranch, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface Message {
  role: "user" | "assistant";
  content: string;
  choiceBadge?: string;
}

const conversationHistory: Message[] = [
  {
    role: "user",
    content:
      "I'm trying to understand how async/await works in JavaScript. Can you explain the basics?",
  },
  {
    role: "assistant",
    content:
      "Async/await is syntactic sugar built on top of Promises. When you mark a function as `async`, it automatically returns a Promise. The `await` keyword pauses execution of the async function until the Promise resolves, making asynchronous code read like synchronous code.\n\nFor example:\n```javascript\nasync function fetchUser(id) {\n  const response = await fetch(`/api/users/${id}`);\n  const data = await response.json();\n  return data;\n}\n```",
    choiceBadge: "A chosen at Turn 1",
  },
  {
    role: "user",
    content:
      "That makes sense. What about error handling with async/await? How does that differ from .then().catch()?",
  },
  {
    role: "assistant",
    content:
      'With async/await, you use try/catch blocks for error handling, which many developers find more natural than chaining `.catch()`. Both approaches ultimately deal with rejected Promises, but try/catch gives you a familiar control flow:\n\n```javascript\nasync function fetchUser(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    if (!response.ok) throw new Error("Network error");\n    return await response.json();\n  } catch (err) {\n    console.error("Failed to fetch user:", err);\n    return null;\n  }\n}\n```',
    choiceBadge: "A chosen at Turn 2",
  },
];

const RESPONSE_A_CONTENT = `Great question! Let me explain the common patterns for handling multiple concurrent async operations.

**Promise.all** runs multiple promises in parallel and waits for all to resolve:

\`\`\`javascript
async function fetchDashboard(userId) {
  const [user, posts, notifications] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
    fetchNotifications(userId),
  ]);
  return { user, posts, notifications };
}
\`\`\`

**Promise.allSettled** is similar but doesn't short-circuit on rejection — useful when you want results from all promises regardless of failures.

**Promise.race** resolves as soon as the first promise settles, which is great for implementing timeouts...`;

/* ───── Branch Path B alternative conversation (diverges at turn 2) ───── */
const branchBHistory: Message[] = [
  {
    role: "user",
    content:
      "I'm trying to understand how async/await works in JavaScript. Can you explain the basics?",
  },
  {
    role: "assistant",
    content:
      "Async/await is syntactic sugar built on top of Promises. When you mark a function as `async`, it automatically returns a Promise. The `await` keyword pauses execution of the async function until the Promise resolves, making asynchronous code read like synchronous code.\n\nFor example:\n```javascript\nasync function fetchUser(id) {\n  const response = await fetch(`/api/users/${id}`);\n  const data = await response.json();\n  return data;\n}\n```",
    choiceBadge: "A chosen at Turn 1",
  },
  {
    role: "user",
    content:
      "That makes sense. What about error handling with async/await? How does that differ from .then().catch()?",
  },
  {
    role: "assistant",
    content:
      'Error handling with async/await can be done in two main ways. The most common is wrapping your `await` calls in a try/catch block. However, since async functions return Promises, you can also attach `.catch()` at the call site.\n\nKey difference: with `.then().catch()`, errors propagate through the chain automatically. With async/await, uncaught errors in an async function become rejected Promises:\n\n```javascript\n// Approach 1: try/catch inside\nasync function safe() {\n  try {\n    const data = await riskyOperation();\n    return data;\n  } catch (e) {\n    return fallbackValue;\n  }\n}\n\n// Approach 2: catch at call site\nconst result = await safe().catch(handleError);\n```\n\nI generally recommend try/catch for complex flows and .catch() for simple one-liners.',
    choiceBadge: "B chosen at Turn 2",
  },
  {
    role: "user",
    content:
      "Interesting — so which approach should I use for production code?",
  },
  {
    role: "assistant",
    content:
      "For production code, I recommend a hybrid approach. Use try/catch for business logic where you need granular error handling, and .catch() for top-level calls where you just want to prevent unhandled rejections.\n\nAlso consider creating a utility wrapper:\n```javascript\nasync function tryCatch(promise) {\n  try {\n    const data = await promise;\n    return [data, null];\n  } catch (error) {\n    return [null, error];\n  }\n}\n```\nThis Go-style pattern keeps your code flat and explicit about error paths.",
  },
];

const EDGE_CASE_CATEGORIES = [
  "Ambiguous preference",
  "Guideline gap",
  "Unsafe but borderline",
  "Other",
] as const;

const RESPONSE_B_CONTENT = `There are several key patterns for concurrent async operations:

1. **Promise.all()** — Run multiple async tasks in parallel. Rejects if any promise rejects.

2. **Promise.allSettled()** — Like Promise.all but waits for all promises, giving you the status of each.

3. **Promise.race()** — Returns the result of whichever promise settles first.

4. **Promise.any()** — Returns the first fulfilled promise, ignoring rejections.

Here's a practical example combining these patterns:

\`\`\`javascript
async function loadPage() {
  const results = await Promise.allSettled([
    fetch('/api/user'),
    fetch('/api/content'),
    fetch('/api/ads'),
  ]);

  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : null
  );
}
\`\`\``;

export default function ChatPage() {
  const [preference, setPreference] = useState<"a" | "b" | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [progress, setProgress] = useState(3);
  const [messages, setMessages] = useState<Message[]>(conversationHistory);
  const [showBranch, setShowBranch] = useState(false);
  const [activePath, setActivePath] = useState<"a" | "b">("a");
  const [flagMode, setFlagMode] = useState(false);
  const [edgeCaseChecked, setEdgeCaseChecked] = useState(false);
  const [edgeCaseCategory, setEdgeCaseCategory] = useState<string>("");
  const { toast } = useToast();
  const addReviewItem = useReviewStore((s) => s.addItem);

  const handleSend = useCallback(() => {
    if (!messageInput.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: messageInput }]);
    setMessageInput("");
  }, [messageInput]);

  const handleSkip = useCallback(() => {
    setProgress((p) => p + 1);
    setPreference(null);
    toast("Task skipped", "info");
  }, [toast]);

  const handleFlag = useCallback(() => {
    setFlagMode((prev) => !prev);
  }, []);

  const handleSubmitFlag = useCallback(() => {
    addReviewItem({
      id: `review-${Date.now()}`,
      title: `Flagged: Chat Task #${progress + 1}`,
      description: edgeCaseChecked
        ? `Edge case flagged — ${edgeCaseCategory || "Uncategorized"}`
        : "Annotator flagged this conversational task for review",
      source: "Annotator",
      status: "Flagged",
      taskType: "Conversational",
      flaggedBy: "Current Annotator",
      flaggedAt: new Date().toISOString(),
      annotationId: `ann-${Date.now()}`,
      campaignId: "camp-llama-align",
      priority: edgeCaseChecked ? "High" : "Medium",
      tier: "human-review",
      autoChecks: { gold: true, time: true, iaa: true, consistency: true },
      confidence: 80,
      routingReason: edgeCaseChecked
        ? `Edge case: ${edgeCaseCategory || "Uncategorized"}`
        : "Annotator-flagged conversational task for review",
    });
    setProgress((p) => p + 1);
    setPreference(null);
    setFlagMode(false);
    setEdgeCaseChecked(false);
    setEdgeCaseCategory("");
    toast("Task flagged for review", "warning");
  }, [progress, addReviewItem, toast, edgeCaseChecked, edgeCaseCategory]);

  const handleSubmitPreference = useCallback(() => {
    if (!preference) return;
    setProgress((p) => p + 1);
    setPreference(null);
    toast("Turn preference submitted", "success");
  }, [preference, toast]);

  return (
    <>
      <TaskHeader
        taskName="Conversational RLHF"
        subtitle="Anthropic Helpfulness — Multi-Turn"
        progress={{ current: progress, total: 6 }}
        timer="4:12"
        onGuidelines={() => setGuidelinesOpen(true)}
        onSkip={handleSkip}
        onFlag={handleFlag}
      />

      <div className="stagger-children mx-auto max-w-[1440px] space-y-4 px-8 py-6">
        {/* Edge case flag panel */}
        {flagMode && (
          <div className="rounded-comfortable border border-[#D97706] bg-[#FFFBEB] p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <p className="font-inter text-body-md font-medium text-ink">
                  Flag this task for review
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={edgeCaseChecked}
                    onChange={(e) => {
                      setEdgeCaseChecked(e.target.checked);
                      if (!e.target.checked) setEdgeCaseCategory("");
                    }}
                    className="h-4 w-4 rounded border-[#EBEEED] text-[#005151] focus:ring-[#005151]"
                  />
                  <span className="font-inter text-[13px] text-ink">
                    Flag as edge case for guideline review
                  </span>
                </label>
                {edgeCaseChecked && (
                  <div className="ml-6">
                    <div className="relative">
                      <select
                        value={edgeCaseCategory}
                        onChange={(e) => setEdgeCaseCategory(e.target.value)}
                        className="w-64 appearance-none rounded-standard border border-[#EBEEED] bg-white px-3 py-2 pr-8 font-inter text-[13px] text-ink focus:border-[#005151] focus:outline-none focus:ring-1 focus:ring-[#005151]"
                      >
                        <option value="">Select category...</option>
                        {EDGE_CASE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F7A77]" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="ghost" size="sm" onClick={() => { setFlagMode(false); setEdgeCaseChecked(false); setEdgeCaseCategory(""); }}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSubmitFlag}>
                  Submit Flag
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Branch path tabs */}
        {showBranch && (
          <div className="flex items-center gap-1 rounded-comfortable bg-[#F7F8F8] p-1">
            <button
              onClick={() => setActivePath("a")}
              className={cn(
                "flex-1 rounded-standard px-4 py-2 font-inter text-[13px] font-medium transition-colors",
                activePath === "a"
                  ? "bg-[#005151] text-white"
                  : "text-[#6F7A77] hover:bg-white hover:text-ink"
              )}
            >
              Path A (current)
            </button>
            <button
              onClick={() => setActivePath("b")}
              className={cn(
                "flex-1 rounded-standard px-4 py-2 font-inter text-[13px] font-medium transition-colors",
                activePath === "b"
                  ? "bg-[#005151] text-white"
                  : "text-[#6F7A77] hover:bg-white hover:text-ink"
              )}
            >
              Path B (branch)
            </button>
          </div>
        )}

        {/* Conversation history */}
        <div>
          <p className="mb-3 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Conversation History
            {showBranch && (
              <span className="ml-2 text-[#6F7A77] normal-case tracking-normal">
                — viewing {activePath === "a" ? "Path A" : "Path B"}
              </span>
            )}
          </p>
          <div className="space-y-2.5 rounded-comfortable border border-level-2 bg-white p-4">
            {(activePath === "b" && showBranch ? branchBHistory : messages).map((msg, idx) => (
              <div
                key={idx}
                className="group relative"
              >
                <div
                  className={cn(
                    "flex gap-3 rounded-standard p-3",
                    msg.role === "user" ? "bg-level-1" : "bg-white"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-inter text-[12px] font-bold text-white",
                      msg.role === "user" ? "bg-[#B45309]" : "bg-success"
                    )}
                  >
                    {msg.role === "user" ? "Y" : "A"}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-inter text-label-md font-medium text-ink">
                        {msg.role === "user" ? "You" : "Assistant"}
                      </span>
                      {msg.choiceBadge && (
                        <Badge variant="success" animate={false}>
                          {msg.choiceBadge}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 font-inter text-body-md text-ink whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                  {/* Branch button on completed turns */}
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => {
                        setShowBranch(true);
                        setActivePath("b");
                      }}
                      className="shrink-0 self-start rounded-standard p-1.5 text-[#6F7A77] opacity-0 transition-opacity hover:bg-[#F7F8F8] hover:text-[#005151] group-hover:opacity-100"
                      title="Create branch from this turn"
                    >
                      <GitBranch className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current turn prompt */}
        <div>
          <p className="mb-2 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Current Turn — Turn 3
          </p>
          <div className="rounded-comfortable bg-level-1 px-5 py-4">
            <p className="font-inter text-body-md text-ink">
              Now I want to understand how to handle multiple async operations at once.
              What are the common patterns?
            </p>
          </div>
        </div>

        {/* Response comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <ResponsePanel
              label="A"
              title="Response A"
              content={RESPONSE_A_CONTENT}
              tokenCount={178}
              selected={preference === "a"}
              latencyMs={2800}
            >
              <div className="flex items-center gap-2">
                <ProgressBar value={92} max={100} size="sm" className="w-24" />
                <span className="font-inter text-label-md text-caution">Streaming...</span>
              </div>
            </ResponsePanel>
          </div>
          <div className="space-y-2">
            <ResponsePanel
              label="B"
              title="Response B"
              content={RESPONSE_B_CONTENT}
              tokenCount={201}
              selected={preference === "b"}
              latencyMs={12100}
            >
              <Badge variant="success" animate={false}>Complete</Badge>
            </ResponsePanel>
          </div>
        </div>

        {/* Preference buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant={preference === "a" ? "primary" : "secondary"}
            size="md"
            onClick={() => setPreference("a")}
          >
            A is better
          </Button>
          <Button
            variant={preference === "b" ? "primary" : "secondary"}
            size="md"
            onClick={() => setPreference("b")}
          >
            B is better
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!preference}
            onClick={handleSubmitPreference}
          >
            Submit Choice
          </Button>
        </div>

        {/* Message input */}
        <div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Type your next message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              size="md"
              icon={<Send className="h-4 w-4" />}
              disabled={!messageInput.trim()}
              onClick={handleSend}
            >
              Send
            </Button>
          </div>
          <p className="mt-1.5 font-inter text-label-md text-tertiary-text">
            Shift+Enter for new line
          </p>
        </div>

        {/* Compare Paths button when branching is active */}
        {showBranch && (
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="md"
              icon={<GitBranch className="h-4 w-4" />}
              onClick={() => toast("Path comparison view coming soon", "info")}
            >
              Compare Paths
            </Button>
          </div>
        )}
      </div>

      <GuidelinesDrawer open={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
      <QualityFeedbackPanel />
    </>
  );
}
