// Pure Web Audio API Synthesizer — Ethereal Organic Harmonics & Crystal Bowls
// Role: The Sovereign Sentry // OMEGA Audio Architecture

export interface AudioBands {
  low: number;
  mid: number;
  high: number;
  energy: number;
}

export interface IAudioAnalyzerProvider {
  getAudioBands(target: AudioBands): void;
}

export interface FFTConfig {
  fftSize: number;
  frequencyBinCount: number;
  minDecibels: number;
  maxDecibels: number;
  smoothingTimeConstant: number;
}

export const FFT_CONFIG: FFTConfig = {
  fftSize: 1024,
  frequencyBinCount: 512,
  minDecibels: -90,
  maxDecibels: -10,
  smoothingTimeConstant: 0.85
};

export const SOLFEGGIO_FREQUENCIES: Record<string, number> = {
  FROERYBELL: 432,   // Cosmic Grounding & Harmonic Alignment
  THEARINAZS: 528,   // Transformation & Miracles
  SEVARCHKY: 639,    // System Interconnectivity
  LOAFINEST: 174,    // Natural Foundation & Grounding
  AETHELGARD: 741,   // Awakening Intuition & Cleansing Leaks
  MORPHIUS_V: 852,   // High-Dimensional Vector Turbulence
  ASTRALNOX: 963     // Crown Singularity Transcendence
};

/**
 * Calculates dual-chorus detuning harmonics for crystal singing bowls:
 * Fundamental tone f and perfect fifth f * 1.503 producing microtonal beating.
 */
export function calculateHarmonicDetune(freq: number): {
  fundamental: number;
  fifth: number;
  beatFreq: number;
} {
  const fifth = freq * 1.503;
  const beatFreq = Math.abs(fifth - freq * 1.5);
  return {
    fundamental: freq,
    fifth,
    beatFreq
  };
}

/**
 * Validates Web Audio FFT analyzer node parameters against spec.
 */
export function validateFFTConfig(config: FFTConfig): boolean {
  // FFT size must be power of two between 32 and 32768
  const isPowerOfTwo = (config.fftSize & (config.fftSize - 1)) === 0;
  const validSize = isPowerOfTwo && config.fftSize >= 32 && config.fftSize <= 32768;
  const validBin = config.frequencyBinCount === config.fftSize / 2;
  const validSmoothing = config.smoothingTimeConstant >= 0 && config.smoothingTimeConstant <= 1;
  const validDecibels = config.minDecibels < config.maxDecibels;

  return validSize && validBin && validSmoothing && validDecibels;
}

class EtherealAudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  public isMuted: boolean = false;
  private isUnlocked: boolean = false;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (this.ctx) return;
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      this.ctx = new AudioCtxClass();
      try {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = FFT_CONFIG.fftSize;
        this.analyser.smoothingTimeConstant = FFT_CONFIG.smoothingTimeConstant;
        this.analyser.minDecibels = FFT_CONFIG.minDecibels;
        this.analyser.maxDecibels = FFT_CONFIG.maxDecibels;
        this.analyser.connect(this.ctx.destination);
      } catch {}
    }
  }

  public getAnalyser(): AnalyserNode | null {
    if (!this.analyser) {
      this.initContext();
    }
    return this.analyser;
  }

  public getFFTData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  private freqDataScratch: Uint8Array | null = null;

  public getAudioBands(target: AudioBands): void {
    if (!this.analyser) {
      target.low = 0; target.mid = 0; target.high = 0; target.energy = 0;
      return;
    }
    const binCount = this.analyser.frequencyBinCount;
    if (!this.freqDataScratch || this.freqDataScratch.length !== binCount) {
      this.freqDataScratch = new Uint8Array(binCount);
    }
    this.analyser.getByteFrequencyData(this.freqDataScratch as any);

    // Compute spectral energy across frequency bins without GC allocations
    let lowSum = 0;
    const lowEnd = Math.min(16, binCount);
    for (let i = 0; i < lowEnd; i++) lowSum += this.freqDataScratch[i];

    let midSum = 0;
    const midEnd = Math.min(80, binCount);
    for (let i = 16; i < midEnd; i++) midSum += this.freqDataScratch[i];

    let highSum = 0;
    const highEnd = Math.min(256, binCount);
    for (let i = 80; i < highEnd; i++) highSum += this.freqDataScratch[i];

    target.low = lowEnd > 0 ? lowSum / (lowEnd * 255) : 0;
    target.mid = midEnd > 16 ? midSum / ((midEnd - 16) * 255) : 0;
    target.high = highEnd > 80 ? highSum / ((highEnd - 80) * 255) : 0;
    target.energy = (target.low * 0.5 + target.mid * 0.3 + target.high * 0.2);
  }

  public unlock() {
    if (typeof window === 'undefined') return;
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.isUnlocked = true;
      });
    } else {
      this.isUnlocked = true;
    }
  }

  // Soft crystalline water droplet ripple
  public playRipple(baseFreq: number = 620) {
    if (typeof window === 'undefined' || this.isMuted) return;
    this.unlock();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      } else {
        gain.connect(this.ctx.destination);
      }

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // Meditative Singing Crystal Bowl / Ethereal Swell
  public playCrystalBowl(freq: number = 432) {
    if (typeof window === 'undefined' || this.isMuted) return;
    this.unlock();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const detune = calculateHarmonicDetune(freq);

      // Dual detuned oscillators for singing bowl chorus beating
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(detune.fundamental, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(detune.fifth, now); // Sweet fifth harmonic

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);

      if (this.analyser) {
        gain.connect(this.analyser);
      } else {
        gain.connect(this.ctx.destination);
      }

      osc1.onended = () => {
        osc1.disconnect();
        osc2.disconnect();
        gain.disconnect();
      };

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch {}
  }

  // Ethereal Pentatonic Wind Chime
  public playChime() {
    if (typeof window === 'undefined' || this.isMuted) return;
    this.unlock();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      // Ethereal Pentatonic Frequencies (F4, Ab4, Bb4, C5, Eb5)
      const notes = [349.23, 415.30, 466.16, 523.25, 622.25];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.035, now + idx * 0.045 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.45);

        osc.connect(gain);
        if (this.analyser) {
          gain.connect(this.analyser);
        } else {
          gain.connect(this.ctx.destination);
        }

        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };

        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.45);
      });
    } catch {}
  }

  // Backward compatibility alias for blip
  public playBlip(freq: number = 880) {
    this.playRipple(freq);
  }

  // Backward compatibility alias for warp
  public playWarp() {
    this.playCrystalBowl(320);
  }

  public playDreamChime() {
    this.playChime();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const cyberAudio = new EtherealAudioEngine();
