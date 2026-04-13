# SHOWCASE PORTFOLIO - REFINED MVP SPECIFICATION
## Complete Technical Documentation with Missing Components

---

## TABLE OF CONTENTS
1. [Executive Summary](#1-executive-summary)
2. [MVP Scope & Goals](#2-mvp-scope--goals)
3. [Technical Architecture](#3-technical-architecture)
4. [Frontend Specification (React)](#4-frontend-specification-react)
5. [Backend Specification (Rust)](#5-backend-specification-rust)
6. [Database Schema](#6-database-schema)
7. [API Specification](#7-api-specification)
8. [Design System & Themes](#8-design-system--themes)
9. [Animation & Interaction System](#9-animation--interaction-system)
10. [Vercel Deployment Guide](#10-vercel-deployment-guide)
11. [Phase 2 Roadmap](#11-phase-2-roadmap)

---

## 1. EXECUTIVE SUMMARY

**Project**: Showcase Portfolio  
**Stack**: React + TypeScript + Vite + Rust (Axum) + SQLite  
**Deployment**: Vercel (Frontend) + Self-hosted/Vercel (Backend)  
**Themes**: Everforest (default), Anime-Subtle, Otaku-Theme (expandable system)

### What's New in This Refinement
- ✅ Complete React Context structure for Theme Switcher with 3 initial themes
- ✅ Rich animation system for interactive user experience
- ✅ Vercel deployment configuration (vercel.json, CORS, environment variables)
- ✅ Detailed API request/response schemas
- ✅ Form validation rules and error handling
- ✅ JWT authentication flow with httpOnly cookies
- ✅ Component hierarchy and file structure
- ✅ Image upload specifications (limits, formats, validation)
- ✅ Frontend routing structure
- ✅ Security best practices

---

## 2. MVP SCOPE & GOALS

### 2.1 Primary Goals
| Priority | Goal | Success Criteria |
|----------|------|------------------|
| P0 | Display Web/Software projects | Projects load < 200ms |
| P0 | Secure admin functionality | JWT-based auth, httpOnly cookies |
| P1 | Token-based CSS theming | Single variable change updates entire UI |
| P1 | Image gallery per project | Carousel with keyboard navigation |
| P1 | Rich animations & interactions | 60fps smooth transitions |
| P2 | "About/Interests" footer | Subtle hobby integration |

### 2.2 Out of Scope (Post-MVP)
- Cloud storage (R2/S3) - Phase 2
- Additional theme presets - Phase 2
- Advanced analytics - Phase 2
- Real-time updates - Phase 2

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 High-Level Architecture
```
+-----------------+     +-----------------+     +-----------------+
|   Vercel CDN    |---->|  React Frontend |---->|  Rust Backend   |
|  (Static Site)  |     |  (Vite + TS)    |     |  (Axum + SQLite)|
+-----------------+     +-----------------+     +-----------------+
                               |                          |
                               v                          v
                        +-----------------+     +-----------------+
                        |  localStorage   |     |   SQLite DB     |
                        |  (Theme Pref)   |     |  + Local Files  |
                        +-----------------+     +-----------------+
```

### 3.2 Project Directory Structure
```
showcase-portfolio/
├── frontend/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── project-card.tsx
│   │   │   ├── image-carousel.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── login-form.tsx
│   │   ├── contexts/            # React Context providers
│   │   │   ├── theme-context.tsx      # Theme state management
│   │   │   └── auth-context.tsx       # Auth state management
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── use-projects.ts
│   │   │   ├── use-auth.ts
│   │   │   └── use-local-storage.ts
│   │   ├── lib/                 # Utilities
│   │   │   ├── api.ts           # API client
│   │   │   └── utils.ts
│   │   ├── pages/               # Route pages
│   │   │   ├── home-page.tsx
│   │   │   ├── admin-login.tsx
│   │   │   └── admin-dashboard.tsx
│   │   ├── styles/              # Global styles
│   │   │   ├── tokens.css       # CSS variables
│   │   │   └── animations.css   # Animation keyframes
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/                  # Static assets
│   │   └── themes/              # Theme-specific assets
│   │       └── otaku/           # Manga panel backgrounds
│   ├── vercel.json              # Vercel routing config
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                     # Rust + Axum
│   ├── src/
│   │   ├── main.rs              # Entry point
│   │   ├── config.rs            # Environment config
│   │   ├── routes/              # API routes
│   │   │   ├── mod.rs
│   │   │   ├── projects.rs      # GET /projects, POST /projects
│   │   │   ├── auth.rs          # POST /login
│   │   │   └── uploads.rs       # File upload handlers
│   │   ├── models/              # Data models
│   │   │   ├── mod.rs
│   │   │   ├── project.rs
│   │   │   └── user.rs
│   │   ├── middleware/          # Auth middleware
│   │   │   └── auth.rs
│   │   ├── db/                  # Database operations
│   │   │   └── mod.rs
│   │   └── utils/               # Utilities
│   │       └── jwt.rs
│   ├── uploads/                 # Local image storage
│   ├── migrations/              # SQL migrations
│   ├── Cargo.toml
│   └── .env.example
│
└── README.md
```

---

## 4. FRONTEND SPECIFICATION (REACT)

### 4.1 React Context Structure (THEME SWITCHER)

#### Theme Context (`src/contexts/theme-context.tsx`)
```typescript
// Theme definition
interface Theme {
  name: string;
  id: string;
  colors: {
    '--bg-main': string;
    '--bg-card': string;
    '--bg-hover': string;
    '--bg-input': string;
    '--text-primary': string;
    '--text-secondary': string;
    '--text-muted': string;
    '--accent-green': string;
    '--accent-blue': string;
    '--accent-red': string;
    '--accent-yellow': string;
    '--accent-purple': string;
    '--accent-pink': string;
    '--accent-orange': string;
    '--border-color': string;
  };
  backgroundImage?: string;  // For otaku theme
  animationStyle?: 'subtle' | 'playful' | 'minimal';
}

// Available themes (expandable system)
const THEMES: Record<string, Theme> = {
  // ============================================
  // THEME 1: EVERFOREST (Default - Rich Colors)
  // ============================================
  everforest: {
    name: 'Everforest Dark',
    id: 'everforest',
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
  },

  // ============================================
  // THEME 2: ANIME-SUBTLE (Professional Anime)
  // ============================================
  'anime-subtle': {
    name: 'Anime Subtle',
    id: 'anime-subtle',
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
  },

  // ============================================
  // THEME 3: OTAKU-THEME (Full Anime Experience)
  // ============================================
  'otaku-theme': {
    name: 'Otaku Mode',
    id: 'otaku-theme',
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
    backgroundImage: '/themes/otaku/manga-panels.jpg',
    animationStyle: 'playful'
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  themeName: string;
  setTheme: (name: string) => void;
  isDark: boolean;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useLocalStorage('theme', 'everforest');
  
  useEffect(() => {
    const theme = THEMES[themeName] || THEMES.everforest;
    
    // Apply CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    
    // Apply background image for otaku theme
    if (theme.backgroundImage) {
      document.body.style.backgroundImage = `url(${theme.backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundPosition = 'center';
    } else {
      document.body.style.backgroundImage = 'none';
    }
    
    // Apply animation style class
    document.documentElement.setAttribute('data-animation-style', theme.animationStyle || 'subtle');
  }, [themeName]);

  const value = {
    currentTheme: THEMES[themeName] || THEMES.everforest,
    themeName,
    setTheme: setThemeName,
    isDark: true,
    availableThemes: Object.keys(THEMES),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

#### Auth Context (`src/contexts/auth-context.tsx`)
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  login: (passphrase: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT stored in httpOnly cookie (set by backend)
// Frontend only tracks auth state, not the token itself
```

### 4.2 Frontend Routing Structure
```typescript
// App.tsx routing
<BrowserRouter>
  <ThemeProvider>
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/login" />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </ThemeProvider>
</BrowserRouter>
```

### 4.3 Component Hierarchy
```
App
├── ThemeProvider
│   └── AuthProvider
│       └── Router
│           ├── HomePage (Public)
│           │   ├── Navbar (with ThemeToggle)
│           │   ├── HeroSection (animated)
│           │   ├── ProjectGrid (staggered animation)
│           │   │   └── ProjectCard[] (hover effects)
│           │   │       └── ImageCarousel (slide transitions)
│           │   └── Footer (with HobbyTag)
│           │
│           ├── AdminLogin
│           │   └── LoginForm
│           │
│           └── AdminDashboard (Protected)
│               ├── ProjectCreator
│               │   └── ProjectForm
│               └── ProjectList (with Delete)
```

### 4.4 Custom Hooks

#### `useLocalStorage` Hook
```typescript
// For theme persistence
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStored(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [stored, setValue];
}
```

---

## 5. BACKEND SPECIFICATION (RUST)

### 5.1 Dependencies (`Cargo.toml`)
```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
tower = "0.4"
tower-http = { version = "0.5", features = ["cors", "fs"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
sqlx = { version = "0.7", features = ["sqlite", "runtime-tokio"] }
jsonwebtoken = "9"
bcrypt = "0.15"
chrono = { version = "0.4", features = ["serde"] }
uuid = { version = "1", features = ["v4"] }
multer = "3"
tracing = "0.1"
tracing-subscriber = "0.3"
dotenvy = "0.15"
```

### 5.2 JWT Authentication Middleware
```rust
// src/middleware/auth.rs
use axum::{
    extract::Request,
    http::StatusCode,
    middleware::Next,
    response::Response,
};
use jsonwebtoken::{decode, DecodingKey, Validation};

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub async fn auth_middleware(
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let token = request
        .cookies()
        .get("auth_token")
        .map(|c| c.value().to_string())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let secret = std::env::var("JWT_SECRET").map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    decode::<Claims>(
        &token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(next.run(request).await)
}
```

---

## 6. DATABASE SCHEMA

### 6.1 Complete Schema with Constraints
```sql
-- Core Projects Table
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 100),
    description TEXT NOT NULL CHECK(length(description) BETWEEN 10 AND 5000),
    repo_url TEXT CHECK(repo_url IS NULL OR repo_url LIKE 'https://%'),
    ext_url TEXT CHECK(ext_url IS NULL OR ext_url LIKE 'https://%'),
    tech_stack TEXT NOT NULL, -- JSON array: ["Rust", "React", "TypeScript"]
    hobby_tag TEXT CHECK(hobby_tag IS NULL OR length(hobby_tag) <= 50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Project Images Table
CREATE TABLE project_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER CHECK(file_size <= 5242880), -- 5MB max
    mime_type TEXT CHECK(mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
    display_order INTEGER DEFAULT 0,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_projects_created ON projects(created_at DESC);
CREATE INDEX idx_images_project ON project_images(project_id);

-- Hobby Status Table (for footer)
CREATE TABLE user_status (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    current_activity TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default status
INSERT INTO user_status (id, current_activity) VALUES (1, 'Building cool things');
```

---

## 7. API SPECIFICATION

### 7.1 Request/Response Schemas

#### GET /api/projects
```typescript
// Response: 200 OK
interface ProjectsResponse {
  success: true;
  data: Project[];
  meta: {
    total: number;
    fetched_at: string;
  };
}

interface Project {
  id: number;
  title: string;
  description: string;
  repo_url: string | null;
  ext_url: string | null;
  tech_stack: string[]; // Parsed from JSON
  hobby_tag: string | null;
  images: ProjectImage[];
  created_at: string;
}

interface ProjectImage {
  id: number;
  url: string; // /uploads/{filename}
  display_order: number;
}

// Error: 500 Internal Server Error
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

#### POST /api/login
```typescript
// Request
interface LoginRequest {
  passphrase: string; // Min 8 characters
}

// Response: 200 OK
interface LoginResponse {
  success: true;
  message: "Authentication successful";
}
// Sets httpOnly cookie: auth_token={jwt}

// Response: 401 Unauthorized
interface LoginError {
  success: false;
  error: {
    code: "INVALID_PASSPHRASE";
    message: "Invalid passphrase";
  };
}
```

#### POST /api/projects (Authenticated)
```typescript
// Request: multipart/form-data
interface CreateProjectRequest {
  title: string;           // Required, 1-100 chars
  description: string;     // Required, 10-5000 chars (Markdown)
  repo_url?: string;       // Optional, valid URL
  ext_url?: string;        // Optional, valid URL
  tech_stack: string;      // JSON array: ["Rust", "React"]
  hobby_tag?: string;      // Optional, max 50 chars
  images: File[];          // Optional, max 5 files, 5MB each
}

// Response: 201 Created
interface CreateProjectResponse {
  success: true;
  data: Project;
}

// Response: 400 Bad Request
interface ValidationError {
  success: false;
  error: {
    code: "VALIDATION_ERROR";
    message: "Invalid input data";
    details: {
      field: string;
      message: string;
    }[];
  };
}

// Response: 401 Unauthorized
// Response: 413 Payload Too Large (images > 5MB)
```

#### DELETE /api/projects/:id (Authenticated)
```typescript
// Response: 204 No Content (success)

// Response: 404 Not Found
interface NotFoundError {
  success: false;
  error: {
    code: "PROJECT_NOT_FOUND";
    message: "Project with id {id} not found";
  };
}
```

### 7.2 API Endpoint Summary
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/projects | No | List all projects with images |
| GET | /api/projects/:id | No | Get single project |
| POST | /api/login | No | Authenticate, set JWT cookie |
| POST | /api/logout | Yes | Clear JWT cookie |
| POST | /api/projects | Yes | Create project with images |
| PUT | /api/projects/:id | Yes | Update project |
| DELETE | /api/projects/:id | Yes | Delete project + images |
| GET | /api/status | No | Get hobby status for footer |
| PUT | /api/status | Yes | Update hobby status |

---

## 8. DESIGN SYSTEM & THEMES

### 8.1 CSS Tokens (`src/styles/tokens.css`)
```css
:root {
  /* Background Colors */
  --bg-main: #1E2327;
  --bg-card: #2B3339;
  --bg-hover: #343C42;
  --bg-input: #232A2E;
  
  /* Text Colors */
  --text-primary: #D3C6AA;
  --text-secondary: #9DA9A0;
  --text-muted: #7A8478;
  --text-inverse: #1E2327;
  
  /* Accent Colors */
  --accent-green: #A7C080;
  --accent-blue: #7FBBB3;
  --accent-red: #E67E80;
  --accent-yellow: #DBBC7F;
  --accent-purple: #D699B6;
  --accent-pink: #E69875;
  --accent-orange: #E69875;
  
  /* Border & Shadow */
  --border-color: #4F585E;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
  
  /* Z-index Scale */
  --z-dropdown: 100;
  --z-modal: 200;
  --z-toast: 300;
}

/* Anime Subtle Theme Overrides */
[data-theme="anime-subtle"] {
  --bg-main: #1A1A2E;
  --bg-card: #16213E;
  --bg-hover: #1F2A4A;
  --bg-input: #0F3460;
  --text-primary: #EAEAEA;
  --text-secondary: #B8C5D6;
  --text-muted: #7A8BA3;
  --accent-green: #7EE787;
  --accent-blue: #60A5FA;
  --accent-red: #F87171;
  --accent-yellow: #FCD34D;
  --accent-purple: #C084FC;
  --accent-pink: #F472B6;
  --accent-orange: #FB923C;
  --border-color: #2D3A5C;
}

/* Otaku Theme Overrides */
[data-theme="otaku-theme"] {
  --bg-main: #0D0D0D;
  --bg-card: rgba(20, 20, 30, 0.85);
  --bg-hover: rgba(35, 35, 50, 0.9);
  --bg-input: rgba(15, 15, 25, 0.9);
  --text-primary: #FFFFFF;
  --text-secondary: #E0E0E0;
  --text-muted: #A0A0A0;
  --accent-green: #39FF14;
  --accent-blue: #00D9FF;
  --accent-red: #FF0055;
  --accent-yellow: #FFD700;
  --accent-purple: #B829DD;
  --accent-pink: #FF69B4;
  --accent-orange: #FF6B35;
  --border-color: rgba(255, 255, 255, 0.15);
}
```

### 8.2 Component Styles
```css
/* Card Component */
.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  transition: transform var(--transition-base),
              box-shadow var(--transition-base),
              border-color var(--transition-fast);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Button Variants */
.btn-primary {
  background: var(--accent-green);
  color: var(--text-inverse);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
}

/* Tech Stack Tag */
.tech-tag {
  background: var(--bg-input);
  color: var(--accent-blue);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-sm);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  transition: all var(--transition-fast);
}

.tech-tag:hover {
  background: var(--accent-blue);
  color: var(--text-inverse);
}
```

---

## 9. ANIMATION & INTERACTION SYSTEM

### 9.1 Animation Philosophy
The portfolio features a rich, interactive experience with smooth 60fps animations that enhance user engagement without being distracting. Animation intensity scales with the theme:
- **Everforest**: Subtle, professional animations
- **Anime-Subtle**: Playful but restrained animations
- **Otaku-Theme**: Full anime-style animations with particles and effects

### 9.2 Animation CSS (`src/styles/animations.css`)
```css
/* ============================================
   CORE ANIMATIONS
   ============================================ */

/* Fade In Up - Page Load */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade In Scale - Cards */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Slide In From Left */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide In From Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Pulse Glow - Interactive Elements */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 5px var(--accent-blue);
  }
  50% {
    box-shadow: 0 0 20px var(--accent-blue), 0 0 30px var(--accent-purple);
  }
}

/* Shimmer - Loading States */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Bounce - Attention */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Float - Decorative Elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* ============================================
   ANIME-SPECIFIC ANIMATIONS
   ============================================ */

/* Sparkle Effect */
@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

/* Glitch Effect - Otaku Theme */
@keyframes glitch {
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(-2px, 2px);
  }
  20% {
    clip-path: inset(92% 0 1% 0);
    transform: translate(2px, -2px);
  }
  40% {
    clip-path: inset(43% 0 1% 0);
    transform: translate(-2px, 2px);
  }
  60% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(2px, -2px);
  }
  80% {
    clip-path: inset(54% 0 7% 0);
    transform: translate(-2px, 2px);
  }
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(2px, -2px);
  }
}

/* Particle Float - Background Effects */
@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(720deg);
    opacity: 0;
  }
}

/* ============================================
   UTILITY CLASSES
   ============================================ */

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-scale {
  animation: fadeInScale 0.5s ease-out forwards;
}

.animate-slide-in-left {
  animation: slideInLeft 0.6s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.6s ease-out forwards;
}

.animate-pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Stagger Animation Delays */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
.stagger-6 { animation-delay: 0.6s; }

/* ============================================
   INTERACTION STATES
   ============================================ */

/* Hover Lift Effect */
.hover-lift {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Hover Scale Effect */
.hover-scale {
  transition: transform var(--transition-fast);
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Hover Glow Effect */
.hover-glow {
  transition: box-shadow var(--transition-fast);
}

.hover-glow:hover {
  box-shadow: 0 0 20px var(--accent-blue);
}

/* Focus Ring */
.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--accent-blue);
}

/* Active Press Effect */
.active-press:active {
  transform: scale(0.98);
}

/* ============================================
   THEME-SPECIFIC ANIMATIONS
   ============================================ */

/* Otaku Theme - Glitch Text */
[data-animation-style="playful"] .glitch-text {
  position: relative;
}

[data-animation-style="playful"] .glitch-text::before,
[data-animation-style="playful"] .glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

[data-animation-style="playful"] .glitch-text::before {
  animation: glitch 2s infinite linear alternate-reverse;
  color: var(--accent-red);
  z-index: -1;
}

[data-animation-style="playful"] .glitch-text::after {
  animation: glitch 3s infinite linear alternate-reverse;
  color: var(--accent-blue);
  z-index: -2;
}

/* Particle Container - Otaku Theme */
.particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--accent-pink);
  border-radius: 50%;
  animation: particleFloat 10s linear infinite;
}

/* ============================================
   REDUCED MOTION SUPPORT
   ============================================ */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 9.3 React Animation Components

#### FadeIn Component
```typescript
// src/components/animations/fade-in.tsx
import { useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(30px)';
      case 'down': return 'translateY(-30px)';
      case 'left': return 'translateX(50px)';
      case 'right': return 'translateX(-50px)';
      default: return 'translateY(30px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
```

#### StaggerContainer Component
```typescript
// src/components/animations/stagger-container.tsx
import { FadeIn } from './fade-in';

interface StaggerContainerProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  baseDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 100,
  baseDelay = 0,
  direction = 'up',
  className = '',
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          direction={direction}
          delay={baseDelay + index * staggerDelay}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
};
```

#### ParticleBackground Component (Otaku Theme)
```typescript
// src/components/animations/particle-background.tsx
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const particles: Particle[] = [];
    const colors = ['#FF69B4', '#00D9FF', '#39FF14', '#FFD700', '#B829DD'];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
```

### 9.4 Animation Implementation Guide

#### Page Load Sequence
```typescript
// HomePage animation sequence
const HomePage = () => {
  return (
    <div className="relative">
      {/* Particle background for otaku theme */}
      <ParticleBackground />
      
      <FadeIn direction="down" delay={0}>
        <Navbar />
      </FadeIn>
      
      <FadeIn direction="up" delay={200}>
        <HeroSection />
      </FadeIn>
      
      <StaggerContainer 
        staggerDelay={150} 
        baseDelay={400}
        className="project-grid"
      >
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </StaggerContainer>
      
      <FadeIn direction="up" delay={600}>
        <Footer />
      </FadeIn>
    </div>
  );
};
```

#### Hover Effects
```typescript
// ProjectCard with hover animations
const ProjectCard = ({ project }) => {
  return (
    <div className="project-card hover-lift hover-glow group">
      {/* Image with zoom effect */}
      <div className="overflow-hidden rounded-lg">
        <img 
          src={project.image} 
          alt={project.title}
          className="transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      {/* Content with slide-up reveal */}
      <div className="mt-4 transform transition-all duration-300 group-hover:translate-y-[-4px]">
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.description}
        </p>
      </div>
      
      {/* Tech tags with stagger */}
      <div className="flex gap-2 mt-3">
        {project.techStack.map((tech, i) => (
          <span 
            key={tech}
            className="tech-tag transform transition-all duration-200"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};
```

---

## 10. VERCEL DEPLOYMENT GUIDE

### 10.1 Frontend Deployment (`vercel.json`)
```json
{
  "version": 2,
  "name": "showcase-portfolio",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "${BACKEND_URL}/api/$1"
    },
    {
      "source": "/uploads/(.*)",
      "destination": "${BACKEND_URL}/uploads/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

### 10.2 Backend CORS Configuration (Rust)
```rust
// src/main.rs
use tower_http::cors::{Any, CorsLayer};

let cors = CorsLayer::new()
    .allow_origin([
        "https://your-domain.vercel.app".parse().unwrap(),
        "http://localhost:5173".parse().unwrap(),
    ])
    .allow_methods(Any)
    .allow_headers(Any)
    .allow_credentials(true);
```

### 10.3 Environment Variables

#### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
```

#### Backend (.env)
```
# Database
DATABASE_URL=sqlite://./database.db

# Security
ADMIN_PASSPHRASE=your_secure_passphrase_here
JWT_SECRET=your_random_jwt_secret_min_32_chars

# Server
PORT=3000
FRONTEND_URL=https://your-domain.vercel.app

# Uploads
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### 10.4 Deployment Checklist
- [ ] Set up Vercel project linked to GitHub repo
- [ ] Configure environment variables in Vercel dashboard
- [ ] Deploy backend to VPS/Railway/Render
- [ ] Update `FRONTEND_URL` in backend env
- [ ] Update `BACKEND_URL` in frontend `vercel.json`
- [ ] Test authentication flow
- [ ] Test image uploads
- [ ] Verify CORS is working
- [ ] Test all three themes
- [ ] Verify animations work at 60fps

---

## 11. PHASE 2 ROADMAP

### 11.1 Cloud Storage Integration (R2/S3)
```rust
// Workflow:
// 1. Receive image upload
// 2. Resize/convert to WebP using `image` crate
// 3. Upload to R2/S3
// 4. Store public URL in database
```

### 11.2 Additional Theme Presets (Expandable System)
```typescript
// Future themes to add:
// - nord: Arctic, blue-based theme
// - gruvbox: Retro groove theme
// - catppuccin: Pastel theme
// - dracula: Dark purple theme
// - tokyo-night: City lights theme
// - custom: User-defined theme builder

// themes/index.ts
export const THEMES = {
  everforest: { /* ... */ },
  'anime-subtle': { /* ... */ },
  'otaku-theme': { /* ... */ },
  // Phase 2 additions:
  nord: { /* ... */ },
  gruvbox: { /* ... */ },
  catppuccin: { /* ... */ },
  dracula: { /* ... */ },
  'tokyo-night': { /* ... */ },
};
```

### 11.3 Advanced Animations
- Page transitions with Framer Motion
- Scroll-triggered parallax effects
- 3D card tilt on hover
- Custom cursor effects
- Sound effects (optional, muted by default)

### 11.4 Project Categories
```sql
-- Phase 2 Schema Addition
ALTER TABLE projects ADD COLUMN category TEXT 
  CHECK(category IN ('Web', 'Software', 'CLI', 'Script', 'Library'))
  DEFAULT 'Web';

ALTER TABLE projects ADD COLUMN is_featured BOOLEAN DEFAULT 0;
ALTER TABLE projects ADD COLUMN version_number TEXT;
```

### 11.5 Analytics Integration
```typescript
// Privacy-focused analytics (Plausible/Umami)
// Track: Page views, project clicks, theme switches
// No cookies, no personal data
```

---

## APPENDIX

### A. Security Checklist
- [ ] JWT stored in httpOnly, secure, SameSite=strict cookie
- [ ] CORS properly configured for production domain only
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention via sqlx parameterized queries
- [ ] File upload: validate mime type, size, extension
- [ ] Rate limiting on login endpoint
- [ ] Helmet headers for security

### B. Performance Targets
| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| API Response Time | < 200ms | Server logs |
| Time to Interactive | < 3s | Lighthouse |
| Bundle Size | < 200KB | Vite build |
| Animation Frame Rate | 60fps | DevTools |

### C. Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 14+

### D. Theme Assets

#### Otaku Theme Background Assets
Place manga panel images in:
```
frontend/public/themes/otaku/
├── manga-panels.jpg          # Main background
├── manga-panels-dark.jpg     # Dark variant
└── particles/                # Optional particle sprites
    ├── star.png
    ├── sparkle.png
    └── sakura.png
```

Recommended image specs:
- Resolution: 1920x1080 minimum
- Format: WebP with JPG fallback
- Size: < 500KB each
- Style: Subtle, low-contrast manga panels
