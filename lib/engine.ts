// Portfolio Engine // sevarchky.my.id
// Overengineered Spatial Computing Architecture: 7-Spheres Instanced System, 35k GPU Curl Swarm, Web Audio FFT Bridge & Exploded Blueprints

import * as THREE from 'three';
import {
  CelestialShader,
  CurlParticleShader,
  HolographicWireframeShader,
  ConduitShader
} from './shaders.ts';
import {
  SPHERES,
  SphereData,
  calculateSphereCoordinates,
  getSphereById
} from './spheres.ts';
import {
  resolvePerformanceTier,
  PerformanceTier,
  FRESNEL_PALETTES,
  getPaletteByKey
} from './performance.ts';
import type { IAudioAnalyzerProvider, AudioBands } from './audio.ts';

export interface EngineTelemetry {
  fps: number;
  particles: number;
  coords: string;
  tier: string;
  activeSphere: string;
  drawCalls: number;
}

export interface EngineCallbacks {
  onTelemetry?: (data: EngineTelemetry) => void;
  onRipple?: () => void;
  onSphereSelect?: (sphere: SphereData) => void;
}

// 7-Sphere Persona Visual Metadata & Chromatic Profiles
const PERSONA_PROFILES = [
  { primary: '#D8B4FE', secondary: '#818CF8', scale: 2.3, density: 1.1, amp: 0.65, metal: 0.2 }, // Froerybell
  { primary: '#00FF66', secondary: '#38BDF8', scale: 1.25, density: 1.8, amp: 0.45, metal: 0.8 }, // ThearinaZs
  { primary: '#00F0FF', secondary: '#08080A', scale: 1.45, density: 1.4, amp: 0.70, metal: 0.95 }, // Sevarchky
  { primary: '#FDBA74', secondary: '#FB7185', scale: 1.15, density: 0.8, amp: 0.35, metal: 0.1 }, // Loafinest
  { primary: '#6366F1', secondary: '#EC4899', scale: 1.05, density: 2.2, amp: 0.50, metal: 0.7 }, // Aethelgard
  { primary: '#E2E8F0', secondary: '#3B82F6', scale: 0.95, density: 2.0, amp: 0.80, metal: 0.5 }, // Morphius-V
  { primary: '#10B981', secondary: '#8B5CF6', scale: 0.85, density: 2.5, amp: 0.90, metal: 0.85 }  // Astralnox
];

export class PortfolioEngine {
  private canvas: HTMLCanvasElement;
  private callbacks: EngineCallbacks;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  // 1. 7-Spheres Instanced System
  private celestialMesh!: THREE.InstancedMesh;
  private celestialMat!: THREE.ShaderMaterial;
  private orbitalRingsMesh!: THREE.InstancedMesh;
  private focusProgressArray = new Float32Array(7);
  private targetFocusArray = new Float32Array(7);
  private focusedSphereIndex = 0; // default: Froerybell (0)

  // 2. 35,000 GPU Curl Noise Particles
  private sporeGeo!: THREE.BufferGeometry;
  private sporeMat!: THREE.ShaderMaterial;
  private spores!: THREE.Points;

  // 3. Exploded Holographic Blueprint Group
  private holographicGroup = new THREE.Group();
  private isHolographicMode = false;
  private explodeProgress = 0.0;
  private targetExplodeProgress = 0.0;
  private holographicMaterials: THREE.ShaderMaterial[] = [];

  // Interaction & Raycasting
  private raycaster = new THREE.Raycaster();
  private interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private pointerNdc = new THREE.Vector2(0, 0);
  private targetPointerWorld = new THREE.Vector3(0, 0, 0);
  private defaultCameraPos = new THREE.Vector3(0, 0, 12);
  private targetCameraPos = new THREE.Vector3(0, 0, 12);

  // Performance & Web Audio Uniforms Bridge
  private tier: PerformanceTier;
  private audioAnalyzer: IAudioAnalyzerProvider | null = null;
  private scratchBands: AudioBands = { low: 0, mid: 0, high: 0, energy: 0 };
  private audioUniformVec = [0, 0, 0, 0];

