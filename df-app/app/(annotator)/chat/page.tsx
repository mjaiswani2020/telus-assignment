"use client";

import { useState } from "react";
import { TaskHeader } from "@/components/annotator/task-header";
import { ResponsePanel } from "@/components/annotator/response-panel";
import { GuidelinesDrawer } from "@/components/guidelines-drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
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

  return (
    <>
      <TaskHeader
        taskName="Conversational RLHF"
        subtitle="Anthropic Helpfulness — Multi-Turn"
        progress={{ current: 3, total: 6 }}
        timer="4:12"
        onGuidelines={() => setGuidelinesOpen(true)}
      />

      <div className="stagger-children mx-auto max-w-[1440px] space-y-6 px-8 py-6">
        {/* Conversation history */}
        <div>
          <p className="mb-3 font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
            Conversation History
          </p>
          <div className="space-y-3 rounded-comfortable border border-level-2 bg-white p-4">
            {conversationHistory.map((msg, idx) => (
              <div
                key={idx}
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <ResponsePanel
              label="A"
              title="Response A"
              content={RESPONSE_A_CONTENT}
              tokenCount={178}
              selected={preference === "a"}
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
            >
              Send
            </Button>
          </div>
          <p className="mt-1.5 font-inter text-label-md text-tertiary-text">
            Shift+Enter for new line
          </p>
        </div>
      </div>

      <GuidelinesDrawer open={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </>
  );
}
