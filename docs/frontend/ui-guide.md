# Frontend UI Guide

> Component patterns, themes, and animation system.

---

## Design Philosophy

**Inspired by:** [ambiq.com](https://ambiq.com) & [encoder.digital](https://encoder.digital/en)

### Core Principles
- **Clean & Minimal** - Generous whitespace, uncluttered layouts
- **Smooth Animations** - Subtle transitions that enhance without distracting
- **High-Quality Visuals** - Custom graphics and professional imagery
- **Modern Aesthetic** - Contemporary design with approachable feel
- **Content-Focused** - Let projects speak for themselves

---

## Component Architecture

```
App
├── ThemeProvider
│   └── AuthProvider
│       └── Router
│           ├── HomePage
│           │   ├── Navbar (ThemeToggle)
│           │   ├── HeroSection
│           │   ├── ProjectGrid
│           │   │   └── ProjectCard[]
│           │   │       └── ImageCarousel
│           │   └── Footer
│           ├── AdminLogin
│           │   └── LoginForm
│           └── AdminDashboard
│               ├── ProjectForm
│               └── ProjectList
```

---

## Theme System

### Theme Structure
```typescript
interface Theme {
  name: string;
  id: string;
  colors: {
    '--bg-main': string;
    '--bg-card': string;
    '--bg-hover': string;
    '--text-primary': string;
    '--text-secondary': string;
    '--accent-green': string;
    '--accent-blue': string;
    '--accent-red': string;
    '--accent-yellow': string;
    '--accent-purple': string;
    '--accent-pink': string;
    '--accent-orange': string;
    '--border-color': string;
  };
  backgroundImage?: string;
  backgroundConfig?: {
    enabled: boolean;
    opacity: number;
    blur: number;
    mangaPanels: string[];  // Configurable manga panel paths
  };
  animationStyle: 'subtle' | 'playful';
}
```

### Available Themes

#### 1. Everforest (Default)
Clean, professional dark theme with forest-inspired colors.

```typescript
{
  id: 'everforest',
  name: 'Everforest',
  colors: {
    '--bg-main': '#1E2327',
    '--bg-card': '#2B3339',
    '--bg-hover': '#343C42',
    '--bg-input': '#232A2E',
    '--text-primary': '#D3C6AA',
    '--text-secondary': '#9DA9A0',
    '--text-muted': '#7A8478',
    '--accent-green': '#A7C080',
    '--accent-blue': '#7FBBB3',
    '--accent-red': '#E67E80',
    '--accent-yellow': '#DBBC7F',
    '--accent-purple': '#D699B6',
    '--accent-pink': '#E69875',
    '--accent-orange': '#E69875',
    '--border-color': '#4F585E',
  },
  animationStyle: 'subtle'
}
```

**Visual Style:**
- Dark backgrounds with warm accents
- Minimal borders, subtle shadows
- Professional, understated elegance

#### 2. Anime-Subtle
Professional anime aesthetic - clean enough for work, expressive enough for personality.

```typescript
{
  id: 'anime-subtle',
  name: 'Anime Subtle',
  colors: {
    '--bg-main': '#1A1A2E',
    '--bg-card': '#16213E',
    '--bg-hover': '#1F2A4A',
    '--bg-input': '#0F3460',
    '--text-primary': '#EAEAEA',
    '--text-secondary': '#B8C5D6',
    '--text-muted': '#7A8BA3',
    '--accent-green': '#7EE787',
    '--accent-blue': '#60A5FA',
    '--accent-red': '#F87171',
    '--accent-yellow': '#FCD34D',
    '--accent-purple': '#C084FC',
    '--accent-pink': '#F472B6',
    '--accent-orange': '#FB923C',
    '--border-color': '#2D3A5C',
  },
  animationStyle: 'playful'
}
```

**Visual Style:**
- Deep navy/purple backgrounds
- Vibrant but controlled accent colors
- Slightly more playful animations

#### 3. Otaku-Theme
Full anime experience with **configurable manga panel backgrounds**.

```typescript
{
  id: 'otaku-theme',
  name: 'Otaku Mode',
  colors: {
    '--bg-main': '#0D0D0D',
    '--bg-card': 'rgba(20, 20, 30, 0.85)',
    '--bg-hover': 'rgba(35, 35, 50, 0.9)',
    '--bg-input': 'rgba(15, 15, 25, 0.9)',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#E0E0E0',
    '--text-muted': '#A0A0A0',
    '--accent-green': '#39FF14',
    '--accent-blue': '#00D9FF',
    '--accent-red': '#FF0055',
    '--accent-yellow': '#FFD700',
    '--accent-purple': '#B829DD',
    '--accent-pink': '#FF69B4',
    '--accent-orange': '#FF6B35',
    '--border-color': 'rgba(255, 255, 255, 0.15)',
  },
  backgroundConfig: {
    enabled: true,
    opacity: 0.15,
    blur: 2,
    mangaPanels: [
      '/themes/otaku/panels/panel-1.jpg',
      '/themes/otaku/panels/panel-2.jpg',
      '/themes/otaku/panels/panel-3.jpg',
      // ... user can add more
    ]
  },
  animationStyle: 'playful'
}
```

**Visual Style:**
- Dark base with glassmorphism cards
- **Configurable manga panel backgrounds** (user-defined images)
- Neon accent colors
- Particle effects and playful animations
- Background opacity/blur adjustable

### Configurable Manga Backgrounds

The Otaku theme supports user-configurable manga panel backgrounds:

```typescript
// Theme configuration in admin panel
interface OtakuBackgroundConfig {
  enabled: boolean;           // Toggle background on/off
  opacity: number;            // 0.0 - 1.0 (default: 0.15)
  blur: number;               // px blur amount (default: 2)
  panels: string[];           // Array of image paths
  shuffle: boolean;           // Randomize panel order
  interval: number;           // Seconds between transitions
}
```

**Usage:**
```typescript
// Admin can configure backgrounds
const otakuConfig: OtakuBackgroundConfig = {
  enabled: true,
  opacity: 0.15,
  blur: 2,
  panels: [
    '/themes/otaku/my-favorite-manga-1.jpg',
    '/themes/otaku/my-favorite-manga-2.jpg',
  ],
  shuffle: true,
  interval: 30
};
```

### Using Themes
```typescript
import { useTheme } from '@/contexts/theme-context';

function MyComponent() {
  const { currentTheme, themeName, setTheme, backgroundConfig } = useTheme();
  
  return (
    <button onClick={() => setTheme('otaku-theme')}>
      Switch to Otaku
    </button>
  );
}
```

---

## Animation System

### Animation Philosophy
Inspired by ambiq.com - animations should be **smooth, subtle, and purposeful**.

### CSS Animation Classes

| Class | Effect | Duration | Use Case |
|-------|--------|----------|----------|
| `.animate-fade-in` | Simple fade | 400ms | Content reveal |
| `.animate-fade-in-up` | Fade + slide up | 600ms | Page sections |
| `.animate-fade-in-scale` | Fade + scale | 500ms | Cards, modals |
| `.animate-slide-in-left` | Slide from left | 600ms | Side content |
| `.animate-slide-in-right` | Slide from right | 600ms | Side content |
| `.animate-pulse-subtle` | Subtle pulse | 3s loop | Interactive hints |
| `.animate-float` | Gentle float | 4s loop | Decorative elements |

### Hover Effects

| Class | Effect | Duration |
|-------|--------|----------|
| `.hover-lift` | translateY(-4px) + soft shadow | 250ms |
| `.hover-scale` | scale(1.02) | 200ms |
| `.hover-glow` | Soft accent glow | 200ms |
| `.hover-brightness` | brightness(1.05) | 150ms |
| `.active-press` | scale(0.98) | 100ms |

### Smooth Scroll Behavior
```css
html {
  scroll-behavior: smooth;
}
```

### React Animation Components

#### FadeIn
```typescript
import { FadeIn } from '@/components/animations/fade-in';

<FadeIn direction="up" delay={200} duration={600}>
  <MyComponent />
</FadeIn>
```

**Props:**
- `direction`: 'up' | 'down' | 'left' | 'right' | 'none'
- `delay`: number (ms)
- `duration`: number (ms)

#### StaggerContainer
```typescript
import { StaggerContainer } from '@/components/animations/stagger-container';

<StaggerContainer staggerDelay={100} baseDelay={200}>
  {items.map(item => <Card key={item.id} {...item} />)}
</StaggerContainer>
```

#### ParticleBackground (Otaku Theme)
```typescript
import { ParticleBackground } from '@/components/animations/particle-background';

// Only render for otaku theme
{themeName === 'otaku-theme' && <ParticleBackground />}
```

### Animation Guidelines

1. **Use transform/opacity only** - GPU accelerated
2. **Keep it subtle** - Animations should enhance, not distract
3. **Consistent timing** - Use 200-300ms for interactions, 400-600ms for reveals
4. **Easing matters** - Use `ease-out` for entrances, `ease-in-out` for continuous
5. **Respect prefers-reduced-motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Layout Patterns

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}
```

### Section Spacing
```css
.section {
  padding: var(--space-3xl) 0;  /* 64px vertical */
}

