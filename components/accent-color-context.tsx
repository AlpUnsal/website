"use client";

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";

// Curated palette of calm, sophisticated colors
const CALM_COLORS = [
  "#7c9885", // sage green
  "#a8899a", // dusty rose
  "#8b9dc3", // slate blue
  "#b8a99a", // warm taupe
  "#9ab0a6", // seafoam
  "#a3927e", // muted bronze
  "#8fa3b1", // steel blue
  "#b5a897", // sand
  "#b07d7d", // muted terracotta red
];

function getRandomColor(excludeColor?: string): string {
  const available = excludeColor 
    ? CALM_COLORS.filter(c => c !== excludeColor)
    : CALM_COLORS;
  return available[Math.floor(Math.random() * available.length)];
}

interface AccentColorContextType {
  accentColor: string | null;
  triggerColorChange: () => void;
  clearColor: () => void;
}

const AccentColorContext = createContext<AccentColorContextType | null>(null);

export function AccentColorProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const lastColorRef = useRef<string | undefined>(undefined);

  const triggerColorChange = useCallback(() => {
    const newColor = getRandomColor(lastColorRef.current);
    lastColorRef.current = newColor;
    setAccentColor(newColor);
  }, []);

  const clearColor = useCallback(() => {
    setAccentColor(null);
  }, []);

  return (
    <AccentColorContext.Provider value={{ accentColor, triggerColorChange, clearColor }}>
      {children}
    </AccentColorContext.Provider>
  );
}

export function useAccentColor() {
  const context = useContext(AccentColorContext);
  if (!context) {
    throw new Error("useAccentColor must be used within an AccentColorProvider");
  }
  return context;
}
