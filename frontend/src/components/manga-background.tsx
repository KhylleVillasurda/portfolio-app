import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useGetThemeSettings, getGetThemeSettingsQueryKey } from "@workspace/api-client-react";

interface Panel {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "speedlines" | "halftone" | "kanji" | "neon";
  focalPoint?: { x: number; y: number };
  kanji?: string;
  rotationSpeed?: number;
  rotation?: number;
  flashOpacity?: number;
}

const PANELS: Panel[] = [
  { id: "A", x: 0, y: 0, w: 0.55, h: 0.42, type: "speedlines", focalPoint: { x: 0.8, y: 0.8 }, rotationSpeed: 0.02, rotation: 0 },
  { id: "B", x: 0.55, y: 0, w: 0.45, h: 0.22, type: "halftone" },
  { id: "C", x: 0.55, y: 0.22, w: 0.25, h: 0.20, type: "kanji", kanji: "力" },
  { id: "D", x: 0.80, y: 0.22, w: 0.20, h: 0.20, type: "neon" },
  { id: "E", x: 0, y: 0.42, w: 0.35, h: 0.30, type: "halftone" },
  { id: "F", x: 0.35, y: 0.42, w: 0.65, h: 0.30, type: "speedlines", focalPoint: { x: -0.5, y: -0.5 }, rotationSpeed: -0.015, rotation: 0 },
  { id: "G", x: 0, y: 0.72, w: 1, h: 0.28, type: "halftone", kanji: "始 終 今 力 速 技 夢 戦 創 空 間" },
];

const DRIFTING_KANJI = ["始", "終", "今", "力", "速", "技", "夢", "戦", "創", "空", "間"];

// Pre-generate speed line data per panel — eliminates Math.random() every frame
const SPEED_LINE_COUNT = 100;
interface SpeedLineDatum {
  angle: number;
  baseOpacity: number;
  width: number;
  colorIdx: number;
}
function buildSpeedLineData(): SpeedLineDatum[] {
  return Array.from({ length: SPEED_LINE_COUNT }, (_, i) => ({
    angle: (i / SPEED_LINE_COUNT) * Math.PI * 2,
    baseOpacity: 0.04 + Math.random() * 0.11,
    width: 0.5 + Math.random() * 1.5,
    colorIdx: i % 4,
  }));
}

interface DriftingKanji {
  x: number;
  y: number;
  char: string;
  dx: number;
  dy: number;
  size: number;
}

