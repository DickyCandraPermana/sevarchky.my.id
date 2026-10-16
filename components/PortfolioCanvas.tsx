'use client';

import { useEffect, useRef } from 'react';
import { PortfolioEngine, EngineTelemetry } from '../lib/engine.ts';
import { SphereData } from '../lib/spheres.ts';
import { cyberAudio } from '../lib/audio.ts';

interface PortfolioCanvasProps {
  onTelemetry?: (telemetry: EngineTelemetry) => void;
  engineRef?: React.MutableRefObject<PortfolioEngine | null>;
  onSphereSelect?: (sphere: SphereData) => void;
}

export function PortfolioCanvas({ onTelemetry, engineRef, onSphereSelect }: PortfolioCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new PortfolioEngine(canvasRef.current, {
      onTelemetry,
      onSphereSelect
    });

    // Zero-heap Web Audio Analyser Uniforms Bridge
    engine.setAudioAnalyzer(cyberAudio);

    if (engineRef) {
      engineRef.current = engine;
    }

    return () => {
      engine.dispose();
      if (engineRef) {
        engineRef.current = null;
      }
    };
  }, [onTelemetry, engineRef, onSphereSelect]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto z-0 block"
      style={{ touchAction: 'none' }}
    />
  );
}
