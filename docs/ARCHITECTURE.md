# Signal Core — Architectural Specification & Knowledge Packaging Pipeline

**Product**: Signal Core  
**Organization**: SEIHouse Resilient Architecture Division  
**Document Version**: 1.2  
**Status**: Active Specification  

---

## 1. Problem Statement & Philosophy

Modern digital infrastructure assumes constant connectivity, continuous AC power, and ubiquitous access to hyperscale cloud data centers. In real crises—earthquakes, severe hurricanes, power outages, electromagnetic degradation, or remote wilderness operations—this assumption collapses first.

Signal Core exists to decouple human knowledge and critical situational data from centralized infrastructure. It functions in three concrete tiers:

1. **Pre-Prepared Assembled Knowledge Packages** (Vetted core knowledge)
2. **User-Provided Information Packaging** (User brings data, Signal Core packages it for offline transport)
3. **Local Edge AI (1B–3B SLM) Ingestion Interface** (Grounding compact on-device models)

---

## 2. Pillar 1: Pre-Assembled Information Packages

### Design Philosophy
Pre-assembled packages are not flat walls of text or static PDFs. They are **structured hierarchical directive trees** organized into:
- **Immediate Directives**: Short, imperative field commands (1–2 sentences) requiring minimal cognitive processing under adrenaline and stress.
- **Branching Decision Trees**: Categorical triage structures (e.g. distinguishing mechanical emergencies, biological pathogens, or environmental trauma).
- **"Understand the Why" Conceptual Layer**: Explains the underlying physical or biological principles so operators can improvise solutions when prescribed tools are unavailable.

### Supported Domains (Universal Human Core)
| Package ID | Domain | Key Directives | Branching Taxonomy |
|---|---|---|---|
| `first-aid` | Immediate Medical Triage | CPR, arterial bleeding, tourniquet, shock | Medical Emergencies, Environmental Trauma, Pediatric/Geriatric |
| `water-sanitation` | Hydration & Biohazard Containment | Thermal boiling, SODIS, chlorine titration, latrine safety | Sourcing, Chemical/Biological Purification, Field Sanitation |
| `reasoning` | Cognitive Stress Heuristics | Resource budgeting, S.T.O.P. principle, panic de-escalation | Resource Estimation, Verification Checks, Worst-Case Matrix |
| `navigation` | Terrestrial Offline Wayfinding | Handrails, backstops, pacing, terrain association | Map Orientation, Linear Handrails, Backstops |
| `shelter` | Thermoregulation & Exposure Control | Conduction insulation, windbreak, layered clothing | Core Insulation, Micro-Climate Engineering, Fire Craft |
| `repair` | Applied Mechanical Improvisation | Stress vectors, load-bearing fasteners, depressurization | Mechanical Isolations, Structural Fastening, Adhesive Physics |
| `comms` | Low-Bandwidth Zero-Grid Relay | VHF/UHF protocols, read-backs, plain language | Radio Transmission Protocols, De-escalation Scripts |
| `weather` | Severe Atmospheric Hazards | Flash flood dynamics, tornado shelter, lightning mitigation | High-Wind Shelter, Hydrological Hazards, Thermal Extremes |
| `power` | Extended Grid Disruption | Food perishability timelines, CO poisoning prevention | Generator Safety Zones, Thermal Retention, Circuit Safeguards |
| `learning` | Rapid Skill Acquisition Under Duress | Functional decomposition, diagnostic failure analysis | Cognitive Scaffolding, Fast Experimentation Loops |

---

## 3. Pillar 2: User-Provided Information Packaging Engine

### "Bring Your Own Data" Pipeline
Users enter operational and personal context into Signal Core's sandboxed client-side editor. Signal Core structures, validates, and serializes this into a universal offline package schema:

```
[ User Raw Data ] 
       │
       ▼
[ Client Validation & Normalization Engine ]
       │
       ├─► Schema Standardizer (Contacts, Medical Registries, Safe Zones)
       ├─► Integrity Checksum Generator (SHA-256 verification hash)
       │
       ▼
[ Multi-Vector Distribution Pipeline ]
       ├─► Vector A: Stark Analog Print Engine (Go-Bag physical paper)
       ├─► Vector B: High-Density 2D Matrix (QR Vector Payload)
       ├─► Vector C: Zero-Grid Peer Radio (Bluetooth LE advertisement & Ad-Hoc LAN)
       └─► Vector D: Structured JSON/CBOR Blob (Local Filesystem Persistence)
```

