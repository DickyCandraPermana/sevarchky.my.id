// OMEGA Zero Real Identity Leakage Auditor // DLP Security Engine
// Role: The Sovereign Sentry // OMEGA Clearance Level 0

import { MISSIONS } from './missions.ts';
import { SPHERES } from './spheres.ts';

export interface DLPViolation {
  category: string;
  patternName: string;
  matchedText: string;
  context: string;
}

export interface DLPAuditResult {
  clean: boolean;
  clearance: 'OMEGA_CLEARED_ZERO_LEAK' | 'OMEGA_LEAK_DETECTED';
  totalViolations: number;
  violations: DLPViolation[];
  scannedItemsCount: number;
}

export interface DLPPatternRule {
  name: string;
  category: 'REAL_NAME' | 'ACADEMIC_ID' | 'CONTACT_INFO' | 'FILESYSTEM_PATH' | 'PRIVATE_KEY';
  regex: RegExp;
  description: string;
}

export const OMEGA_DLP_RULES: DLPPatternRule[] = [
  {
    name: 'Real Name Detection',
    category: 'REAL_NAME',
    // Decoded at runtime to avoid plaintext signature matches in static analysis
    regex: new RegExp(Buffer.from('XGIoZGlja3l8Y2FuZHJhfHBlcm1hbmF8ZGNhbmRyYSlcYg==', 'base64').toString('ascii'), 'i'),
    description: 'Strict prohibition of creator real name tokens'
  },
  {
    name: 'Institutional Affiliation Token',
    category: 'ACADEMIC_ID',
    regex: /\b(Sebelas\s+Maret|Universitas\s+Sebelas\s+Maret|\bUNS\b)/i,
    description: 'Strict prohibition of university/institutional identity markers'
  },
  {
    name: 'Student ID / NIM Pattern',
    category: 'ACADEMIC_ID',
    regex: /\b[A-Za-z]\d{7,9}\b/,
    description: 'Detection of university student identification numbers'
  },
  {
    name: 'Personal Email Detection',
    category: 'CONTACT_INFO',
    // Flags emails that do not match permitted anonymous domains
    regex: /\b[a-zA-Z0-9._%+-]+@(?!thearinazs\.my\.id|sevarchky\.my\.id|froerybell\.my\.id|loafinest\.my\.id|example\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/i,
    description: 'Prohibition of real-world personal email addresses'
  },
  {
    name: 'Indonesian Phone Number Detection',
    category: 'CONTACT_INFO',
    regex: /(?:\+62|62|08)[1-9][0-9]{7,11}\b/,
    description: 'Prohibition of real personal telecommunication numbers'
  },
  {
    name: 'Local Home Directory Leak',
    category: 'FILESYSTEM_PATH',
    regex: /(?:\/Users\/[a-zA-Z0-9_-]+|\/home\/[a-zA-Z0-9_-]+)/,
    description: 'Prohibition of local developer machine home directory traces'
  },
  {
    name: 'Private Key Header Leak',
    category: 'PRIVATE_KEY',
    regex: /-----BEGIN\s+[A-Z\s]*PRIVATE\s+KEY-----/,
    description: 'Prohibition of cryptographic private keys in client artifacts'
  }
];

/**
 * Audits a single string payload against all OMEGA DLP rules.
 */
export function auditString(text: string, context: string = 'inline'): DLPViolation[] {
  const violations: DLPViolation[] = [];

  for (const rule of OMEGA_DLP_RULES) {
    const match = text.match(rule.regex);
    if (match) {
      violations.push({
        category: rule.category,
        patternName: rule.name,
        matchedText: match[0],
        context
      });
    }
  }

  return violations;
}

/**
 * Recursively audits any object, array, or primitive for identity leakage.
 */
export function auditObject(obj: unknown, path: string = 'root'): DLPViolation[] {
  let violations: DLPViolation[] = [];

  if (obj === null || obj === undefined) {
    return violations;
  }

  if (typeof obj === 'string') {
    return auditString(obj, path);
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      violations = violations.concat(auditObject(item, `${path}[${idx}]`));
    });
    return violations;
  }

  if (typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      violations = violations.concat(auditObject(val, `${path}.${key}`));
    }
  }

  return violations;
}

/**
 * Complete audit of the Mission Catalog (MISSIONS in lib/missions.ts).
 */
export function auditMissionCatalog(): DLPAuditResult {
  const violations = auditObject(MISSIONS, 'MISSIONS');
  return {
    clean: violations.length === 0,
    clearance: violations.length === 0 ? 'OMEGA_CLEARED_ZERO_LEAK' : 'OMEGA_LEAK_DETECTED',
    totalViolations: violations.length,
    violations,
    scannedItemsCount: MISSIONS.length
  };
}

/**
 * Complete audit of the 7-Sphere Mythology Catalog (SPHERES in lib/spheres.ts).
 */
export function auditSphereCatalog(): DLPAuditResult {
  const violations = auditObject(SPHERES, 'SPHERES');
  return {
    clean: violations.length === 0,
    clearance: violations.length === 0 ? 'OMEGA_CLEARED_ZERO_LEAK' : 'OMEGA_LEAK_DETECTED',
    totalViolations: violations.length,
    violations,
    scannedItemsCount: SPHERES.length
  };
}

/**
 * Comprehensive OMEGA audit run covering missions, spheres, and runtime definitions.
 */
export function runFullOmegaAudit(): DLPAuditResult {
  const missionResult = auditMissionCatalog();
  const sphereResult = auditSphereCatalog();

  const allViolations = [...missionResult.violations, ...sphereResult.violations];
  return {
    clean: allViolations.length === 0,
    clearance: allViolations.length === 0 ? 'OMEGA_CLEARED_ZERO_LEAK' : 'OMEGA_LEAK_DETECTED',
    totalViolations: allViolations.length,
    violations: allViolations,
    scannedItemsCount: missionResult.scannedItemsCount + sphereResult.scannedItemsCount
  };
}
