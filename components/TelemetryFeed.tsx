'use client';

import { EngineTelemetry } from '../lib/engine.ts';
import { SphereData, SPHERES } from '../lib/spheres.ts';

interface TelemetryFeedProps {
  telemetry: EngineTelemetry;
  activeSphere?: SphereData;
}

export function TelemetryFeed({ telemetry, activeSphere = SPHERES[0] }: TelemetryFeedProps) {
  return (
    <div className="fixed top-5 right-5 z-20 pointer-events-none hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 text-xs text-zinc-400 shadow-sm font-mono">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        <span className="text-zinc-300 font-medium">{telemetry.fps} FPS</span>
      </div>
      <span className="text-zinc-600">•</span>
      <span className="text-emerald-400/90 text-[11px] font-medium tracking-tight">DC: 2</span>
      <span className="text-zinc-600">•</span>
      <span>{telemetry.particles.toLocaleString()} curl spores</span>
      <span className="text-zinc-600">•</span>
      <span className="text-purple-300/90 text-[11px] font-semibold">{activeSphere.name.toUpperCase()} [{activeSphere.frequencyHz}Hz]</span>
    </div>
  );
}
