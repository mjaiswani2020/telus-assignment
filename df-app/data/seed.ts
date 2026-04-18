// ---------------------------------------------------------------------------
// RLHF DataForge -- Central seed data & TypeScript interfaces
// All data is mock/static for the prototype.
// ---------------------------------------------------------------------------

// ---- Shared enums & literal types ----------------------------------------

export type ProjectStatus = 'Active' | 'Paused' | 'Archived';
export type CampaignStatus = 'Active' | 'Complete' | 'Draft';
export type RoundStatus = 'Active' | 'Complete' | 'Draft';
export type TaskStatus = 'Active' | 'Draft' | 'Completed';
export type TaskType =
  | 'Pairwise'
  | 'Safety'
  | 'SFT'
  | 'Arena'
  | 'Editing'
  | 'Ranking'
  | 'Rubric'
  | 'Conversational';
export type AnnotatorStatus = 'Active' | 'In Review' | 'Onboarding' | 'Paused';
export type AnnotatorTrend = 'Improving' | 'Stable' | 'Declining';
export type ReviewItemSource = 'Annotator' | 'Auto';
export type ReviewItemStatus = 'Flagged' | 'Escalated' | 'Resolved';
export type ExportFormat = 'DPO' | 'Reward Model' | 'SFT' | 'Raw';
export type ExportDestination = 'S3' | 'Download' | 'HF Hub' | 'GCS';
export type ExportStatus = 'Complete' | 'In Progress' | 'Failed';
export type ModelHealth = 'Up' | 'Slow' | 'Down';

// ---- Interfaces ----------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ISO date
  status: ProjectStatus;
  campaignCount: number;
  activeRounds: number;
  totalAnnotations: number;
}

export interface Round {
  id: string;
  campaignId: string;
  name: string;
  status: RoundStatus;
  progress: number;      // completed annotations
  target: number;        // target annotations
  iaa: number;           // inter-annotator agreement
  iaaTarget: number;
  goldAccuracy: number;  // %
  eta: string;           // human-readable ETA
}

export interface Campaign {
  id: string;
  projectId: string;
  name: string;
  status: CampaignStatus;
  rounds: Round[];
  totalAnnotations: number;
  iaa: number;
  createdAt: string;
}

export interface PreferenceDistribution {
  significantlyBetter: number;
  better: number;
  slightlyBetter: number;
  negligible: number;
}

export interface CrossRoundComparison {
  roundId: string;
  roundName: string;
  iaa: number;
  goldAccuracy: number;
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  projectId: string;
  projectName: string;
  campaignId: string;
  status: TaskStatus;
  annotationCount: number;
  assignedAnnotators: number;
  createdAt: string;
}

export interface Annotator {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  status: AnnotatorStatus;
  skills: string[];
  goldAccuracy: number; // %
  iaa: number;          // 0-1
  tasks30d: number;
  trend: AnnotatorTrend;
  joinedAt: string;
}

export type ReviewTier = 'human-review' | 'escalated';

export interface AutoChecks {
  gold: boolean;
  time: boolean;
  iaa: boolean;
  consistency: boolean;
}

export interface ReviewItem {
  id: string;
  title: string;
  description: string;
  source: ReviewItemSource;
  status: ReviewItemStatus;
  taskType: TaskType;
  flaggedBy: string;      // annotator name or "System"
  flaggedAt: string;      // ISO datetime
  annotationId: string;
  campaignId: string;
  priority: 'High' | 'Medium' | 'Low';
  tier: ReviewTier;
  autoChecks: AutoChecks;
  confidence: number;     // 0-100
  routingReason: string;
}

export interface ExportRecord {
  id: string;
  version: string;
  format: ExportFormat;
  destination: ExportDestination;
  status: ExportStatus;
  recordCount: number;
  fileSize: string;
  campaignId: string;
  campaignName: string;
  createdAt: string;
  createdBy: string;
}

export interface ModelEndpoint {
  id: string;
  name: string;
  provider: string;
  version: string;
  health: ModelHealth;
  activeTasks: number;
  latencyMs: number;
  lastChecked: string;
  endpoint: string;
}

// ---- Seed data -----------------------------------------------------------

export const seedProjects: Project[] = [
  {
    id: 'proj-helpfulness',
    name: 'Helpfulness Track',
    description:
      'Core helpfulness alignment across conversational, coding, and creative domains. Targets Llama-3 70B DPO training pipeline.',
    createdAt: '2026-01-08T09:00:00Z',
    status: 'Active',
    campaignCount: 3,
    activeRounds: 2,
    totalAnnotations: 45_231,
  },
  {
    id: 'proj-safety',
    name: 'Safety Track',
    description:
      'Red-teaming, refusal calibration, and harm-boundary evaluation for production safety classifiers.',
    createdAt: '2026-02-03T14:30:00Z',
    status: 'Active',
    campaignCount: 2,
    activeRounds: 1,
    totalAnnotations: 23_847,
  },
  {
    id: 'proj-code-eval',
    name: 'Code Evaluation',
    description:
      'Multi-language code correctness, style adherence, and explanation quality benchmarking.',
    createdAt: '2026-03-12T11:15:00Z',
    status: 'Active',
    campaignCount: 1,
    activeRounds: 1,
    totalAnnotations: 8_102,
  },
];

