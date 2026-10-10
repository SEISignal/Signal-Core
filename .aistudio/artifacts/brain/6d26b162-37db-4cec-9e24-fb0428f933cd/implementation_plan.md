# Custom Skill-Packet Bundles & Tailored Practice Plans

Enable users of Signal Core to compose custom skill-packet bundles tailored to their specific operational environment, profession, and threat profile, generating an actionable, phased learning schedule and hands-on practice curriculum.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following parameters and architectural choices have been confirmed for the bundle creation engine:

- **Confirmed Decision (Creation Flow)**: Custom creation directly from scratch without forced generic presets, allowing operators full autonomy over bundle scope and focus areas.
- **Confirmed Decision (Situational Profiling)**: Bundle recommendations and curriculum prioritization are parameterized by **Location Climate** (Temperate, Arid/Desert, Tropical/Humid, Cold/Subarctic), **Profession Role** (Healthcare, Mechanical/Trades, Logistics/Field, Urban Resident, Tech/Comms), and **Emergency Risk Level** (Precautionary, Regional Disruption, Systemic Outage).
- **Plan Structure**: Phased timeline model (Phase 1: Foundation & Triage, Phase 2: Technical Protocols, Phase 3: Stress Drills & Validation) featuring daily drills, situational exercise steps, and verifiable readiness criteria.

---

## 1. Overview & Core Concept

- **What It Does**: Operators can launch a dedicated **Custom Bundle Studio** to assemble personalized skill-packet packages. By specifying their operating geography/climate, civilian or field profession, and anticipated hazard horizon, the app synthesizes a tailored learning syllabus and actionable practice regimen with milestone tracking.
- **Target Audience**: Emergency responders, remote field workers, utility personnel, and prepared citizens operating in unstable or disconnected environments who need hyper-relevant, non-redundant survival competencies.
- **Key Value**: Replaces generic one-size-fits-all checklists with an adaptive, offline-persisted learning track that aligns practice drills with actual situational exposure and role responsibilities.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Launch Bundle Studio**:
   - The user taps **"New Custom Bundle"** from the main dashboard or navigation bar.
   - On mobile, this slides up a clean, full-height modal sheet with touch-friendly progress indicators; on desktop, it displays an expansive split modal dialog.

2. **Step 1: Operational Profile**:
   - Provide a Bundle Name (e.g., *"Cascade High-Desert Prep"*, *"Urban Grid Failure Kit"*).
   - Select **Location Climate** (segmented selection: Arid, Temperate, Tropical, Subarctic).
   - Select **Profession / Role** (Healthcare, Mechanical/Trades, Logistics, Urban Resident, etc.).
   - Set **Anticipated Hazard Level** (Precautionary, Infrastructure Disruption, Severe Outage).

3. **Step 2: Knowledge Branches & Topic Selection**:
   - Filter through core knowledge packets (First Aid, Water & Sanitation, Offline Navigation, Mechanical Repair, Stress Communication, Food Preservation).
   - Select specific branch competencies (e.g., *CPR Protocols*, *Solar Disinfection*, *Dead Reckoning*, *Hydraulic Braking*).
   - Live summary shows total estimated study time and skill coverage.

4. **Step 3: Practice Drills & Training Cadence**:
   - Select hands-on drill types (Mental Drills, Physical Timed Drills, Equipment Checkouts, Group Scenarios).
   - Configure target cadence (e.g., 15-minute daily micro-drills vs. weekly intensive simulations).

5. **Step 4: Tailored Plan Generation & Execution**:
   - The engine generates a phased learning and practice curriculum:
     - **Phase 1: Immediate Triage & Foundation** (Days 1–7)
     - **Phase 2: Core Mechanical & Operational Procedures** (Days 8–21)
     - **Phase 3: High-Stress Scenarios & Physical Drills** (Days 22–30)
   - The plan features interactive drill completion toggles, countdown timers for speed drills, and an **Export Plan** trigger for analog printable field sheets or offline QR sharing.

### Visual Identity & Theme Tokens

- **Aesthetic Direction**: Functional, field-grade utilitarian design matching Signal Core's typography and palette. High-contrast labels, crisp hairline borders (`border-stone-200 dark:border-stone-800`), and zero decorative fluff.
- **Typography**: Clean display headings in `font-sans font-bold tracking-tight`, monospace metadata for metrics and operational parameters (`font-mono text-xs tabular-nums`).
- **Color Distribution**:
  - 60% Canvas: `bg-stone-50 dark:bg-stone-950`
  - 30% Surface: `bg-white dark:bg-stone-900`
  - 10% Accent: `text-stone-900 dark:text-stone-100` with emerald/amber functional indicators.
