# Sevarchky // Structural Architecture Specification: Extreme Overengineering Upgrade
**Target Benchmark**: Awwwards Site of the Year / FWA of the Day  
**Runtime**: Standalone Next.js 16.3.8 + React 19.2.8 + Three.js 0.186.1 + Tailwind CSS v4  
**Clearance**: OMEGA // Absolute Privacy (Zero Personal Identity Leakage)

---

## 1. System Philosophy: The Paradox of Controlled Chaos

The primary failure mode of hyper-complex 3D web experiences is uncontrolled draw call explosion, continuous CPU-GPU bus bandwidth bottlenecks, and mobile thermal throttling.

To achieve visual extremity while maintaining a constant **60–120 FPS on mobile TBDR (Tile-Based Deferred Rendering) GPUs**:
1. **Strict Dual-Layer Decoupling**: The 3D WebGL Canvas never renders typography or interactive DOM controls; the HTML DOM never recalculates 3D transforms.
2. **GPU Vertex Pipe Primacy**: Compute heavy physics (35k particle flowfield, orbital trajectories, vertex ripples, curl noise) directly in GLSL vertex shaders. The CPU transmits zero dynamic geometry buffers per frame.
3. **Batched Celestial Bodies**: The entire 7-sphere persona system is consolidated into a **single `THREE.InstancedMesh` (1 draw call)** rather than 7 independent meshes.
4. **Zero Garbage Collection in Render Loop**: Audio FFT binning, telemetry updates, and vector transforms reuse pre-allocated scratch vectors and typed arrays.

---

## 2. Global Module Architecture & File Tree

```
sevarchky.my.id/
├── ARCHITECTURE.md                  # This structural architecture specification
├── app/
│   ├── globals.css                  # Tailored frosted glass backdrop filters & font tokens
│   ├── layout.tsx                   # Root metadata, fonts (Geist, Syne), viewport config
│   └── page.tsx                     # Top-level page wiring DOM layers to 3D Canvas
├── components/
│   ├── PortfolioCanvas.tsx          # Canvas lifecycle manager, mount/unmount & resize
│   ├── TacticalDock.tsx             # Floating dock: persona cycle, ripple, codex, audio
│   ├── TacticalHeader.tsx           # Editorial stream hero header & navigation links
│   ├── ShowcaseDeck.tsx             # Editorial mission stream cards
│   ├── MissionModal.tsx             # Mission dossier with 3D Holographic Schematic toggle
│   ├── TerminalModal.tsx            # ⌘K interactive tactical command terminal
│   ├── TelemetryFeed.tsx            # Live telemetry badges (FPS, particles, coordinates, tier)
│   └── HolographicInspector.tsx     # Spatial HUD overlays during 3D exploded view
├── lib/
│   ├── engine.ts                    # PortfolioEngine coordinator (scene, loop, camera)
│   ├── audio.ts                     # EtherealAudioEngine + AnalyserNode + AudioAnalyzerBridge
│   ├── shaders/
│   │   ├── simplex.glsl.ts          # Simplex 3D noise & analytic 3D curl noise chunks
│   │   ├── celestial.glsl.ts        # Instanced 7-Spheres celestial multi-archetype shader
│   │   ├── particles.glsl.ts        # 35k Curl-noise magnetic vortex & shockwave shader
│   │   └── holographic.glsl.ts      # Exploded schematic wireframe & data conduit shaders
│   ├── celestial/
│   │   ├── CelestialSystem.ts       # InstancedMesh(7) celestial body manager & orbital physics
│   │   ├── personaCatalog.ts        # 7 Persona definitions (Froerybell, ThearinaZs, Sevarchky...)
│   │   └── orbitalPhysics.ts        # Keplerian orbital position & focus lerp solver
│   ├── particles/
│   │   └── ParticleFlowfield.ts     # 35k GPU particle buffer & uniform controller
│   ├── holographic/
│   │   ├── HolographicExploder.ts   # Exploded schematic assembly & bezier data conduits
│   │   └── missionBlueprints.ts     # Subsystem hierarchy & exploded node coordinates per mission
│   ├── audio/
│   │   └── AudioBridge.ts           # Zero-coupling AnalyserNode bridge & FFT smoothing
│   ├── missions.ts                  # Flagship missions data & architecture blueprints
│   ├── performance.ts               # Hardware tiering (Tier 1-3), DPR limits, palettes
│   ├── state/
│   │   ├── portfolioState.ts        # Lightweight reactive state store (zero-dep pub/sub)
│   │   └── events.ts                # Typed event bus (warp, selectPersona, explodeMission)
│   └── terminal.ts                  # Command processor & autocomplete
└── tests/
    ├── portfolio.test.ts            # Core missions, privacy, and performance tests
    ├── celestial.test.ts            # Persona catalog & orbital mechanics invariants
    └── audio-bridge.test.ts         # Audio analyser FFT binning & smoothing unit tests
```