export const seedCampaigns: Campaign[] = [
  {
    id: 'camp-llama-align',
    projectId: 'proj-helpfulness',
    name: 'Llama 3 Alignment Campaign',
    status: 'Active',
    totalAnnotations: 45_231,
    iaa: 0.72,
    createdAt: '2026-01-10T10:00:00Z',
    rounds: [
      {
        id: 'round-1',
        campaignId: 'camp-llama-align',
        name: 'Round 1 — Baseline SFT',
        status: 'Complete',
        progress: 10_000,
        target: 10_000,
        iaa: 0.68,
        iaaTarget: 0.65,
        goldAccuracy: 76,
        eta: 'Complete',
      },
      {
        id: 'round-2',
        campaignId: 'camp-llama-align',
        name: 'Round 2 — Reward Model v1',
        status: 'Complete',
        progress: 15_000,
        target: 15_000,
        iaa: 0.71,
        iaaTarget: 0.65,
        goldAccuracy: 79,
        eta: 'Complete',
      },
      {
        id: 'round-3',
        campaignId: 'camp-llama-align',
        name: 'Round 3 — Post-DPO Checkpoint',
        status: 'Active',
        progress: 8_231,
        target: 11_500,
        iaa: 0.72,
        iaaTarget: 0.65,
        goldAccuracy: 82,
        eta: '~4 days',
      },
    ],
  },
  {
    id: 'camp-gpt4-safety',
    projectId: 'proj-safety',
    name: 'GPT-4 Safety Audit',
    status: 'Active',
    totalAnnotations: 18_412,
    iaa: 0.69,
    createdAt: '2026-02-05T09:30:00Z',
    rounds: [
      {
        id: 'round-s1',
        campaignId: 'camp-gpt4-safety',
        name: 'Round 1 — Harm Taxonomy Review',
        status: 'Active',
        progress: 6_800,
        target: 10_000,
        iaa: 0.69,
        iaaTarget: 0.70,
        goldAccuracy: 74,
        eta: '~6 days',
      },
    ],
  },
  {
    id: 'camp-arena-q1',
    projectId: 'proj-safety',
    name: 'Arena Benchmark Q1',
    status: 'Complete',
    totalAnnotations: 5_435,
    iaa: 0.74,
    createdAt: '2026-01-20T08:00:00Z',
    rounds: [
      {
        id: 'round-a1',
        campaignId: 'camp-arena-q1',
        name: 'Round 1 — Arena Baseline',
        status: 'Complete',
        progress: 5_435,
        target: 5_500,
        iaa: 0.74,
        iaaTarget: 0.70,
        goldAccuracy: 81,
        eta: 'Complete',
      },
    ],
  },
  {
    id: 'camp-helpfulness-creative',
    projectId: 'proj-helpfulness',
    name: 'Creative Writing Evaluation',
    status: 'Active',
    totalAnnotations: 12_340,
    iaa: 0.67,
    createdAt: '2026-02-18T13:00:00Z',
    rounds: [
      {
        id: 'round-cw1',
        campaignId: 'camp-helpfulness-creative',
        name: 'Round 1 — Story Continuation',
        status: 'Complete',
        progress: 8_000,
        target: 8_000,
        iaa: 0.65,
        iaaTarget: 0.60,
        goldAccuracy: 72,
        eta: 'Complete',
      },
      {
        id: 'round-cw2',
        campaignId: 'camp-helpfulness-creative',
        name: 'Round 2 — Poetry & Style',
        status: 'Active',
        progress: 4_340,
        target: 7_000,
        iaa: 0.67,
        iaaTarget: 0.60,
        goldAccuracy: 75,
        eta: '~8 days',
      },
    ],
  },
  {
    id: 'camp-helpfulness-code',
    projectId: 'proj-helpfulness',
    name: 'Code Helpfulness Sprint',
    status: 'Draft',
    totalAnnotations: 0,
    iaa: 0,
    createdAt: '2026-03-28T16:00:00Z',
    rounds: [],
  },
  {
    id: 'camp-code-bench',
    projectId: 'proj-code-eval',
    name: 'Multi-Language Code Bench',
    status: 'Active',
    totalAnnotations: 8_102,
    iaa: 0.70,
    createdAt: '2026-03-14T10:00:00Z',
    rounds: [
      {
        id: 'round-cb1',
        campaignId: 'camp-code-bench',
        name: 'Round 1 — Python & JS',
        status: 'Active',
        progress: 8_102,
        target: 12_000,
        iaa: 0.70,
        iaaTarget: 0.65,
        goldAccuracy: 78,
        eta: '~7 days',
      },
    ],
  },
];

export const seedPreferenceDistribution: PreferenceDistribution = {
  significantlyBetter: 12,
  better: 34,
  slightlyBetter: 38,
  negligible: 16,
};

export const seedCrossRoundComparisons: CrossRoundComparison[] = [
  { roundId: 'round-1', roundName: 'Round 1', iaa: 0.68, goldAccuracy: 76 },
  { roundId: 'round-2', roundName: 'Round 2', iaa: 0.71, goldAccuracy: 79 },
  { roundId: 'round-3', roundName: 'Round 3', iaa: 0.72, goldAccuracy: 82 },
];

