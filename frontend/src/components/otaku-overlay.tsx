import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const WORDS = [
  { text: "ドーン", color: "var(--accent-yellow)", top: "10%", left: "5%", delay: 0, duration: 4 },
  { text: "バキ", color: "var(--accent-pink)", top: "20%", right: "10%", delay: 1, duration: 5 },
  { text: "ズドーン", color: "var(--accent-yellow)", bottom: "15%", left: "8%", delay: 2, duration: 6 },
  { text: "シュッ", color: "var(--accent-pink)", top: "50%", right: "5%", delay: 0.5, duration: 3.5 },
  { text: "キラキラ", color: "var(--accent-blue)", bottom: "30%", right: "15%", delay: 1.5, duration: 4.5 },
];

export function OtakuOverlay() {
  const { theme } = useTheme();

  if (theme !== "otaku-theme") return null;

  return (
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden scanlines">
      {/* Corner Accents — pure CSS, no JS animation */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 opacity-30">
        <div className="w-10 h-0.5 bg-[var(--accent-blue)] transform -rotate-45 origin-left" />
        <div className="w-8 h-0.5 bg-[var(--accent-blue)] transform -rotate-45 origin-left" />
        <div className="w-6 h-0.5 bg-[var(--accent-blue)] transform -rotate-45 origin-left" />
      </div>
      <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-30 items-end">
        <div className="w-10 h-0.5 bg-[var(--accent-blue)] transform rotate-45 origin-right" />
        <div className="w-8 h-0.5 bg-[var(--accent-blue)] transform rotate-45 origin-right" />
        <div className="w-6 h-0.5 bg-[var(--accent-blue)] transform rotate-45 origin-right" />
      </div>
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 opacity-30">
        <div className="w-6 h-0.5 bg-[var(--accent-blue)] transform rotate-45 origin-left" />
        <div className="w-8 h-0.5 bg-[var(--accent-blue)] transform rotate-45 origin-left" />
        <div className="w-10 h-0.5 bg-[var(--accent-blue)] transform rotate-45 origin-left" />
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 opacity-30 items-end">
        <div className="w-6 h-0.5 bg-[var(--accent-blue)] transform -rotate-45 origin-right" />
        <div className="w-8 h-0.5 bg-[var(--accent-blue)] transform -rotate-45 origin-right" />
        <div className="w-10 h-0.5 bg-[var(--accent-blue)] transform -rotate-45 origin-right" />
      </div>

      {/* Floating Words — will-change promotes to own compositor layer */}
      {WORDS.map((word, i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [-8, 8, -8] }}
          transition={{
            repeat: Infinity,
            duration: word.duration,
            delay: word.delay,
            ease: "easeInOut",
          }}
          className="absolute font-black impact-text"
          style={{
            top: word.top,
            bottom: word.bottom,
            left: word.left,
            right: word.right,
            color: word.color,
            opacity: 0.08,
            fontSize: "clamp(4rem, 8vw, 8rem)",
            lineHeight: 1,
            transform: `rotate(${i % 2 === 0 ? -5 : 5}deg)`,
            willChange: "transform",
          }}
        >
          {word.text}
        </motion.div>
      ))}
    </div>
  );
}
