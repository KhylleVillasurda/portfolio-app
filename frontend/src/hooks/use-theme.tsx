import { createContext, useContext, useEffect, useState } from "react";

type ThemeName = "everforest" | "anime-subtle" | "otaku-theme";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = {
  "everforest": {
    "--bg-main": "#1E2327",
    "--bg-card": "#2B3339",
    "--bg-hover": "#343C42",
    "--bg-input": "#232A2E",
    "--text-primary": "#D3C6AA",
    "--text-secondary": "#9DA9A0",
    "--text-muted": "#7A8478",
    "--accent-green": "#A7C080",
    "--accent-blue": "#7FBBB3",
    "--accent-red": "#E67E80",
    "--accent-yellow": "#DBBC7F",
    "--accent-purple": "#D699B6",
    "--accent-pink": "#D699B6", // Fallback
    "--border-color": "#4F585E",
    "animationStyle": "subtle"
  },
  "anime-subtle": {
    "--bg-main": "#1A1A2E",
    "--bg-card": "#16213E",
    "--bg-hover": "#1F2A4A",
    "--bg-input": "#0F3460",
    "--text-primary": "#EAEAEA",
    "--text-secondary": "#B8C5D6",
    "--text-muted": "#7A8BA3",
    "--accent-green": "#7EE787",
    "--accent-blue": "#60A5FA",
    "--accent-red": "#F87171",
    "--accent-yellow": "#FCD34D",
    "--accent-purple": "#C084FC",
    "--accent-pink": "#F472B6",
    "--border-color": "#2D3A5C",
    "animationStyle": "playful"
  },
  "otaku-theme": {
    "--bg-main": "#0D0D0D",
    "--bg-card": "rgba(20,20,30,0.85)",
    "--bg-hover": "rgba(35,35,50,0.9)",
    "--bg-input": "rgba(30,30,45,0.8)",
    "--text-primary": "#FFFFFF",
    "--text-secondary": "#E0E0E0",
    "--text-muted": "#A0A0A0",
    "--accent-green": "#39FF14",
    "--accent-blue": "#00D9FF",
    "--accent-red": "#FF0055",
    "--accent-yellow": "#FFD700",
    "--accent-purple": "#B829DD",
    "--accent-pink": "#FF69B4",
    "--border-color": "rgba(255,255,255,0.15)",
    "animationStyle": "playful"
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem("theme") as ThemeName;
    return saved && themes[saved] ? saved : "everforest";
  });

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];
    
    // Set custom properties
    Object.entries(currentTheme).forEach(([key, value]) => {
      if (key !== "animationStyle") {
        root.style.setProperty(key, value);
      }
    });
    
    // Set data attribute for animation
    root.setAttribute("data-animation-style", currentTheme.animationStyle);
    
    // Always force dark class for Tailwind components that rely on it
    root.classList.add("dark");
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