export const seedTasks: Task[] = [
  // Active (5)
  {
    id: 'task-001',
    name: 'Llama Helpfulness Eval — Round 3',
    type: 'Pairwise',
    projectId: 'proj-helpfulness',
    projectName: 'Helpfulness Track',
    campaignId: 'camp-llama-align',
    status: 'Active',
    annotationCount: 8_231,
    assignedAnnotators: 12,
    createdAt: '2026-03-20T09:00:00Z',
  },
  {
    id: 'task-002',
    name: 'Safety Refusal Boundary',
    type: 'Safety',
    projectId: 'proj-safety',
    projectName: 'Safety Track',
    campaignId: 'camp-gpt4-safety',
    status: 'Active',
    annotationCount: 4_320,
    assignedAnnotators: 8,
    createdAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'task-003',
    name: 'Code Correctness — Python',
    type: 'SFT',
    projectId: 'proj-code-eval',
    projectName: 'Code Evaluation',
    campaignId: 'camp-code-bench',
    status: 'Active',
    annotationCount: 5_402,
    assignedAnnotators: 6,
    createdAt: '2026-03-15T11:00:00Z',
  },
  {
    id: 'task-004',
    name: 'Creative Writing Arena',
    type: 'Arena',
    projectId: 'proj-helpfulness',
    projectName: 'Helpfulness Track',
    campaignId: 'camp-helpfulness-creative',
    status: 'Active',
    annotationCount: 4_340,
    assignedAnnotators: 10,
    createdAt: '2026-02-20T10:30:00Z',
  },
  {
    id: 'task-005',
    name: 'Harm Category Classification',
    type: 'Safety',
    projectId: 'proj-safety',
    projectName: 'Safety Track',
    campaignId: 'camp-gpt4-safety',
    status: 'Active',
    annotationCount: 2_480,
    assignedAnnotators: 5,
    createdAt: '2026-02-12T08:45:00Z',
  },
  // Draft (4)
  {
    id: 'task-006',
    name: 'Instruction Following — Editing',
    type: 'Editing',
    projectId: 'proj-helpfulness',
    projectName: 'Helpfulness Track',
    campaignId: 'camp-helpfulness-code',
    status: 'Draft',
    annotationCount: 0,
    assignedAnnotators: 0,
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'task-007',
    name: 'Response Ranking — Coding',
    type: 'Ranking',
    projectId: 'proj-code-eval',
    projectName: 'Code Evaluation',
    campaignId: 'camp-code-bench',
    status: 'Draft',
    annotationCount: 0,
    assignedAnnotators: 0,
    createdAt: '2026-04-05T14:20:00Z',
  },
  {
    id: 'task-008',
    name: 'Rubric Grading — Medical QA',
    type: 'Rubric',
    projectId: 'proj-helpfulness',
    projectName: 'Helpfulness Track',
    campaignId: 'camp-llama-align',
    status: 'Draft',
    annotationCount: 0,
    assignedAnnotators: 0,
    createdAt: '2026-04-08T11:00:00Z',
  },
  {
    id: 'task-009',
    name: 'Multi-Turn Conversation Eval',
    type: 'Conversational',
    projectId: 'proj-helpfulness',
    projectName: 'Helpfulness Track',
    campaignId: 'camp-helpfulness-creative',
    status: 'Draft',
    annotationCount: 0,
    assignedAnnotators: 0,
    createdAt: '2026-04-10T16:00:00Z',
  },
  // Completed (3)
  {
    id: 'task-010',
    name: 'Arena Baseline Comparison',
    type: 'Arena',
    projectId: 'proj-safety',
    projectName: 'Safety Track',
    campaignId: 'camp-arena-q1',
    status: 'Completed',
    annotationCount: 5_435,
    assignedAnnotators: 14,
    createdAt: '2026-01-22T09:00:00Z',
  },
  {
    id: 'task-011',
    name: 'SFT Baseline Collection',
    type: 'SFT',
    projectId: 'proj-helpfulness',
    projectName: 'Helpfulness Track',
    campaignId: 'camp-llama-align',
    status: 'Completed',
    annotationCount: 10_000,
    assignedAnnotators: 18,
    createdAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'task-012',
    name: 'Reward Model Pairwise — R2',
    type: 'Pairwise',
    projectId: 'proj-helpfulness',
    projectName: 'Helpfulness Track',
    campaignId: 'camp-llama-align',
    status: 'Completed',
    annotationCount: 15_000,
    assignedAnnotators: 16,
    createdAt: '2026-02-01T10:00:00Z',
  },
];

