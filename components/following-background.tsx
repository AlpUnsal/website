"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function FollowingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 1.5 + Math.random() * 1,
        opacity: 0.2 + Math.random() * 0.15,
      });
    }
    return particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const mouse = mouseRef.current;
    const particles = particlesRef.current;

    particles.forEach((particle, index) => {
      // Add some random wandering
      particle.vx += (Math.random() - 0.5) * 0.3;
      particle.vy += (Math.random() - 0.5) * 0.3;

      if (mouse.x > 0 && mouse.y > 0) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Attraction to mouse - stronger when further away
        const attractForce = Math.min(distance / 200, 1.5) * 0.15;
        particle.vx += (dx / distance) * attractForce;
        particle.vy += (dy / distance) * attractForce;

        // Soft repulsion only when very close to prevent literal overlap
        if (distance < 8) {
          particle.vx -= (dx / distance) * 0.8;
          particle.vy -= (dy / distance) * 0.8;
        }
      }

      // Light particle-to-particle repulsion only at very close range
      for (let j = index + 1; j < particles.length; j++) {
        const other = particles[j];
        const pdx = particle.x - other.x;
        const pdy = particle.y - other.y;
        const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
        
        // Only push apart when literally overlapping
        if (pDist < 6 && pDist > 0) {
          const push = 0.15;
          particle.vx += (pdx / pDist) * push;
          particle.vy += (pdy / pDist) * push;
          other.vx -= (pdx / pDist) * push;
          other.vy -= (pdy / pDist) * push;
        }
      }

      // Apply friction
      particle.vx *= 0.94;
      particle.vy *= 0.94;

      // Clamp velocity
      const maxSpeed = 8;
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > maxSpeed) {
        particle.vx = (particle.vx / speed) * maxSpeed;
        particle.vy = (particle.vy / speed) * maxSpeed;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160, 160, 160, ${particle.opacity})`;
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
