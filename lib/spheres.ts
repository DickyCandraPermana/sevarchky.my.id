// The 7 Spheres Archetype & Persona Mythology // OMEGA Clearance
// 01 Soul • 07 Spheres Cosmology

export interface SphereData {
  id: string;
  index: number;
  code: string;
  name: string;
  title: string;
  archetype: string;
  frequencyHz: number;
  solfeggioMeaning: string;
  orbitalRadius: number;
  inclinationDeg: number;
  orbitalSpeed: number; // rad/s
  clearance: 'OMEGA';
  materialArchetype: string;
  telemetrySignature: string;
}

export const SPHERES: SphereData[] = [
  {
    id: 'froerybell',
    index: 1,
    code: 'SPHERE-01',
    name: 'Froerybell',
    title: 'The Ethereal Dreamscape',
    archetype: 'Surreal Organic Fluid & Bioluminescent Viscosity',
    frequencyHz: 432,
    solfeggioMeaning: 'Cosmic Grounding & Harmonic DNA Alignment',
    orbitalRadius: 0.0, // Singularity Center
    inclinationDeg: 0,
    orbitalSpeed: 0.0,
    clearance: 'OMEGA',
    materialArchetype: 'Amorphous Thin-Film Iridescent Glass with Simplex Noise Morphing',
    telemetrySignature: 'VISCOSITY: 0.88 // OSC: 432Hz // HARMONIC'
  },
  {
    id: 'thearinazs',
    index: 2,
    code: 'SPHERE-02',
    name: 'ThearinaZs',
    title: 'The Neural Nexus',
    archetype: 'Multi-Agent Supervisor & StreamParser Cockpit',
    frequencyHz: 528,
    solfeggioMeaning: 'Transformation, Miracles & Mathematical Stream Synthesis',
    orbitalRadius: 4.2,
    inclinationDeg: 15.0,
    orbitalSpeed: 0.85,
    clearance: 'OMEGA',
    materialArchetype: 'Crystalline Geometric Ast-Lattice with KaTeX Delimiter Shaders',
    telemetrySignature: 'AGENTS: 10 ACTIVE // SSE: 18ms // BALANCED'
  },
  {
    id: 'sevarchky',
    index: 3,
    code: 'SPHERE-03',
    name: 'Sevarchky',
    title: 'The Cyber-Brutalist Monarch',
    archetype: 'High-Performance 120FPS Monolithic Hardware Sentry',
    frequencyHz: 639,
    solfeggioMeaning: 'System Interconnectivity & Resilient Mesh Cohesion',
    orbitalRadius: 6.8,
    inclinationDeg: -22.0,
    orbitalSpeed: 0.62,
    clearance: 'OMEGA',
    materialArchetype: 'Liquid Chromium Molten Metal with 1px Tactical Wireframe Borders',
    telemetrySignature: 'RENDER: 60FPS // CHROME_DISP: 1.4 // OPTIMAL'
  },
  {
    id: 'loafinest',
    index: 4,
    code: 'SPHERE-04',
    name: 'Loafinest',
    title: 'The Zen Sloth',
    archetype: 'Low-Entropy Inertial Damping & Thermal Dissipation',
    frequencyHz: 174,
    solfeggioMeaning: 'Natural Equilibrium, Grounding & Thermal Quiescence',
    orbitalRadius: 9.4,
    inclinationDeg: 8.0,
    orbitalSpeed: 0.35,
    clearance: 'OMEGA',
    materialArchetype: 'Ultra-Soft Translucent Aerogel with Lazy-Load Physics Suspension',
    telemetrySignature: 'ENTROPY: 0.02 // DAMPING: 0.95 // ZEN_STABLE'
  },
  {
    id: 'aethelgard',
    index: 5,
    code: 'SPHERE-05',
    name: 'Aethelgard',
    title: 'The Cryptographic Citadel',
    archetype: 'Zero-Knowledge Sentry & Automated DLP Sanitizer',
    frequencyHz: 741,
    solfeggioMeaning: 'Awakening Intuition, Cleansing Leaks & Pure Anonymity',
    orbitalRadius: 12.1,
    inclinationDeg: 38.0,
    orbitalSpeed: 0.28,
    clearance: 'OMEGA',
    materialArchetype: 'Encrypted Quantum Wireframe Cage with Zero-Leak Projection',
    telemetrySignature: 'DLP: 100% CLEAN // LEAK_RISK: ZERO // OMEGA'
  },
  {
    id: 'morphius',
    index: 6,
    code: 'SPHERE-06',
    name: 'Morphius-V',
    title: 'The Kinetic Swarm',
    archetype: '50k GPU Particle Swarm & Divergence-Free Curl Field',
    frequencyHz: 852,
    solfeggioMeaning: 'Spiritual Order & High-Dimensional Vector Turbulence',
    orbitalRadius: 15.0,
    inclinationDeg: -45.0,
    orbitalSpeed: 0.20,
    clearance: 'OMEGA',
    materialArchetype: 'Instanced Point Field with Magnetic Cursor Repulsion & Branchless Falloff',
    telemetrySignature: 'PARTICLES: 50,000 // CURL: DIVERGENCE_FREE'
  },
  {
    id: 'astralnox',
    index: 7,
    code: 'SPHERE-07',
    name: 'Astralnox',
    title: 'The Void Singularity',
    archetype: 'Gravitational Warp Singularity & Spline Horizon Rig',
    frequencyHz: 963,
    solfeggioMeaning: 'Crown Transcendence & Cosmic Dimensional Unification',
    orbitalRadius: 18.5,
    inclinationDeg: 60.0,
    orbitalSpeed: 0.12,
    clearance: 'OMEGA',
    materialArchetype: 'Event Horizon Gravitational Lensing with Black Hole Chromatic Aberration',
    telemetrySignature: 'WARP_POWER: 1.0 // SINGULARITY: COHERENT'
  }
];

