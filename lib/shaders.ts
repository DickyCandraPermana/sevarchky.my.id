// GLSL Shaders Ecosystem // sevarchky.my.id
// Overengineered 7-Spheres Celestial System, 35k GPU Curl Noise Swarm & Holographic Wireframes

export const SIMPLEX_3D_CHUNK = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // 3D Curl Noise: divergence-free vector field v = curl(psi)
  vec3 curlNoise(vec3 p) {
    const float e = 0.05;
    float dx = snoise(p + vec3(e, 0.0, 0.0)) - snoise(p - vec3(e, 0.0, 0.0));
    float dy = snoise(p + vec3(0.0, e, 0.0)) - snoise(p - vec3(0.0, e, 0.0));
    float dz = snoise(p + vec3(0.0, 0.0, e)) - snoise(p - vec3(0.0, 0.0, e));

    vec3 p1 = p + vec3(17.1, 31.7, 7.3);
    float dx1 = snoise(p1 + vec3(e, 0.0, 0.0)) - snoise(p1 - vec3(e, 0.0, 0.0));
    float dy1 = snoise(p1 + vec3(0.0, e, 0.0)) - snoise(p1 - vec3(0.0, e, 0.0));
    float dz1 = snoise(p1 + vec3(0.0, 0.0, e)) - snoise(p1 - vec3(0.0, 0.0, e));

    return normalize(vec3(
      dy1 - dz,
      dz1 - dx,
      dx1 - dy
    ));
  }
`;

// ==========================================
// 1. CELESTIAL SHADER (7-Spheres InstancedMesh)
// ==========================================
export const CelestialShader = {
  uniforms: {
    uTime: { value: 0 },
    uAudioBands: { value: [0, 0, 0, 0] }, // [low, mid, high, energy]
    uNoiseDensity: { value: 1.4 },
    uNoiseStrength: { value: 0.35 },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform vec4 uAudioBands; // x: low, y: mid, z: high, w: energy
    uniform float uNoiseDensity;
    uniform float uNoiseStrength;

    attribute float aPersonaId;
    attribute vec3 aPrimaryColor;
    attribute vec3 aSecondaryColor;
    attribute vec4 aPersonaParams; // x: noise density, y: amp, z: metalness, w: unlocked
    attribute float aFocusProgress;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vFresnel;
    varying float vPersonaId;
    varying vec3 vPrimaryColor;
    varying vec3 vSecondaryColor;
    varying vec4 vPersonaParams;
    varying float vFocusProgress;
    varying float vDisplacement;

    ${SIMPLEX_3D_CHUNK}

    void main() {
      vPersonaId = aPersonaId;
      vPrimaryColor = aPrimaryColor;
      vSecondaryColor = aSecondaryColor;
      vPersonaParams = aPersonaParams;
      vFocusProgress = aFocusProgress;

      // Transform normal with instance matrix
      mat3 normMatrix = transpose(inverse(mat3(modelMatrix * instanceMatrix)));
      vNormal = normalize(normMatrix * normal);

      vec3 pos = position;

      // Dynamic Simplex noise displacement modulated by audio sub-bass (x) and mid harmonics (y)
      float density = uNoiseDensity * aPersonaParams.x;
      float amp = uNoiseStrength * aPersonaParams.y * (1.0 + uAudioBands.x * 0.7);
      float slowTime = uTime * (0.35 + aPersonaParams.y * 0.2);
      
      float n = snoise(pos * density + vec3(slowTime * 0.4, slowTime * 0.2, aPersonaId * 2.1));
      float displacement = n * amp;
      vDisplacement = displacement;
      pos += normal * displacement;

      // Scale up slightly when focused
      pos *= (1.0 + aFocusProgress * 0.35);

      vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;

      vec4 mvPosition = viewMatrix * worldPos;
      vViewPosition = -mvPosition.xyz;

      // Compute Fresnel term in vertex stage for performance
      vec3 viewDir = normalize(-mvPosition.xyz);
      float NdotV = clamp(dot(vNormal, viewDir), 0.0, 1.0);
      vFresnel = pow(1.0 - NdotV, 3.2);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec4 uAudioBands;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vFresnel;
    varying float vPersonaId;
    varying vec3 vPrimaryColor;
    varying vec3 vSecondaryColor;
    varying vec4 vPersonaParams;
    varying float vFocusProgress;
    varying float vDisplacement;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Iridescent chromatic dispersion phase
      float chromaticPhase = vFresnel * 3.14159 + (vDisplacement * 2.0) + (uTime * 0.2);
      vec3 iridColor = vec3(
        sin(chromaticPhase) * 0.5 + 0.5,
        sin(chromaticPhase + 2.094) * 0.5 + 0.5,
        sin(chromaticPhase + 4.188) * 0.5 + 0.5
      );

      // Blend primary base with secondary accent via Fresnel
      vec3 core = mix(vPrimaryColor, vSecondaryColor, iridColor.g * 0.6);
      vec3 surface = mix(core, vSecondaryColor, vFresnel * 0.85);

      // Specular highlights
      vec3 lightDir = normalize(vec3(1.2, 2.0, 1.5));
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfVec), 0.0), 32.0) * (0.4 + vPersonaParams.z * 0.6);

      // Audio high band scintillation
      float sparkle = uAudioBands.z * 0.3;
      vec3 finalColor = surface + (spec + sparkle) * (vSecondaryColor * 0.5 + 0.5);

      // Branchless alpha (preserves early-Z for TBDR)
      gl_FragColor = vec4(finalColor, 0.94);
    }
  `
};

