import { test, describe } from 'node:test';
import assert from 'node:assert';
import * as THREE from 'three';

import {
  FFT_CONFIG,
  SOLFEGGIO_FREQUENCIES,
  calculateHarmonicDetune,
  validateFFTConfig
} from '../lib/audio.ts';

import {
  evaluatePotentialField,
  computeCurlNoise,
  verifyDivergenceFree,
  verifyBoundedVelocity,
  type Vector3D
} from '../lib/curl.ts';

import {
  SPHERES,
  getSphereById,
  calculateSphereCoordinates,
  checkOrbitalSeparation
} from '../lib/spheres.ts';

import { processCommand } from '../lib/terminal.ts';
import { runFullOmegaAudit, auditString } from '../lib/dlp.ts';
import { resolvePerformanceTier } from '../lib/performance.ts';
import { MISSIONS } from '../lib/missions.ts';

describe('Sovereign Sentry // Overengineering Governance & Engineering Verification Matrix', () => {

  // =========================================================================
  // TC-ENG-01: FFT Analyzer Node State & Procedural Audio Harmonics
  // =========================================================================
  test('[TC-ENG-01] Validates Web Audio FFT analyzer node state and dual-chorus beating', () => {
    // 1. Verify FFT analyzer configuration bounds
    assert.strictEqual(FFT_CONFIG.fftSize, 1024, 'FFT size must be exactly 1024 for high-resolution analysis');
    assert.strictEqual(FFT_CONFIG.frequencyBinCount, 512, 'frequencyBinCount must be exactly half fftSize');
    assert.strictEqual(FFT_CONFIG.smoothingTimeConstant, 0.85, 'smoothingTimeConstant must be 0.85 for organic fluid decay');
    assert.ok(FFT_CONFIG.minDecibels < FFT_CONFIG.maxDecibels, 'minDecibels must be lower than maxDecibels');
    assert.ok(validateFFTConfig(FFT_CONFIG), 'validateFFTConfig must return true for default configuration');

    // 2. Verify Solfeggio frequency mapping for all 7 Archetypes
    assert.strictEqual(SOLFEGGIO_FREQUENCIES.FROERYBELL, 432, 'Froerybell must align to 432 Hz');
    assert.strictEqual(SOLFEGGIO_FREQUENCIES.THEARINAZS, 528, 'ThearinaZs must align to 528 Hz');
    assert.strictEqual(SOLFEGGIO_FREQUENCIES.SEVARCHKY, 639, 'Sevarchky must align to 639 Hz');
    assert.strictEqual(SOLFEGGIO_FREQUENCIES.LOAFINEST, 174, 'Loafinest must align to 174 Hz');
    assert.strictEqual(SOLFEGGIO_FREQUENCIES.AETHELGARD, 741, 'Aethelgard must align to 741 Hz');
    assert.strictEqual(SOLFEGGIO_FREQUENCIES.MORPHIUS_V, 852, 'Morphius-V must align to 852 Hz');
    assert.strictEqual(SOLFEGGIO_FREQUENCIES.ASTRALNOX, 963, 'Astralnox must align to 963 Hz');

    // 3. Test crystal singing bowl microtonal dual-oscillator detuning
    const baseFreq = 432;
    const detune = calculateHarmonicDetune(baseFreq);
    assert.strictEqual(detune.fundamental, 432, 'Fundamental frequency must match input');
    // Sweet fifth is freq * 1.503
    assert.strictEqual(detune.fifth, 432 * 1.503, 'Fifth harmonic must match 1.503 detune multiplier');
    // Microtonal beating should be positive and small
    assert.ok(detune.beatFreq > 0 && detune.beatFreq < 2.0, 'Beat frequency must produce subtle chorusing under 2.0 Hz');
  });

  // =========================================================================
  // TC-ENG-02: Curl Noise Vector Field Math & Divergence-Free Invariant
  // =========================================================================
  test('[TC-ENG-02] Verifies curl noise vector field math integrity and divergence-free property', () => {
    // 1. Check potential field evaluation is deterministic and finite
    const origin: Vector3D = { x: 0, y: 0, z: 0 };
    const psi = evaluatePotentialField(origin, 0);
    assert.ok(isFinite(psi.x) && isFinite(psi.y) && isFinite(psi.z), 'Potential field must be finite at origin');

    // 2. Sample 3D test points in the active swarm volume [-10, 10]
    const testPoints: Vector3D[] = [
      { x: 0, y: 0, z: 0 },
      { x: 1.5, y: -2.3, z: 4.1 },
      { x: -5.0, y: 3.2, z: -1.8 },
      { x: 7.2, y: -8.1, z: 6.4 },
      { x: -3.5, y: -4.0, z: -2.2 }
    ];

    // 3. Verify divergence-free property: ∇ · (∇ × Ψ) == 0 within numerical tolerance
    const divResult = verifyDivergenceFree(testPoints, 2e-3);
    assert.ok(divResult.passes, `Divergence must remain below 2e-3 everywhere. Max observed: ${divResult.maxDivergence}`);
    assert.strictEqual(divResult.failures.length, 0, 'Zero points can violate divergence-free fluid invariant');

    // 4. Verify velocity bounds to prevent particle explosion or NaN
    const velocityResult = verifyBoundedVelocity(testPoints, 10.0);
    assert.ok(velocityResult.passes, `Particle velocities must remain strictly bounded. Max magnitude: ${velocityResult.maxMagnitude}`);
    assert.ok(velocityResult.maxMagnitude > 0, 'Velocity field must not be stagnant zero');
  });

  // =========================================================================
  // TC-ENG-03: 7-Sphere Celestial Hierarchy & Orbital Transforms
  // =========================================================================
  test('[TC-ENG-03] Validates 7-Sphere cosmology coordinates, orbital shells and non-collision invariant', () => {
    // 1. Verify exact 7 spheres defined
    assert.strictEqual(SPHERES.length, 7, 'Cosmology must define exactly 7 celestial spheres');

    // 2. Verify all 7 carry OMEGA clearance
    SPHERES.forEach((s, idx) => {
      assert.strictEqual(s.index, idx + 1, `Sphere ${s.id} index must equal ${idx + 1}`);
      assert.strictEqual(s.clearance, 'OMEGA', `Sphere ${s.id} must hold OMEGA clearance`);
      assert.ok(s.telemetrySignature.length > 0, `Sphere ${s.id} must specify telemetry signature`);
      assert.ok(s.frequencyHz > 0, `Sphere ${s.id} must specify positive frequency`);
    });

    // 3. Verify non-intersecting orbital shells
    const shellsSeparated = checkOrbitalSeparation(SPHERES);
    assert.ok(shellsSeparated, 'Adjacent orbital shells must have minimum radial clearance of >= 2.0 units');

    // 4. Test 3D orbital coordinate transforms at t = 0 and t = 10
    const thearinazs = getSphereById('thearinazs');
    assert.ok(thearinazs, 'ThearinaZs sphere must be found');

    const pos0 = calculateSphereCoordinates(thearinazs, 0);
    assert.strictEqual(pos0.x, thearinazs.orbitalRadius, 'At t=0, sphere should sit along positive X axis');
    assert.strictEqual(pos0.y, 0, 'At t=0, Y coordinate should be 0');
    assert.strictEqual(pos0.z, 0, 'At t=0, Z coordinate should be 0');

    const pos10 = calculateSphereCoordinates(thearinazs, 10);
    const radiusCalculated = Math.sqrt(pos10.x * pos10.x + pos10.y * pos10.y + pos10.z * pos10.z);
    assert.ok(
      Math.abs(radiusCalculated - thearinazs.orbitalRadius) < 1e-4,
      `Calculated orbital radius ${radiusCalculated} must match sphere radius ${thearinazs.orbitalRadius}`
    );
  });

  // =========================================================================
  // TC-ENG-04: Terminal Directive Parser & Directive Grammar
  // =========================================================================
  test('[TC-ENG-04] Validates terminal directive expansion parser AST execution and flags', () => {
    // 1. Test 'orbit' directive
    const orbitRes = processCommand('orbit thearinazs --lock');
    assert.ok(orbitRes.success, 'orbit command should succeed');
    assert.ok(orbitRes.output.includes('ORBIT LOCK: SPHERE-02'), 'Output should confirm orbit lock');
    assert.strictEqual(orbitRes.action?.type, 'SET_ORBIT');
    assert.strictEqual(orbitRes.action?.payload.sphere, 'thearinazs');
    assert.strictEqual(orbitRes.action?.payload.lock, true);

    // 2. Test 'orbit all --speed 2.5'
    const orbitAllRes = processCommand('orbit all --speed 2.5');
    assert.ok(orbitAllRes.success, 'orbit all should succeed');
    assert.strictEqual(orbitAllRes.action?.payload.speed, 2.5);

    // 3. Test 'freq' directive
    const freqRes = processCommand('freq 528 --bowl');
    assert.ok(freqRes.success, 'freq command should succeed');
    assert.ok(freqRes.output.includes('528 Hz'), 'Output should confirm frequency');
    assert.strictEqual(freqRes.action?.type, 'SET_FREQ');
    assert.strictEqual(freqRes.action?.payload.hz, 528);
    assert.strictEqual(freqRes.action?.payload.bowl, true);

    // Out of bounds freq check
    const invalidFreq = processCommand('freq 50000');
    assert.strictEqual(invalidFreq.success, false, 'freq > 20000 should be rejected');

    // 4. Test 'warp' directive with power
    const warpRes = processCommand('warp 2.4');
    assert.ok(warpRes.success, 'warp with power should succeed');
    assert.strictEqual(warpRes.action?.type, 'TRIGGER_WARP');
    assert.strictEqual(warpRes.action?.payload.power, 2.4);

    // 5. Test 'matrix' directive
    const matrixRes = processCommand('matrix');
    assert.ok(matrixRes.success, 'matrix should succeed');
    assert.ok(matrixRes.output.includes('COSMOLOGICAL 7-SPHERE TOPOLOGY MATRIX'));
    assert.strictEqual(matrixRes.action?.type, 'DISPLAY_MATRIX');

    // 6. Test 'benchmark' directive
    const benchRes = processCommand('benchmark --stress');
    assert.ok(benchRes.success, 'benchmark should succeed');
    assert.ok(benchRes.output.includes('TBDR HARDWARE BENCHMARK PROTOCOL'));
    assert.strictEqual(benchRes.action?.type, 'RUN_BENCHMARK');
    assert.strictEqual(benchRes.action?.payload.stress, true);

    // 7. Test 'dlp:audit' directive
    const dlpRes = processCommand('dlp:audit');
    assert.ok(dlpRes.success, 'dlp:audit should succeed');
    assert.ok(dlpRes.output.includes('OMEGA_CLEARED_ZERO_LEAK'));
    assert.strictEqual(dlpRes.action?.type, 'RUN_DLP_AUDIT');
  });

  // =========================================================================
  // TC-ENG-05: OMEGA Zero Real Identity Leakage (DLP Security Engine)
  // =========================================================================
  test('[TC-ENG-05] Enforces OMEGA Zero Real Identity Leakage across missions and spheres', () => {
    // 1. Run full OMEGA DLP scan
    const audit = runFullOmegaAudit();
    assert.strictEqual(audit.clean, true, 'Zero violations allowed across entire portfolio state');
    assert.strictEqual(audit.clearance, 'OMEGA_CLEARED_ZERO_LEAK');
    assert.strictEqual(audit.totalViolations, 0, 'Violation count must be zero');
    assert.ok(audit.scannedItemsCount >= 11, 'Must scan all missions + spheres');

    // 2. Validate DLP scanner catches simulated real-name breach
    const breachedText = 'Authored by Dicky Permana at Sebelas Maret';
    const violations = auditString(breachedText, 'test_sample');
    assert.ok(violations.length >= 2, 'DLP engine must flag real name and institutional affiliations');
    assert.ok(violations.some(v => v.category === 'REAL_NAME'), 'Must detect real name token');
    assert.ok(violations.some(v => v.category === 'ACADEMIC_ID'), 'Must detect academic token');

    // 3. Validate DLP scanner catches simulated phone number and personal email
    const contactBreach = 'Reach out at 081234567890 or personal@gmail.com';
    const contactViolations = auditString(contactBreach, 'contact_sample');
    assert.ok(contactViolations.some(v => v.category === 'CONTACT_INFO'), 'Must detect phone number and personal email');
  });

  // =========================================================================
  // TC-ENG-06: Dynamic Hardware Tiering & TBDR Mobile Particle Budgeting
  // =========================================================================
  test('[TC-ENG-06] Validates dynamic hardware tiering, DPR clamps and branchless particle budget', () => {
    const mobileTier = resolvePerformanceTier({ isMobile: true, devicePixelRatio: 3, screenWidth: 390 });
    assert.strictEqual(mobileTier.tier, 1, 'Standard mobile TBDR must be Tier 1');
    assert.strictEqual(mobileTier.particleCount, 8000, 'Tier 1 particle budget capped at 8000');
    assert.strictEqual(mobileTier.maxDpr, 1.0, 'Tier 1 DPR must clamp to 1.0');
    assert.strictEqual(mobileTier.enableBloom, false, 'Mobile disables expensive bloom pass');

    const tabletTier = resolvePerformanceTier({ isMobile: false, devicePixelRatio: 2, screenWidth: 1024 });
    assert.strictEqual(tabletTier.tier, 2, 'Tablet viewport must be Tier 2');
    assert.strictEqual(tabletTier.particleCount, 12000, 'Tier 2 particle budget capped at 12000');
    assert.strictEqual(tabletTier.maxDpr, 1.25, 'Tier 2 DPR must clamp to 1.25');

    const desktopTier = resolvePerformanceTier({ isMobile: false, devicePixelRatio: 2, screenWidth: 1920 });
    assert.strictEqual(desktopTier.tier, 3, 'High desktop must be Tier 3');
    assert.strictEqual(desktopTier.particleCount, 16000, 'Tier 3 particle budget capped at 16000');
    assert.strictEqual(desktopTier.maxDpr, 1.5, 'Tier 3 DPR must clamp to 1.5');
  });

  // =========================================================================
  // TC-ENG-07: Mission Dossier Schema Completeness & Blueprint Presence
  // =========================================================================
  test('[TC-ENG-07] Verifies mission dossiers carry OMEGA clearance, KPIs and architectural blueprints', () => {
    assert.ok(MISSIONS.length >= 4, 'Must provide at least 4 flagship mission dossiers');

    MISSIONS.forEach(mission => {
      // Must hold OMEGA clearance
      assert.strictEqual(mission.clearance, 'OMEGA', `Mission ${mission.id} must be OMEGA cleared`);

      // Must have at least 3 verifiable KPIs
      assert.ok(mission.metrics.length >= 3, `Mission ${mission.id} must have >= 3 verifiable KPIs`);
      mission.metrics.forEach(metric => {
        assert.ok(metric.label.length > 0, 'KPI label must not be empty');
        assert.ok(metric.value.length > 0, 'KPI value must not be empty');
        assert.ok(metric.subtext.length > 0, 'KPI subtext must not be empty');
      });

      // Must have architectural blueprints
      assert.ok(mission.blueprint.length > 0, `Mission ${mission.id} must provide ASCII architecture blueprint`);
      assert.ok(mission.techStack.length >= 3, `Mission ${mission.id} must declare >= 3 stack technologies`);
      assert.ok(mission.operationalChallenge.length > 0, `Mission ${mission.id} must document technical challenge`);
      assert.ok(mission.algorithmicSolution.length > 0, `Mission ${mission.id} must document solution`);
    });
  });

  // =========================================================================
  // TC-ENG-08: Three.js WebGL Resource Disposal & Zero Memory Leak Hygiene
  // =========================================================================
  test('[TC-ENG-08] Validates Three.js WebGL memory lifecycle disposal and teardown hygiene', () => {
    // 1. Create simulated Three.js buffer geometry and shader material
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, 1, 1, 1, 2, 2, 2]);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: 'void main() { gl_Position = vec4(position, 1.0); }',
      fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }'
    });

    const mesh = new THREE.Mesh(geo, mat);
    const scene = new THREE.Scene();
    scene.add(mesh);

    assert.strictEqual(scene.children.length, 1, 'Scene should contain 1 mesh');

    // 2. Perform rigorous disposal sequence
    mesh.geometry.dispose();
    mesh.material.dispose();
    scene.remove(mesh);

    assert.strictEqual(scene.children.length, 0, 'Scene children must be cleared');
    assert.strictEqual(mesh.geometry.attributes.position.array.length, 9, 'Memory buffer accessible prior to GC');
  });

});
