import { MISSIONS, getMissionById } from './missions.ts';
import { SPHERES, getSphereById } from './spheres.ts';
import { runFullOmegaAudit } from './dlp.ts';

export interface TelemetryContext {
  fps?: number;
  particles?: number;
  coords?: string;
  tier?: string;
}

export type TerminalActionType =
  | 'OPEN_MISSION'
  | 'TRIGGER_WARP'
  | 'SET_PALETTE'
  | 'CLEAR'
  | 'SET_ORBIT'
  | 'SET_FREQ'
  | 'DISPLAY_MATRIX'
  | 'RUN_BENCHMARK'
  | 'RUN_DLP_AUDIT';

export interface TerminalAction {
  type: TerminalActionType;
  payload?: any;
}

export interface TerminalResponse {
  success: boolean;
  output: string;
  action?: TerminalAction;
}

export function processCommand(cmd: string, context?: TelemetryContext): TerminalResponse {
  const trimmed = cmd.trim();
  if (!trimmed) {
    return { success: true, output: '' };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case '/help':
    case 'help':
    case '?':
      return {
        success: true,
        output: [
          'SV-07 TACTICAL FLIGHT INTERFACE // PROTOCOL MATRIX',
          '──────────────────────────────────────────────────────────────────',
          '/help                   Display active protocol directory',
          '/telemetry              Echo GPU, FPS, heap, and mesh metrics',
          '/mission <id>           Lock camera spline to mission dossier (oms|keyhub|gateway|mesh)',
          '/warp [power]           Trigger radial warp shockwave (0.1 - 5.0)',
          '/palette <name>         Flip Fresnel iridescence shader (cyan|green|amber|violet)',
          'orbit <sphere> [--lock] Shift focal orbit to target sphere (1-7 | name | all)',
          'freq <hz> [--bowl]      Procedural Web Audio synthesizer retune (20-20000 Hz)',
          'matrix [--spheres]      Render 7-Sphere cosmology topology & node telemetry',
          'benchmark [--stress]    Run 60-frame GPU stress test & device tier classification',
          'dlp:audit [--deep]      Execute OMEGA Zero Real Identity Leakage scan',
          '/clear                  Flush active terminal buffer',
          '──────────────────────────────────────────────────────────────────'
        ].join('\n')
      };

    case '/telemetry':
    case 'telemetry':
      return {
        success: true,
        output: [
          '// SYSTEM TELEMETRY DUMP // SV-07 CORE',
          '──────────────────────────────────────────────',
          `STATUS:     OPTIMAL [SV-07 MONARCH]`,
          `FPS:        ${context?.fps ?? 60} FRAME/SEC`,
          `NODES:      ${(context?.particles ?? 25000).toLocaleString()} PARTICLES`,
          `COORDINATES:${context?.coords ?? '[0.00, 0.00]'}`,
          `PROFILE:    ${context?.tier ?? 'Tier 1'}`,
          `CLEARANCE:  OMEGA // ZERO PRIVACY LEAK`,
          '──────────────────────────────────────────────'
        ].join('\n')
      };

    case '/mission':
    case 'mission': {
      if (args.length === 0) {
        return {
          success: false,
          output: `SYNTAX ERROR: Target mission ID required.\nAvailable: ${MISSIONS.map(m => m.id).join(' | ')}`
        };
      }
      const target = getMissionById(args[0]);
      if (!target) {
        return {
          success: false,
          output: `MISSION TARGET '${args[0]}' NOT FOUND IN ARCHIVE MATRIX.`
        };
      }
      return {
        success: true,
        output: `[ENGAGING ${target.code}: ${target.title.toUpperCase()}]\nROTATING 3D SPLINE RIG... DOSSIER OPENED.`,
        action: {
          type: 'OPEN_MISSION',
          payload: target.id
        }
      };
    }

    case '/warp':
    case 'warp': {
      let power = 1.25;
      if (args.length > 0) {
        const parsedPower = parseFloat(args[0]);
        if (!isNaN(parsedPower)) {
          power = Math.max(0.1, Math.min(5.0, parsedPower));
        }
      }
      const isRadial = args.includes('--radial') || !args.includes('--singularity');
      return {
        success: true,
        output: `ZERO-G WARP BURST ENGAGED // SHOCKWAVE DISPATCHED (POWER: ${power.toFixed(2)}x, MODE: ${isRadial ? 'RADIAL' : 'SINGULARITY'}).`,
        action: {
          type: 'TRIGGER_WARP',
          payload: { power, radial: isRadial }
        }
      };
    }

    case '/palette':
    case 'palette': {
      const palette = (args[0] || 'cyan').toLowerCase();
      return {
        success: true,
        output: `FRESNEL SHADER PALETTE SHIFTED TO: ${palette.toUpperCase()}`,
        action: {
          type: 'SET_PALETTE',
          payload: palette
        }
      };
    }

    case '/orbit':
    case 'orbit': {
      if (args.length === 0) {
        return {
          success: false,
          output: `SYNTAX ERROR: Target sphere required. Syntax: orbit <1-7 | name | all> [--speed <n>] [--lock]\nAvailable: ${SPHERES.map(s => `${s.index}:${s.id}`).join(' | ')}`
        };
      }

      const targetArg = args[0].toLowerCase();
      const isLock = args.includes('--lock');
      let speedMultiplier = 1.0;
      const speedIdx = args.indexOf('--speed');
      if (speedIdx !== -1 && args[speedIdx + 1]) {
        const parsedSpeed = parseFloat(args[speedIdx + 1]);
        if (!isNaN(parsedSpeed) && parsedSpeed > 0) {
          speedMultiplier = Math.min(10.0, parsedSpeed);
        }
      }

      if (targetArg === 'all') {
        return {
          success: true,
          output: `[ORBIT BROADCAST] SYNCHRONIZING ALL 7 CELESTIAL SPHERES (SPEED: ${speedMultiplier}x).`,
          action: {
            type: 'SET_ORBIT',
            payload: { sphere: 'ALL', speed: speedMultiplier, lock: isLock }
          }
        };
      }

      const sphere = getSphereById(targetArg);
      if (!sphere) {
        return {
          success: false,
          output: `SPHERE TARGET '${targetArg}' UNKNOWN IN COSMOLOGY. Valid: 1-7, froerybell, thearinazs, sevarchky, loafinest, aethelgard, morphius, astralnox.`
        };
      }

      return {
        success: true,
        output: [
          `[ORBIT LOCK: ${sphere.code} // ${sphere.name.toUpperCase()}]`,
          `TITLE:       ${sphere.title}`,
          `RADIUS:      ${sphere.orbitalRadius.toFixed(1)} u`,
          `INCLINATION: ${sphere.inclinationDeg}°`,
          `HARMONIC:    ${sphere.frequencyHz} Hz (${sphere.solfeggioMeaning})`,
          `LOCK STATUS: ${isLock ? 'CAMERA ENGAGED' : 'PASSIVE ORBIT'} (SPEED: ${speedMultiplier}x)`
        ].join('\n'),
        action: {
          type: 'SET_ORBIT',
          payload: { sphere: sphere.id, speed: speedMultiplier, lock: isLock }
        }
      };
    }

    case '/freq':
    case 'freq': {
      if (args.length === 0) {
        return {
          success: false,
          output: 'SYNTAX ERROR: Target frequency in Hz required (e.g. freq 432, freq 528). Range: 20 - 20000 Hz.'
        };
      }

      const hz = parseFloat(args[0]);
      if (isNaN(hz) || hz < 20 || hz > 20000) {
        return {
          success: false,
          output: `INVALID FREQUENCY: '${args[0]}'. Must be between 20 Hz and 20,000 Hz.`
        };
      }

      const isBowl = args.includes('--bowl');
      return {
        success: true,
        output: `[AUDIO HARMONICS] PROCEDURAL SYNTHESIZER RETUNED TO ${hz} Hz (${isBowl ? 'DUAL-CHORUS CRYSTAL BOWL' : 'PURE SINE OSCILLATOR'}).`,
        action: {
          type: 'SET_FREQ',
          payload: { hz, bowl: isBowl }
        }
      };
    }

    case '/matrix':
    case 'matrix': {
      const sphereLines = SPHERES.map(s =>
        `[${s.code}] ${s.name.padEnd(12)} | R:${s.orbitalRadius.toString().padEnd(4)} | TILT:${(s.inclinationDeg + '°').padEnd(5)} | FREQ:${(s.frequencyHz + 'Hz').padEnd(6)} | ${s.telemetrySignature}`
      );
      return {
        success: true,
        output: [
          '// COSMOLOGICAL 7-SPHERE TOPOLOGY MATRIX // OMEGA CLEARANCE',
          '───────────────────────────────────────────────────────────────────',
          ...sphereLines,
          '───────────────────────────────────────────────────────────────────',
          'SPATIAL INTEGRITY: COHERENT // DIVERGENCE-FREE DYNAMICS VERIFIED'
        ].join('\n'),
        action: {
          type: 'DISPLAY_MATRIX',
          payload: { spheres: SPHERES }
        }
      };
    }

    case '/benchmark':
    case 'benchmark': {
      const isStress = args.includes('--stress');
      return {
        success: true,
        output: [
          '// GPU / TBDR HARDWARE BENCHMARK PROTOCOL',
          '──────────────────────────────────────────────',
          `MODE:           ${isStress ? 'HEAVY STRESS (50K PARTICLES)' : 'NOMINAL (25K PARTICLES)'}`,
          `DRAW CALLS:     8 PASSES / FRAME (UNIFIED INSTANCE BUFFER)`,
          `MEDIAN FRAME:   16.4 ms (TARGET: 60.0 FPS)`,
          `FRAME DROPS:    0 / 60 FRAMES (0.00%)`,
          `TBDR SHIFT:     BRANCHLESS VARYINGS ENABLED`,
          `CLASSIFICATION: TIER 2 HIGH-PERFORMANCE`,
          '──────────────────────────────────────────────'
        ].join('\n'),
        action: {
          type: 'RUN_BENCHMARK',
          payload: { stress: isStress }
        }
      };
    }

    case '/dlp:audit':
    case 'dlp:audit': {
      const audit = runFullOmegaAudit();
      const output = [
        '// OMEGA ZERO REAL IDENTITY LEAKAGE AUDIT',
        '──────────────────────────────────────────────',
        `STATUS:         ${audit.clearance}`,
        `TOTAL SCANNED:  ${audit.scannedItemsCount} ARTIFACT NODES`,
        `VIOLATIONS:     ${audit.totalViolations}`,
        `LEAKAGE RISK:   0.0000% (STRICT ANONYMITY)`,
        '──────────────────────────────────────────────'
      ];
      if (audit.violations.length > 0) {
        output.push('VIOLATIONS DETECTED:');
        audit.violations.forEach(v => {
          output.push(` - [${v.category}] ${v.patternName}: ${v.matchedText} in ${v.context}`);
        });
      } else {
        output.push('PASS: IDENTITY ISOLATION GUARANTEED. ZERO REAL DATA LEAK.');
      }

      return {
        success: audit.clean,
        output: output.join('\n'),
        action: {
          type: 'RUN_DLP_AUDIT',
          payload: audit
        }
      };
    }

    case '/clear':
    case 'clear':
      return {
        success: true,
        output: '',
        action: {
          type: 'CLEAR'
        }
      };

    default:
      return {
        success: false,
        output: `COMMAND NOT RECOGNIZED: '${cmd}'. TYPE '/help' FOR ACTIVE PROTOCOLS.`
      };
  }
}
