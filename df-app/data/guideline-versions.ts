// ---------------------------------------------------------------------------
// Guideline Versions & Edge Cases -- Mock data for versioned guidelines drawer
// ---------------------------------------------------------------------------

export interface GuidelineChange {
  section: string;
  type: "added" | "modified" | "removed";
  description: string;
  date: string;
}

export interface GuidelineVersion {
  version: string;
  date: string;
  author: string;
  approver: string;
  summary: string;
  changes: GuidelineChange[];
}

export interface EdgeCase {
  id: number;
  title: string;
  category: "Safety" | "Helpfulness" | "Coding" | "Clarity" | "Accuracy";
  scenario: string;
  expertDecision: string;
  source: string;
  addedInVersion: string;
}

export const guidelineVersions: GuidelineVersion[] = [
  {
    version: "v2.3",
    date: "Apr 15, 2026",
    author: "Sarah Chen",
    approver: "Dr. Kim",
    summary:
      "Added code evaluation examples and refined borderline safety cases",
    changes: [
      {
        section: "3.2 Borderline Safety Cases",
        type: "modified",
        description:
          "Added 3 new examples for borderline content involving medical advice",
        date: "Apr 15, 2026",
      },
      {
        section: "5.1 Code Evaluation",
        type: "added",
        description:
          "New section with examples for evaluating code correctness vs. style",
        date: "Apr 15, 2026",
      },
      {
        section: "2.4 Preference Scale",
        type: "modified",
        description:
          'Clarified distinction between "slightly better" and "better" with worked examples',
        date: "Apr 14, 2026",
      },
      {
        section: "4.3 Deprecated Prompts",
        type: "removed",
        description:
          "Removed legacy prompt categories that are no longer used in active campaigns",
        date: "Apr 14, 2026",
      },
    ],
  },
  {
    version: "v2.2",
    date: "Mar 28, 2026",
    author: "James Wright",
    approver: "Dr. Kim",
    summary: "Expanded safety guidelines and added multi-turn evaluation criteria",
    changes: [
      {
        section: "3.1 Safety Categories",
        type: "modified",
        description:
          "Updated categories to include self-harm, misinformation, and privacy violations",
        date: "Mar 28, 2026",
      },
      {
        section: "6.2 Multi-Turn Evaluation",
        type: "added",
        description:
          "New section for evaluating coherence and consistency across conversation turns",
        date: "Mar 27, 2026",
      },
      {
        section: "2.1 Response Quality",
        type: "modified",
        description:
          "Added examples distinguishing factual accuracy from stylistic preference",
        date: "Mar 26, 2026",
      },
    ],
  },
  {
    version: "v2.1",
    date: "Mar 10, 2026",
    author: "Sarah Chen",
    approver: "Dr. Patel",
    summary: "Refined preference scale definitions and added flagging criteria",
    changes: [
      {
        section: "2.4 Preference Scale",
        type: "modified",
        description:
          "Refined tie-breaking criteria with 5 illustrative examples",
        date: "Mar 10, 2026",
      },
      {
        section: "5.3 Flagging Criteria",
        type: "added",
        description:
          "New section defining when to flag vs. skip a task with decision tree",
        date: "Mar 9, 2026",
      },
    ],
  },
  {
    version: "v2.0",
    date: "Feb 20, 2026",
    author: "Dr. Kim",
    approver: "Dr. Patel",
    summary: "Major revision: restructured all sections, new evaluation framework",
    changes: [
      {
        section: "All Sections",
        type: "modified",
        description:
          "Complete restructure of guideline document with new section numbering",
        date: "Feb 20, 2026",
      },
      {
        section: "1.0 Evaluation Framework",
        type: "added",
        description:
          "Introduced new 4-dimension evaluation framework (Helpfulness, Accuracy, Safety, Clarity)",
        date: "Feb 19, 2026",
      },
    ],
  },
];

export const edgeCases: EdgeCase[] = [
  {
    id: 1,
    title: "Partially correct medical advice",
    category: "Safety",
    scenario:
      "Response A provides accurate general health information but includes one outdated recommendation about aspirin use for heart attack prevention. Response B is less detailed but entirely accurate.",
    expertDecision:
      'Rate as "Slightly Better" for B \u2014 partial accuracy should not be equated with harmful misinformation, but outdated medical advice can cause real harm.',
    source: "Disagreement pattern in Round 3 \u2014 34% annotator disagreement",
    addedInVersion: "v2.3",
  },
  {
    id: 2,
    title: "Code works but has security vulnerability",
    category: "Coding",
    scenario:
      "Response A provides a working SQL query that is vulnerable to injection attacks. Response B returns a parameterized query that is slightly less efficient but secure.",
    expertDecision:
      'Rate as "Better" for B \u2014 security vulnerabilities in code examples constitute a safety issue regardless of functional correctness.',
    source: "Expert review in Round 4 \u2014 flagged by senior annotator",
    addedInVersion: "v2.3",
  },
  {
    id: 3,
    title: "Helpful but overly verbose response",
    category: "Helpfulness",
    scenario:
      "Response A answers the user\u2019s simple factual question in 3 paragraphs with unnecessary context. Response B gives a concise 2-sentence answer that directly addresses the question.",
    expertDecision:
      'Rate as "Slightly Better" for B \u2014 conciseness is valued when the user\u2019s intent is clearly a quick factual lookup. Excess verbosity reduces helpfulness.',
    source: "Calibration session \u2014 consensus reached among 8 annotators",
    addedInVersion: "v2.2",
  },
  {
    id: 4,
    title: "Culturally sensitive content with regional variation",
    category: "Safety",
    scenario:
      "Response A discusses a cultural practice using Western-centric framing that could be perceived as dismissive. Response B acknowledges multiple cultural perspectives without judgment.",
    expertDecision:
      'Rate as "Better" for B \u2014 cultural sensitivity requires avoiding ethnocentric framing. When practices are legal and non-harmful, neutral framing is preferred.',
    source: "Disagreement pattern in Round 2 \u2014 41% annotator disagreement",
    addedInVersion: "v2.1",
  },
  {
    id: 5,
    title: "Correct answer with poor formatting",
    category: "Clarity",
    scenario:
      "Response A provides the correct answer to a multi-step math problem but presents all steps in a single dense paragraph. Response B has a minor arithmetic error but uses clear step-by-step formatting with headings.",
    expertDecision:
      'Rate as "Slightly Better" for A \u2014 correctness takes priority over formatting, but note the formatting issue in your justification. Formatting alone does not override accuracy.',
    source: "Expert review in Round 5 \u2014 split decision resolved by Dr. Patel",
    addedInVersion: "v2.3",
  },
];
