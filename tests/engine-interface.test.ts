import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SPHERES, calculateSphereCoordinates, checkOrbitalSeparation } from '../lib/spheres.ts';
import { CelestialShader, CurlParticleShader, HolographicWireframeShader, ConduitShader } from '../lib/shaders.ts';

describe('PortfolioEngine Overengineering Interface Tests', () => {
  test('[TC-ENG-INT-01] Validates 7-Spheres instanced geometry matrix calculation', () => {
    // 7 instances must have stable, non-NaN world positions at any time t
    const times = [0, 1.5, 10.0, 100.0];
    times.forEach(t => {
      SPHERES.forEach(sphere => {
        const coords = calculateSphereCoordinates(sphere, t);
        assert.ok(!Number.isNaN(coords.x), `Sphere ${sphere.id} x is NaN at t=${t}`);
        assert.ok(!Number.isNaN(coords.y), `Sphere ${sphere.id} y is NaN at t=${t}`);
        assert.ok(!Number.isNaN(coords.z), `Sphere ${sphere.id} z is NaN at t=${t}`);
      });
    });
  });

  test('[TC-ENG-INT-02] Verifies zero-heap audio bridge uniform contract', () => {
    // uAudioBands uniform must expect a 4-element array [low, mid, high, energy]
    assert.ok(Array.isArray(CelestialShader.uniforms.uAudioBands.value), 'CelestialShader uAudioBands must be array');
    assert.strictEqual(CelestialShader.uniforms.uAudioBands.value.length, 4, 'Must have 4 bands');
    assert.ok(Array.isArray(CurlParticleShader.uniforms.uAudioBands.value), 'CurlParticleShader uAudioBands must be array');
    assert.strictEqual(CurlParticleShader.uniforms.uAudioBands.value.length, 4, 'Must have 4 bands');
  });

  test('[TC-ENG-INT-03] Verifies holographic exploded wireframe shader contract', () => {
    assert.strictEqual(HolographicWireframeShader.uniforms.uExplodeProgress.value, 0.0);
    assert.strictEqual(HolographicWireframeShader.uniforms.uAccentColor.value.length, 3);
  });
});
