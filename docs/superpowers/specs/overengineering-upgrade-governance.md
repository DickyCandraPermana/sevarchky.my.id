# Sovereign Sentry Governance Charter // OMEGA Architecture Specification
**Sub-agent Mandate:** The Sovereign Sentry (Governance, OMEGA Privacy & Test Matrix Specification)  
**Classification:** OMEGA CLEARANCE LEVEL 0 // STRICT ANONYMITY  
**Target Repository:** `/opt/data/sevarchky.my.id`  
**Grade Target:** Awwwards Site of the Year / FWA of the Month Tier Overengineering  
**Status:** RATIFIED & PASSING (16/16 Automated Tests Verified)

---

## 1. Executive Summary & Governance Charter

This specification establishes the architectural governance, automated quality gates, narrative cosmological cohesion, and zero-leakage security protocols for the **Extreme Overengineering Upgrade** of `sevarchky.my.id`.

### Core Architectural Pillars
1. **Persona & Narrative Cosmology (01 Soul • 07 Spheres):** Every visual shader, Web Audio harmonic frequency, terminal directive, and telemetry feed binds directly to one of the 7 archetypes: *Froerybell, ThearinaZs, Sevarchky, Loafinest, Aethelgard, Morphius-V, and Astralnox*.
2. **Divergence-Free Spatial Fluid Dynamics:** Particle turbulence is mathematically governed by analytical and numerical curl noise $\mathbf{v} = \nabla \times \mathbf{\Psi}$, guaranteeing an incompressible, divergence-free kinetic swarm ($\nabla \cdot \mathbf{v} \equiv 0$) with bounded velocity envelopes.
3. **Harmonic Web Audio Procedural Synthesis:** Elimination of all static, pre-recorded audio assets in favor of pure real-time Web Audio API crystal bowl oscillators, dual-chorus detuning (`f * 1.503`), pentatonic arpeggios, and FFT frequency analyzer feedback loops.
4. **OMEGA Zero Real Identity Leakage (DLP Security Engine):** Automated, deterministic screening across source code, mission dossiers, shader comments, UI typography, and telemetry nodes to prevent any real-world personal identification, institutional markers, or unmasked communication vectors.
5. **Deterministic Quality Gates (TDD):** Uncompromising quality gates enforcing 100% test pass rates across `TC-ENG-01` to `TC-ENG-08` (along with `TC-PORT-01..05` and `TC-CELEST-01..03`), zero TypeScript compiler errors, zero ESLint warnings, and static SSG build compilation.

---

## 2. The 7-Persona Cosmology & Narrative Integrity Matrix

The portfolio interface is governed by the 7 Spheres Archetype. All visual assets, telemetry signatures, audio harmonics, and terminal commands must strictly conform to this matrix:

| Sphere Index | Codename | Archetype & Persona Role | Domain & Shader Material | Solfeggio / Harmonic Freq | Orbital Radius ($R$) | Orbital Tilt ($\theta$) | Telemetry Signature |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SPHERE-01** | `froerybell` | **The Ethereal Dreamscape** | Amorphous Thin-Film Iridescent Glass; Simplex Viscosity Morphing | **432 Hz** (Cosmic Grounding) | 0.0 u (Center) | 0.0° | `VISCOSITY: 0.88 // OSC: 432Hz // HARMONIC` |
| **SPHERE-02** | `thearinazs` | **The Neural Nexus** | Multi-Agent Supervisor; Crystalline Ast-Lattice & KaTeX Delimiters | **528 Hz** (Miracles & Transformation) | 4.2 u | +15.0° | `AGENTS: 10 ACTIVE // SSE: 18ms // BALANCED` |
| **SPHERE-03** | `sevarchky` | **The Cyber-Brutalist Monarch** | 120 FPS Flight Sentry; Molten Liquid Chromium & 1px Tactical Wireframe | **639 Hz** (Harmonic Interconnectivity) | 6.8 u | -22.0° | `RENDER: 60FPS // CHROME_DISP: 1.4 // OPTIMAL` |
| **SPHERE-04** | `loafinest` | **The Zen Sloth** | Low-Entropy Inertial Damping; Ultra-Soft Translucent Aerogel | **174 Hz** (Natural Foundation) | 9.4 u | +8.0° | `ENTROPY: 0.02 // DAMPING: 0.95 // ZEN_STABLE` |
| **SPHERE-05** | `aethelgard` | **The Cryptographic Citadel** | Zero-Knowledge Sentry & Automated DLP Sanitizer; Quantum Wireframe Cage | **741 Hz** (Awakening & Cleansing) | 12.1 u | +38.0° | `DLP: 100% CLEAN // LEAK_RISK: ZERO // OMEGA` |
| **SPHERE-06** | `morphius` | **The Kinetic Swarm** | 50,000 GPU Particles; Divergence-Free Curl Field & Branchless Falloffs | **852 Hz** (Spiritual High-Order Flow) | 15.0 u | -45.0° | `PARTICLES: 50,000 // CURL: DIVERGENCE_FREE` |
| **SPHERE-07** | `astralnox` | **The Void Singularity** | Gravitational Lensing & Spline Horizon Rig; Black Hole Distortion | **963 Hz** (Crown Transcendence) | 18.5 u | +60.0° | `WARP_POWER: 1.0 // SINGULARITY: COHERENT` |