---

## 3. Pillar 1: The 7 Spheres Celestial System

### 3.1 Persona Catalog
The system coordinates 7 celestial bodies orbiting a central focal node:
1. **Froerybell** (Amorphous Surreal Organic Dreamscape): Pearlescent thin-film, soft continuous simplex morphing, crystal bowl resonance (`#D8B4FE` / `#818CF8`).
2. **ThearinaZs** (Autonomous Multi-Agent Nexus & Swarm Hivemind): Hyper-faceted icosahedron with neon pulse core and quantum lattice (`#00FF66` / `#38BDF8`).
3. **Sevarchky** (Monolithic Liquid Chromium & Cyber-Brutalist Void): Molten chrome mirror with high metalness (0.95), sharp directional specular, cyan rim fresnel (`#00F0FF` / `#08080A`).
4. **Loafinest** (Warm Cozy Lofi Amber / Velvet Hearth): Volumetric nebula orb, internal particulate suspension, soft warmth (`#FDBA74` / `#FB7185`).
5. **Aura Alpha (Unrevealed 01)** - *Quantum Singularity*: Event horizon accretion disk, inverted dark obsidian core with gravitationally lensed caustic halo (`#6366F1` / `#EC4899`).
6. **Aura Beta (Unrevealed 02)** - *Temporal Chrono-Prism*: Geometric prism refractions, spectral dispersion, shifting angular facets (`#E2E8F0` / `#3B82F6`).
7. **Aura Gamma (Unrevealed 03)** - *Neural Hyper-Weave*: Synaptic point cloud lattice with pulsing electrical discharge arcs (`#10B981` / `#8B5CF6`).

### 3.2 Draw Call Consolidation: Single `THREE.InstancedMesh`
- Instead of 7 meshes with separate draw calls, all 7 celestial spheres share **one base geometry** (`THREE.IcosahedronGeometry(1.0, subdivisions)`) and **one master shader material**.
- **Draw Call Count**: Exactly **1 draw call** for all 7 celestial bodies.
- A secondary `THREE.InstancedMesh` of thin torus geometry renders all 7 orbital trajectory rings in **1 draw call**.
- Total draw calls for the entire celestial system: **2 draw calls**.

### 3.3 Instance Attributes Specification
Attached to `InstancedBufferGeometry`:
| Attribute | Type | Component Size | Description |
|---|---|---|---|
| `instanceMatrix` | `mat4` | 16 floats | Orbital position, rotation, and dynamic scale |
| `aPersonaId` | `float` | 1 float | Index (0.0 to 6.0) for shader branching/archetypes |
| `aPrimaryColor` | `vec3` | 3 floats | Base/Fresnel primary chromatic anchor |
| `aSecondaryColor` | `vec3` | 3 floats | Secondary chromatic dispersion color |
| `aPersonaParams` | `vec4` | 4 floats | `x`: noise density, `y`: noise amplitude, `z`: metalness, `w`: unlocked state |
| `aFocusProgress` | `float` | 1 float | Interpolation factor (0.0 = in orbit, 1.0 = focused stage view) |

### 3.4 Orbital Mechanics & Camera Focus Rig
- **Orbit Equations**:
  $$\vec{P}_i(t) = \begin{bmatrix} R_i \cos(\omega_i t + \phi_i) \\ R_i \sin(\omega_i t + \phi_i) \sin(\theta_i) \\ R_i \sin(\omega_i t + \phi_i) \cos(\theta_i) \end{bmatrix}$$
- When a persona is selected (via click, dock, or terminal command):
  - Target sphere instance matrix smoothly interpolates toward the focal stage anchor: `(3.0, 0.0, 0.0)` with scale `2.4`.
  - Non-focused spheres scale down to `0.45` and widen their orbits, preserving clear visual hierarchy.
  - Camera glides along a smooth Bezier spline to frame the active persona.

---

## 4. Pillar 2: Web Audio FFT Uniforms Bridge

### 4.1 Zero-Coupling Architecture
`lib/audio.ts` (audio synthesis) and `lib/engine.ts` (WebGL render loop) are strictly decoupled via the `IAudioAnalyzerProvider` interface.

