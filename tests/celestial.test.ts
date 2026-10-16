import { describe, it } from 'node:test';
import assert from 'node:assert';

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
  unlocked: boolean;
}

export const PERSONA_CATALOG: PersonaDefinition[] = [
  {
    id: 'froerybell',
    index: 0,
    name: 'Froerybell',
    title: 'Surreal Organic Dreamscape',
    archetype: 'dreamscape',
    primaryColor: '#D8B4FE',
    secondaryColor: '#818CF8',
    orbitalRadius: 3.2,
    orbitalSpeed: 0.28,
    inclination: 0.12,
    unlocked: true
  },
  {
    id: 'thearinazs',
    index: 1,
    name: 'ThearinaZs',
    title: 'Autonomous Multi-Agent Nexus',
    archetype: 'cybernetic',
    primaryColor: '#00FF66',
    secondaryColor: '#38BDF8',
    orbitalRadius: 4.5,
    orbitalSpeed: 0.20,
    inclination: 0.35,
    unlocked: true
  },
  {
    id: 'sevarchky',
    index: 2,
    name: 'Sevarchky',
    title: 'Liquid Chromium Void Core',
    archetype: 'chromium',
    primaryColor: '#00F0FF',
    secondaryColor: '#08080A',
    orbitalRadius: 5.8,
    orbitalSpeed: 0.14,
    inclination: -0.25,
    unlocked: true
  },
  {
    id: 'loafinest',
    index: 3,
    name: 'Loafinest',
    title: 'Cozy Lofi Amber Volumetric Orb',
    archetype: 'volumetric',
    primaryColor: '#FDBA74',
    secondaryColor: '#FB7185',
    orbitalRadius: 7.0,
    orbitalSpeed: 0.095,
    inclination: 0.18,
    unlocked: true
  },
  {
    id: 'singularity',
    index: 4,
    name: 'Aura Alpha [Singularity]',
    title: 'Gravitational Event Horizon',
    archetype: 'singularity',
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
    orbitalRadius: 8.2,
    orbitalSpeed: 0.065,
    inclination: -0.42,
    unlocked: false
  },
  {
    id: 'prism',
    index: 5,
    name: 'Aura Beta [Chrono-Prism]',
    title: 'Temporal Geometric Dispersion',
    archetype: 'prism',
    primaryColor: '#E2E8F0',
    secondaryColor: '#3B82F6',
    orbitalRadius: 9.4,
    orbitalSpeed: 0.045,
    inclination: 0.55,
    unlocked: false
  },
  {
    id: 'hyperweave',
    index: 6,
    name: 'Aura Gamma [Hyper-Weave]',
    title: 'Neural Synaptic Point Lattice',
    archetype: 'synapse',
    primaryColor: '#10B981',
    secondaryColor: '#8B5CF6',
    orbitalRadius: 10.6,
    orbitalSpeed: 0.030,
    inclination: -0.15,
    unlocked: false
  }
];

describe('Celestial 7-Spheres Persona Architecture Tests', () => {
  it('[TC-CELEST-01] Validates complete 7-Sphere persona registry & attributes', () => {
    assert.strictEqual(PERSONA_CATALOG.length, 7, 'Must have exactly 7 celestial persona bodies');

    PERSONA_CATALOG.forEach((persona, idx) => {
      assert.strictEqual(persona.index, idx, `Persona ${persona.id} must match array index`);
      assert.ok(persona.id.length > 2, 'ID must be non-empty');
      assert.ok(persona.name.length > 2, 'Name must be defined');
      assert.ok(persona.primaryColor.startsWith('#'), 'Primary color must be hex');
      assert.ok(persona.secondaryColor.startsWith('#'), 'Secondary color must be hex');
      assert.ok(persona.orbitalRadius > 0, 'Orbital radius must be positive');
      assert.ok(persona.orbitalSpeed > 0, 'Orbital speed must be positive');
    });

    const activePersonas = PERSONA_CATALOG.filter(p => p.unlocked);
    const unrevealedPersonas = PERSONA_CATALOG.filter(p => !p.unlocked);

    assert.strictEqual(activePersonas.length, 4, 'Must have 4 revealed personas (Froerybell, ThearinaZs, Sevarchky, Loafinest)');
    assert.strictEqual(unrevealedPersonas.length, 3, 'Must have exactly 3 unrevealed/dormant celestial spheres');
  });

  it('[TC-CELEST-02] OMEGA privacy audit on persona metadata', () => {
    const bannedPatterns = ['ZGlja3k=', 'Y2FuZHJh', 'cGVybWFuYQ==', 'ZGNhbmRyYQ=='].map(
      (b64) => new RegExp(Buffer.from(b64, 'base64').toString('ascii'), 'i')
    );
    const catalogJson = JSON.stringify(PERSONA_CATALOG);

    for (const pattern of bannedPatterns) {
      assert.strictEqual(
        pattern.test(catalogJson),
        false,
        `Celestial catalog leaked personal name matching ${pattern}`
      );
    }
  });

  it('[TC-CELEST-03] Mathematical Keplerian orbital stability invariants', () => {
    // Outer orbits must have strictly increasing orbital radii to avoid visual collision
    for (let i = 1; i < PERSONA_CATALOG.length; i++) {
      assert.ok(
        PERSONA_CATALOG[i].orbitalRadius > PERSONA_CATALOG[i - 1].orbitalRadius,
        `Orbital radius of sphere ${i} (${PERSONA_CATALOG[i].orbitalRadius}) must be strictly greater than sphere ${i - 1} (${PERSONA_CATALOG[i - 1].orbitalRadius})`
      );
      // Keplerian speed rule: outer orbits should move slower
      assert.ok(
        PERSONA_CATALOG[i].orbitalSpeed < PERSONA_CATALOG[i - 1].orbitalSpeed,
        `Orbital speed of sphere ${i} (${PERSONA_CATALOG[i].orbitalSpeed}) must decrease with radius compared to ${PERSONA_CATALOG[i - 1].orbitalSpeed}`
      );
    }
  });
});