export const seedAnnotators: Annotator[] = [
  {
    id: 'ann-001',
    name: 'Sarah K.',
    initials: 'SK',
    avatarColor: '#6366f1',
    status: 'Active',
    skills: ['General', 'Safety', 'Medical'],
    goldAccuracy: 91,
    iaa: 0.84,
    tasks30d: 1_203,
    trend: 'Stable',
    joinedAt: '2025-08-14T00:00:00Z',
  },
  {
    id: 'ann-002',
    name: 'Marcus T.',
    initials: 'MT',
    avatarColor: '#f59e0b',
    status: 'Active',
    skills: ['General', 'Safety', 'Creative'],
    goldAccuracy: 82,
    iaa: 0.76,
    tasks30d: 847,
    trend: 'Improving',
    joinedAt: '2025-09-02T00:00:00Z',
  },
  {
    id: 'ann-003',
    name: 'James L.',
    initials: 'JL',
    avatarColor: '#10b981',
    status: 'Active',
    skills: ['Code', 'General'],
    goldAccuracy: 88,
    iaa: 0.81,
    tasks30d: 956,
    trend: 'Stable',
    joinedAt: '2025-07-21T00:00:00Z',
  },
  {
    id: 'ann-004',
    name: 'Alex C.',
    initials: 'AC',
    avatarColor: '#ef4444',
    status: 'In Review',
    skills: ['General'],
    goldAccuracy: 58,
    iaa: 0.61,
    tasks30d: 234,
    trend: 'Declining',
    joinedAt: '2025-11-10T00:00:00Z',
  },
  {
    id: 'ann-005',
    name: 'Wei Z.',
    initials: 'WZ',
    avatarColor: '#8b5cf6',
    status: 'Paused',
    skills: ['General', 'Code'],
    goldAccuracy: 54,
    iaa: 0.52,
    tasks30d: 156,
    trend: 'Declining',
    joinedAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 'ann-006',
    name: 'Elena R.',
    initials: 'ER',
    avatarColor: '#ec4899',
    status: 'Active',
    skills: ['Creative', 'General', 'Medical'],
    goldAccuracy: 89,
    iaa: 0.82,
    tasks30d: 1_087,
    trend: 'Improving',
    joinedAt: '2025-08-28T00:00:00Z',
  },
  {
    id: 'ann-007',
    name: 'David P.',
    initials: 'DP',
    avatarColor: '#14b8a6',
    status: 'Active',
    skills: ['Code', 'General'],
    goldAccuracy: 86,
    iaa: 0.79,
    tasks30d: 742,
    trend: 'Stable',
    joinedAt: '2025-09-15T00:00:00Z',
  },
  {
    id: 'ann-008',
    name: 'Priya M.',
    initials: 'PM',
    avatarColor: '#f97316',
    status: 'Active',
    skills: ['Safety', 'Medical', 'General'],
    goldAccuracy: 93,
    iaa: 0.86,
    tasks30d: 1_345,
    trend: 'Stable',
    joinedAt: '2025-06-10T00:00:00Z',
  },
  {
    id: 'ann-009',
    name: 'Carlos V.',
    initials: 'CV',
    avatarColor: '#3b82f6',
    status: 'Active',
    skills: ['General', 'Creative'],
    goldAccuracy: 80,
    iaa: 0.74,
    tasks30d: 623,
    trend: 'Improving',
    joinedAt: '2025-10-05T00:00:00Z',
  },
  {
    id: 'ann-010',
    name: 'Fatima A.',
    initials: 'FA',
    avatarColor: '#a855f7',
    status: 'Active',
    skills: ['Safety', 'General'],
    goldAccuracy: 85,
    iaa: 0.78,
    tasks30d: 891,
    trend: 'Stable',
    joinedAt: '2025-09-20T00:00:00Z',
  },
  {
    id: 'ann-011',
    name: 'Tom H.',
    initials: 'TH',
    avatarColor: '#22c55e',
    status: 'Active',
    skills: ['Code', 'General'],
    goldAccuracy: 87,
    iaa: 0.80,
    tasks30d: 834,
    trend: 'Stable',
    joinedAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'ann-012',
    name: 'Nina S.',
    initials: 'NS',
    avatarColor: '#e11d48',
    status: 'Active',
    skills: ['Creative', 'General'],
    goldAccuracy: 84,
    iaa: 0.77,
    tasks30d: 710,
    trend: 'Improving',
    joinedAt: '2025-10-12T00:00:00Z',
  },
  {
    id: 'ann-013',
    name: 'Ryan O.',
    initials: 'RO',
    avatarColor: '#0ea5e9',
    status: 'Active',
    skills: ['General', 'Safety'],
    goldAccuracy: 81,
    iaa: 0.75,
    tasks30d: 668,
    trend: 'Stable',
    joinedAt: '2025-11-01T00:00:00Z',
  },
  {
    id: 'ann-014',
    name: 'Li W.',
    initials: 'LW',
    avatarColor: '#d946ef',
    status: 'Active',
    skills: ['Code', 'Medical'],
    goldAccuracy: 90,
    iaa: 0.83,
    tasks30d: 1_120,
    trend: 'Stable',
    joinedAt: '2025-07-05T00:00:00Z',
  },
  {
    id: 'ann-015',
    name: 'Anna B.',
    initials: 'AB',
    avatarColor: '#f43f5e',
    status: 'Active',
    skills: ['General', 'Creative'],
    goldAccuracy: 83,
    iaa: 0.76,
    tasks30d: 592,
    trend: 'Stable',
    joinedAt: '2025-10-28T00:00:00Z',
  },
  {
    id: 'ann-016',
    name: 'Ben F.',
    initials: 'BF',
    avatarColor: '#84cc16',
    status: 'Active',
    skills: ['Safety', 'General'],
    goldAccuracy: 79,
    iaa: 0.73,
    tasks30d: 510,
    trend: 'Improving',
    joinedAt: '2025-11-18T00:00:00Z',
  },
  {
    id: 'ann-017',
    name: 'Mia G.',
    initials: 'MG',
    avatarColor: '#06b6d4',
    status: 'Active',
    skills: ['General', 'Medical'],
    goldAccuracy: 88,
    iaa: 0.80,
    tasks30d: 945,
    trend: 'Stable',
    joinedAt: '2025-08-22T00:00:00Z',
  },
  {
    id: 'ann-018',
    name: 'Jake R.',
    initials: 'JR',
    avatarColor: '#eab308',
    status: 'Active',
    skills: ['Code', 'General'],
    goldAccuracy: 85,
    iaa: 0.78,
    tasks30d: 780,
    trend: 'Stable',
    joinedAt: '2025-09-10T00:00:00Z',
  },
  {
    id: 'ann-019',
    name: 'Olivia D.',
    initials: 'OD',
    avatarColor: '#7c3aed',
    status: 'Active',
    skills: ['Creative', 'Safety'],
    goldAccuracy: 86,
    iaa: 0.79,
    tasks30d: 867,
    trend: 'Improving',
    joinedAt: '2025-09-30T00:00:00Z',
  },
  {
    id: 'ann-020',
    name: 'Sam N.',
    initials: 'SN',
    avatarColor: '#2563eb',
    status: 'Active',
    skills: ['General'],
    goldAccuracy: 78,
    iaa: 0.72,
    tasks30d: 445,
    trend: 'Stable',
    joinedAt: '2025-12-05T00:00:00Z',
  },
  {
    id: 'ann-021',
    name: 'Rachel Q.',
    initials: 'RQ',
    avatarColor: '#db2777',
    status: 'Active',
    skills: ['Medical', 'General'],
    goldAccuracy: 92,
    iaa: 0.85,
    tasks30d: 1_190,
    trend: 'Stable',
    joinedAt: '2025-07-15T00:00:00Z',
  },
  {
    id: 'ann-022',
    name: 'Kevin Y.',
    initials: 'KY',
    avatarColor: '#059669',
    status: 'Active',
    skills: ['Code', 'General'],
    goldAccuracy: 84,
    iaa: 0.77,
    tasks30d: 698,
    trend: 'Stable',
    joinedAt: '2025-10-20T00:00:00Z',
  },
  {
    id: 'ann-023',
    name: 'Zoe E.',
    initials: 'ZE',
    avatarColor: '#c026d3',
    status: 'Active',
    skills: ['Safety', 'Creative'],
    goldAccuracy: 81,
    iaa: 0.75,
    tasks30d: 620,
    trend: 'Improving',
    joinedAt: '2025-11-08T00:00:00Z',
  },
  {
    id: 'ann-024',
    name: 'Leo I.',
    initials: 'LI',
    avatarColor: '#0891b2',
    status: 'Active',
    skills: ['General', 'Code'],
    goldAccuracy: 83,
    iaa: 0.76,
    tasks30d: 555,
    trend: 'Stable',
    joinedAt: '2025-11-25T00:00:00Z',
  },
  {
    id: 'ann-025',
    name: 'Hannah J.',
    initials: 'HJ',
    avatarColor: '#e879f9',
    status: 'In Review',
    skills: ['General', 'Creative'],
    goldAccuracy: 62,
    iaa: 0.63,
    tasks30d: 310,
    trend: 'Declining',
    joinedAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'ann-026',
    name: 'Tyler U.',
    initials: 'TU',
    avatarColor: '#65a30d',
    status: 'Onboarding',
    skills: ['General'],
    goldAccuracy: 0,
    iaa: 0,
    tasks30d: 0,
    trend: 'Stable',
    joinedAt: '2026-04-10T00:00:00Z',
  },
  {
    id: 'ann-027',
    name: 'Isla P.',
    initials: 'IP',
    avatarColor: '#4f46e5',
    status: 'Onboarding',
    skills: ['Code', 'General'],
    goldAccuracy: 0,
    iaa: 0,
    tasks30d: 0,
    trend: 'Stable',
    joinedAt: '2026-04-12T00:00:00Z',
  },
  {
    id: 'ann-028',
    name: 'Omar K.',
    initials: 'OK',
    avatarColor: '#b91c1c',
    status: 'Active',
    skills: ['Safety', 'General', 'Medical'],
    goldAccuracy: 87,
    iaa: 0.80,
    tasks30d: 920,
    trend: 'Stable',
    joinedAt: '2025-08-05T00:00:00Z',
  },
];