```
┌────────────────────────────────────────────────────────┐
│                   Web Audio Thread                     │
│  [Oscillators / Bowls / Chimes]                       │
│                       │                                │
│                       ▼                                │
│             [Master Gain Node]                         │
│                       │                                │
│                       ▼                                │
│             [AnalyserNode (fftSize: 256)]              │
│                       │                                │
│                       ▼                                │
│             [audioContext.destination]                 │
└───────────────────────┬────────────────────────────────┘
                        │
                        │ getByteFrequencyData()
                        ▼
┌────────────────────────────────────────────────────────┐
│             AudioBridge (lib/audio/AudioBridge.ts)     │
│  • Bins: Low [20-250Hz], Mid [250-4kHz], High [4k-16k] │
│  • Attack/Decay exponential smoothing filter           │
│  • Zero-allocation in-place mutation of AudioBands     │
│  • Synthetic ambient fallback when suspended/muted     │
└───────────────────────┬────────────────────────────────┘
                        │ AudioBands snapshot
                        ▼
┌────────────────────────────────────────────────────────┐
│          PortfolioEngine Render Loop (lib/engine.ts)   │
│  • Reads audioProvider.getAudioBands(scratchBands)     │
│  • Smooth uniform interpolation (lerp factor 0.15)     │
│  • uAudioLow:   Sphere core displacement & sub-bass    │
│  • uAudioMid:   Chromatic phase shift & wave speed     │
│  • uAudioHigh:  Spore point sizes & sparkle transients │
└────────────────────────────────────────────────────────┘
```

### 4.2 FFT Band Definitions
Sampling Rate: 44.1 kHz or 48.0 kHz. `fftSize = 256` gives 128 frequency bins with resolution $\Delta f \approx 172.2\text{ Hz}$ per bin.
1. **Low Band (20 Hz - 250 Hz)**: Bins 0–2. Drives physical core displacement, bass pulsation, and gravitational breathing.
2. **Mid Band (250 Hz - 4,000 Hz)**: Bins 3–23. Drives melodic crystal singing bowl resonance, surface wave frequency, and chromatic iridescence.
3. **High Band (4,000 Hz - 16,000 Hz)**: Bins 24–93. Drives chime transients, spore particle sparkle size, and specular glints.
4. **Energy**: Root Mean Square (RMS) amplitude across all active bins.

### 4.3 Zero-Allocation Implementation Pattern
```ts
export interface AudioBands {
  low: number;    // 0.0 - 1.0
  mid: number;    // 0.0 - 1.0
  high: number;   // 0.0 - 1.0
  energy: number; // 0.0 - 1.0
}

export interface IAudioAnalyzerProvider {
  getAudioBands(target?: AudioBands): AudioBands;
  isAvailable(): boolean;
}
```
The render loop passes a persistent `scratchBands` object into `getAudioBands(scratchBands)`, generating **0 heap allocations per second**.

---

## 5. Pillar 3: 3D GPU Curl Noise Flowfield (35k+ Particles)

### 5.1 Mathematical Foundation: Divergence-Free Fluid Motion
Standard 3D simplex noise produces vector fields with non-zero divergence ($\nabla \cdot \vec{v} \neq 0$), causing particles to compress into dense filaments or collapse into point singularities.

**Curl Noise** computes the rotational field of a 3D vector potential field $\vec{\psi}(x, y, z)$:
$$\vec{v} = \nabla \times \vec{\psi} = \left( \frac{\partial \psi_z}{\partial y} - \frac{\partial \psi_y}{\partial z},\; \frac{\partial \psi_x}{\partial z} - \frac{\partial \psi_z}{\partial x},\; \frac{\partial \psi_y}{\partial x} - \frac{\partial \psi_x}{\partial y} \right)$$
Because $\nabla \cdot (\nabla \times \vec{\psi}) = 0$ identically, Curl Noise is **divergence-free (incompressible)**. Particles drift in infinite, fluid, turbulent streamlines without clumping.

### 5.2 GLSL Analytic Curl Noise Vertex Chunk
```glsl
// GLSL finite difference curl operator
vec3 computeCurl(vec3 p) {
  const float e = 0.001;
  float n1 = snoise(vec3(p.x, p.y + e, p.z));
  float n2 = snoise(vec3(p.x, p.y - e, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + e));
  float n4 = snoise(vec3(p.x, p.y, p.z - e));
  float n5 = snoise(vec3(p.x + e, p.y, p.z));
  float n6 = snoise(vec3(p.x - e, p.y, p.z));

  float x = (n1 - n2) - (n3 - n4);
  float y = (n3 - n4) - (n5 - n6);
  float z = (n5 - n6) - (n1 - n2);

  return normalize(vec3(x, y, z) / (2.0 * e));
}
```

