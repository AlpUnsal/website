"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ParticleContextType {
  particlesVisible: boolean;
  toggleParticles: () => void;
}

const ParticleContext = createContext<ParticleContextType | undefined>(undefined);

export function ParticleProvider({ children }: { children: ReactNode }) {
  const [particlesVisible, setParticlesVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load preference from localStorage
    const stored = localStorage.getItem("particlesVisible");
    if (stored !== null) {
      setParticlesVisible(stored === "true");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("particlesVisible", String(particlesVisible));
    }
  }, [particlesVisible, mounted]);

  useEffect(() => {
    const handleDoubleClick = () => {
      setParticlesVisible((prev) => !prev);
    };

    window.addEventListener("dblclick", handleDoubleClick);
    return () => window.removeEventListener("dblclick", handleDoubleClick);
  }, []);

  return (
    <ParticleContext.Provider value={{ particlesVisible, toggleParticles: () => setParticlesVisible((p) => !p) }}>
      {children}
    </ParticleContext.Provider>
  );
}

export function useParticles() {
  const context = useContext(ParticleContext);
  if (!context) {
    throw new Error("useParticles must be used within a ParticleProvider");
  }
  return context;
}