### Celestial Invariants
- **Non-Colliding Orbital Shell Invariant:** Radial distance $\Delta R = R_{i+1} - R_i \ge 2.0$ units across all adjacent spheres.
- **Orbital Coordinate Formula:**
  $$\begin{aligned}
  x(t) &= R \cos(\omega t) \\
  y(t) &= -R \sin(\omega t) \sin(\theta_{\text{inc}}) \\
  z(t) &= R \sin(\omega t) \cos(\theta_{\text{inc}})
  \end{aligned}$$
- **Harmonic Solfeggio Rule:** Only procedural sine waves or dual-detuned crystal bowl oscillators are permitted for user interactions and ambient drones.

---

## 3. Terminal Directive Expansion Specification

The command-line interface provides real-time bidirectional control between the tactical UI and the 3D WebGL / Web Audio runtime engines. Commands are accepted with or without leading `/`.

### Command Grammar & Directive AST

```
<directive>       ::= <command> [ <arguments> ] [ <flags> ]
<command>         ::= "help" | "/help" | "telemetry" | "/telemetry" | "mission" | "/mission"
                    | "orbit" | "/orbit" | "freq" | "/freq" | "warp" | "/warp"
                    | "matrix" | "/matrix" | "benchmark" | "/benchmark" | "dlp:audit" | "/dlp:audit"
                    | "palette" | "/palette" | "clear" | "/clear"
<flags>           ::= <flag> [ <flags> ]
<flag>            ::= "--lock" | "--radial" | "--singularity" | "--bowl" | "--stress" | "--deep"
                    | "--speed" <number> | "--duration" <number>
```

### Directive Detail Specifications

#### 1. `orbit <sphere> [--speed <n>] [--lock]`
- **Description:** Adjusts camera focal lock and orbital velocity on a target celestial sphere.
- **Parameters:**
  - `<sphere>`: `1-7` (index), `froerybell | thearinazs | sevarchky | loafinest | aethelgard | morphius | astralnox`, or `all`.
  - `--speed <n>`: Speed multiplier (range: `0.1` to `10.0`, default: `1.0`).
  - `--lock`: Locks camera spline focus directly to the target sphere's local frame.
- **Action Dispatched:** `{ type: 'SET_ORBIT', payload: { sphere: string, speed: number, lock: boolean } }`
- **Error Handling:** Returns syntax error with valid sphere catalog when an unmapped name or index is provided.

#### 2. `freq <hz> [--bowl]`
- **Description:** Retunes the procedural Web Audio oscillator in real time.
- **Parameters:**
  - `<hz>`: Frequency in Hertz (range: `20` to `20000`).
  - `--bowl`: Activates dual-chorus crystal singing bowl mode (`f` + `f * 1.503`).
- **Action Dispatched:** `{ type: 'SET_FREQ', payload: { hz: number, bowl: boolean } }`
- **Error Handling:** Rejects frequencies below 20 Hz or above 20,000 Hz with explicit parameter boundary warnings.

#### 3. `warp [power] [--radial | --singularity]`
- **Description:** Triggers a zero-G shockwave impulse displacing the particulate swarm and pulsing the camera FOV.
- **Parameters:**
  - `[power]`: Numerical shockwave magnitude (clamped between `0.1` and `5.0`, default: `1.25`).
  - `--radial`: Spherical expansion wavefront outward from pointer hit point.
  - `--singularity`: Inward gravitational collapse pulling particles toward origin before rebound.
- **Action Dispatched:** `{ type: 'TRIGGER_WARP', payload: { power: number, radial: boolean } }`

#### 4. `matrix [--spheres]`
- **Description:** Prints the complete 7-Sphere cosmological topology matrix with radius, inclination tilt, Solfeggio frequency, and real-time telemetry string.
- **Action Dispatched:** `{ type: 'DISPLAY_MATRIX', payload: { spheres: SphereData[] } }`

#### 5. `benchmark [--stress]`
- **Description:** Executes a 60-frame GPU performance profile measuring frame variance, TBDR draw-call counts, and mobile memory pressure.
- **Parameters:**
  - `--stress`: Increases active particle simulation budget to 50,000 nodes for high-end stress testing.
- **Action Dispatched:** `{ type: 'RUN_BENCHMARK', payload: { stress: boolean } }`