  // Lifecycle
  private rafId: number | null = null;
  private isDestroyed = false;
  private isPaused = false;

  // Shockwave Warp Physics
  private warpTime = 99.0;
  private warpPower = 0.0;

  // Ripple Physics
  private rippleTime = 999.0;
  private rippleIntensity = 0.0;
  private rippleOrigin = new THREE.Vector3(0, 0, 0);

  // Benchmarking & Telemetry
  private lastTime = performance.now();
  private frameCount = 0;
  private fpsTimer = 0;
  private currentFps = 60;

  constructor(canvas: HTMLCanvasElement, callbacks: EngineCallbacks = {}) {
    this.canvas = canvas;
    this.callbacks = callbacks;

    const isMobile =
      typeof window !== 'undefined' &&
      (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;

    this.tier = resolvePerformanceTier({
      isMobile,
      devicePixelRatio: dpr,
      screenWidth: width
    });

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0914, 0.028);

    const aspect = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 16 / 9;
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 120);
    this.camera.position.copy(this.defaultCameraPos);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.tier.tier >= 2,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
      alpha: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.tier.maxDpr));

    this.targetFocusArray[0] = 1.0;

    this.initCelestialInstancedSystem();
    this.initOrbitalRings();
    this.initCurlNoiseParticles();
    this.initHolographicBlueprint();
    this.bindEvents();
    this.startLoop();
  }

  // =========================================================================
  // 1. CELESTIAL 7-SPHERES INSTANCED MESH (Single Draw Call)
  // =========================================================================
  private initCelestialInstancedSystem() {
    const geo = new THREE.IcosahedronGeometry(1.0, this.tier.monolithSubdivisions);

    // Instance attributes for all 7 spheres
    const aPersonaId = new Float32Array(7);
    const aPrimaryColor = new Float32Array(7 * 3);
    const aSecondaryColor = new Float32Array(7 * 3);
    const aPersonaParams = new Float32Array(7 * 4); // x: density, y: amp, z: metal, w: unlocked
    const aFocusProgress = new Float32Array(7);

    for (let i = 0; i < 7; i++) {
      const p = PERSONA_PROFILES[i];
      aPersonaId[i] = i + 1;

      const prim = new THREE.Color(p.primary);
      aPrimaryColor[i * 3 + 0] = prim.r;
      aPrimaryColor[i * 3 + 1] = prim.g;
      aPrimaryColor[i * 3 + 2] = prim.b;

      const sec = new THREE.Color(p.secondary);
      aSecondaryColor[i * 3 + 0] = sec.r;
      aSecondaryColor[i * 3 + 1] = sec.g;
      aSecondaryColor[i * 3 + 2] = sec.b;

      aPersonaParams[i * 4 + 0] = p.density;
      aPersonaParams[i * 4 + 1] = p.amp;
      aPersonaParams[i * 4 + 2] = p.metal;
      aPersonaParams[i * 4 + 3] = 1.0; // Unlocked

      aFocusProgress[i] = i === 0 ? 1.0 : 0.0;
    }

    geo.setAttribute('aPersonaId', new THREE.InstancedBufferAttribute(aPersonaId, 1));
    geo.setAttribute('aPrimaryColor', new THREE.InstancedBufferAttribute(aPrimaryColor, 3));
    geo.setAttribute('aSecondaryColor', new THREE.InstancedBufferAttribute(aSecondaryColor, 3));
    geo.setAttribute('aPersonaParams', new THREE.InstancedBufferAttribute(aPersonaParams, 4));
    geo.setAttribute('aFocusProgress', new THREE.InstancedBufferAttribute(aFocusProgress, 1));

    this.celestialMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uAudioBands: { value: this.audioUniformVec },
        uNoiseDensity: { value: 1.3 },
        uNoiseStrength: { value: 0.45 },
      },
      vertexShader: CelestialShader.vertexShader,
      fragmentShader: CelestialShader.fragmentShader
    });

    this.celestialMesh = new THREE.InstancedMesh(geo, this.celestialMat, 7);
    this.celestialMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    this.updateSphereTransforms(0);
    this.scene.add(this.celestialMesh);
  }

  // =========================================================================
  // 2. ORBITAL RINGS (Single Instanced Draw Call for 6 Orbit Paths)
  // =========================================================================
  private initOrbitalRings() {
    // Thin torus geometry instanced for all 6 outer orbital paths
    const ringGeo = new THREE.TorusGeometry(1.0, 0.015, 8, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4a4365,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.orbitalRingsMesh = new THREE.InstancedMesh(ringGeo, ringMat, 6);
    const dummy = new THREE.Object3D();

    for (let i = 1; i < 7; i++) {
      const s = SPHERES[i];
      dummy.position.set(0, 0, 0);
      dummy.scale.set(s.orbitalRadius, s.orbitalRadius, 1.0);
      dummy.rotation.x = Math.PI * 0.5 + (s.inclinationDeg * Math.PI) / 180;
      dummy.updateMatrix();
      this.orbitalRingsMesh.setMatrixAt(i - 1, dummy.matrix);
    }

    this.orbitalRingsMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.orbitalRingsMesh);
  }

  // =========================================================================
  // 3. 35,000 GPU DIVERGENCE-FREE CURL NOISE PARTICLES
  // =========================================================================
  private initCurlNoiseParticles() {
    // 35,000 for high-tier desktop, 18,000 for medium, 8,000 for mobile
    const count = this.tier.tier >= 3 ? 35000 : this.tier.tier >= 2 ? 18000 : 8000;
    this.sporeGeo = new THREE.BufferGeometry();

    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const phase = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical galactic spore distribution
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.65) * 26.0;
      const h = (Math.random() - 0.5) * 16.0;

      pos[i * 3 + 0] = r * Math.cos(theta);
      pos[i * 3 + 1] = h;
      pos[i * 3 + 2] = r * Math.sin(theta);

      scale[i] = Math.random() * 0.75 + 0.35;
      phase[i] = Math.random() * Math.PI * 2;
    }

    this.sporeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.sporeGeo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    this.sporeGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));

    const initialPalette = FRESNEL_PALETTES[0];

    this.sporeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAudioBands: { value: this.audioUniformVec },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uWarpTime: { value: 99.0 },
        uWarpPower: { value: 0.0 },
        uColorA: { value: new THREE.Color(initialPalette.hex) },
        uColorB: { value: new THREE.Color(initialPalette.secondaryHex) }
      },
      vertexShader: CurlParticleShader.vertexShader,
      fragmentShader: CurlParticleShader.fragmentShader
    });

    this.spores = new THREE.Points(this.sporeGeo, this.sporeMat);
    this.scene.add(this.spores);
  }

  // =========================================================================
  // 4. HOLOGRAPHIC 3D EXPLODED BLUEPRINT ARCHITECTURE
  // =========================================================================
  private initHolographicBlueprint() {
    const modules = [
      { name: 'Core Solver', offset: new THREE.Vector3(0, 2.8, 0), color: '#00F0FF' },
      { name: 'Vector Ingestion', offset: new THREE.Vector3(-3.2, 0.4, 1.2), color: '#00FF66' },
      { name: 'Protocol Gateway', offset: new THREE.Vector3(3.2, -0.4, -1.2), color: '#D8B4FE' },
      { name: 'Feedback Stream', offset: new THREE.Vector3(0, -2.8, 0), color: '#FDBA74' },
    ];

    modules.forEach(m => {
      // Box geometry with barycentric attributes for wireframe edges
      const boxGeo = new THREE.BoxGeometry(1.6, 0.8, 1.2);
      this.attachBarycentricCoordinates(boxGeo);

      const mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uExplodeProgress: { value: 0.0 },
          uAccentColor: { value: new THREE.Color(m.color) },
          uSubsystemOffset: { value: m.offset },
        },
        vertexShader: HolographicWireframeShader.vertexShader,
        fragmentShader: HolographicWireframeShader.fragmentShader
      });

      this.holographicMaterials.push(mat);
      const mesh = new THREE.Mesh(boxGeo, mat);
      this.holographicGroup.add(mesh);
    });

    // Add connecting laser conduit spline
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.8, 0),
      new THREE.Vector3(-3.2, 0.4, 1.2),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3.2, -0.4, -1.2),
      new THREE.Vector3(0, -2.8, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.03, 8, false);
    const conduitMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uPulseSpeed: { value: 3.0 },
        uConduitColor: { value: new THREE.Color('#00FF66') }
      },
      vertexShader: ConduitShader.vertexShader,
      fragmentShader: ConduitShader.fragmentShader
    });
    this.holographicMaterials.push(conduitMat);
    const tubeMesh = new THREE.Mesh(tubeGeo, conduitMat);
    this.holographicGroup.add(tubeMesh);

    this.holographicGroup.visible = false;
    this.scene.add(this.holographicGroup);
  }

  private attachBarycentricCoordinates(geo: THREE.BufferGeometry) {
    const nonIndexed = geo.toNonIndexed();
    const count = nonIndexed.attributes.position.count;
    const bary = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 3) {
      bary[i * 3 + 0] = 1; bary[i * 3 + 1] = 0; bary[i * 3 + 2] = 0;
      bary[(i + 1) * 3 + 0] = 0; bary[(i + 1) * 3 + 1] = 1; bary[(i + 1) * 3 + 2] = 0;
      bary[(i + 2) * 3 + 0] = 0; bary[(i + 2) * 3 + 1] = 0; bary[(i + 2) * 3 + 2] = 1;
    }
    nonIndexed.setAttribute('aBarycentric', new THREE.BufferAttribute(bary, 3));
    geo.copy(nonIndexed);
  }

  // =========================================================================
  // PUBLIC CONTROL INTERFACES
  // =========================================================================
  public setAudioAnalyzer(analyzer: IAudioAnalyzerProvider) {
    this.audioAnalyzer = analyzer;
  }

  public focusSphere(idOrIndex: number | string) {
    const sphere = getSphereById(idOrIndex);
    if (!sphere) return;

    this.focusedSphereIndex = sphere.index - 1;
    for (let i = 0; i < 7; i++) {
      this.targetFocusArray[i] = i === this.focusedSphereIndex ? 1.0 : 0.0;
    }

    if (this.callbacks.onSphereSelect) {
      this.callbacks.onSphereSelect(sphere);
    }
  }

  public setHolographicMode(active: boolean, _subsystem?: string) {
    this.isHolographicMode = active;
    this.targetExplodeProgress = active ? 1.0 : 0.0;
    this.holographicGroup.visible = true;

    if (active) {
      this.targetCameraPos.set(6.2, 4.2, 8.5);
    } else {
      this.targetCameraPos.copy(this.defaultCameraPos);
    }
  }

  public triggerWarp(strength: number = 1.4) {
    this.warpTime = 0.0;
    this.warpPower = strength;
    if (this.sporeMat) {
      this.sporeMat.uniforms.uWarpTime.value = 0.0;
      this.sporeMat.uniforms.uWarpPower.value = strength;
    }
    this.triggerRipple(new THREE.Vector3(0, 0, 0), strength);
  }

  public triggerRipple(origin?: THREE.Vector3, intensity: number = 1.0) {
    if (origin) {
      this.rippleOrigin.copy(origin);
    } else {
      this.rippleOrigin.copy(this.targetPointerWorld);
    }
    this.rippleTime = 0.0;
    this.rippleIntensity = intensity;

    if (this.callbacks.onRipple) {
      this.callbacks.onRipple();
    }
  }

  public setFresnelColor(paletteKeyOrHex: string) {
    const palette = getPaletteByKey(paletteKeyOrHex);
    const prim = new THREE.Color(palette.hex);
    const sec = new THREE.Color(palette.secondaryHex);

    if (this.sporeMat) {
      this.sporeMat.uniforms.uColorA.value = prim;
      this.sporeMat.uniforms.uColorB.value = sec;
    }
  }

  // =========================================================================
  // TRANSFORMS & RENDER LOOP
  // =========================================================================
  private updateSphereTransforms(elapsed: number) {
    if (!this.celestialMesh) return;
    const dummy = new THREE.Object3D();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    for (let i = 0; i < 7; i++) {
      const sphere = SPHERES[i];
      const p = PERSONA_PROFILES[i];
      const coords = calculateSphereCoordinates(sphere, elapsed);

      // Center offset for mobile vs desktop
      const cx = isMobile ? coords.x : coords.x + (i === 0 ? 3.0 : 0);
      const cy = isMobile ? coords.y + 1.2 : coords.y;
      const cz = coords.z;

      dummy.position.set(cx, cy, cz);
      dummy.scale.setScalar(p.scale);
      dummy.rotation.y = elapsed * (0.2 + (i + 1) * 0.05);
      dummy.rotation.x = Math.sin(elapsed * 0.3 + i) * 0.2;
      dummy.updateMatrix();

      this.celestialMesh.setMatrixAt(i, dummy.matrix);
    }

    this.celestialMesh.instanceMatrix.needsUpdate = true;
  }

  private handlePointer = (clientX: number, clientY: number) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const hit = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.interactionPlane, hit)) {
      this.targetPointerWorld.copy(hit);
    }
  };

  private onPointerMove = (e: PointerEvent) => this.handlePointer(e.clientX, e.clientY);
  private onPointerDown = (e: PointerEvent) => {
    this.handlePointer(e.clientX, e.clientY);
    this.triggerRipple(this.targetPointerWorld, 1.25);
  };
  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) this.handlePointer(e.touches[0].clientX, e.touches[0].clientY);
  };
  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      this.handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      this.triggerRipple(this.targetPointerWorld, 1.25);
    }
  };

  private onScroll = () => {
    if (this.isHolographicMode) return;
    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    const isMobile = window.innerWidth < 768;
    this.targetCameraPos.z = 12 - progress * 4.5;
    this.targetCameraPos.y = -progress * 2.5;
    this.targetCameraPos.x = isMobile ? 0 : Math.sin(progress * Math.PI) * 2.2;
  };

  private onResize = () => {
    if (this.isDestroyed) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private onVisibilityChange = () => {
    if (document.hidden) {
      this.isPaused = true;
    } else {
      this.isPaused = false;
      this.lastTime = performance.now();
    }
  };

  private onContextLost = (e: Event) => {
    e.preventDefault();
    this.isPaused = true;
  };

  private onContextRestored = () => {
    this.isPaused = false;
    this.lastTime = performance.now();
  };

  private bindEvents() {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.canvas.addEventListener('webglcontextlost', this.onContextLost, false);
    this.canvas.addEventListener('webglcontextrestored', this.onContextRestored, false);
  }

  private unbindEvents() {
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
  }

  private startLoop() {
    const animate = (currentTime: number) => {
      if (this.isDestroyed) return;
      this.rafId = requestAnimationFrame(animate);

      if (this.isPaused) return;

      const delta = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      // Telemetry calculation
      this.frameCount++;
      this.fpsTimer += delta;

      if (this.fpsTimer >= 0.5) {
        this.currentFps = Math.round(this.frameCount / this.fpsTimer);
        this.frameCount = 0;
        this.fpsTimer = 0;

        if (this.callbacks.onTelemetry) {
          const drawCalls = this.renderer.info.render.calls;
          const active = SPHERES[this.focusedSphereIndex]?.name || 'Froerybell';
          this.callbacks.onTelemetry({
            fps: this.currentFps,
            particles: this.sporeGeo?.attributes?.position?.count || 35000,
            coords: `[${this.pointerNdc.x.toFixed(2)}, ${this.pointerNdc.y.toFixed(2)}]`,
            tier: this.tier.name,
            activeSphere: active,
            drawCalls: drawCalls
          });
        }
      }

      const elapsed = currentTime * 0.001;

      // 1. Zero-heap Web Audio FFT analysis bridge
      if (this.audioAnalyzer) {
        this.audioAnalyzer.getAudioBands(this.scratchBands);
        this.audioUniformVec[0] = this.scratchBands.low;
        this.audioUniformVec[1] = this.scratchBands.mid;
        this.audioUniformVec[2] = this.scratchBands.high;
        this.audioUniformVec[3] = this.scratchBands.energy;
      } else {
        this.audioUniformVec[0] = 0;
        this.audioUniformVec[1] = 0;
        this.audioUniformVec[2] = 0;
        this.audioUniformVec[3] = 0;
      }

      // 2. Update Shaders Time & Audio Uniforms
      if (this.celestialMat) {
        this.celestialMat.uniforms.uTime.value = elapsed;
        this.celestialMat.uniforms.uAudioBands.value = this.audioUniformVec;
      }
      if (this.sporeMat) {
        this.sporeMat.uniforms.uTime.value = elapsed;
        this.sporeMat.uniforms.uAudioBands.value = this.audioUniformVec;
        this.sporeMat.uniforms.uMouse.value.lerp(this.targetPointerWorld, 0.12);
      }

      // 3. Shockwave Warp propagation
      if (this.warpPower > 0) {
        this.warpTime += delta;
        if (this.sporeMat) {
          this.sporeMat.uniforms.uWarpTime.value = this.warpTime;
        }
        if (this.warpTime > 2.5) {
          this.warpPower = 0;
        }
      }

      // 4. Smooth focus transition across 7 spheres
      const focusAttr = this.celestialMesh?.geometry?.getAttribute('aFocusProgress') as THREE.InstancedBufferAttribute;
      if (focusAttr) {
        for (let i = 0; i < 7; i++) {
          this.focusProgressArray[i] += (this.targetFocusArray[i] - this.focusProgressArray[i]) * 0.08;
          focusAttr.setX(i, this.focusProgressArray[i]);
        }
        focusAttr.needsUpdate = true;
      }

      // 5. Update Exploded Blueprint mode
      this.explodeProgress += (this.targetExplodeProgress - this.explodeProgress) * 0.08;
      if (this.holographicGroup.visible) {
        this.holographicMaterials.forEach(m => {
          if (m.uniforms.uTime) m.uniforms.uTime.value = elapsed;
          if (m.uniforms.uExplodeProgress) m.uniforms.uExplodeProgress.value = this.explodeProgress;
        });
        if (this.explodeProgress < 0.01 && !this.isHolographicMode) {
          this.holographicGroup.visible = false;
        }
      }

      // 6. Multi-Sphere Transforms
      this.updateSphereTransforms(elapsed);

      // 7. Camera Smooth Interpolation
      if (!this.isHolographicMode && this.focusedSphereIndex > 0) {
        const s = SPHERES[this.focusedSphereIndex];
        const sCoord = calculateSphereCoordinates(s, elapsed);
        const targetCam = new THREE.Vector3(sCoord.x * 0.7, sCoord.y * 0.7 + 1.5, sCoord.z * 0.7 + 5.5);
        this.camera.position.lerp(targetCam, 0.05);
        this.camera.lookAt(sCoord.x, sCoord.y, sCoord.z);
      } else {
        this.camera.position.lerp(this.targetCameraPos, 0.05);
        this.camera.lookAt(0, 0, 0);
      }

      // 8. Render Scene
      this.renderer.render(this.scene, this.camera);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  // =========================================================================
  // DEEP DISPOSAL & TEARDOWN
  // =========================================================================
  public dispose() {
    this.isDestroyed = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.unbindEvents();

    if (this.celestialMesh) {
      this.celestialMesh.geometry.dispose();
      this.celestialMat.dispose();
      this.scene.remove(this.celestialMesh);
    }

    if (this.orbitalRingsMesh) {
      this.orbitalRingsMesh.geometry.dispose();
      (this.orbitalRingsMesh.material as THREE.Material).dispose();
      this.scene.remove(this.orbitalRingsMesh);
    }

    if (this.spores) {
      this.sporeGeo.dispose();
      this.sporeMat.dispose();
      this.scene.remove(this.spores);
    }

    this.holographicGroup.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    this.scene.remove(this.holographicGroup);

    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
