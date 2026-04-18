"use client";

import { useState, useMemo, useCallback } from "react";
import { TaskHeader } from "@/components/annotator/task-header";
import { GuidelinesDrawer } from "@/components/guidelines-drawer";
import { QualityFeedbackPanel } from "@/components/annotator/quality-feedback-panel";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useReviewStore } from "@/stores/review-store";
import { cn } from "@/lib/cn";

const ORIGINAL_TEXT = `Python's Global Interpreter Lock (GIL) is a mutex that prevents multiple threads from executing Python bytecode simultaneously. This means that even on multi-core systems, Python threads cannot truly run in parallel for CPU-bound tasks.

The GIL exists primarily because CPython's memory management is not thread-safe. The reference counting mechanism used for garbage collection would require complex locking mechanisms without the GIL, leading to significant performance overhead.

To work around the GIL for CPU-bound tasks, you can use:
1. The multiprocessing module, which uses separate processes instead of threads
2. C extensions that release the GIL during computation
3. Alternative Python implementations like Jython or IronPython that don't have a GIL

For I/O-bound tasks, the GIL is less of a problem because threads release the GIL while waiting for I/O operations, allowing other threads to run.

Note that the GIL is specific to CPython. PyPy, for example, also has a GIL but is working on removing it. Python 3.12 introduced experimental support for a per-interpreter GIL, which is a step toward eventual GIL removal.`;

const INITIAL_EDIT = `Python's Global Interpreter Lock (GIL) is a mutex that prevents multiple native threads from executing Python bytecode simultaneously. This means that even on multi-core systems, only one thread can execute Python bytecode at a time for CPU-bound tasks.

The GIL exists primarily because CPython's memory management is not thread-safe. The reference counting mechanism used for garbage collection would require complex and error-prone locking mechanisms without the GIL, which would add significant performance overhead for single-threaded programs.

To work around the GIL for CPU-bound tasks, you can use:
1. The multiprocessing module, which spawns separate processes with their own Python interpreters
2. C extensions (via ctypes or Cython) that release the GIL during computation
3. The concurrent.futures module with ProcessPoolExecutor
4. Alternative Python implementations like Jython or IronPython that don't have a GIL

For I/O-bound tasks, the GIL is less of a concern because threads release the GIL while waiting for I/O operations, allowing other threads to run. This is why asyncio and threading work well for network-heavy applications.

Note that the GIL is specific to CPython. Python 3.13 introduced an experimental free-threaded mode (PEP 703) that allows disabling the GIL entirely, which is a major step toward true multi-threaded parallelism in Python.`;

function computeDiff(original: string, edited: string) {
  const origWords = original.split(/(\s+)/);
  const editWords = edited.split(/(\s+)/);
  const removed: string[] = [];
  const added: string[] = [];

  const origSet = new Set(origWords);
  const editSet = new Set(editWords);

  origWords.forEach((w) => {
    if (!editSet.has(w) && w.trim()) removed.push(w);
  });
  editWords.forEach((w) => {
    if (!origSet.has(w) && w.trim()) added.push(w);
  });

  return { removed, added };
}

function computeEditDistance(original: string, edited: string) {
  const charsChanged = Math.abs(edited.length - original.length) +
    Array.from(original).filter((c, i) => edited[i] !== c).length;

  const origSentences = original.split(/[.!?]+/).filter(Boolean);
  const editSentences = edited.split(/[.!?]+/).filter(Boolean);
  const sentencesModified = Math.abs(editSentences.length - origSentences.length) +
    origSentences.filter((s, i) => editSentences[i] !== s).length;

  return { charsChanged, sentencesModified };
}