export function getSphereById(idOrIndex: string | number): SphereData | undefined {
  if (typeof idOrIndex === 'number') {
    return SPHERES.find(s => s.index === idOrIndex);
  }
  const query = idOrIndex.toLowerCase().trim();
  const indexNum = parseInt(query, 10);
  if (!isNaN(indexNum)) {
    const foundByIndex = SPHERES.find(s => s.index === indexNum);
    if (foundByIndex) return foundByIndex;
  }
  return SPHERES.find(s =>
    s.id.toLowerCase() === query ||
    s.name.toLowerCase() === query ||
    s.code.toLowerCase() === query ||
    s.id.toLowerCase().includes(query)
  );
}

export interface SphereCoordinates {
  x: number;
  y: number;
  z: number;
}

/**
 * Calculates 3D orbital coordinates in world space at elapsed time t (seconds).
 * Applies inclination angle rotation around the X-axis for orbital tilt.
 */
export function calculateSphereCoordinates(sphere: SphereData, timeSeconds: number): SphereCoordinates {
  if (sphere.orbitalRadius === 0) {
    return { x: 0, y: 0, z: 0 };
  }

  const theta = sphere.orbitalSpeed * timeSeconds;
  const inclinationRad = (sphere.inclinationDeg * Math.PI) / 180;

  // Unrotated planar orbit in XZ
  const rawX = sphere.orbitalRadius * Math.cos(theta);
  const rawZ = sphere.orbitalRadius * Math.sin(theta);

  // Apply orbital tilt around X-axis:
  // y = -rawZ * sin(inclinationRad)
  // z =  rawZ * cos(inclinationRad)
  const x = Math.abs(rawX) < 1e-12 ? 0 : rawX;
  const rawY = -rawZ * Math.sin(inclinationRad);
  const y = Math.abs(rawY) < 1e-12 ? 0 : rawY;
  const rawZFinal = rawZ * Math.cos(inclinationRad);
  const z = Math.abs(rawZFinal) < 1e-12 ? 0 : rawZFinal;

  return { x, y, z };
}

/**
 * Validates that all spheres maintain non-colliding orbital shells.
 * Returns true if minimum radial clearance between adjacent shells is >= 2.0 units.
 */
export function checkOrbitalSeparation(spheres: SphereData[] = SPHERES): boolean {
  const sorted = [...spheres].sort((a, b) => a.orbitalRadius - b.orbitalRadius);
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = sorted[i + 1].orbitalRadius - sorted[i].orbitalRadius;
    if (gap < 2.0) {
      return false;
    }
  }
  return true;
}