.section-compact {
  padding: var(--space-2xl) 0;  /* 48px vertical */
}
```

### Grid Layouts
```css
/* Project Grid */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Component Patterns

### ProjectCard
Clean card design with smooth hover effects.

```typescript
interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    images: { url: string }[];
    techStack: string[];
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="project-card hover-lift group rounded-xl overflow-hidden bg-card border border-border">
      {/* Image with subtle zoom */}
      <div className="aspect-video overflow-hidden">
        <img 
          src={project.images[0]?.url} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary">{project.title}</h3>
        <p className="mt-2 text-secondary line-clamp-2">{project.description}</p>
        
        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.techStack.map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### Navbar
Clean, minimal navbar with theme toggle.

```typescript
export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full bg-bg-main/80 backdrop-blur-md border-b border-border z-50">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="text-xl font-bold text-primary">
          Portfolio
        </a>
        
        <div className="flex items-center gap-4">
          <a href="#projects" className="text-secondary hover:text-primary transition-colors">
            Projects
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
```

### ThemeToggle
Elegant theme switcher.

```typescript
export const ThemeToggle: React.FC = () => {
  const { themeName, setTheme, availableThemes } = useTheme();
  
  return (
    <select 
      value={themeName} 
      onChange={(e) => setTheme(e.target.value)}
      className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-primary focus:ring-2 focus:ring-accent-blue focus:outline-none transition-all"
    >
      {availableThemes.map(theme => (
        <option key={theme} value={theme}>
          {THEMES[theme].name}
        </option>
      ))}
    </select>
  );
};
```

### ImageCarousel
Smooth image carousel with fade transitions.

```typescript
interface ImageCarouselProps {
  images: { url: string; alt?: string }[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  
  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-bg-input">
      {images.map((img, idx) => (
        <img 
          key={img.url}
          src={img.url}
          alt={img.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-bg-card/80 hover:bg-bg-card transition-colors"
          >
            ←
          </button>
          <button 
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-bg-card/80 hover:bg-bg-card transition-colors"
          >
            →
          </button>
          
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === current ? 'bg-primary' : 'bg-primary/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
```

---

## Styling Patterns

### Using CSS Variables
```css
.my-component {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  transition: background var(--transition-fast), transform var(--transition-base);
}

.my-component:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
}
```

### Tailwind + CSS Variables
```tsx
<div className="bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl p-6 hover:bg-[var(--bg-hover)] transition-colors">
  Content
</div>
```

### Glassmorphism (Otaku Theme)
```css
.glass-card {
  background: rgba(20, 20, 30, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-xl);
}
```

### Theme-Specific Styles
```css
/* Subtle animations for Everforest/Anime-Subtle */
[data-animation-style="subtle"] .card {
  transition: transform 250ms ease-out, box-shadow 250ms ease-out;
}

/* Playful animations for Otaku theme */
[data-animation-style="playful"] .card {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Custom Hooks

### useTheme
```typescript
const { 
  currentTheme,       // Full theme object
  themeName,          // Current theme ID
  setTheme,           // (themeId: string) => void
  isDark,             // boolean
  availableThemes,    // string[]
  backgroundConfig    // Otaku background config
} = useTheme();
```

### useAuth
```typescript
const {
  isAuthenticated,    // boolean
  login,              // (passphrase: string) => Promise<void>
  logout,             // () => void
  isLoading           // boolean
} = useAuth();
```

### useProjects
```typescript
const {
  projects,           // Project[]
  isLoading,          // boolean
  error,              // Error | null
  refetch             // () => void
} = useProjects();
```

---

## File Structure

```
frontend/src/
├── components/
│   ├── ui/                    # shadcn components
│   ├── animations/            # Animation components
│   │   ├── fade-in.tsx
│   │   ├── stagger-container.tsx
│   │   └── particle-background.tsx
│   ├── project-card.tsx
│   ├── image-carousel.tsx
│   ├── theme-toggle.tsx
│   ├── navbar.tsx
│   └── login-form.tsx
├── contexts/
│   ├── theme-context.tsx
│   └── auth-context.tsx
├── hooks/
│   ├── use-projects.ts
│   ├── use-auth.ts
│   └── use-local-storage.ts
├── pages/
│   ├── home-page.tsx
│   ├── admin-login.tsx
│   └── admin-dashboard.tsx
├── styles/
│   ├── tokens.css             # CSS variables (3 themes)
│   └── animations.css         # Animation keyframes
├── lib/
│   ├── api.ts                 # API client
│   └── utils.ts
└── types/
    └── index.ts
```

---

## Design References

| Site | Inspiration |
|------|-------------|
| [ambiq.com](https://ambiq.com) | Clean layout, smooth animations, generous whitespace |
| [encoder.digital](https://encoder.digital/en) | Modern portfolio aesthetic, content-focused |

---

*UI Design Status: ✅ Completed*