#### 6. `dlp:audit [--deep]`
- **Description:** Triggers an autonomous OMEGA Zero Real Identity Leakage scan over all mission records, sphere metadata, and runtime dictionaries.
- **Action Dispatched:** `{ type: 'RUN_DLP_AUDIT', payload: DLPAuditResult }`
- **Output:** Returns `OMEGA_CLEARED_ZERO_LEAK` or details precise token violations.

---

## 4. Automated Test Strategy (TDD) Matrix

The test matrix implements formal verification across the engineering lifecycle. All tests run natively via `node --experimental-strip-types --test tests/*.test.ts`.

```
========================================================================================================
TEST CASE IDENTIFIER | SUBSYSTEM VERIFIED       | INVARIANTS & ACCEPTANCE CRITERIA
========================================================================================================
TC-ENG-01            | Web Audio FFT Analyzer   | FFT size == 1024; frequencyBinCount == 512;
                     | & Procedural Synthesis   | smoothing == 0.85; Solfeggio presets verified;
                     |                          | Singing bowl dual-chorus beating: f * 1.503.
---------------------+--------------------------+-------------------------------------------------------
TC-ENG-02            | Curl Noise Vector Field  | Discrete curl: v = ∇ × Ψ;
                     | Math & Divergence-Free   | Incompressible fluid: ∇ · (∇ × Ψ) < 2e-3 everywhere;
                     | Invariant                | Bounded velocity: 0 < |v| < 10.0 (zero NaN/Infinity).
---------------------+--------------------------+-------------------------------------------------------
TC-ENG-03            | 7-Sphere Celestial       | Exactly 7 spheres defined with OMEGA clearance;
                     | Hierarchy & Orbit Math   | Orbital shell gap: ΔR >= 2.0u across all spheres;
                     |                          | Orbit coordinates: |p(t)| == R; tilt angle transforms.
---------------------+--------------------------+-------------------------------------------------------
TC-ENG-04            | Terminal Directive       | Full AST execution: orbit, freq, warp, matrix,
                     | Parser & AST Execution   | benchmark, dlp:audit; flag parsing (--lock, --bowl);
                     |                          | Boundary error rejection (freq > 20kHz).
---------------------+--------------------------+-------------------------------------------------------
TC-ENG-05            | OMEGA Zero Real Identity | Zero matches against banned patterns (real names,
                     | Leakage (DLP Engine)     | personal emails, Indonesian phones, student IDs,
                     |                          | local home paths); scan verification >= 11 entities.
---------------------+--------------------------+-------------------------------------------------------
TC-ENG-06            | Dynamic Hardware Tiering | Tier 0/1: mobile TBDR, maxDpr 1.0, 8k particles;
                     | & TBDR Mobile Budget     | Tier 2: tablet, maxDpr 1.25, 12k particles;
                     |                          | Tier 3: desktop, maxDpr 1.5, 16k-50k particles.
---------------------+--------------------------+-------------------------------------------------------
TC-ENG-07            | Mission Dossier Schema   | All missions hold OMEGA clearance; >= 3 verified
                     | & Architectural Prints   | metrics with subtext; ASCII architecture blueprint;
                     |                          | techStack >= 3; operationalChallenge & solution.
---------------------+--------------------------+-------------------------------------------------------
TC-ENG-08            | Three.js WebGL Resource  | Explicit disposal sequence: geometry.dispose(),
                     | Disposal & Leak Hygiene  | material.dispose(), scene.remove(); zero dangling
                     |                          | WebGL context handles or unreleased buffer memory.
========================================================================================================
```

---

## 5. Quality Gates & Enforcement Thresholds

Every proposed commit, pull request, and deployment must pass the five Sovereign Sentry Quality Gates:

```
[GATE 1: STATIC BUILD]       Next.js 16 SSG Static Build (`npm run build`) -> Exit Code 0, 100% Prerendered
[GATE 2: ZERO LINT ERRORS]   TypeScript Strict Type Check (`npm run lint` / `tsc --noEmit`) -> 0 Errors, 0 Warnings
[GATE 3: 100% TEST PASS]     Test Suite (`pnpm test` / `node --test`) -> 100% Pass Rate (16/16 Passed)
[GATE 4: BUNDLE SIZE LIMIT]  Initial Gzipped JS Bundle < 180 KB; Total First Load < 350 KB; Zero Uncompressed Audio
[GATE 5: OMEGA PRIVACY]      DLP Zero-Leak Verification (`dlp:audit`) -> 0 Violations (OMEGA_CLEARED_ZERO_LEAK)
```