export function MangaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const { data: themeSettings } = useGetThemeSettings({
    query: {
      queryKey: getGetThemeSettingsQueryKey(),
      enabled: theme === "otaku-theme",
      staleTime: 30_000,
    },
  });

  useEffect(() => {
    if (theme !== "otaku-theme") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    // Decouple mouse reads from RAF — read once per frame
    let mouseX = -1000, mouseY = -1000;
    let pendingMouseX = -1000, pendingMouseY = -1000;

    let frameCount = 0;

    // Pre-generated speed line data — no Math.random() per frame
    const speedLineData: Record<string, SpeedLineDatum[]> = {};
    for (const panel of PANELS) {
      if (panel.type === "speedlines") {
        speedLineData[panel.id] = buildSpeedLineData();
      }
    }

    // Use a regular HTMLCanvasElement for compatibility (no OffscreenCanvas API needed)
    let halftoneCache: HTMLCanvasElement | null = null;
    let scanlineCache: HTMLCanvasElement | null = null;

    const driftingKanjis: DriftingKanji[] = [];
    for (let i = 0; i < 8; i++) {
      driftingKanjis.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        char: DRIFTING_KANJI[Math.floor(Math.random() * DRIFTING_KANJI.length)],
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        size: 100 + Math.random() * 100,
      });
    }

    const panelImages: Record<string, HTMLImageElement> = {};
    if (themeSettings) {
      for (const panel of PANELS) {
        const key = `manga_panel_${panel.id}` as keyof typeof themeSettings;
        const url = themeSettings[key];
        if (url) {
          const img = new Image();
          img.src = url;
          panelImages[panel.id] = img;
        }
      }
    }

    // Cache CSS variables — only re-read on resize, never inside draw()
    let accentBlue = "#4FA8D5";
    let accentPurple = "#9B72CF";
    let accentPink = "#E879A0";
    let bgMain = "#0a0a0f";
    const refreshColors = () => {
      const cs = getComputedStyle(document.documentElement);
      accentBlue   = cs.getPropertyValue("--accent-blue").trim()   || accentBlue;
      accentPurple = cs.getPropertyValue("--accent-purple").trim() || accentPurple;
      accentPink   = cs.getPropertyValue("--accent-pink").trim()   || accentPink;
      bgMain       = cs.getPropertyValue("--bg-main").trim()       || bgMain;
    };
    refreshColors();

    // Build offscreen caches using regular <canvas> for maximum compatibility
    const buildStaticCaches = (w: number, h: number) => {
      // Halftone cache — draw all dot-grid panels once, blit each frame
      const htCanvas = document.createElement("canvas");
      htCanvas.width = w;
      htCanvas.height = h;
      const htCtx = htCanvas.getContext("2d");
      if (htCtx) {
        htCtx.fillStyle = "rgba(255, 255, 255, 0.06)";
        const spacing = 8;
        for (const panel of PANELS) {
          if (panel.type !== "halftone") continue;
          const px = panel.x * w, py = panel.y * h;
          const pw = panel.w * w, ph = panel.h * h;
          htCtx.save();
          htCtx.beginPath();
          htCtx.rect(px, py, pw, ph);
          htCtx.clip();
          for (let x = px; x < px + pw; x += spacing) {
            for (let y = py; y < py + ph; y += spacing) {
              htCtx.beginPath();
              htCtx.arc(x, y, 1.5, 0, Math.PI * 2);
              htCtx.fill();
            }
          }
          htCtx.restore();
        }
        halftoneCache = htCanvas;
      }

      // Scanlines cache — single blit replaces ~360 fillRect calls per frame
      const slCanvas = document.createElement("canvas");
      slCanvas.width = w;
      slCanvas.height = h;
      const slCtx = slCanvas.getContext("2d");
      if (slCtx) {
        slCtx.fillStyle = "rgba(0, 0, 0, 0.04)";
        for (let y = 0; y < h; y += 3) {
          slCtx.fillRect(0, y, w, 1);
        }
        scanlineCache = slCanvas;
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      refreshColors();
      buildStaticCaches(canvas.width, canvas.height);
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

    // --- Draw helpers ---

    const drawSpeedLines = (
      panel: Panel,
      lines: SpeedLineDatum[],
      px: number, py: number, pw: number, ph: number,
      mouseDist: number,
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();

      const cx = px + pw / 2, cy = py + ph / 2;
      let fx = cx, fy = cy;
      if (panel.focalPoint) {
        fx += panel.focalPoint.x * (pw / 2);
        fy += panel.focalPoint.y * (ph / 2);
      }

      const isHovered = mouseDist < 150;
      const hoverMultiplier = isHovered ? 2.5 : 1;
      panel.rotation = (panel.rotation || 0) + (panel.rotationSpeed || 0.02) * (isHovered ? 3 : 1);

      ctx.translate(fx, fy);
      ctx.rotate(panel.rotation);

      const colors = [accentBlue, accentPurple, accentPink, "#ffffff"];
      const radius = Math.sqrt(pw * pw + ph * ph) * 1.5;

      for (const line of lines) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(line.angle) * radius, Math.sin(line.angle) * radius);
        ctx.strokeStyle = colors[line.colorIdx];
        ctx.globalAlpha = line.baseOpacity * hoverMultiplier;
        ctx.lineWidth = line.width;
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawImageInPanel = (img: HTMLImageElement, px: number, py: number, pw: number, ph: number) => {
      if (!img.complete || img.naturalWidth === 0) return false;
      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const panelAspect = pw / ph;
      let drawW: number, drawH: number, drawX: number, drawY: number;
      if (imgAspect > panelAspect) {
        drawH = ph; drawW = ph * imgAspect;
        drawX = px - (drawW - pw) / 2; drawY = py;
      } else {
        drawW = pw; drawH = pw / imgAspect;
        drawX = px; drawY = py - (drawH - ph) / 2;
      }

      ctx.globalAlpha = 0.55;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(px, py, pw, ph);
      // Reuse halftone cache for the dot overlay on image panels
      if (halftoneCache) {
        ctx.drawImage(halftoneCache, px, py, pw, ph, px, py, pw, ph);
      }
      ctx.restore();
      return true;
    };

    const draw = () => {
      // Sync mouse once per frame
      mouseX = pendingMouseX;
      mouseY = pendingMouseY;

      frameCount++;
      if (frameCount % 240 === 0) {
        const rp = PANELS[Math.floor(Math.random() * PANELS.length)];
        rp.flashOpacity = 0.35;
      }

      const w = canvas.width, h = canvas.height;

      // Background fill
      ctx.fillStyle = bgMain;
      ctx.fillRect(0, 0, w, h);

      // 1. Blit halftone cache (1 drawImage vs ~97k arc calls)
      if (halftoneCache) ctx.drawImage(halftoneCache, 0, 0);

      // 2. Animated panels
      for (const panel of PANELS) {
        const px = panel.x * w, py = panel.y * h;
        const pw = panel.w * w, ph = panel.h * h;

        const img = panelImages[panel.id];
        const drewImage = img ? drawImageInPanel(img, px, py, pw, ph) : false;

        if (!drewImage) {
          if (panel.type === "speedlines") {
            const cx = px + pw / 2, cy = py + ph / 2;
            let fx = cx, fy = cy;
            if (panel.focalPoint) {
              fx += panel.focalPoint.x * (pw / 2);
              fy += panel.focalPoint.y * (ph / 2);
            }
            const dx = mouseX - fx, dy = mouseY - fy;
            drawSpeedLines(panel, speedLineData[panel.id], px, py, pw, ph, Math.sqrt(dx * dx + dy * dy));
          } else if (panel.type === "kanji") {
            ctx.save();
            ctx.beginPath();
            ctx.rect(px, py, pw, ph);
            ctx.clip();
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(px, py, pw, ph);
            ctx.fillStyle = accentPurple;
            ctx.globalAlpha = 0.08;
            ctx.font = "bold 120px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(panel.kanji || "", px + pw / 2, py + ph / 2);
            ctx.restore();
          } else if (panel.type === "neon") {
            ctx.save();
            ctx.beginPath();
            ctx.rect(px, py, pw, ph);
            ctx.clip();
            const cx = px + pw / 2, cy = py + ph / 2;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(pw, ph));
            grad.addColorStop(0, accentBlue);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(px, py, pw, ph);
            ctx.restore();
          }
          // halftone panels already painted by the cache blit above
        }

        if (panel.flashOpacity && panel.flashOpacity > 0) {
          ctx.fillStyle = "white";
          ctx.globalAlpha = panel.flashOpacity;
          ctx.fillRect(px, py, pw, ph);
          panel.flashOpacity -= 0.0175;
          if (panel.flashOpacity <= 0) panel.flashOpacity = 0;
          ctx.globalAlpha = 1;
        }
      }

      // 3. Drifting kanji
      for (const k of driftingKanjis) {
        k.x += k.dx; k.y += k.dy;
        if (k.x > w + k.size) k.x = -k.size;
        if (k.x < -k.size) k.x = w + k.size;
        if (k.y > h + k.size) k.y = -k.size;
        if (k.y < -k.size) k.y = h + k.size;
        ctx.fillStyle = "white";
        ctx.globalAlpha = 0.05;
        ctx.font = `bold ${k.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(k.char, k.x, k.y);
      }
      ctx.globalAlpha = 1;

      // 4. Panel borders
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 5;
      for (const panel of PANELS) {
        ctx.strokeRect(panel.x * w, panel.y * h, panel.w * w, panel.h * h);
      }

      // 5. Blit scanlines cache (1 drawImage vs ~360 fillRect calls)
      if (scanlineCache) ctx.drawImage(scanlineCache, 0, 0);

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      // Explicitly free offscreen canvas memory
      halftoneCache = null;
      scanlineCache = null;
    };
  }, [theme, themeSettings]);

  if (theme !== "otaku-theme") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ willChange: "transform" }}
    />
  );
}