export const seedReviewItems: ReviewItem[] = [
  {
    id: 'rev-001',
    title: 'Ambiguous comparison',
    description:
      'Both responses are nearly identical in quality. The comparison criteria feel under-specified for this prompt category.',
    source: 'Annotator',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'Marcus T.',
    flaggedAt: '2026-04-17T08:14:00Z',
    annotationId: 'ann-batch-3-0421',
    campaignId: 'camp-llama-align',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: false, consistency: true },
    confidence: 72,
    routingReason: 'IAA check flagged — annotator disagrees with 2/3 peers on preference strength',
  },
  {
    id: 'rev-002',
    title: 'Low time (12s)',
    description:
      'Annotation completed in 12 seconds — well below the 45s minimum expected for pairwise comparison tasks of this complexity.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-17T07:52:00Z',
    annotationId: 'ann-batch-3-0398',
    campaignId: 'camp-llama-align',
    priority: 'High',
    tier: 'human-review',
    autoChecks: { gold: true, time: false, iaa: true, consistency: true },
    confidence: 38,
    routingReason: 'Time threshold violation — 12s is well below 45s minimum for pairwise tasks',
  },
  {
    id: 'rev-003',
    title: 'IAA disagreement',
    description:
      '3 of 4 annotators rated this as "safe" while 1 rated "harmful — category 3". Significant disagreement on borderline content.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Safety',
    flaggedBy: 'System',
    flaggedAt: '2026-04-17T06:30:00Z',
    annotationId: 'ann-safety-0187',
    campaignId: 'camp-gpt4-safety',
    priority: 'High',
    tier: 'escalated',
    autoChecks: { gold: true, time: true, iaa: false, consistency: false },
    confidence: 31,
    routingReason: 'Multi-check failure — IAA outlier with consistency disagreement on safety content',
  },
  {
    id: 'rev-004',
    title: 'Content concern',
    description:
      'Red-team prompt generated a response that may require escalation to the safety team. Annotator flagged for policy review.',
    source: 'Annotator',
    status: 'Flagged',
    taskType: 'Safety',
    flaggedBy: 'Sarah K.',
    flaggedAt: '2026-04-17T05:45:00Z',
    annotationId: 'ann-safety-0192',
    campaignId: 'camp-gpt4-safety',
    priority: 'High',
    tier: 'escalated',
    autoChecks: { gold: true, time: true, iaa: true, consistency: false },
    confidence: 45,
    routingReason: 'Annotator-flagged safety concern — content requires policy team review',
  },
  {
    id: 'rev-005',
    title: 'Guidelines unclear',
    description:
      'Rubric criteria for "thoroughness" overlaps with "completeness" — annotators interpreting differently across the team.',
    source: 'Annotator',
    status: 'Flagged',
    taskType: 'Rubric',
    flaggedBy: 'James L.',
    flaggedAt: '2026-04-17T04:20:00Z',
    annotationId: 'ann-rubric-0054',
    campaignId: 'camp-llama-align',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: false, consistency: true },
    confidence: 65,
    routingReason: 'Annotator-flagged guideline ambiguity — rubric criteria overlap detected',
  },
  {
    id: 'rev-006',
    title: 'Repeated pattern detected',
    description:
      'Annotator selected "Response A" for 18 consecutive comparisons. Possible position bias or inattention.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-17T03:10:00Z',
    annotationId: 'ann-batch-3-0356',
    campaignId: 'camp-llama-align',
    priority: 'High',
    tier: 'escalated',
    autoChecks: { gold: false, time: true, iaa: false, consistency: false },
    confidence: 22,
    routingReason: 'Multi-check failure — position bias pattern with gold failure and consistency issues',
  },
  {
    id: 'rev-007',
    title: 'Missing justification',
    description:
      'Required rationale field left blank on a high-disagreement item. Annotator may have skipped the explanation step.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-17T02:45:00Z',
    annotationId: 'ann-batch-3-0341',
    campaignId: 'camp-llama-align',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: false },
    confidence: 58,
    routingReason: 'Consistency check failed — missing rationale on high-disagreement item',
  },
  {
    id: 'rev-008',
    title: 'Inconsistent safety rating',
    description:
      'Same prompt was rated "safe" in one batch and "harmful" in another by the same annotator. Possible context dependency.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Safety',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T23:15:00Z',
    annotationId: 'ann-safety-0175',
    campaignId: 'camp-gpt4-safety',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: false },
    confidence: 52,
    routingReason: 'Consistency failure — same annotator gave contradictory safety ratings on identical prompt',
  },
  // Annotator flags (3 more to reach 8)
  {
    id: 'rev-009',
    title: 'Prompt quality issue',
    description:
      'Source prompt contains garbled text — likely a data pipeline encoding error. Cannot annotate meaningfully.',
    source: 'Annotator',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'Elena R.',
    flaggedAt: '2026-04-16T22:30:00Z',
    annotationId: 'ann-batch-3-0312',
    campaignId: 'camp-llama-align',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: true },
    confidence: 85,
    routingReason: 'Annotator-flagged data quality issue — garbled prompt text',
  },
  {
    id: 'rev-010',
    title: 'Code output not renderable',
    description:
      'Response contains LaTeX that doesn\'t render in the annotation UI. Annotator cannot evaluate formatting accuracy.',
    source: 'Annotator',
    status: 'Flagged',
    taskType: 'SFT',
    flaggedBy: 'David P.',
    flaggedAt: '2026-04-16T21:00:00Z',
    annotationId: 'ann-code-0088',
    campaignId: 'camp-code-bench',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: true },
    confidence: 90,
    routingReason: 'Annotator-flagged UI rendering issue — LaTeX not supported in annotation interface',
  },
  {
    id: 'rev-011',
    title: 'Duplicate prompt pair',
    description:
      'This prompt pair appears to be a duplicate of item ann-batch-3-0280. May inflate annotation counts.',
    source: 'Annotator',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'Priya M.',
    flaggedAt: '2026-04-16T20:15:00Z',
    annotationId: 'ann-batch-3-0299',
    campaignId: 'camp-llama-align',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: true },
    confidence: 82,
    routingReason: 'Annotator-flagged duplicate — potential data pipeline duplication',
  },
  // Auto-flagged (7 more to reach 15)
  {
    id: 'rev-012',
    title: 'Low time (8s)',
    description:
      'Annotation completed in 8 seconds on a multi-paragraph comparison. Far below expected completion time.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T19:40:00Z',
    annotationId: 'ann-batch-3-0287',
    campaignId: 'camp-llama-align',
    priority: 'High',
    tier: 'human-review',
    autoChecks: { gold: true, time: false, iaa: true, consistency: true },
    confidence: 35,
    routingReason: 'Time threshold violation — 8s on multi-paragraph comparison',
  },
  {
    id: 'rev-013',
    title: 'Gold question failed',
    description:
      'Annotator answered gold-standard question incorrectly. This is their 3rd miss in the last 50 items.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T18:55:00Z',
    annotationId: 'ann-batch-3-0271',
    campaignId: 'camp-llama-align',
    priority: 'High',
    tier: 'human-review',
    autoChecks: { gold: false, time: true, iaa: true, consistency: true },
    confidence: 42,
    routingReason: 'Gold standard failure — 3rd miss in last 50 items, declining accuracy pattern',
  },
  {
    id: 'rev-014',
    title: 'Outlier confidence score',
    description:
      'Annotator reported 100% confidence on an item where all other annotators reported 40-60% confidence.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Safety',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T17:30:00Z',
    annotationId: 'ann-safety-0163',
    campaignId: 'camp-gpt4-safety',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: false, consistency: false },
    confidence: 48,
    routingReason: 'IAA outlier — annotator confidence (100%) diverges significantly from peer range (40-60%)',
  },
  {
    id: 'rev-015',
    title: 'Session timeout detected',
    description:
      'Annotator session was idle for 22 minutes before submitting. Response quality may be compromised.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T16:10:00Z',
    annotationId: 'ann-batch-3-0258',
    campaignId: 'camp-llama-align',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: false, iaa: true, consistency: true },
    confidence: 68,
    routingReason: 'Session anomaly — 22-minute idle period before submission',
  },
  {
    id: 'rev-016',
    title: 'Token length mismatch',
    description:
      'Justification text is only 4 tokens for an item requiring detailed explanation (minimum 20 tokens).',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Rubric',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T15:25:00Z',
    annotationId: 'ann-rubric-0041',
    campaignId: 'camp-llama-align',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: false },
    confidence: 55,
    routingReason: 'Consistency failure — justification length (4 tokens) far below minimum (20 tokens)',
  },
  {
    id: 'rev-017',
    title: 'Systematic label skew',
    description:
      'Annotator labels skew 80% toward "safe" vs. team average of 62%. Possible leniency bias on boundary cases.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Safety',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T14:00:00Z',
    annotationId: 'ann-safety-0148',
    campaignId: 'camp-gpt4-safety',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: false, consistency: false },
    confidence: 44,
    routingReason: 'Label distribution skew — 80% safe vs. 62% team average suggests leniency bias',
  },
  {
    id: 'rev-018',
    title: 'Copy-paste justification',
    description:
      'Same justification text used verbatim across 5 consecutive items. Likely template or copy-paste behavior.',
    source: 'Auto',
    status: 'Flagged',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T12:45:00Z',
    annotationId: 'ann-batch-3-0230',
    campaignId: 'camp-llama-align',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: false },
    confidence: 50,
    routingReason: 'Consistency failure — identical justification text across 5 consecutive items',
  },
  // Resolved items (12 resolved today — these have status Resolved)
  {
    id: 'rev-019',
    title: 'Low time (15s) — resolved',
    description: 'Reviewed and confirmed as valid quick annotation on a short prompt pair.',
    source: 'Auto',
    status: 'Resolved',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-17T01:00:00Z',
    annotationId: 'ann-batch-3-0200',
    campaignId: 'camp-llama-align',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: false, iaa: true, consistency: true },
    confidence: 70,
    routingReason: 'Time threshold — short completion but simple prompt pair',
  },
  {
    id: 'rev-020',
    title: 'IAA disagreement — resolved',
    description: 'Adjudicated by senior annotator. Consensus reached after guidelines clarification.',
    source: 'Auto',
    status: 'Resolved',
    taskType: 'Safety',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T23:50:00Z',
    annotationId: 'ann-safety-0140',
    campaignId: 'camp-gpt4-safety',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: false, consistency: true },
    confidence: 60,
    routingReason: 'IAA outlier — resolved via senior adjudication',
  },
  {
    id: 'rev-021',
    title: 'Annotation correction',
    description: 'Annotator self-corrected after reviewing guidelines. Label updated.',
    source: 'Annotator',
    status: 'Resolved',
    taskType: 'Pairwise',
    flaggedBy: 'Carlos V.',
    flaggedAt: '2026-04-16T22:00:00Z',
    annotationId: 'ann-batch-3-0185',
    campaignId: 'camp-llama-align',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: true },
    confidence: 88,
    routingReason: 'Annotator self-flagged for correction',
  },
  {
    id: 'rev-022',
    title: 'Gold question edge case',
    description: 'Gold question had an ambiguous correct answer. Question retired from pool.',
    source: 'Auto',
    status: 'Resolved',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T20:30:00Z',
    annotationId: 'ann-batch-3-0170',
    campaignId: 'camp-llama-align',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: false, time: true, iaa: true, consistency: true },
    confidence: 55,
    routingReason: 'Gold standard failure — ambiguous gold question',
  },
  {
    id: 'rev-023',
    title: 'Timeout false positive',
    description: 'Network latency caused false timeout detection. Annotation was valid.',
    source: 'Auto',
    status: 'Resolved',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T19:00:00Z',
    annotationId: 'ann-batch-3-0155',
    campaignId: 'camp-llama-align',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: false, iaa: true, consistency: true },
    confidence: 75,
    routingReason: 'Time anomaly — network-induced false positive',
  },
  {
    id: 'rev-024',
    title: 'Duplicate — confirmed',
    description: 'Duplicate verified and removed from annotation pool. Counts adjusted.',
    source: 'Annotator',
    status: 'Resolved',
    taskType: 'Pairwise',
    flaggedBy: 'Tom H.',
    flaggedAt: '2026-04-16T18:00:00Z',
    annotationId: 'ann-batch-3-0142',
    campaignId: 'camp-llama-align',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: true },
    confidence: 80,
    routingReason: 'Annotator-flagged duplicate prompt',
  },
  {
    id: 'rev-025',
    title: 'Safety escalation — cleared',
    description: 'Content reviewed by safety team. Determined to be within acceptable bounds.',
    source: 'Annotator',
    status: 'Resolved',
    taskType: 'Safety',
    flaggedBy: 'Fatima A.',
    flaggedAt: '2026-04-16T16:30:00Z',
    annotationId: 'ann-safety-0130',
    campaignId: 'camp-gpt4-safety',
    priority: 'High',
    tier: 'escalated',
    autoChecks: { gold: true, time: true, iaa: true, consistency: false },
    confidence: 40,
    routingReason: 'Safety concern escalated by annotator — cleared after review',
  },
  {
    id: 'rev-026',
    title: 'Bias pattern — false alarm',
    description: 'Statistical review showed pattern was within normal distribution. No action needed.',
    source: 'Auto',
    status: 'Resolved',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T15:00:00Z',
    annotationId: 'ann-batch-3-0128',
    campaignId: 'camp-llama-align',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: false, consistency: true },
    confidence: 62,
    routingReason: 'IAA pattern — statistical review showed normal distribution',
  },
  {
    id: 'rev-027',
    title: 'Short justification — accepted',
    description: 'Item was a clear-cut comparison. Brief justification deemed appropriate.',
    source: 'Auto',
    status: 'Resolved',
    taskType: 'Rubric',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T13:30:00Z',
    annotationId: 'ann-rubric-0032',
    campaignId: 'camp-llama-align',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: false },
    confidence: 72,
    routingReason: 'Consistency flag — short justification on clear-cut item',
  },
  {
    id: 'rev-028',
    title: 'Rendering issue — fixed',
    description: 'UI bug causing code blocks to not render. Fixed by engineering, annotations resumed.',
    source: 'Annotator',
    status: 'Resolved',
    taskType: 'SFT',
    flaggedBy: 'James L.',
    flaggedAt: '2026-04-16T12:00:00Z',
    annotationId: 'ann-code-0075',
    campaignId: 'camp-code-bench',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: true },
    confidence: 92,
    routingReason: 'Annotator-flagged rendering bug',
  },
  {
    id: 'rev-029',
    title: 'Confidence calibration',
    description: 'Annotator retrained on confidence scoring. Follow-up scores within normal range.',
    source: 'Auto',
    status: 'Resolved',
    taskType: 'Safety',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T10:30:00Z',
    annotationId: 'ann-safety-0118',
    campaignId: 'camp-gpt4-safety',
    priority: 'Medium',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: false, consistency: true },
    confidence: 58,
    routingReason: 'IAA outlier — confidence scoring recalibrated',
  },
  {
    id: 'rev-030',
    title: 'Label correction — batch',
    description: 'Batch of 8 labels corrected after guideline update. All re-annotated.',
    source: 'Auto',
    status: 'Resolved',
    taskType: 'Pairwise',
    flaggedBy: 'System',
    flaggedAt: '2026-04-16T09:00:00Z',
    annotationId: 'ann-batch-3-0100',
    campaignId: 'camp-llama-align',
    priority: 'Low',
    tier: 'human-review',
    autoChecks: { gold: true, time: true, iaa: true, consistency: false },
    confidence: 65,
    routingReason: 'Consistency failure — batch labels corrected after guideline update',
  },
];

