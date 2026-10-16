# Extreme Overengineering Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `sevarchky.my.id` into an Awwwards/FWA-grade spatial computing experience featuring the 7-Spheres celestial system, 35k GPU Curl-Noise particle flowfield, Web Audio FFT reactive uniforms bridge, holographic exploded 3D architecture, and tactical terminal directives while strictly maintaining 60–120 FPS performance and Zero Real Identity Leak.

**Architecture:** Pure Three.js 0.186.1 with InstancedMesh(7) celestial rendering (2 draw calls total), Vertex-computed divergence-free Curl Noise particle kinetics, zero-allocation AudioBands FFT uniform streaming, single-pass barycentric holographic wireframe, and decoupled DOM Cyber-Brutalist HUD.

**Tech Stack:** Next.js 16.3.8 (App Router, Turbopack), React 19.2.8, Three.js 0.186.1, Web Audio API, Tailwind CSS v4, Node.js Test Runner.

**Spec:** `docs/superpowers/specs/overengineering-upgrade-governance.md` and `ARCHITECTURE.md`

## Global Constraints
- **Zero Real Identity Leak:** Strictly no real names, personal emails, or contact info in any file, UI string, shader comment, test, or commit.
- **Pure Three.js 0.186.1:** Do not inject `@react-three/fiber`, `@react-three/drei`, or `@dimforge/rapier3d-compat`. Keep client bundle < 160 KB gzipped.
- **TBDR Mobile Optimization:** Zero `discard` in particle fragment shaders (use branchless cubic falloff), single-pass barycentric wireframes, and adaptive particle counts (5k mobile / 15k tablet / 35k desktop).
- **Web Audio Zero-Allocation:** FFT data passed to shaders via flat uniform array / vec4 `uAudioBands` without creating dynamic textures every frame.
- **Git Commit Author:** Must remain strictly `sevarchky <contact@sevarchky.my.id>`.

## Review Focus
1. **WebGL Context Loss:** Browser tab switching or mobile memory reclamation must cleanly pause RAF and rebuild scene on `webglcontextrestored` without uncaught errors.
2. **Audio Autoplay Policy:** AudioContext must initialize in suspended state and unlock seamlessly on first user interaction without throwing DOMException.
3. **Early-Z Preservation:** Particle rendering must use additive blending and branchless falloff to prevent TBDR GPU stalls.
4. **Keplerian Orbital Stability:** Orbital shells must maintain non-colliding invariant ($\Delta R \ge 2.0\text{u}$) across all animation frames.
5. **DLP Enforcement:** Terminal directives (`dlp:audit`, `matrix`, `help`) and telemetry must never output real personal information.

---

### Task 1: Advanced GLSL Shaders Upgrade (`lib/shaders.ts`)

**Files:**
- Modify: `lib/shaders.ts`
- Test: `tests/shaders.test.ts`

**Interfaces:**
- Consumes: `lib/spheres.ts` (SPHERES metadata and colors)
- Produces: `CelestialShader`, `CurlParticleShader`, `HolographicWireframeShader`, `ConduitShader`

- [ ] **Step 1: Write test for advanced shader definitions**

Create `tests/shaders.test.ts` verifying that `CelestialShader`, `CurlParticleShader`, `HolographicWireframeShader`, and `ConduitShader` export valid vertex and fragment shader strings with required uniform declarations (`uTime`, `uAudioBands`, `uWarpPower`, `uMouse`, `aBarycentric`).

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/shaders.test.ts`
Expected: FAIL (missing exports in `lib/shaders.ts`)

- [ ] **Step 3: Implement advanced shaders in `lib/shaders.ts`**

Implement:
1. `CelestialShader`: Support InstancedMesh attributes (`aPersonaId`, `aPrimaryColor`, `aSecondaryColor`, `aPersonaParams`, `aFocusProgress`), simplex noise surface displacement, and thin-film Fresnel iridescence.
2. `CurlParticleShader`: Vertex-computed 3D Curl Noise vector field ($\mathbf{v} = \nabla \times \mathbf{\Psi}$), pointer magnetic vortex, shockwave impulse shell ($W(r, t)$), and branchless cubic falloff without `discard`.
3. `HolographicWireframeShader`: Single-pass barycentric wireframe rendering (`aBarycentric`) with dynamic mission accent glint.
4. `ConduitShader`: 3D Bezier energy spline with moving telemetry pulse (`fract(vUv.x * 6.0 - uTime * 2.5)`).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --experimental-strip-types --test tests/shaders.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/shaders.ts tests/shaders.test.ts
git commit -m "feat(shaders): implement 7-spheres celestial, curl noise, and holographic wireframe shaders"
```

---

### Task 2: PortfolioEngine Overhaul (`lib/engine.ts`)

**Files:**
- Modify: `lib/engine.ts`
- Test: `tests/governance-engine.test.ts`

**Interfaces:**
- Consumes: `lib/shaders.ts`, `lib/spheres.ts`, `lib/audio.ts`, `lib/performance.ts`
- Produces: `PortfolioEngine` with methods `setFocusSphere(id)`, `triggerWarp(power, radial)`, `setExplodedMission(missionId)`, `handleResize()`, `dispose()`

- [ ] **Step 1: Write/verify engine integration test assertions**

Ensure `tests/governance-engine.test.ts` validates WebGL context loss recovery, resource disposal (`dispose()`), and particle budget scaling.

