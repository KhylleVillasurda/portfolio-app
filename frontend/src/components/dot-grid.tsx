import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === "otaku-theme") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    // Decouple mousemove from RAF — update mouse position once per frame
    let pendingMouseX = -1000;
    let pendingMouseY = -1000;

    const dotSize = 2;
    const spacing = 40;
    const hoverRadius = 120;
    const hoverRadiusSq = hoverRadius * hoverRadius;

    // Cache CSS variable — only refresh on resize, not every frame
    let accentColor = "#7FBBB3";
    const refreshColor = () => {
      const cs = getComputedStyle(document.documentElement);
      accentColor = cs.getPropertyValue("--accent-blue").trim() || accentColor;
    };
    refreshColor();

    // Pre-render the static (no-hover) dot grid into an OffscreenCanvas
    // This is blitted each frame instead of drawing ~1300 arcs
    let staticCache: HTMLCanvasElement | null = null;

    const buildStaticCache = (w: number, h: number) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const sCtx = offscreen.getContext("2d");
      if (!sCtx) return;
      sCtx.fillStyle = accentColor;
      sCtx.globalAlpha = 0.12;
      for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
          sCtx.beginPath();
          sCtx.arc(x, y, dotSize, 0, Math.PI * 2);
          sCtx.fill();
        }
      }
      staticCache = offscreen;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      refreshColor();
      buildStaticCache(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingMouseX = e.clientX;
      pendingMouseY = e.clientY;
    };
    const handleMouseLeave = () => {
      pendingMouseX = -1000;
      pendingMouseY = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    resize();

    const draw = () => {
      // Consume pending mouse position once per frame
      mouseX = pendingMouseX;
      mouseY = pendingMouseY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Blit pre-rendered static layer (1 drawImage vs ~1300 arc calls)
      if (staticCache) {
        ctx.drawImage(staticCache, 0, 0);
      }

      // 2. Draw hover-affected dots on top — only iterate the local neighbourhood
      if (mouseX > -900) {
        ctx.fillStyle = accentColor;
        const w = canvas.width;
        const h = canvas.height;
        const minX = Math.max(0, Math.floor((mouseX - hoverRadius) / spacing) * spacing);
        const maxX = Math.min(w, Math.ceil((mouseX + hoverRadius) / spacing) * spacing);
        const minY = Math.max(0, Math.floor((mouseY - hoverRadius) / spacing) * spacing);
        const maxY = Math.min(h, Math.ceil((mouseY + hoverRadius) / spacing) * spacing);

        for (let x = minX; x <= maxX; x += spacing) {
          for (let y = minY; y <= maxY; y += spacing) {
            const dx = mouseX - x;
            const dy = mouseY - y;
            const distSq = dx * dx + dy * dy;
            if (distSq >= hoverRadiusSq) continue;

            const force = (hoverRadius - Math.sqrt(distSq)) / hoverRadius;
            ctx.globalAlpha = 0.12 + force * 0.4;
            ctx.beginPath();
            ctx.arc(x + dx * force * 0.1, y + dy * force * 0.1, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
