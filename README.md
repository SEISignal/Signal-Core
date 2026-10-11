# SIGNAL CORE

> **A Signal project • SEIHouse Productions LLC**
> *Your emergency information, packaged to live offline, with an assistant that answers from it.*

---

## What Signal Core is

Signal Core lets you collect the information you would need in an emergency —
your own documents, plus guides from trusted organizations — and packages it to
live fully offline on your device. When something happens, you ask questions in
plain language, and the AI already on your phone answers using **only your
package**, showing you where each answer came from. If your device has no AI,
you can still search and read everything.

No internet. No account. No one else holding your data.

It is a tool for emergencies. Nothing fancy. It should already exist.

---

## What Signal Core is not

- **Not a content publisher.** Signal Core does not write, curate, or host
  emergency guidance. Organizations whose job is that information — the Red
  Cross, FEMA / Ready.gov, WHO, CDC, local emergency management — already
  publish it. Signal Core links to them; the user downloads from the source.
- **Not an AI company.** Signal Core does not ship or train its own model as a
  requirement. It connects to the AI built into modern phones and treats the
  model as replaceable.
- **Not a service.** There are no servers holding user data. Everything is
  created, stored, and used on the user's own device.

---

## How it works

```
  1. GATHER                2. PACKAGE                 3. ASK
  ─────────                ──────────                 ─────
  Your documents     ──►   One SPP package     ──►    Phone's on-device AI
  Your family plan         (.spp file)                answers from the
  Your manuals             · every file kept          package only, and
  Trusted-source           · integrity checked        shows the source
  downloads                · readable text for AI     passage
                           · source + date noted
                                                      No AI available?
                                                      Search and read the
                                                      package directly.
```

### 1. Gather — bring your own information

The user brings what matters to them: medication lists, a family contact and
meeting-point plan, the manual for a generator or water filter, school or
workplace emergency procedures, notes, anything. Signal Core also offers a
short list of **links** to trusted organizations so the user can download
official guides themselves. Signal Core never rewrites or redistributes that
material.

### 2. Package — SPP

Signal packages are **SPP packages** (`.spp`, the SEIHouse Productions Package),
the shared container format used across SEIHouse — SEA, SEN, and Signal alike.
Signal Core does not define its own package format.

SPP already provides what an emergency package needs:

- **Original files kept byte for byte**, with a SHA-256 fingerprint for each, so
  a damaged USB, an interrupted copy, or an altered file is caught before anyone
  relies on it.
- **Readable text for AI**, derived alongside supported documents, so an
  on-device model can read the content.
- **Survives without the app.** An `.spp` is a standard ZIP: any unzip tool can
  open it and find ordinary files.
- **A sanctioned place for Signal-specific details.** Where a file came from and
  when it was downloaded are recorded in SPP's optional, namespaced metadata
  (planned key: `signal.source`), without changing the shared core.

### 3. Ask — the on-device assistant

Signal Core is the bridge between the package and whatever AI the device has:

1. **The device has built-in AI** (for example Apple's on-device Foundation
   Models on supported iPhones, or Gemini Nano on supported Android phones):
   Signal Core finds the most relevant passages in the package and hands them
   to that model.
2. **It does not:** an optional small downloadable model (1B–3B class) can be
   used instead.
3. **Neither works** (older phone, low battery): plain offline search and
   reading, which always works.

Every answer must come from the package and show the passage it used. When the
package does not cover a question, the assistant says so instead of guessing.

---

## Principles

- **Correct over fast.** In an emergency, a feature that only looks like it
  works is worse than a missing one. Nothing is presented as working until it
  works.
- **The user's data stays the user's.** Local only. Zero telemetry.
- **The format outlives the app.** Packages are plain, documented, durable files.
- **Always a fallback.** AI is a layer on top of the package, never a
  requirement to reach it.
- **Cheap to run, by design.** No servers and no cloud AI means cost does not
  grow with users. Signal is intended to be subsidized, not monetized.

---

## Signal inside SEIHouse

Signal is not separate from SEA (SEIHouse Expanded Albums) and SEN (SEIHouse
Expanded Novels). SEIHouse is a time capsule for artistic expression; Signal
applies the same idea to resilience — things that stay with people when
everything else stops working.

- **Shared format.** SEA, SEN, and Signal all use SPP. Improvements made for one
  benefit all of them.
- **Album distribution.** SEA expanded albums will ship on USB as well as
  online. Those USBs are planned to carry Signal material. *Exact contents are
  not decided.* Options under consideration: printable plan templates and a
  trusted-source sheet readable on any device; a blank Signal package to fill
  in; a copy of Signal Core runnable from the drive on a laptop; and a QR code
  or link to set up Signal ahead of time.

---

## Current state — honest status

The code in this repository is an **early prototype from before this direction
was settled**. It does not yet reflect the product described above:

| Area | Prototype today | Direction |
|---|---|---|
| Content | Hand-written knowledge packs in `lib/data.ts` | Removed; replaced by bring-your-own plus links to trusted sources |
| Package format | Ad-hoc `SIGNAL_CORE_FALLBACK_V1` JSON | SPP |
| QR export | Decorative pattern, not scannable | Removed until real |
| Bluetooth / peer sync | Scripted animation | Removed until real |
| Offline storage | Not implemented | Required |
| AI | None | On-device model via the phone, with search fallback |

Signal Core is a long-form project. No date is promised; correctness is.

---

## Roadmap

- [ ] **Phase 0 — Honest prototype.** Remove hand-written packs and simulated
      features (QR, Bluetooth). Label anything unfinished.
- [ ] **Phase 1 — SPP intake.** Open `.spp` packages; validate and show their
      contents; read and search fully offline.
- [ ] **Phase 2 — Build packages.** Add your own files; record source and date
      in `signal.source` metadata; trusted-source link list.
- [ ] **Phase 3 — Offline persistence.** Installable app, packages stored on device.
- [ ] **Phase 4 — Retrieval.** Find the right passages for a question, with
      citations, entirely on device.
- [ ] **Phase 5 — On-device AI.** Native app shell connecting to the phone's
      built-in model; optional downloadable small model; search fallback.

Dependencies on SPP (tracked in `SEIHouse/SEIHouse-Package`): readable text
for PDF documents, which most official emergency guides use.

---

## Development

Prerequisites: Node.js 20+.

```bash
npm install
npm run dev     # development server
npm test        # unit tests
npm run build   # production build
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the architecture.

---

*Signal Core — a Signal project by SEIHouse Productions LLC.*