- [ ] **Step 2: Implement full overengineered engine in `lib/engine.ts`**

Implement:
1. `CelestialSystem`: InstancedMesh(7) for celestial bodies + InstancedMesh(7) for Keplerian orbit rings (2 draw calls total). Smooth camera and target lerp on sphere focus.
2. `ParticleFlowfield`: 35,000 GPU Curl-Noise particles (scaled by hardware tier) with magnetic mouse lerp and shockwave impulse propagation.
3. `AudioBridge`: Real-time extraction of FFT frequency bands (`uAudioBands`: `vec4(low, mid, high, energy)`) via `cyberAudio.getFrequencyBands()`.
4. `HolographicBlueprint`: Exploded schematic view when a mission is inspected with Bezier conduit lines.
5. Context loss recovery state machine (`webglcontextlost`, `webglcontextrestored`) and recursive scene disposal.

- [ ] **Step 3: Run test suite to verify passes**

Run: `node --experimental-strip-types --test tests/governance-engine.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add lib/engine.ts
git commit -m "feat(engine): orchestrate 7-spheres celestial system, curl noise swarm, and audio FFT uniforms"
```

---

### Task 3: Cyber-Brutalist HUD & Tactical Controls Integration

**Files:**
- Modify: `components/TacticalDock.tsx`
- Modify: `components/TacticalHeader.tsx`
- Modify: `components/TelemetryFeed.tsx`
- Modify: `components/MissionModal.tsx`
- Modify: `components/TerminalModal.tsx`
- Modify: `app/page.tsx`
- Test: `tests/portfolio.test.ts`

**Interfaces:**
- Consumes: `lib/engine.ts`, `lib/spheres.ts`, `lib/audio.ts`, `lib/terminal.ts`
- Produces: Interactive tactile UI for 7-Sphere focus, Solfeggio tuning, spectrum meter, and terminal commands.

- [ ] **Step 1: Update `TacticalDock.tsx`**

Add:
- 7-Sphere quick selector buttons (`1` to `7`) with persona accent glows.
- Solfeggio frequency tuner button cycling through 432Hz, 528Hz, 639Hz, 741Hz, 852Hz.
- Mini audio spectrum visualizer bar showing real-time audio FFT activity.
- Shockwave warp impulse trigger.

- [ ] **Step 2: Update `TacticalHeader.tsx` & `TelemetryFeed.tsx`**

Add:
- Display current active celestial sphere archetype and Solfeggio frequency.
- Live telemetry stats: Draw call counter ($\le 5$), particle count (35,000), TBDR status (`OPTIMAL`), and active audio bands.

- [ ] **Step 3: Update `MissionModal.tsx` & `TerminalModal.tsx`**

Add:
- 3D Blueprint Explode toggle when opening a mission dossier.
- Support for new terminal commands (`orbit`, `freq`, `warp`, `matrix`, `benchmark`, `dlp:audit`) with interactive engine dispatch.

- [ ] **Step 4: Wire state & keyboard shortcuts in `app/page.tsx`**

Add numeric keys `1`–`7` to immediately orbit/focus target celestial sphere, `W` for warp, `F` for frequency tuning, `⌘K` for terminal.

- [ ] **Step 5: Run tests & verify clean build**

Run: `node --experimental-strip-types --test tests/*.test.ts`
Run: `pnpm run build`
Expected: 100% test pass, clean Turbopack build without errors.

- [ ] **Step 6: Commit**

```bash
git add components/ app/
git commit -m "feat(ui): integrate 7-sphere dock selector, spectrum visualizer, and tactical directives"
```

---

### Task 4: Automated Governance, DLP Clearance & Local Validation

**Files:**
- Verify: all files in `/opt/data/sevarchky.my.id`
- Test: all unit tests

- [ ] **Step 1: Execute complete test suite**

Run: `node --experimental-strip-types --test tests/*.test.ts`
Expected: 17+ tests passing across 4 suites.

- [ ] **Step 2: Run OMEGA Zero Real Identity Leakage scan**

Run: `node --experimental-strip-types -e 'import { runFullDLPScan } from "./lib/dlp.ts"; const r = runFullDLPScan(); console.log(JSON.stringify(r, null, 2)); process.exit(r.violations.length);'`
Expected: `CLEARED_ZERO_LEAK`, 0 violations.

- [ ] **Step 3: Run production build verification**

Run: `pnpm run build`
Expected: Static generation completed successfully, bundle size < 160 KB gzipped.

- [ ] **Step 4: Audit git log and staging**

Verify commit authorship is strictly `sevarchky <contact@sevarchky.my.id>`.

---

### Task 5: Production Deployment & Live Verification

**Files:**
- Remote: `DickyCandraPermana/sevarchky.my.id` on GitHub
- Deployment: Vercel Production + Cloudflare DNS

- [ ] **Step 1: Push changes to GitHub repository**

Run: `git push origin main`

- [ ] **Step 2: Monitor Vercel production deployment**

Query Vercel REST API until deployment status is `READY`.

- [ ] **Step 3: Live HTTP/2 and Edge verification**

Verify `curl -s -I https://sevarchky.my.id` returns `HTTP/2 200 OK`.
Verify `curl -s -I https://www.sevarchky.my.id` returns `HTTP/2 308` redirecting to apex.

- [ ] **Step 4: Live DOM Zero Real Identity Leak Audit**

Scan live production HTML for personal names, emails, and credentials.
Expected: 0 matches, 100% anonymized.
