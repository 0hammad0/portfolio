"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface SoundContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  playSound: (sound: SoundType) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

type SoundType = "click" | "hover" | "success" | "error" | "toggle" | "whoosh" | "pop";

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Simple sound effects using Web Audio API (no external files needed)
function createOscillatorSound(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.1
): () => void {
  return () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      // Audio context not available
    }
  };
}

// Sound configurations using synthesized sounds
const SOUND_CONFIGS: Record<SoundType, () => void> = {
  click: createOscillatorSound(800, 0.1, "sine", 0.08),
  hover: createOscillatorSound(600, 0.05, "sine", 0.03),
  success: () => {
    createOscillatorSound(523, 0.15, "sine", 0.08)();
    setTimeout(() => createOscillatorSound(659, 0.15, "sine", 0.08)(), 100);
    setTimeout(() => createOscillatorSound(784, 0.2, "sine", 0.08)(), 200);
  },
  error: () => {
    createOscillatorSound(200, 0.3, "square", 0.06)();
  },
  toggle: createOscillatorSound(440, 0.1, "triangle", 0.08),
  whoosh: () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const noise = audioContext.createBufferSource();
      const bufferSize = audioContext.sampleRate * 0.15;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      noise.buffer = buffer;

      const filter = audioContext.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1000;
      filter.Q.value = 0.5;

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      noise.start();
    } catch {
      // Audio context not available
    }
  },
  pop: createOscillatorSound(1200, 0.08, "sine", 0.1),
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  // Load saved preference
  useEffect(() => {
    const savedEnabled = localStorage.getItem("soundEnabled") === "true";
    const savedVolume = parseFloat(localStorage.getItem("soundVolume") || "0.5");
    setEnabledState(savedEnabled);
    setVolumeState(savedVolume);
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    localStorage.setItem("soundEnabled", String(value));

    // Play a sound when enabling
    if (value) {
      SOUND_CONFIGS.toggle();
    }
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    localStorage.setItem("soundVolume", String(value));
  }, []);

  const playSound = useCallback(
    (sound: SoundType) => {
      if (!enabled) return;

      const soundFn = SOUND_CONFIGS[sound];
      if (soundFn) {
        soundFn();
      }
    },
    [enabled]
  );

  return (
    <SoundContext.Provider
      value={{
        enabled,
        setEnabled,
        playSound,
        volume,
        setVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}

// Hook for adding sound to elements
export function useSoundEffect() {
  const { playSound, enabled } = useSound();

  return {
    onClick: enabled ? () => playSound("click") : undefined,
    onMouseEnter: enabled ? () => playSound("hover") : undefined,
    onSuccess: enabled ? () => playSound("success") : undefined,
    onError: enabled ? () => playSound("error") : undefined,
    onToggle: enabled ? () => playSound("toggle") : undefined,
  };
}
