# DataForge MVP — Build Spec

You are building a high-fidelity interactive prototype of a production SaaS product. Your job is to ship a pixel-perfect, polished, Vercel-hosted clickthrough that I can share with my team and have them genuinely mistake it for a real product.

## What I'll supply vs. what you handle

I have already done vercel login 
My github is also connected with you 

You handle everything else:
- Install Node 18+/pnpm/vercel CLI if missing (check first with `--version`)
- Scaffold the project, write all code, run the dev server, deploy
- Access the 34 design files via the Paper MCP (they're named `01_Admin_Dashboard.png` through `34_Guidelines_Viewer.png`)
- Commit to git, push, deploy, return me the live URL

## Questions to ask me upfront (before starting the build)

Ask these in one batch, then don't block on me for anything else:

1. **Vercel project name** — df-app 
I haven't setup anything on vercel yet. assuming you will do it yourself

2. **GitHub repo** — It's already with you
3. **Package manager preference** — pnpm (my recommendation) or npm?

Everything else you decide based on this spec.

## Stack

- Next.js 14 App Router + TypeScript (strict)
- Tailwind CSS
- Zustand for mutable mock state (tasks added appear in lists, etc.)
- Recharts for charts
- lucide-react for icons
- Framer Motion for transitions and micro-animations
- Fonts via `next/font/google`: Instrument Serif (display), Geist (body), Geist Mono (code)

## Deliverable

34 screens across two apps in one Next.js project:

**Admin app** (sidebar layout) — screens 01–21, 33
- `/` Dashboard · `/projects` · `/projects/[id]` · `/campaigns/[id]/rounds/[roundId]` · `/tasks` · `/tasks/new` · `/tasks/new/configure` (7-step wizard in one route) · `/models` · `/annotators` · `/analytics` · `/reviews` · `/reviews/[id]` · `/exports` · `/exports/new` · `/settings/api-keys` · `/qualifications` · `/qualifications/builder`

**Annotator app** (dark teal top bar, no sidebar) — screens 22–32
- `/annotate` home · `/annotate/[id]/pairwise` · `/chat` · `/sft` · `/red-team` · `/edit` · `/rank` · `/rubric` · `/arena` · `/annotate/profile` · `/annotate/qualification/[id]`

**Global overlay** — screen 34 `<GuidelinesDrawer />` accessible from any task screen via the "Guidelines" button.

Use Next.js route groups: `app/(admin)/` and `app/(annotator)/` with separate `layout.tsx` files.

## Pixel-perfect requirement

"Looks like the designs" is not the bar. **Looks indistinguishable from the designs** is the bar. Specifically:

- Pull every design via the Paper MCP before coding the corresponding screen. Reference it while building. Do not build from memory.
- Match exact spacing, typography sizes, border weights, corner radii, and color values. When in doubt, use the devtools-style precision: measure the design, replicate it.
- Status badges (Active/Draft/Complete/Paused/Review/Flagged/etc.) must use the exact tint backgrounds and text colors from the designs. Catalog them in one `<Badge>` component with variants.
- Page titles in display serif, ALL CAPS, ~0.01em tracking — this is the product's signature and must be consistent across every admin page header.
- Numbers in stat cards: display serif, large, tight leading. Labels above them: 10–11px, uppercase, tracked ~0.14em, muted gray.
- Tables: hairline borders only, generous vertical padding (~14px), no zebra striping, no heavy dividers. Column headers: small uppercase tracked.
- Cards: white background, 1px `#EEF0EE` border, 6px radius, **no drop shadows**. The design language is restrained — shadows would kill it.

## Polish requirements (this is what separates prototype-feel from product-feel)

Budget real time for this. A stiff, unpolished app gives away that it's a prototype in the first 3 seconds.

**Micro-animations with Framer Motion:**
- Sidebar nav item: subtle background fade on hover (150ms), active state animates in
- Route transitions: fade + 4px slide-up on the main content area (200ms)
- Stat card numbers: count-up animation on mount (600ms, ease-out) — use a small hook
- Table rows: stagger-fade-in on first paint (30ms delay per row, capped at 10)
- Badges: scale from 0.9 to 1 on mount (120ms)
- Modal/drawer (Guidelines): slide-in from right with backdrop fade (220ms)
- Progress bars: animate width from 0 to target on mount (700ms, ease-out)
- Toast/success states: slide-down from top when mutations happen ("Task created")
- Wizard step transitions: cross-fade content area between steps (180ms)
- Button press: subtle scale 0.98 on active state

**Interaction quality:**
- Every button has a hover state, focus-visible ring, and active state
- Every input has a focus ring in brand teal, not browser default
- Disabled states at 40% opacity with cursor-not-allowed
- Loading states where they'd exist in prod