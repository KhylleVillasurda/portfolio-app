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
    let mouseX = -1000;
    let mouseY = -1000;

    let frameCount = 0;
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

    // Pre-load images for panels that have URLs
    // No crossOrigin attribute — avoids CORS taint errors on self-hosted images
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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    resize();

    const computedStyle = getComputedStyle(document.documentElement);
    const getVar = (name: string) => computedStyle.getPropertyValue(name).trim() || "#ffffff";

    const drawHalftone = (px: number, py: number, pw: number, ph: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      const spacing = 8;
      for (let x = px; x < px + pw; x += spacing) {
        for (let y = py; y < py + ph; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawSpeedLines = (panel: Panel, px: number, py: number, pw: number, ph: number, mouseDist: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();

      const cx = px + pw / 2;
      const cy = py + ph / 2;
      let fx = cx;
      let fy = cy;
      if (panel.focalPoint) {
        fx += panel.focalPoint.x * (pw / 2);
        fy += panel.focalPoint.y * (ph / 2);
      }

      const isHovered = mouseDist < 150;
      const hoverMultiplier = isHovered ? 2.5 : 1;
      const speedMultiplier = isHovered ? 3 : 1;

      panel.rotation = (panel.rotation || 0) + (panel.rotationSpeed || 0.02) * speedMultiplier;

      ctx.translate(fx, fy);
      ctx.rotate(panel.rotation);

      const colors = [getVar("--accent-blue"), getVar("--accent-purple"), getVar("--accent-pink"), "#ffffff"];
      const radius = Math.sqrt(pw * pw + ph * ph) * 1.5;

      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        const color = colors[i % colors.length];
        const opacity = (0.04 + Math.random() * 0.11) * hoverMultiplier;
        const width = 0.5 + Math.random() * 1.5;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = width;
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

      // Cover-fit the image inside the panel
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const panelAspect = pw / ph;
      let drawW: number, drawH: number, drawX: number, drawY: number;
      if (imgAspect > panelAspect) {
        drawH = ph;
        drawW = ph * imgAspect;
        drawX = px - (drawW - pw) / 2;
        drawY = py;
      } else {
        drawW = pw;
        drawH = pw / imgAspect;
        drawX = px;
        drawY = py - (drawH - ph) / 2;
      }

      ctx.globalAlpha = 0.55;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Halftone overlay on top of image for manga feel
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(px, py, pw, ph);

      // Light dot overlay
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      const spacing = 8;
      for (let x = px; x < px + pw; x += spacing) {
        for (let y = py; y < py + ph; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
      return true;
    };

    const draw = () => {
      frameCount++;

      if (frameCount % 240 === 0) {
        const randomPanel = PANELS[Math.floor(Math.random() * PANELS.length)];
        randomPanel.flashOpacity = 0.35;
      }

      const bgMain = getVar("--bg-main");
      ctx.fillStyle = bgMain;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      PANELS.forEach((panel) => {
        const px = panel.x * w;
        const py = panel.y * h;
        const pw = panel.w * w;
        const ph = panel.h * h;

        let mouseDist = Infinity;
        if (panel.type === "speedlines") {
          const cx = px + pw / 2;
          const cy = py + ph / 2;
          let fx = cx;
          let fy = cy;
          if (panel.focalPoint) {
            fx += panel.focalPoint.x * (pw / 2);
            fy += panel.focalPoint.y * (ph / 2);
          }
          const dx = mouseX - fx;
          const dy = mouseY - fy;
          mouseDist = Math.sqrt(dx * dx + dy * dy);
        }

        // If a custom image is set, draw it; otherwise use generated effect
        const img = panelImages[panel.id];
        const drewImage = img ? drawImageInPanel(img, px, py, pw, ph) : false;

        if (!drewImage) {
          if (panel.type === "halftone") {
            drawHalftone(px, py, pw, ph);
          } else if (panel.type === "speedlines") {
            drawSpeedLines(panel, px, py, pw, ph, mouseDist);
          } else if (panel.type === "kanji") {
            ctx.save();
            ctx.beginPath();
            ctx.rect(px, py, pw, ph);
            ctx.clip();
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(px, py, pw, ph);
            ctx.fillStyle = getVar("--accent-purple");
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
            const cx = px + pw / 2;
            const cy = py + ph / 2;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(pw, ph));
            grad.addColorStop(0, getVar("--accent-blue"));
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(px, py, pw, ph);
            ctx.restore();
          }
        }

        if (panel.flashOpacity && panel.flashOpacity > 0) {
          ctx.fillStyle = "white";
          ctx.globalAlpha = panel.flashOpacity;
          ctx.fillRect(px, py, pw, ph);
          panel.flashOpacity -= 0.0175;
          if (panel.flashOpacity <= 0) panel.flashOpacity = 0;
          ctx.globalAlpha = 1;
        }
      });

      // Drifting kanji
      driftingKanjis.forEach((k) => {
        k.x += k.dx;
        k.y += k.dy;
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
      });
      ctx.globalAlpha = 1;

      // Panel borders
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 5;
      PANELS.forEach((panel) => {
        ctx.strokeRect(panel.x * w, panel.y * h, panel.w * w, panel.h * h);
      });

      // Scanlines
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, themeSettings]);

  if (theme !== "otaku-theme") return null;

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
