"use client";

import { useEffect, useRef, useCallback } from "react";

interface Triangle {
  x: number;
  y: number;
  rotation: number;
  targetRotation: number;
}

export function TriangleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trianglesRef = useRef<Triangle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  const initTriangles = useCallback((width: number, height: number) => {
    const triangles: Triangle[] = [];
    const spacing = 50;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;
        triangles.push({
          x,
          y,
          rotation: Math.random() * Math.PI * 2,
          targetRotation: 0,
        });
      }
    }
    return triangles;
  }, []);

  const drawTriangle = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      rotation: number,
      opacity: number
    ) => {
      const size = 5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      // Elongated arrow/chevron shape
      ctx.moveTo(size * 1.2, 0);
      ctx.lineTo(-size * 0.4, -size * 0.35);
      ctx.lineTo(-size * 0.4, size * 0.35);
      ctx.closePath();
      ctx.fillStyle = `rgba(150, 150, 150, ${opacity})`;
      ctx.fill();
      ctx.restore();
    },
    []
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const mouse = mouseRef.current;
    const triangles = trianglesRef.current;

    triangles.forEach((triangle) => {
      // Calculate angle to mouse
      const dx = mouse.x - triangle.x;
      const dy = mouse.y - triangle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const targetRotation = Math.atan2(dy, dx);

      // Calculate rotation difference
      let rotationDiff = targetRotation - triangle.rotation;
      
      // Normalize to [-PI, PI]
      while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
      while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;
      
      // Smooth interpolation - closer triangles turn faster
      const maxDistance = 400;
      const speedFactor = Math.max(0.02, 0.12 * (1 - Math.min(distance, maxDistance) / maxDistance));
      triangle.rotation += rotationDiff * speedFactor;

      // Calculate opacity based on distance from mouse - energy map effect
      const baseOpacity = 0.08;
      const maxOpacity = 0.25;
      const opacityBoost = Math.max(0, 1 - distance / 300) * (maxOpacity - baseOpacity);
      const opacity = baseOpacity + opacityBoost;

      drawTriangle(ctx, triangle.x, triangle.y, triangle.rotation, opacity);
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [drawTriangle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      trianglesRef.current = initTriangles(canvas.width, canvas.height);
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
  }, [initTriangles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