export const seedExports: ExportRecord[] = [
  {
    id: 'exp-001',
    version: 'v2026.04.16.001',
    format: 'DPO',
    destination: 'S3',
    status: 'Complete',
    recordCount: 28_531,
    fileSize: '1.2 GB',
    campaignId: 'camp-llama-align',
    campaignName: 'Llama 3 Alignment Campaign',
    createdAt: '2026-04-16T18:30:00Z',
    createdBy: 'Sarah K.',
  },
  {
    id: 'exp-002',
    version: 'v2026.04.15.002',
    format: 'Reward Model',
    destination: 'S3',
    status: 'Complete',
    recordCount: 15_220,
    fileSize: '680 MB',
    campaignId: 'camp-llama-align',
    campaignName: 'Llama 3 Alignment Campaign',
    createdAt: '2026-04-15T22:00:00Z',
    createdBy: 'Priya M.',
  },
  {
    id: 'exp-003',
    version: 'v2026.04.15.001',
    format: 'SFT',
    destination: 'HF Hub',
    status: 'Complete',
    recordCount: 10_000,
    fileSize: '420 MB',
    campaignId: 'camp-llama-align',
    campaignName: 'Llama 3 Alignment Campaign',
    createdAt: '2026-04-15T14:15:00Z',
    createdBy: 'James L.',
  },
  {
    id: 'exp-004',
    version: 'v2026.04.14.001',
    format: 'Raw',
    destination: 'Download',
    status: 'Complete',
    recordCount: 45_231,
    fileSize: '2.1 GB',
    campaignId: 'camp-llama-align',
    campaignName: 'Llama 3 Alignment Campaign',
    createdAt: '2026-04-14T10:00:00Z',
    createdBy: 'David P.',
  },
  {
    id: 'exp-005',
    version: 'v2026.04.13.001',
    format: 'DPO',
    destination: 'GCS',
    status: 'Complete',
    recordCount: 18_412,
    fileSize: '890 MB',
    campaignId: 'camp-gpt4-safety',
    campaignName: 'GPT-4 Safety Audit',
    createdAt: '2026-04-13T16:45:00Z',
    createdBy: 'Elena R.',
  },
  {
    id: 'exp-006',
    version: 'v2026.04.12.001',
    format: 'Reward Model',
    destination: 'S3',
    status: 'Complete',
    recordCount: 5_435,
    fileSize: '240 MB',
    campaignId: 'camp-arena-q1',
    campaignName: 'Arena Benchmark Q1',
    createdAt: '2026-04-12T09:30:00Z',
    createdBy: 'Marcus T.',
  },
  {
    id: 'exp-007',
    version: 'v2026.04.11.001',
    format: 'SFT',
    destination: 'HF Hub',
    status: 'Complete',
    recordCount: 8_102,
    fileSize: '350 MB',
    campaignId: 'camp-code-bench',
    campaignName: 'Multi-Language Code Bench',
    createdAt: '2026-04-11T11:20:00Z',
    createdBy: 'Tom H.',
  },
  {
    id: 'exp-008',
    version: 'v2026.04.10.001',
    format: 'Raw',
    destination: 'S3',
    status: 'Complete',
    recordCount: 23_847,
    fileSize: '1.4 GB',
    campaignId: 'camp-gpt4-safety',
    campaignName: 'GPT-4 Safety Audit',
    createdAt: '2026-04-10T20:00:00Z',
    createdBy: 'Fatima A.',
  },
];