### 5.3 Physical Pointer Forces
1. **Pointer Magnetic Vortex**:
   - Radial component: Repels particles inside influence radius $R_{\text{vortex}} = 5.0$.
   - Tangential component: Induces angular momentum (swirling whirlpool around pointer):
     $$\vec{F}_{\text{swirl}} = \left( -\hat{r}_y, \hat{r}_x, 0 \right) \cdot \frac{k_{\text{vortex}}}{d + 0.5}$$
2. **Shockwave Impulse Wavefront**:
   - Propagating compression wave triggered on click / `/warp`:
     $$W(r, t) = \exp\left( -\frac{(r - v_{\text{wave}} t)^2}{2 \sigma^2} \right) \cdot \exp(-\alpha t) \cdot I_{\text{ripple}}$$
3. **Audio Coupling**:
   - Particle point size modulated by `uAudioHigh`:
     $$\text{size} = a_{\text{scale}} \cdot \left( \frac{24.0}{-z_{\text{view}}} \right) \cdot (1.0 + 0.8 \cdot u_{\text{audioHigh}})$$

### 5.4 Anti-Lag & TBDR Optimization
- Particle counts scaled via Hardware Tiering:
  - **Tier 3 (Desktop)**: 35,000 particles
  - **Tier 2 (Tablet)**: 20,000 particles
  - **Tier 1 (Mobile)**: 10,000 particles
- **Zero Discard Fragment Shader**: Uses continuous cubic polynomial distance falloff:
  ```glsl
  float dist = length(gl_PointCoord - vec2(0.5));
  float intensity = clamp(0.5 - dist, 0.0, 1.0) * 2.0;
  intensity = intensity * intensity * intensity; // Smooth cubic falloff, zero discard
  gl_FragColor = vec4(vColor * (intensity * vAlpha), intensity * vAlpha);
  ```
  Preserves early-Z rejection on mobile GPUs (Apple Silicon, Mali, Adreno).

---

## 6. Pillar 4: Holographic 3D Architecture Mode

### 6.1 Interactive Schematic Transition
When a user opens any mission dossier (`OMS`, `KeyHub`, `Gateway`, `Mesh`):
1. **Camera Spline Re-orientation**: Camera glides smoothly from editorial reading position `(0, 0, 11)` to an isometric inspection angle `(5.5, 3.8, 7.2)` focused on the exploded architectural assembly.
2. **Concentric Disassembly**: The celestial monolith splits into **4 decoupled architectural subsystem nodes**:
   - **Node 01: Algorithmic Core** (In-memory heuristic / constraint solver) -> Stays at origin `(0, 0, 0)` with pulsing wireframe core.
   - **Node 02: Vector Memory & Ingestion Layer** (77-chunk Gemini vector store / SSE stream parser) -> Explodes upward to `(0, 2.2, 0)`.
   - **Node 03: Protocol Edge & Gateway** (FastAPI / SOCKS5 / Reverse proxy) -> Explodes to `(-2.6, -1.2, 0)`.
   - **Node 04: Manifest & Feedback Stream** (Zero-discrepancy dispatcher / KaTeX renderer) -> Explodes to `(2.6, -1.2, 0)`.
3. **Data Conduits**: 3D quadratic Bezier curves connect the nodes with pulsing energy dashes:
   - Dash animation driven by `fract(vUv.x * 6.0 - uTime * 2.5)`.
4. **Holographic Wireframe Shader**:
   - High-contrast wireframe edge detection combined with rim Fresnel glow.
   - Mission accent color dynamic binding (`OMS` = `#00F0FF`, `KeyHub` = `#00FF66`, `Gateway` = `#FF5500`, `Mesh` = `#B500FF`).

---

## 7. State Management & Event Bus Architecture

### 7.1 Decoupled Reactive Store Pattern
To prevent React re-render cascades from affecting the 60–120 FPS Three.js loop:
- **Visual state lives in Three.js objects & uniforms**.
- **Application state lives in a zero-dependency reactive micro-store**:

```ts
export type PersonaId = 'froerybell' | 'thearinazs' | 'sevarchky' | 'loafinest' | 'singularity' | 'prism' | 'hyperweave';

export interface PortfolioState {
  activePersonaId: PersonaId;
  activeMissionId: string | null;
  isHolographicMode: boolean;
  isTerminalOpen: boolean;
  isMuted: boolean;
  telemetry: {
    fps: number;
    particles: number;
    coords: string;
    tier: string;
  };
}
```

