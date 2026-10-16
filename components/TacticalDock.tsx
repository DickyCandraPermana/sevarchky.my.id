'use client';

import { useState, useEffect } from 'react';
import { FresnelColorAnchor, FRESNEL_PALETTES } from '../lib/performance.ts';
import { cyberAudio } from '../lib/audio.ts';
import { SPHERES, SphereData } from '../lib/spheres.ts';

interface TacticalDockProps {
  onWarp: () => void;
  onPaletteChange: (palette: FresnelColorAnchor) => void;
  onOpenTerminal: () => void;
  activeSphere?: SphereData;
  onSelectSphere?: (sphere: SphereData) => void;
}

const SPHERE_COLORS: Record<string, string> = {
  froerybell: '#D8B4FE',
  thearinazs: '#00FF66',
  sevarchky: '#00F0FF',
  loafinest: '#FDBA74',
  aethelgard: '#6366F1',
  morphius: '#E2E8F0',
  astralnox: '#10B981'
};

export function TacticalDock({
  onWarp,
  onPaletteChange,
  onOpenTerminal,
  activeSphere = SPHERES[0],
  onSelectSphere
}: TacticalDockProps) {
  const [selectedPaletteKey, setSelectedPaletteKey] = useState('violet');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);
  const [sphereMenuOpen, setSphereMenuOpen] = useState(false);
  const [spectrumBands, setSpectrumBands] = useState<number[]>([15, 25, 40, 20, 10]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAudioEnabled) {
      interval = setInterval(() => {
        setSpectrumBands([
          Math.min(95, Math.floor(20 + Math.random() * 75)),
          Math.min(95, Math.floor(30 + Math.random() * 65)),
          Math.min(95, Math.floor(40 + Math.random() * 55)),
          Math.min(95, Math.floor(25 + Math.random() * 60)),
          Math.min(95, Math.floor(15 + Math.random() * 70))
        ]);
      }, 90);
    } else {
      setSpectrumBands([12, 18, 24, 16, 10]);
    }
    return () => clearInterval(interval);
  }, [isAudioEnabled]);

  const handlePaletteSelect = (palette: FresnelColorAnchor) => {
    setSelectedPaletteKey(palette.key);
    onPaletteChange(palette);
    setPaletteMenuOpen(false);
    cyberAudio.playRipple(800);
  };

  const handleSphereSelect = (sphere: SphereData) => {
    if (onSelectSphere) {
      onSelectSphere(sphere);
    }
    setSphereMenuOpen(false);
    cyberAudio.playTone(sphere.frequencyHz, 1.8);
  };

  const toggleAudio = () => {
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);
    cyberAudio.setEnabled(next);
    if (next) {
      cyberAudio.playBowl(activeSphere.frequencyHz);
    }
  };

  const handleWarp = () => {
    cyberAudio.playShockwave();
    onWarp();
  };

  const activeSphereColor = SPHERE_COLORS[activeSphere.id] || '#c084fc';

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="relative flex flex-wrap items-center gap-1.5 sm:gap-2.5 p-2 sm:p-2.5 rounded-full bg-[#0a0718]/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_45px_rgba(0,0,0,0.7)] pointer-events-auto">

        {/* 7-Spheres Celestial Orbit Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setSphereMenuOpen(!sphereMenuOpen);
              setPaletteMenuOpen(false);
              cyberAudio.playRipple(600);
            }}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-mono bg-white/[0.04] hover:bg-white/[0.09] text-zinc-300 border border-white/[0.08] transition-all cursor-pointer"
            title="Switch Celestial Sphere Persona"
          >
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: activeSphereColor }}
            />
            <span className="font-semibold text-white tracking-wider">
              {activeSphere.id.toUpperCase()}
            </span>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">
              {activeSphere.frequencyHz}Hz
            </span>
          </button>

          {/* Sphere Dropdown */}
          {sphereMenuOpen && (
            <div className="absolute bottom-full left-0 mb-3 w-56 rounded-2xl bg-[#0c081e]/95 backdrop-blur-2xl border border-white/[0.15] p-2 shadow-2xl flex flex-col gap-1 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-widest text-zinc-500 border-b border-white/[0.06]">
                // 7 SPHERES CELESTIAL ROSTER
              </div>
              {SPHERES.map((sphere) => {
                const isSelected = activeSphere.id === sphere.id;
                const sphereColor = SPHERE_COLORS[sphere.id] || '#c084fc';
                return (
                  <button
                    key={sphere.id}
                    type="button"
                    onClick={() => handleSphereSelect(sphere)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/20 text-white border border-purple-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: sphereColor }}
                      />
                      <span>{sphere.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {sphere.frequencyHz}Hz
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Warp Shockwave Trigger */}
        <button
          type="button"
          onClick={handleWarp}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-mono text-purple-200 bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/20 hover:border-purple-400/40 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.15)]"
          title="Trigger 3D Shockwave Warp Impulse"
        >
          <span className="animate-spin text-purple-400">✦</span>
          <span className="hidden sm:inline font-medium">WARP</span>
        </button>

        {/* Palette Switcher Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setPaletteMenuOpen(!paletteMenuOpen);
              setSphereMenuOpen(false);
              cyberAudio.playRipple(600);
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-mono text-zinc-300 bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] transition-all cursor-pointer"
            title="Chromatic Iridescence Palette"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor:
                  FRESNEL_PALETTES.find((p) => p.key === selectedPaletteKey)?.hex || '#c084fc'
              }}
            />
            <span className="hidden md:inline capitalize">{selectedPaletteKey}</span>
          </button>

          {/* Palette Popover */}
          {paletteMenuOpen && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-44 rounded-2xl bg-[#0c081e]/95 backdrop-blur-2xl border border-white/[0.15] p-2 shadow-2xl flex flex-col gap-1 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-widest text-zinc-500 border-b border-white/[0.06]">
                // CHROMATIC THEME
              </div>
              {FRESNEL_PALETTES.map((pal) => (
                <button
                  key={pal.key}
                  type="button"
                  onClick={() => handlePaletteSelect(pal)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left text-xs font-mono transition-all cursor-pointer ${
                    selectedPaletteKey === pal.key
                      ? 'bg-purple-500/20 text-white border border-purple-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: pal.hex }}
                  />
                  <span>{pal.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Audio Toggle & Spectrum Bars */}
        <button
          type="button"
          onClick={toggleAudio}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-mono transition-all cursor-pointer ${
            isAudioEnabled
              ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/[0.08]'
          }`}
          title="Toggle Web Audio Procedural Synthesizer"
        >
          {/* Mini Spectrum Visualizer Bars */}
          <div className="flex items-end gap-0.5 h-3">
            {spectrumBands.map((height, i) => (
              <span
                key={i}
                className="w-0.5 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(15, height)}%`,
                  backgroundColor: isAudioEnabled ? '#34d399' : '#71717a'
                }}
              />
            ))}
          </div>
          <span className="hidden sm:inline font-medium">
            {isAudioEnabled ? `${activeSphere.frequencyHz}Hz` : 'MUTE'}
          </span>
        </button>

        {/* Command Codex Button (⌘K) */}
        <button
          type="button"
          onClick={() => {
            cyberAudio.playRipple(700);
            onOpenTerminal();
          }}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
          title="Open Command Codex (⌘K)"
        >
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 font-mono">⌘K</span>
          <span className="hidden md:inline font-light">CODEX</span>
        </button>

      </div>
    </div>
  );
}