### The Packaging Schema Standard (`SIGNAL_CORE_FALLBACK_V1`)
```json
{
  "protocol": "SIGNAL_CORE_FALLBACK_V1",
  "timestamp": "2026-10-10",
  "payloadHash": "SHA256_HASH_STRING",
  "contacts": [
    {
      "n": "Sarah Chen",
      "r": "Spouse / Primary Contact",
      "p": "+1 (555) 019-2834 / VHF Ch 16",
      "m": "Sector 4 Civic Park East Entrance"
    }
  ],
  "medical": [
    {
      "n": "Sarah Chen",
      "b": "A+",
      "c": "Asthma (Requires Albuterol Inhaler)",
      "m": "Albuterol sulfate 90mcg"
    }
  ],
  "zones": [
    {
      "n": "Sector 4 Civic Park",
      "c": "37.7749° N, 122.4194° W",
      "b": "Community High Gymnasium (Secondary Hub)",
      "s": "District 4"
    }
  ]
}
```

---

## 4. Pillar 3: Local Edge AI (1B–3B SLM) Ingestion Interface

### The Role of Small Language Models in Signal Core
When an operator is in a disaster scenario or remote off-grid station, cloud LLMs (GPT-4, Claude, Gemini Cloud) are completely unreachable. Furthermore, full 70B+ open models require massive GPU servers drawing hundreds of watts of power.

Signal Core is designed as the ground truth corpus and structured knowledge substrate for **ultra-compact 1B to 3B Small Language Models** (e.g. MobileLM, SmolLM2, Llama-3.2-1B/3B, Gemma-2B, Phi-3.5-mini):

```
┌────────────────────────────────────────────────────────┐
│                   EDGE COMPUTE RUNTIME                 │
│         (Low power, battery powered, 1B–3B SLM)        │
└────────────────────────────────────────────────────────┘
                           ▲
                           │ Direct Retrieval Context (RAG)
                           │ Zero Internet Dependency
                           ▼
┌────────────────────────────────────────────────────────┐
│                   SIGNAL CORE PACKS                    │
│   ┌────────────────────────┐  ┌────────────────────┐   │
│   │ Pillar 1: Core Packs   │  │ Pillar 2: Custom   │   │
│   │ (First aid, water,     │  │ User Schema        │   │
│   │  shelter, navigation)  │  │ (Family, medical)  │   │
│   └────────────────────────┘  └────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### Technical Requirements for the 1B–3B Ingestion Layer:
1. **Low Power Profile**: Must run entirely on consumer CPU or integrated NPU/GPU with under 5–15 Watts power draw.
2. **Deterministic Context Grounding**: The SLM does not hallucinate wild medical advice; it strictly extracts and synthesizes answers based on the loaded Signal Core pack.
3. **Concise, High-Urgency Responses**: Optimized for immediate field action—bulleted steps, explicit warnings, and quantitative guidance.
4. **Zero-Setup Model Loading**: Models cached on local device via WebGPU / WebAssembly or local native runtime without requiring active authentication tokens.

*(Note: In the current development stage, Signal Core focuses on establishing pristine pre-assembled packs and user packaging pipelines. Edge AI runtime integration is scheduled for upcoming milestones).*

---

## 5. User Interface & Human Ergonomics (Apple Standard)

Signal Core treats UI not as decoration, but as an operational instrument:
- **Legibility in Direct Sunlight & Low Light**: Subtle, high-contrast typography, zero extraneous decorative noise.
- **Touch Ergonomics Under Stress**: Touch targets are minimum 44px with tactile feedback to prevent mis-clicks with cold, trembling, or gloved hands.
- **Instant Mode Switching**: Rapid toggle between Branching Diagnostic View and Sequential Action Directives.
- **Immediate Visual Status**: Clear confirmation of whether directives are cached locally in memory.

---

*Authored by the SEIHouse Engineering Team.*