// ==========================================
// 2. 35,000 GPU CURL NOISE PARTICLE SWARM
// ==========================================
export const CurlParticleShader = {
  uniforms: {
    uTime: { value: 0 },
    uAudioBands: { value: [0, 0, 0, 0] },
    uMouse: { value: [0, 0, 0] },
    uWarpTime: { value: 99.0 },
    uWarpPower: { value: 0.0 },
    uColorA: { value: [0.84, 0.70, 0.99] }, // Froerybell lavender
    uColorB: { value: [0.0, 0.94, 1.0] },    // Sevarchky cyan
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform vec4 uAudioBands; // low, mid, high, energy
    uniform vec3 uMouse;
    uniform float uWarpTime;
    uniform float uWarpPower;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    attribute float aScale;
    attribute float aPhase;

    varying float vAlpha;
    varying vec3 vColor;

    ${SIMPLEX_3D_CHUNK}

    void main() {
      vec3 pos = position;

      // 3D Divergence-free Curl Noise flowfield
      float flowTime = uTime * 0.25 + aPhase;
      vec3 curl = curlNoise(pos * 0.12 + vec3(0.0, flowTime * 0.3, flowTime * 0.15));
      pos += curl * (0.85 + uAudioBands.x * 0.6);

      // Pointer magnetic vortex
      float mouseDist = distance(pos.xy, uMouse.xy);
      if (mouseDist < 5.0) {
        vec2 toMouse = pos.xy - uMouse.xy;
        // Tangential curl force
        vec2 tangent = vec2(-toMouse.y, toMouse.x);
        float falloff = (5.0 - mouseDist) / 5.0;
        pos.xy += normalize(tangent) * falloff * 0.95;
        // Radial repulsion
        pos.xy += normalize(toMouse) * falloff * 0.5;
      }

      // Spherical shockwave impulse wave shell (from warp trigger)
      if (uWarpPower > 0.0 && uWarpTime < 2.5) {
        float r = length(pos);
        float waveDist = abs(r - uWarpTime * 6.0);
        float shock = exp(-waveDist * 1.2) * exp(-uWarpTime * 1.4) * uWarpPower;
        pos += normalize(pos) * (shock * 2.5);
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Dynamic point size scaling with high-frequency audio sparkles
      float sizeMod = aScale * (1.0 + uAudioBands.z * 1.2);
      gl_PointSize = sizeMod * (26.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;

      // Palette mix based on depth and phase
      float mixT = sin(aPhase + uTime * 0.4) * 0.5 + 0.5;
      vColor = mix(uColorA, uColorB, mixT);
      vAlpha = clamp(0.35 + sin(flowTime * 2.0) * 0.25 + uAudioBands.w * 0.3, 0.2, 0.95);
    }
  `,
  fragmentShader: /* glsl */ `
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      // Branchless soft circular falloff without alpha kill (TBDR early-Z compliant)
      float intensity = clamp(0.5 - dist, 0.0, 1.0) * 2.0;
      intensity = intensity * intensity * intensity;

      gl_FragColor = vec4(vColor * (intensity * vAlpha), intensity * vAlpha);
    }
  `
};

// ==========================================
// 3. HOLOGRAPHIC EXPLODED WIREFRAME SHADER
// ==========================================
export const HolographicWireframeShader = {
  uniforms: {
    uTime: { value: 0 },
    uExplodeProgress: { value: 0.0 }, // 0.0 -> 1.0
    uAccentColor: { value: [0.0, 0.94, 1.0] },
    uSubsystemOffset: { value: [0, 0, 0] },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uExplodeProgress;
    uniform vec3 uSubsystemOffset;

    attribute vec3 aBarycentric;
    varying vec3 vBarycentric;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vBarycentric = aBarycentric;
      vNormal = normalize(normalMatrix * normal);

      vec3 pos = position;
      // Explode along subsystem displacement vector
      pos += uSubsystemOffset * uExplodeProgress;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uAccentColor;

    varying vec3 vBarycentric;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      // Single-pass barycentric edge distance calculation
      float edge = min(min(vBarycentric.x, vBarycentric.y), vBarycentric.z);
      float wireframe = 1.0 - smoothstep(0.0, 0.045, edge);

      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0), 2.0);

      vec3 color = uAccentColor * (wireframe * 0.9 + fresnel * 0.35);
      float alpha = clamp(wireframe + fresnel * 0.5, 0.1, 0.95);

      gl_FragColor = vec4(color, alpha);
    }
  `
};

// ==========================================
// 4. BEZIER CONDUIT TELEMETRY PULSE SHADER
// ==========================================
export const ConduitShader = {
  uniforms: {
    uTime: { value: 0 },
    uPulseSpeed: { value: 2.5 },
    uConduitColor: { value: [0.0, 1.0, 0.4] },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform float uPulseSpeed;
    uniform vec3 uConduitColor;
    varying vec2 vUv;

    void main() {
      // Moving dashed telemetry pulse along spline length
      float pulse = fract(vUv.x * 6.0 - uTime * uPulseSpeed);
      float beam = smoothstep(0.7, 0.98, pulse);
      float baseLine = 0.25;

      vec3 color = uConduitColor * (baseLine + beam * 0.85);
      gl_FragColor = vec4(color, baseLine + beam * 0.7);
    }
  `
};

// ==========================================
// BACKWARD-COMPATIBLE EXPORTS & ALIASES
// ==========================================
export const ORGANIC_JELLY_VERTEX_SHADER = CelestialShader.vertexShader;
export const ORGANIC_JELLY_FRAGMENT_SHADER = CelestialShader.fragmentShader;
export const BIO_SPORE_VERTEX_SHADER = CurlParticleShader.vertexShader;
export const BIO_SPORE_FRAGMENT_SHADER = CurlParticleShader.fragmentShader;

export const MONOLITH_VERTEX_SHADER = ORGANIC_JELLY_VERTEX_SHADER;
export const MONOLITH_FRAGMENT_SHADER = ORGANIC_JELLY_FRAGMENT_SHADER;
export const PARTICLE_VERTEX_SHADER = BIO_SPORE_VERTEX_SHADER;
export const PARTICLE_FRAGMENT_SHADER = BIO_SPORE_FRAGMENT_SHADER;