export const seedModelEndpoints: ModelEndpoint[] = [
  {
    id: 'model-001',
    name: 'Llama-3-70B',
    provider: 'vLLM',
    version: 'dpo-v3.1',
    health: 'Up',
    activeTasks: 3,
    latencyMs: 340,
    lastChecked: '2026-04-17T09:58:00Z',
    endpoint: 'https://vllm-cluster.internal/v1/llama-3-70b-dpo-v3.1',
  },
  {
    id: 'model-002',
    name: 'Llama-3-70B',
    provider: 'vLLM',
    version: 'dpo-v3.0',
    health: 'Up',
    activeTasks: 2,
    latencyMs: 355,
    lastChecked: '2026-04-17T09:58:00Z',
    endpoint: 'https://vllm-cluster.internal/v1/llama-3-70b-dpo-v3.0',
  },
  {
    id: 'model-003',
    name: 'Llama-3-13B',
    provider: 'vLLM',
    version: 'sft-v2.0',
    health: 'Up',
    activeTasks: 1,
    latencyMs: 180,
    lastChecked: '2026-04-17T09:58:00Z',
    endpoint: 'https://vllm-cluster.internal/v1/llama-3-13b-sft-v2.0',
  },
  {
    id: 'model-004',
    name: 'GPT-4-Turbo',
    provider: 'OpenAI',
    version: '2024-04',
    health: 'Up',
    activeTasks: 1,
    latencyMs: 520,
    lastChecked: '2026-04-17T09:57:00Z',
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
  {
    id: 'model-005',
    name: 'Claude-3-Opus',
    provider: 'Anthropic',
    version: 'latest',
    health: 'Slow',
    activeTasks: 0,
    latencyMs: 2_100,
    lastChecked: '2026-04-17T09:55:00Z',
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
];
