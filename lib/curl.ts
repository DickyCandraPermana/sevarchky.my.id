// Divergence-Free Curl Noise Mathematics for Instanced Kinetic Swarms
// Role: The Sovereign Sentry // OMEGA Clearance

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Standard smooth 3D potential field Ψ(x, y, z) = (ψx, ψy, ψz).
 * Composed of sinusoidal and harmonic combinations simulating turbulent fluid vortices.
 */
export function evaluatePotentialField(p: Vector3D, t: number = 0): Vector3D {
  const k1 = 0.4;
  const k2 = 0.7;
  const k3 = 1.1;

  const psiX = Math.sin(p.y * k1 + t * 0.3) * Math.cos(p.z * k2) + Math.cos(p.x * 0.2);
  const psiY = Math.sin(p.z * k1 + t * 0.4) * Math.cos(p.x * k2) + Math.cos(p.y * 0.2);
  const psiZ = Math.sin(p.x * k1 + t * 0.5) * Math.cos(p.y * k2) + Math.cos(p.z * 0.2);

  return { x: psiX, y: psiY, z: psiZ };
}

/**
 * Computes the discrete curl of the vector potential field Ψ:
 * v = ∇ × Ψ = (∂ψz/∂y - ∂ψy/∂z, ∂ψx/∂z - ∂ψz/∂x, ∂ψy/∂x - ∂ψx/∂y)
 * Uses central finite differences with step size epsilon.
 */
export function computeCurlNoise(p: Vector3D, t: number = 0, eps: number = 1e-4): Vector3D {
  const invTwoEps = 0.5 / eps;

  // Partial derivatives with respect to x
  const pxPlus = evaluatePotentialField({ x: p.x + eps, y: p.y, z: p.z }, t);
  const pxMinus = evaluatePotentialField({ x: p.x - eps, y: p.y, z: p.z }, t);
  const dPsiY_dx = (pxPlus.y - pxMinus.y) * invTwoEps;
  const dPsiZ_dx = (pxPlus.z - pxMinus.z) * invTwoEps;

  // Partial derivatives with respect to y
  const pyPlus = evaluatePotentialField({ x: p.x, y: p.y + eps, z: p.z }, t);
  const pyMinus = evaluatePotentialField({ x: p.x, y: p.y - eps, z: p.z }, t);
  const dPsiX_dy = (pyPlus.x - pyMinus.x) * invTwoEps;
  const dPsiZ_dy = (pyPlus.z - pyMinus.z) * invTwoEps;

  // Partial derivatives with respect to z
  const pzPlus = evaluatePotentialField({ x: p.x, y: p.y, z: p.z + eps }, t);
  const pzMinus = evaluatePotentialField({ x: p.x, y: p.y, z: p.z - eps }, t);
  const dPsiX_dz = (pzPlus.x - pzMinus.x) * invTwoEps;
  const dPsiY_dz = (pzPlus.y - pzMinus.y) * invTwoEps;

  // v = ∇ × Ψ
  const vx = dPsiZ_dy - dPsiY_dz;
  const vy = dPsiX_dz - dPsiZ_dx;
  const vz = dPsiY_dx - dPsiX_dy;

  return { x: vx, y: vy, z: vz };
}

/**
 * Computes numerical divergence of a vector field v at point p:
 * div(v) = ∇ · v = ∂vx/∂x + ∂vy/∂y + ∂vz/∂z
 * For curl noise (v = ∇ × Ψ), the theoretical divergence is identically 0.
 */
export function computeDivergence(
  vectorFieldFn: (pos: Vector3D, t: number) => Vector3D,
  p: Vector3D,
  t: number = 0,
  eps: number = 1e-3
): number {
  const invTwoEps = 0.5 / eps;

  const vxPlus = vectorFieldFn({ x: p.x + eps, y: p.y, z: p.z }, t).x;
  const vxMinus = vectorFieldFn({ x: p.x - eps, y: p.y, z: p.z }, t).x;
  const dVx_dx = (vxPlus - vxMinus) * invTwoEps;

  const vyPlus = vectorFieldFn({ x: p.x, y: p.y + eps, z: p.z }, t).y;
  const vyMinus = vectorFieldFn({ x: p.x, y: p.y - eps, z: p.z }, t).y;
  const dVy_dy = (vyPlus - vyMinus) * invTwoEps;

  const vzPlus = vectorFieldFn({ x: p.x, y: p.y, z: p.z + eps }, t).z;
  const vzMinus = vectorFieldFn({ x: p.x, y: p.y, z: p.z - eps }, t).z;
  const dVz_dz = (vzPlus - vzMinus) * invTwoEps;

  return dVx_dx + dVy_dy + dVz_dz;
}

/**
 * Validates divergence-free invariant across multiple sample test coordinates.
 * Returns true if the maximum absolute divergence across all test points is <= tolerance.
 */
export function verifyDivergenceFree(
  testPoints: Vector3D[],
  tolerance: number = 1e-3
): { passes: boolean; maxDivergence: number; failures: Array<{ point: Vector3D; div: number }> } {
  let maxDivergence = 0;
  const failures: Array<{ point: Vector3D; div: number }> = [];

  for (const pt of testPoints) {
    const div = Math.abs(computeDivergence(computeCurlNoise, pt));
    if (div > maxDivergence) {
      maxDivergence = div;
    }
    if (div > tolerance) {
      failures.push({ point: pt, div });
    }
  }

  return {
    passes: failures.length === 0,
    maxDivergence,
    failures
  };
}

/**
 * Validates bounded velocity invariant (prevents particle coordinate blowup / NaN).
 */
export function verifyBoundedVelocity(
  testPoints: Vector3D[],
  maxMagnitudeLimit: number = 10.0
): { passes: boolean; maxMagnitude: number } {
  let maxMagnitude = 0;
  for (const pt of testPoints) {
    const v = computeCurlNoise(pt);
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (isNaN(mag) || !isFinite(mag) || mag > maxMagnitudeLimit) {
      return { passes: false, maxMagnitude: mag };
    }
    if (mag > maxMagnitude) {
      maxMagnitude = mag;
    }
  }
  return { passes: true, maxMagnitude };
}
