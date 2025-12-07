'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useParticles } from './particle-context';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface SandboxParticlesProps {
  inputBoxRef: React.RefObject<HTMLInputElement | null>;
  letterRects: DOMRect[];
  isActive: boolean;
  sandTriggered: boolean;
}

export function SandboxParticles({ inputBoxRef, letterRects, isActive, sandTriggered }: SandboxParticlesProps) {
  const { particlesVisible } = useParticles();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | undefined>(undefined);
  const initializedRef = useRef(false);

  const GRAVITY = 0.15;
  const FRICTION = 0.96;
  const MOUSE_RADIUS = 30;
  const MOUSE_FORCE = 2;
  const CLICK_RADIUS = 300;
  const CLICK_FORCE = 20;
  const PARTICLE_COUNT = 300;

  // Sand-like colors
  const SAND_COLORS = [
    '#d4a574',
    '#c9986a',
    '#be8b60',
    '#b37e56',
  ];

  const createSandParticle = useCallback((x: number, y: number, initialVy: number = 0): Particle => {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: initialVy,
      size: Math.random() * 2 + 3,
      color: SAND_COLORS[Math.floor(Math.random() * SAND_COLORS.length)],
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    const resizeCanvas = () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    };
    resizeCanvas();

    // Initialize sand falling from the input box when triggered
    if (!initializedRef.current && sandTriggered && inputBoxRef.current) {
      const rect = inputBoxRef.current.getBoundingClientRect();
      const particles: Particle[] = [];
      const spawnWidth = rect.width * 0.8;
      const startX = rect.left + rect.width * 0.1;
      const startY = rect.bottom;
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = startX + Math.random() * spawnWidth;
        // Stagger the starting Y position so they fall in waves
        const y = startY + Math.random() * 20;
        const initialVy = Math.random() * 2 + 1; // Initial downward velocity
        particles.push(createSandParticle(x, y, initialVy));
      }
      particlesRef.current = particles;
      initializedRef.current = true;
    }

    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    // Click explosion - push nearby particles away
    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const particles = particlesRef.current;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const distSq = dx * dx + dy * dy;
        const radiusSq = CLICK_RADIUS * CLICK_RADIUS;
        
        if (distSq < radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (CLICK_RADIUS - dist) / CLICK_RADIUS * CLICK_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force - 3; // Extra upward boost
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Helper for rectangular box collision (for letters)
    const collideWithBox = (p: Particle, rect: DOMRect, padding: number = 2) => {
      const left = rect.left - padding;
      const right = rect.right + padding;
      const top = rect.top - padding;
      const bottom = rect.bottom + padding;

      if (p.x + p.size > left && p.x - p.size < right &&
          p.y + p.size > top && p.y - p.size < bottom) {
        
        const overlapLeft = (p.x + p.size) - left;
        const overlapRight = right - (p.x - p.size);
        const overlapTop = (p.y + p.size) - top;
        const overlapBottom = bottom - (p.y - p.size);
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapTop) {
          p.y = top - p.size;
          p.vy *= -0.3;
          const centerX = (left + right) / 2;
          if (Math.abs(p.vx) < 0.5) {
            p.vx += (p.x > centerX ? 0.1 : -0.1);
          }
        } else if (minOverlap === overlapBottom && p.vy < 0) {
          p.y = bottom + p.size;
          p.vy *= -0.3;
        } else if (minOverlap === overlapLeft && p.vx > 0) {
          p.x = left - p.size;
          p.vx *= -0.4;
        } else if (minOverlap === overlapRight && p.vx < 0) {
          p.x = right + p.size;
          p.vx *= -0.4;
        }
      }
    };

    // Pill-shaped (capsule) collision with smooth rolling
    const collideWithPill = (p: Particle, rect: DOMRect) => {
      const height = rect.height;
      const radius = height / 2;
      const leftX = rect.left + radius;
      const rightX = rect.right - radius;
      const centerY = rect.top + radius;
      
      // Find closest point on the pill's center line
      const closestX = Math.max(leftX, Math.min(rightX, p.x));
      
      // Vector from closest point to particle
      const dx = p.x - closestX;
      const dy = p.y - centerY;
      const distSq = dx * dx + dy * dy;
      const minDist = radius + p.size;
      
      // Check if inside pill
      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        
        if (dist > 0.1) {
          // Normal vector pointing outward from pill surface
          const nx = dx / dist;
          const ny = dy / dist;
          
          // Push particle to surface
          p.x = closestX + nx * minDist;
          p.y = centerY + ny * minDist;
          
          // Calculate velocity component going into surface (dot product)
          const velIntoSurface = p.vx * (-nx) + p.vy * (-ny);
          
          // Only remove the component going INTO the surface, keep tangent velocity
          if (velIntoSurface > 0) {
            // Remove normal component, add small bounce
            p.vx += velIntoSurface * nx * 1.2;
            p.vy += velIntoSurface * ny * 1.2;
            
            // Small friction on tangent for stability
            p.vx *= 0.95;
            p.vy *= 0.95;
          }
        } else {
          // At center, push up
          p.y = rect.top - p.size;
          p.vy = -2;
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const particles = particlesRef.current;

      // Get input box rect for collision
      const inputRect = inputBoxRef.current?.getBoundingClientRect();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply gravity
        p.vy += GRAVITY;

        // Mouse repulsion - push sand away from cursor
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;
        const radiusSq = MOUSE_RADIUS * MOUSE_RADIUS;

        if (distSq < radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Apply friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Collide with input box (pill shape with rounded corners)
        if (inputRect) collideWithPill(p, inputRect);
        // Collide with each letter
        for (let j = 0; j < letterRects.length; j++) {
          collideWithBox(p, letterRects[j], 1);
        }

        // Floor collision
        if (p.y + p.size > canvasHeight) {
          p.y = canvasHeight - p.size;
          p.vy *= -0.2;
          p.vx *= 0.7;
        }

        // Wall collisions
        if (p.x < p.size) {
          p.x = p.size;
          p.vx *= -0.3;
        } else if (p.x > canvasWidth - p.size) {
          p.x = canvasWidth - p.size;
          p.vx *= -0.3;
        }

        // Simple particle-particle collision
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const collDx = p2.x - p.x;
          const collDy = p2.y - p.y;
          const collDistSq = collDx * collDx + collDy * collDy;
          const minDist = p.size + p2.size;
          
          if (collDistSq < minDist * minDist && collDistSq > 0) {
            const collDist = Math.sqrt(collDistSq);
            const overlap = (minDist - collDist) / 2;
            const nx = collDx / collDist;
            const ny = collDy / collDist;
            
            p.x -= nx * overlap;
            p.y -= ny * overlap;
            p2.x += nx * overlap;
            p2.y += ny * overlap;

            const relVx = p.vx - p2.vx;
            const relVy = p.vy - p2.vy;
            const relVn = relVx * nx + relVy * ny;
            
            if (relVn > 0) {
              p.vx -= relVn * nx * 0.3;
              p.vy -= relVn * ny * 0.3;
              p2.vx += relVn * nx * 0.3;
              p2.vy += relVn * ny * 0.3;
            }
          }
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 6.28);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isActive) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, sandTriggered, createSandParticle, inputBoxRef, letterRects]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-500"
      style={{ background: 'transparent', opacity: particlesVisible ? 1 : 0 }}
    />
  );
}

