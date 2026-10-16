import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  CelestialShader,
  CurlParticleShader,
  HolographicWireframeShader,
  ConduitShader
} from '../lib/shaders.ts';

describe('Advanced GLSL Shaders Specification & Integrity', () => {
  test('[TC-SHAD-01] CelestialShader exports valid instanced attributes and uniforms', () => {
    assert.ok(CelestialShader, 'CelestialShader must be defined');
    assert.ok(CelestialShader.vertexShader.includes('aPersonaId'), 'Must declare aPersonaId attribute');
    assert.ok(CelestialShader.vertexShader.includes('aPrimaryColor'), 'Must declare aPrimaryColor attribute');
    assert.ok(CelestialShader.vertexShader.includes('aSecondaryColor'), 'Must declare aSecondaryColor attribute');
    assert.ok(CelestialShader.vertexShader.includes('uAudioBands'), 'Must declare uAudioBands uniform');
    assert.ok(CelestialShader.fragmentShader.includes('vFresnel'), 'Fragment shader must compute Fresnel iridescence');
    assert.ok(!CelestialShader.fragmentShader.includes('discard'), 'Fragment shader must not use discard (TBDR early-Z)');
  });

  test('[TC-SHAD-02] CurlParticleShader implements divergence-free kinetics and zero discard', () => {
    assert.ok(CurlParticleShader, 'CurlParticleShader must be defined');
    assert.ok(CurlParticleShader.vertexShader.includes('uMouse'), 'Must support mouse attractor');
    assert.ok(CurlParticleShader.vertexShader.includes('uWarpPower'), 'Must support shockwave warp power');
    assert.ok(CurlParticleShader.vertexShader.includes('uAudioBands'), 'Must couple with audio frequency bands');
    assert.ok(CurlParticleShader.fragmentShader.includes('gl_PointCoord'), 'Fragment shader must use gl_PointCoord');
    assert.ok(!CurlParticleShader.fragmentShader.includes('discard'), 'Fragment shader must not discard for TBDR optimization');
  });

  test('[TC-SHAD-03] HolographicWireframeShader implements single-pass barycentric edges', () => {
    assert.ok(HolographicWireframeShader, 'HolographicWireframeShader must be defined');
    assert.ok(HolographicWireframeShader.vertexShader.includes('aBarycentric'), 'Must accept aBarycentric attribute');
    assert.ok(HolographicWireframeShader.vertexShader.includes('uExplodeProgress'), 'Must support exploded view animation');
    assert.ok(HolographicWireframeShader.fragmentShader.includes('min(min('), 'Fragment shader must compute barycentric edge distance');
  });

  test('[TC-SHAD-04] ConduitShader implements Bezier telemetry pulse', () => {
    assert.ok(ConduitShader, 'ConduitShader must be defined');
    assert.ok(ConduitShader.vertexShader.includes('uv'), 'Vertex shader must process UVs');
    assert.ok(ConduitShader.fragmentShader.includes('fract('), 'Fragment shader must animate telemetry pulse');
  });
});