### Performance Gate Thresholds
- **Target Frame Rate:** 60.0 FPS on mid-tier mobile (TBDR GPUs e.g. Apple A14 / Mali-G78), 120 FPS on high-refresh desktop monitors.
- **Frame Budget:** 16.67 ms maximum frame duration; 99th percentile frame drops < 1.0%.
- **Draw Call Ceiling:** $\le 12$ draw calls per frame via instanced buffer geometry (`THREE.InstancedMesh` / `THREE.Points`) and branchless fragment shaders.
- **Mobile Shader Rule:** Strict prohibition of the `discard` instruction in particle fragment shaders on mobile devices to prevent breaking Early-Z and tile buffer rendering optimizations.

---

## 6. OMEGA Privacy Verification Checklist & Security Policy

### Banned Identifier Regex Rules
1. **Real Names & Pseudonym Variations:**
   `/\b(dicky|candra|permana|dcandra)\b/i`
2. **Academic & Institutional Markers:**
   `/\b(Sebelas\s+Maret|Universitas\s+Sebelas\s+Maret|\bUNS\b)/i`
3. **Student Identification Numbers (NIM / NIP):**
   `/\b[A-Za-z]\d{7,9}\b/`
4. **Personal Email Addresses:**
   `/\b[a-zA-Z0-9._%+-]+@(?!thearinazs\.my\.id|sevarchky\.my\.id|froerybell\.my\.id|loafinest\.my\.id|example\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/i`
5. **Indonesian Mobile Phone Patterns:**
   `/(?:\+62|62|08)[1-9][0-9]{7,11}\b/`
6. **Local Developer Filesystem Leaks:**
   `/(?:\/Users\/[a-zA-Z0-9_-]+|\/home\/[a-zA-Z0-9_-]+)/`
7. **Cryptographic Private Key Headers:**
   `/-----BEGIN\s+[A-Z\s]*PRIVATE\s+KEY-----/`

### Automated Pre-Commit & Verification Workflow
- All code changes must be validated against `lib/dlp.ts` before staging.
- Telemetry feeds must report anonymous archetype identifiers only (e.g. `SV-07 MONARCH`, `OMEGA_CLEARED_ZERO_LEAK`).
- GitHub repository commits, commit author fields, and Git configurations must never reflect real identities.

---

## 7. Verification Audit Results (Current Baseline)

Execution of the full automated governance suite confirmed:

```bash
$ node --experimental-strip-types --test tests/*.test.ts
▶ Celestial 7-Spheres Persona Architecture Tests
  ✔ [TC-CELEST-01] Validates complete 7-Sphere persona registry & attributes (1.10ms)
  ✔ [TC-CELEST-02] OMEGA privacy audit on persona metadata (0.49ms)
  ✔ [TC-CELEST-03] Mathematical Keplerian orbital stability invariants (0.34ms)
✔ Celestial 7-Spheres Persona Architecture Tests (3.60ms)

▶ Sovereign Sentry // Overengineering Governance & Engineering Verification Matrix
  ✔ [TC-ENG-01] Validates Web Audio FFT analyzer node state and dual-chorus beating (1.81ms)
  ✔ [TC-ENG-02] Verifies curl noise vector field math integrity and divergence-free property (1.74ms)
  ✔ [TC-ENG-03] Validates 7-Sphere cosmology coordinates, orbital shells and non-collision invariant (0.75ms)
  ✔ [TC-ENG-04] Validates terminal directive expansion parser AST execution and flags (4.45ms)
  ✔ [TC-ENG-05] Enforces OMEGA Zero Real Identity Leakage across missions and spheres (0.95ms)
  ✔ [TC-ENG-06] Validates dynamic hardware tiering, DPR clamps and branchless particle budget (0.34ms)
  ✔ [TC-ENG-07] Verifies mission dossiers carry OMEGA clearance, KPIs and architectural blueprints (1.51ms)
  ✔ [TC-ENG-08] Validates Three.js WebGL memory lifecycle disposal and teardown hygiene (1.04ms)
✔ Sovereign Sentry // Overengineering Governance & Engineering Verification Matrix (15.11ms)

▶ Portfolio Core & Persona Tests
  ✔ [TC-PORT-01] Validates mission catalog completeness and schema integrity (1.06ms)
  ✔ [TC-PORT-02] Enforces absolute privacy: zero personal/real name leakage in mission data (0.46ms)
  ✔ [TC-PORT-03] Terminal CLI processor executes commands with deterministic outputs (18.12ms)
  ✔ [TC-PORT-04] Performance tier resolution assigns correct particle budgets & DPR limits (0.35ms)
  ✔ [TC-PORT-05] Pearlescent palette definition cycles predictably through chromatic anchors (0.19ms)
✔ Portfolio Core & Persona Tests (21.97ms)

Total Test Execution: 16 passing tests, 0 failures, 0 warnings (Duration: 574.9ms)
TypeScript Compiler: 0 errors (`tsc --noEmit`)
Next.js Production Build: Prerendered static pages (0 dynamic bailouts)
```

The system is certified **OMEGA-READY** for extreme overengineering execution.
