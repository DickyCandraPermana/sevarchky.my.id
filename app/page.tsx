'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PortfolioCanvas } from '../components/PortfolioCanvas.tsx';
import { TelemetryFeed } from '../components/TelemetryFeed.tsx';
import { TacticalHeader } from '../components/TacticalHeader.tsx';
import { ShowcaseDeck } from '../components/ShowcaseDeck.tsx';
import { TacticalDock } from '../components/TacticalDock.tsx';
import { MissionModal } from '../components/MissionModal.tsx';
import { TerminalModal } from '../components/TerminalModal.tsx';
import { PortfolioEngine, EngineTelemetry } from '../lib/engine.ts';
import { Mission, getMissionById } from '../lib/missions.ts';
import { FresnelColorAnchor, getPaletteByKey } from '../lib/performance.ts';
import { TerminalAction } from '../lib/terminal.ts';
import { SPHERES, SphereData, getSphereById } from '../lib/spheres.ts';
import { cyberAudio } from '../lib/audio.ts';

export default function PortfolioPage() {
  const engineRef = useRef<PortfolioEngine | null>(null);

  const [telemetry, setTelemetry] = useState<EngineTelemetry>({
    fps: 60,
    particles: 35000,
    coords: '[0.00, 0.00]',
    tier: 'Tier 3 (TBDR Desktop Ultra)',
    activeSphere: 'Froerybell',
    drawCalls: 2
  });

  const [activeSphere, setActiveSphere] = useState<SphereData>(SPHERES[0]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleSelectSphere = useCallback((sphere: SphereData) => {
    setActiveSphere(sphere);
    if (engineRef.current) {
      engineRef.current.focusSphere(sphere.id);
    }
  }, []);

  const handleSelectMission = useCallback((mission: Mission | null) => {
    setActiveMission(mission);
    if (engineRef.current) {
      engineRef.current.setHolographicMode(Boolean(mission), mission?.code);
    }
  }, []);

  const handleWarp = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.triggerWarp(1.8);
    }
  }, []);

  const handlePaletteChange = useCallback((palette: FresnelColorAnchor) => {
    if (engineRef.current) {
      engineRef.current.setFresnelColor(palette.key);
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') {
        return;
      }

      // ⌘K or Ctrl+K opens command codex
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
        return;
      }

      // Keys '1' through '7' switch celestial spheres
      if (e.key >= '1' && e.key <= '7') {
        const sphereIndex = parseInt(e.key, 10) - 1;
        if (sphereIndex >= 0 && sphereIndex < SPHERES.length) {
          const sp = SPHERES[sphereIndex];
          handleSelectSphere(sp);
          cyberAudio.playTone(sp.frequencyHz, 1.5);
        }
      }

      // Space key triggers warp shockwave
      if (e.code === 'Space' && !activeMission && !isTerminalOpen) {
        e.preventDefault();
        cyberAudio.playShockwave();
        handleWarp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectSphere, handleWarp, activeMission, isTerminalOpen]);

  const handleTelemetry = useCallback((data: EngineTelemetry) => {
    setTelemetry(data);
  }, []);

  const handleTerminalAction = useCallback((action: TerminalAction) => {
    switch (action.type) {
      case 'TRIGGER_WARP':
        cyberAudio.playShockwave();
        handleWarp();
        break;
      case 'SET_ORBIT':
        if (action.payload) {
          const sp =
            getSphereById(action.payload) ||
            SPHERES.find((s) => s.name.toLowerCase() === action.payload.toLowerCase()) ||
            SPHERES.find((s) => s.code.toLowerCase() === action.payload.toLowerCase());
          if (sp) {
            handleSelectSphere(sp);
            cyberAudio.playTone(sp.frequencyHz, 1.8);
          }
        }
        break;
      case 'SET_FREQ':
        if (action.payload) {
          const freq = parseFloat(action.payload);
          if (!isNaN(freq)) {
            cyberAudio.playTone(freq, 2.0);
            handleWarp();
          }
        }
        break;
      case 'SET_PALETTE':
        if (action.payload) {
          const pal = getPaletteByKey(action.payload);
          handlePaletteChange(pal);
        }
        break;
      case 'OPEN_MISSION':
        if (action.payload) {
          const mission = getMissionById(action.payload);
          if (mission) {
            handleSelectMission(mission);
          }
        }
        break;
      default:
        break;
    }
  }, [handleWarp, handleSelectSphere, handlePaletteChange, handleSelectMission]);

  return (
    <main className="relative min-h-screen w-full bg-[#080612] overflow-x-hidden selection:bg-purple-300 selection:text-zinc-950">
      {/* Layer 0: High-Performance 3D WebGL 7-Spheres Celestial & Curl Spore Canvas */}
      {mounted && (
        <PortfolioCanvas
          onTelemetry={handleTelemetry}
          engineRef={engineRef}
          onSphereSelect={handleSelectSphere}
        />
      )}

      {/* Layer 1: Ethereal Ambient Radial Lighting & Subtle Dream Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(circle at 75% 25%, rgba(216, 180, 254, 0.08) 0%, transparent 55%), radial-gradient(circle at 25% 75%, rgba(110, 231, 183, 0.05) 0%, transparent 60%)'
        }}
      />

      {/* Layer 2: Editorial Stream Container */}
      <div className="relative z-20 flex flex-col min-h-screen pb-[calc(env(safe-area-inset-bottom,0px)+140px)]">
        <TelemetryFeed telemetry={telemetry} activeSphere={activeSphere} />
        <TacticalHeader />
        <ShowcaseDeck onSelectMission={handleSelectMission} />
      </div>

      {/* Floating Fluid Glass Dock */}
      <TacticalDock
        onWarp={handleWarp}
        onPaletteChange={handlePaletteChange}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        activeSphere={activeSphere}
        onSelectSphere={handleSelectSphere}
      />

      {/* Modals & Drawers */}
      <MissionModal
        mission={activeMission}
        onClose={() => handleSelectMission(null)}
      />

      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        telemetry={telemetry}
        onAction={handleTerminalAction}
      />
    </main>
  );
}
