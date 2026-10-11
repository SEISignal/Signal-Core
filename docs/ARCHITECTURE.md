# Signal Core — Architecture

**Product**: Signal Core (a Signal project, SEIHouse Productions LLC)
**Status**: Direction set; implementation pending. See README "Current state".

---

## 1. Problem

In a crisis — power outage, storm, earthquake, displacement, or simply no
signal — the information people need is often on the internet, and the AI they
would ask is in the cloud. Both disappear first.

Signal Core keeps the user's chosen information, and a way to ask questions of
it, on the device itself.

## 2. Responsibility boundary

Signal Core is a **tool**, not a source of truth.

| Signal Core is responsible for | Signal Core is not responsible for |
|---|---|
| Storing packages reliably and detecting damage | The accuracy of third-party guidance |
| Finding the right passage for a question | Writing or curating emergency content |
| Answering only from the package, with citations | Hosting or redistributing others' material |
| Saying clearly when the package does not cover something | Training or distributing a proprietary model |

Trusted organizations are offered as **links**. The user downloads from the
source. Where content is public domain (for example most US federal
government publications), bundling may be considered later as a deliberate,
per-source decision; the default is links only.

## 3. Components

```
┌──────────────────────────────────────────────────────────────┐
│                        Signal Core app                        │
│                                                              │
│  ┌───────────┐   ┌───────────────┐   ┌────────────────────┐  │
│  │  Builder  │──►│  SPP package  │──►│  Local index        │  │
│  │ (gather)  │   │  (.spp file)  │   │  (derived, on       │  │
│  └───────────┘   └───────────────┘   │   device, rebuilt   │  │
│                         ▲            │   from the package) │  │
│                         │            └─────────┬──────────┘  │
│                  open / import                 │ passages    │
│                  (file, USB,                   ▼             │
│                   share sheet)       ┌────────────────────┐  │
│                                      │  Model adapter      │  │
│   ┌──────────────────────┐           │  1. device AI       │  │
│   │ Reader / search      │◄──────────┤  2. downloaded SLM  │  │
│   │ (always available)   │  fallback │  3. none → search   │  │
│   └──────────────────────┘           └────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 3.1 Package — SPP

Signal packages are SPP 1.0 packages, read and written with the reference
library in `SEIHouse/SEIHouse-Package` (`createPack`, `intakePack`). Signal Core
must not fork or redefine the format. Anything Signal needs from the format
core is proposed upstream in that repository.

Signal-specific information lives in SPP's optional namespaced fields:

- File-level `metadata["signal.source"]` (planned): where the file came from
  (URL or "user provided"), the publishing organization if any, and the date it
  was obtained.
- Top-level `extensions["signal.*"]` (planned) for package-level details, if
  needed.

Exact shapes are defined when Phase 2 is built, not before.

The package is the source of truth. Everything else — search index,
embeddings, caches — is derived and can be rebuilt from it.

### 3.2 Local index

Built on device from the package's readable text (`content.documents` in the
SPP intake result). Passages keep a reference to their source file and
position so every answer can cite them. Approach (keyword, embeddings, or both)
is chosen in Phase 4 against real on-device constraints.

### 3.3 Model adapter

On-device models have small context windows, so retrieval quality decides
answer quality. The adapter:

1. Selects a small number of passages for the question.
2. Sends only those passages, plus fixed instructions, to the available model.
3. Requires the answer to come from those passages and to cite them.
4. Returns "not in your package" when the passages do not cover the question.

Package text is treated as **data, never as instructions** to the model, in
line with SPP's agent-setup guidance.

Model order: device-provided model → optional downloaded small model → no
model (search and reading only).

### 3.4 Reader and search

Plain offline browsing and search of the package. Works on every device,
with or without a model, and is the guaranteed fallback.

## 4. Platform

The prototype is a Next.js web app. Device-provided AI is reachable only from
installed native apps, so Phase 5 requires a native app shell (wrapping the
existing interface, plus a small native bridge per platform). A web or
laptop build remains useful for building packages and for USB distribution.

## 5. Privacy and safety

- No servers, accounts, analytics, or telemetry.
- Packages may contain sensitive personal data (medical, family, locations).
  SPP 1.0 does not encrypt. Protection of packages at rest — on device and on
  removable media — is a Signal-level decision to be made before Signal
  handles real personal data; it does not belong in the shared SPP core.
- Integrity fingerprints detect damage and alteration; they do not prove who
  created a package.

## 6. Relationship to SEIHouse

SPP is shared by SEA, SEN, and Signal. Signal is one consumer of it, and one
of the places its robustness is tested. SEA expanded-album USBs are a planned
distribution channel for Signal material; contents are undecided.
