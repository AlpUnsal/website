"use client";

import { useEffect, useState, useRef, useCallback } from "react";

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
];

function getRandomColor(excludeColor?: string): string {
  const available = excludeColor 
    ? CALM_COLORS.filter(c => c !== excludeColor)
    : CALM_COLORS;
  return available[Math.floor(Math.random() * available.length)];
}

export function NowIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [lineScale, setLineScale] = useState(0);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const lastColorRef = useRef<string | undefined>(undefined);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small delay to trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!lineRef.current) return;
    
    const rect = lineRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const lineWidth = rect.width;
    
    // Calculate scale based on mouse position (0 to 1)
    const scale = Math.max(0, Math.min(1, mouseX / lineWidth));
    setLineScale(scale);
  }, []);

  const handleMouseEnter = useCallback(() => {
    const newColor = getRandomColor(lastColorRef.current);
    lastColorRef.current = newColor;
    setHoverColor(newColor);
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setHoverColor(null);
    setLineScale(1); // Reset to full width
  }, []);

  // Determine the actual scale to use
  const actualScale = isHovering ? lineScale : (isVisible ? 1 : 0);

  return (
    <div 
      className="now-indicator"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="now-indicator__dot" 
        style={hoverColor ? { backgroundColor: hoverColor } : undefined}
      />
      <span 
        className="now-indicator__label"
        style={hoverColor ? { color: hoverColor } : undefined}
      >
        Now
      </span>
      <div 
        ref={lineRef}
        className="now-indicator__line-container"
        onMouseMove={handleMouseMove}
      >
        <div 
          className={`now-indicator__line ${!isHovering && isVisible ? 'now-indicator__line--animated' : ''}`}
          style={{ 
            transform: `scaleX(${actualScale})`,
            ...(hoverColor ? { backgroundColor: hoverColor } : {})
          }}
        />
      </div>
    </div>
  );
}