export default function EditPage() {
  const [editedText, setEditedText] = useState(INITIAL_EDIT);
  const [diffView, setDiffView] = useState("inline");
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [progress, setProgress] = useState(5);
  const { toast } = useToast();
  const addReviewItem = useReviewStore((s) => s.addItem);

  const handleSkip = useCallback(() => {
    setProgress((p) => p + 1);
    setEditedText(INITIAL_EDIT);
    toast("Task skipped", "info");
  }, [toast]);

  const handleFlag = useCallback(() => {
    addReviewItem({
      id: `review-${Date.now()}`,
      title: `Flagged: Edit Task #${progress + 1}`,
      description: "Annotator flagged this editing task for review",
      source: "Annotator",
      status: "Flagged",
      taskType: "Editing",
      flaggedBy: "Current Annotator",
      flaggedAt: new Date().toISOString(),
      annotationId: `ann-${Date.now()}`,
      campaignId: "camp-llama-align",
      priority: "Medium",
      tier: "human-review",
      autoChecks: { gold: true, time: true, iaa: true, consistency: true },
      confidence: 80,
      routingReason: "Annotator-flagged editing task for review",
    });
    setProgress((p) => p + 1);
    setEditedText(INITIAL_EDIT);
    toast("Task flagged for review", "warning");
  }, [progress, addReviewItem, toast]);

  const handleSubmit = useCallback(() => {
    setProgress((p) => p + 1);
    setEditedText(INITIAL_EDIT);
    toast("Edit submitted successfully", "success");
  }, [toast]);

  const diff = useMemo(() => computeDiff(ORIGINAL_TEXT, editedText), [editedText]);
  const editStats = useMemo(() => computeEditDistance(ORIGINAL_TEXT, editedText), [editedText]);

  return (
    <>
      <TaskHeader
        taskName="Response Editing"
        subtitle="Minimal Correction Mode"
        progress={{ current: progress, total: 30 }}
        timer="3:42"
        onGuidelines={() => setGuidelinesOpen(true)}
        onSkip={handleSkip}
        onFlag={handleFlag}
      />

      <div className="stagger-children mx-auto max-w-[1440px] space-y-4 px-8 py-6">
        {/* Two panels */}
        <div className="grid grid-cols-2 gap-3">
          {/* Original - read only */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Original
              </p>
              <span className="rounded-tight bg-level-1 px-2 py-0.5 font-inter text-label-sm uppercase text-tertiary-text">
                Read-Only
              </span>
            </div>
            <div className="h-[400px] overflow-y-auto rounded-comfortable border border-level-2 bg-level-1 p-5">
              <p className="whitespace-pre-wrap font-inter text-body-md leading-relaxed text-ink">
                {ORIGINAL_TEXT}
              </p>
            </div>
          </div>

          {/* Your Edit - editable */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text">
                Your Edit
              </p>
              <span className="flex items-center gap-1 rounded-tight bg-[#ECFDF5] px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="font-inter text-label-sm uppercase text-success">Editable</span>
              </span>
            </div>
            <textarea
              className={cn(
                "h-[400px] w-full resize-none rounded-comfortable border border-level-2 bg-white p-5 font-inter text-body-md leading-relaxed text-ink",
                "focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/20 focus:outline-none"
              )}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          </div>
        </div>

        {/* Diff view toggle */}
        <div className="space-y-2.5">
          <Tabs
            tabs={[
              { id: "inline", label: "Inline" },
              { id: "side-by-side", label: "Side-by-side" },
            ]}
            activeTab={diffView}
            onChange={setDiffView}
            variant="pill"
          />

          <div className="rounded-comfortable border border-level-2 bg-white p-4">
            {diffView === "inline" ? (
              <div className="space-y-2">
                {diff.removed.length > 0 && (
                  <div>
                    <p className="mb-1 font-inter text-label-sm uppercase text-error">Removed:</p>
                    <p className="font-inter text-body-md text-ink">
                      {diff.removed.map((word, i) => (
                        <span key={i} className="bg-[#FEE2E2] line-through text-error mr-1">
                          {word}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                {diff.added.length > 0 && (
                  <div>
                    <p className="mb-1 font-inter text-label-sm uppercase text-success">Added:</p>
                    <p className="font-inter text-body-md text-ink">
                      {diff.added.map((word, i) => (
                        <span key={i} className="bg-[#DCFCE7] text-success mr-1">
                          {word}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                {diff.removed.length === 0 && diff.added.length === 0 && (
                  <p className="font-inter text-body-md text-tertiary-text italic">
                    No changes detected
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-2 font-inter text-label-sm uppercase text-error">Original</p>
                  <p className="whitespace-pre-wrap font-inter text-body-md text-ink leading-relaxed">
                    {ORIGINAL_TEXT}
                  </p>
                </div>
                <div>
                  <p className="mb-2 font-inter text-label-sm uppercase text-success">Edited</p>
                  <p className="whitespace-pre-wrap font-inter text-body-md text-ink leading-relaxed">
                    {editedText}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit distance label */}
        <div>
          <p className="font-inter text-label-md text-tertiary-text">
            Edit distance: {editStats.charsChanged} chars changed | {editStats.sentencesModified} sentences modified
          </p>
        </div>

        {/* Submit */}
        <div>
          <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
            Submit Edit
          </Button>
        </div>
      </div>

      <GuidelinesDrawer open={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
      <QualityFeedbackPanel />
    </>
  );
}