- **Touch Ergonomics**: All buttons maintain $\ge 44\text{px}$ touch targets, thumb-accessible primary action bars on mobile, and smooth motion transitions via `motion/react`.

---

## 3. Key Product Decisions & Trade-Offs

- **Deterministic Plan Synthesis Engine**:
  - *Chosen Approach*: Implement a robust, deterministic plan synthesizer in TypeScript (`lib/bundlePlanGenerator.ts`) that factors in climate, profession, and hazard levels with rich algorithmic tailoring, with optional Gemini enhancement when online.
  - *Why*: Guarantees instantaneous, 100% reliable offline generation even when disconnected or in airplane mode, preserving Signal Core's core offline-first promise.
  - *Alternatives Considered*: Pure LLM generation on every bundle creation would fail completely when offline or when API limits are reached.
- **Storage & State Management**:
  - *Chosen Approach*: Persist bundles in `localStorage` under `signal_custom_bundles` with reactive React state in `app/page.tsx` and custom hooks.
  - *Why*: Instant client-side persistence with zero backend setup latency, full offline availability, and cross-session durability.
- **Modular Component Decomposition**:
  - *Chosen Approach*: Split the feature into clean, single-responsibility modules:
    - `components/bundles/BundleBuilderModal.tsx` (wizard for building bundles)
    - `components/bundles/BundleDetailView.tsx` (drill runner, curriculum viewer, progress tracking)
    - `components/bundles/CustomBundleList.tsx` (overview cards & quick actions)
    - `lib/bundleTypes.ts` & `lib/bundlePlanGenerator.ts` (data models, algorithmic curriculum generator, and unit tests)
  - *Why*: Adheres to user instruction "Keep code base modular and modern" and "Refactor components when you notice they are growing too large".

---

## 4. Technical Architecture & Data Strategy

### System & Component Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                               app/page.tsx                             │
│                  (State: bundles, activeBundleId, builderOpen)         │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌────────────────────────────────────┐  ┌────────────────────────────────────┐
│      CustomBundleList.tsx          │  │     BundleBuilderModal.tsx         │
│  - Displays operator bundles       │  │  - Step 1: Environment & Profile   │
│  - Progress rings & quick drill CTA│  │  - Step 2: Knowledge Branches      │
│  - "Create New Bundle" trigger     │  │  - Step 3: Drill Types & Cadence   │
└───────────────────┬────────────────┘  │  - Step 4: Curriculum Synthesis    │
                    │                   └──────────────────┬─────────────────┘
                    ▼                                      │
┌────────────────────────────────────┐                     ▼
│      BundleDetailView.tsx          │          ┌──────────────────────┐
│  - Phased learning syllabus        │◄─────────┤bundlePlanGenerator.ts│
│  - Daily drills with timers        │          │(Tailored curriculum  │
│  - Check-in completions            │          │ synthesis algorithm) │
│  - Export plan to analog / QR      │          └──────────────────────┘
└────────────────────────────────────┘
```

### Data Model (`lib/bundleTypes.ts`)

```typescript
export type ClimateType = 'temperate' | 'arid' | 'tropical' | 'subarctic';
export type ProfessionType = 'healthcare' | 'trades' | 'logistics' | 'urban_resident' | 'security_field';
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface PracticeDrill {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  frequency: 'daily' | 'biweekly' | 'weekly';
  description: string;
  instructions: string[];
  equipmentNeeded: string[];
  completed: boolean;
  lastPracticed?: string;
}

export interface PlanPhase {
  phaseNumber: number;
  name: string;
  timeframe: string;
  focus: string;
  drills: PracticeDrill[];
  milestones: string[];
}

export interface CustomBundle {
  id: string;
  name: string;
  createdAt: string;
  climate: ClimateType;
  profession: ProfessionType;
  riskLevel: RiskLevel;
  selectedBranchIds: string[];
  totalEstimatedHours: number;
  phases: PlanPhase[];
  completedDrillIds: string[];
}
```

### Verification & Testing Plan

1. **Automated Unit Tests**:
   - Add `lib/bundlePlanGenerator.test.ts` testing curriculum generation under different combinations of climate, profession, and risk levels.
   - Verify all drills generate correct instructions, timeframes, and valid unique identifiers.
2. **`npm run verify` Execution**:
   - Clean lint check (`npm run lint`).
   - Unit test execution (`npm run test`).
   - Compilation and production build verification (`npm run build`).
3. **Manual Mobile & Ergonomics Verification**:
   - Test touch interactions on 375px mobile breakpoint and desktop.
   - Confirm dark mode fidelity across all new screens.
   - Verify localStorage persistence across reloads.
