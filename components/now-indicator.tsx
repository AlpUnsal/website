"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export function NowIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [lineScale, setLineScale] = useState(0);
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
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setLineScale(1); // Reset to full width
  }, []);

  // Determine the actual scale to use
  const actualScale = isHovering ? lineScale : (isVisible ? 1 : 0);

  return (
    <div className="now-indicator">
      <div className="now-indicator__dot" />
      <span className="now-indicator__label">Now</span>
      <div 
        ref={lineRef}
        className="now-indicator__line-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={`now-indicator__line ${!isHovering && isVisible ? 'now-indicator__line--animated' : ''}`}
          style={{ transform: `scaleX(${actualScale})` }}
        />
      </div>
    </div>
  );
}
