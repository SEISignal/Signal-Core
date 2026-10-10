# SIGNAL CORE

> **A Product of SIGNAL • A Subsidiary of SEIHOUSE**  
> *Deterministic Offline Intelligence & Fallback Knowledge Packaging*

---

## Executive Overview

**Signal Core** is built on a fundamental principle: **technology should expand human capability, not erase the fallback.** When external systems, telecommunication grids, cloud infrastructure, or remote centralized AI services collapse, human beings still need rapid, authoritative, and actionable intelligence.

Signal Core is the human continuity layer—an offline-first knowledge packaging and delivery engine engineered to operate with zero external dependencies.

---

## The Three Core Pillars

The purpose and architecture of Signal Core are defined by three distinct stages:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  SIGNAL CORE                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
         │                                       │                       │
         ▼                                       ▼                       ▼
┌──────────────────┐                   ┌──────────────────┐    ┌──────────────────┐
│     PILLAR 1     │                   │     PILLAR 2     │    │     PILLAR 3     │
│   Pre-Assembled  │                   │  User-Packaged   │    │   Edge AI SLM    │
│  Knowledge Packs │                   │  Custom Data     │    │   Integration    │
│                  │                   │                  │    │  (1B–3B Models)  │
└──────────────────┘                   └──────────────────┘    └──────────────────┘
  Curated, vetted        The user brings their       Designed to feed ultra-
  field directives,      household protocols,        efficient local models
  medical triage, &      medical profiles, &         running on constrained,
  survival procedures    safe zones; we package      low-power devices under
  downloaded offline.    it into durable schemas.    disaster conditions.
```

### 1. Pre-Prepared, Assembled Knowledge Packages
Curated, expert-verified capability packs that users download before infrastructure failure. Each pack provides structured, branching directives, emergency sequence checklists, and practical conceptual grounding ("Understand the Why").
- **Universal Human Core**: First Aid Fundamentals, Water Sourcing & Purification, Offline Terrain Navigation, Emergency Shelter & Thermoregulation, Mechanical Repair, Clear Communication Protocols, Severe Weather Hazards, and Power Outage Management.
- **Branching Decision Trees**: Context-aware categorization (e.g., Acute Hemorrhage vs. Environmental Exposure vs. Special Populations) for split-second triage.

### 2. User-Provided Information Packaging ("Bring Your Own Data")
Users input their family and local operational parameters; Signal Core packages the data into durable, offline-downloadable and printable schemas:
- **Family & Community Directives**: Key personnel, call-signs, backup rally points, and primary VHF/radio frequencies.
- **Critical Medical Registries**: Blood types, life-threatening allergies, chronic conditions, and essential prescriptions.
- **Safe Zone Coordinates**: Primary shelters, secondary evacuation hubs, and terrain waypoints.
- **Multi-Vector Distribution**:
  - *Stark Analog Print Sheet*: High-contrast, low-ink physical paper layout designed for survival go-bags.
  - *Deterministic Vector QR*: High-density Base64 encoded payload that any mobile camera can re-import without network access.
  - *Zero-Grid BLE & Ad-Hoc Wi-Fi*: Sandboxed peer-to-peer radio synchronization across nearby local devices.

### 3. Local Small Language Model (SLM) Grounding (Architectural Roadmap)
Signal Core is designed as the primary structured knowledge layer for **compact local AI (1B–3B parameter models)** running on low-power, degraded edge hardware:
- **Low Compute & Low Power Footprint**: Operates on edge devices running on battery banks, hand cranks, or solar generators where heavy cloud models cannot reach.
- **Direct Retrieval Grounding**: The local model ingests Signal Core’s pre-packaged instructions or user-packaged schemas to provide instantaneous, straight-to-the-point natural language guidance during emergencies without hallucinations.
- *Note*: Step 3 represents the architectural ingestion target; current development focuses on the robust packaging, validation, and zero-grid dissemination of the information packets.

---

## Technical Architecture & Design Standards

### Apple Human Interface Standards
Signal Core adheres strictly to professional, Apple-grade design principles:
- **Clarity & Visual Hierarchy**: High-contrast typography, refined translucent glass surfaces (`backdrop-blur-xl`), and focused layouts.
- **Ergonomics & Touch Targets**: Minimum 44px touch targets across all mobile and tablet viewports.
- **Deterministic Hydration**: Full synchronization with React 19's `useSyncExternalStore` for reactive online/offline network detection with zero SSR mismatch.

### Security & Local Privacy
- **Client-Side Sandbox**: All user-entered emergency contacts, medical registries, and safe zone coordinates are compiled in local client memory.
- **Zero Telemetry**: No third-party analytics, remote logs, or tracking beacons.
- **Offline Integrity**: Verified cryptographic payload hashes ensure data is not corrupted during peer-to-peer transfer.

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation & Development
```bash
# Clone the repository
git clone <repo-url>
cd signal-core

# Install dependencies
npm install

# Run the development server
npm run dev

# Run unit and core logic tests
npm test

# Build for production
npm run build
```

---

## Verification & Testing

Signal Core includes a Vitest test suite testing data schemas, capability rating logic, search filters, and branch fallbacks:
```bash
npm test
```

---

## Roadmap

- [x] **Phase 1: Universal Knowledge Packs & Branching Hierarchy UI**
- [x] **Phase 2: Custom Emergency Schema Builder & Multi-Vector Export (Analog/QR/BLE)**
- [x] **Phase 3: React 19 Hydration Hardening & Apple-Grade SEIHouse Redesign**
- [ ] **Phase 4: Web App Manifest & Service Worker IndexedDB Persistence**
- [ ] **Phase 5: Local 1B–3B SLM Retrieval Interface (WebLLM / Wasm Runtime)**

---

*Signal Core — Built for resilience by SEIHouse.*