### 7.2 Typed Event Bus Contract
```ts
export type EngineEventMap = {
  'WARP_TRIGGERED': { origin?: THREE.Vector3; intensity: number };
  'PERSONA_SELECTED': { personaId: PersonaId };
  'MISSION_EXPLODED': { missionId: string };
  'MISSION_COLLAPSED': void;
  'PALETTE_CHANGED': { key: string; hex: string; secondaryHex: string };
  'AUDIO_TOGGLED': { muted: boolean };
};
```

---

## 8. TypeScript Interface Contracts

### 8.1 Celestial System Interfaces (`lib/celestial/types.ts`)
```ts
import * as THREE from 'three';

export interface PersonaDefinition {
  id: string;
  index: number;
  name: string;
  title: string;
  archetype: 'dreamscape' | 'cybernetic' | 'chromium' | 'volumetric' | 'singularity' | 'prism' | 'synapse';
  primaryColor: string;
  secondaryColor: string;
  orbitalRadius: number;
  orbitalSpeed: number;
  inclination: number;
  phaseOffset: number;
  noiseDensity: number;
  noiseStrength: number;
  metalness: number;
  audioReactivity: number;
  unlocked: boolean;
}

export interface ICelestialSystem {
  instancedMesh: THREE.InstancedMesh;
  orbitMesh: THREE.InstancedMesh;
  update(elapsed: number, delta: number, audioBands: AudioBands): void;
  focusPersona(personaId: string, duration?: number): void;
  getActivePersona(): PersonaDefinition;
  dispose(): void;
}
```

### 8.2 Audio Bridge Interfaces (`lib/audio/types.ts`)
```ts
export interface AudioBands {
  low: number;
  mid: number;
  high: number;
  energy: number;
}

export interface IAudioAnalyzerProvider {
  getAudioBands(target?: AudioBands): AudioBands;
  isAvailable(): boolean;
}
```

### 8.3 Particle System Interfaces (`lib/particles/types.ts`)
```ts
import * as THREE from 'three';

export interface ParticleFlowfieldConfig {
  count: number;
  bounds: THREE.Vector3;
  colorA: THREE.Color;
  colorB: THREE.Color;
}

export interface IParticleFlowfield {
  points: THREE.Points;
  update(elapsed: number, delta: number, pointerWorld: THREE.Vector3, audioBands: AudioBands): void;
  triggerShockwave(origin: THREE.Vector3, intensity: number): void;
  dispose(): void;
}
```

### 8.4 Holographic Mode Interfaces (`lib/holographic/types.ts`)
```ts
import * as THREE from 'three';

export interface ArchitecturalNode {
  id: string;
  name: string;
  description: string;
  offset: THREE.Vector3;
  geometryType: 'icosahedron' | 'box' | 'cylinder' | 'torus';
  scale: number;
}

export interface MissionArchitectureBlueprint {
  missionId: string;
  accentColor: string;
  nodes: ArchitecturalNode[];
  conduits: [string, string][]; // Pairs of Node IDs
}

export interface IHolographicExploder {
  group: THREE.Group;
  setExplodeProgress(progress: number): void;
  loadMission(blueprint: MissionArchitectureBlueprint): void;
  update(elapsed: number, delta: number): void;
  dispose(): void;
}
```

---

## 9. Implementation Roadmap & Milestones

1. **Phase 1: Zero-Coupling Audio Analyser Bridge**
   - Add `AnalyserNode` to `lib/audio.ts` with `getAudioBands(out)`.
   - Add unit tests verifying frequency bin thresholds and zero-allocation semantics.
2. **Phase 2: 35k GPU Curl Noise Flowfield**
   - Implement GLSL curl operator and pointer magnetic vortex.
   - Upgrade hardware tiering table to 35,000 particles on Desktop.
3. **Phase 3: 7 Spheres Celestial System**
   - Implement `InstancedMesh(7)` with per-instance attributes and multi-archetype GLSL shader.
   - Implement orbital mechanics and smooth focus transitions.
4. **Phase 4: Holographic 3D Architecture Mode**
   - Build exploded subsystem assembly and animated Bezier data conduits.
   - Hook mission modal toggle to camera spline and exploded mesh state.
5. **Phase 5: Verification & Benchmarking**
   - Measure 60–120 FPS on mobile TBDR simulators.
   - Verify draw calls remain $\le 5$ in all operational modes.
   - Enforce OMEGA privacy invariants (0 leaks).
