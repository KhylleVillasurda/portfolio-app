# System Design - Showcase Portfolio

> High-level architecture and system overview.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    React Frontend                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │   │
│  │  │   Theme     │  │   Auth      │  │  Project Grid   │ │   │
│  │  │  Context    │  │  Context    │  │  + Animations   │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         Vite + TypeScript                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE NETWORK                         │
│                    (Static Site Hosting)                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │ API Proxy
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Rust Backend (Axum)                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │   │
│  │  │  /projects  │  │   /login    │  │    /uploads     │ │   │
│  │  │   Routes    │  │   Routes    │  │    Handler      │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │   │
│  │  ┌─────────────┐  ┌─────────────┐                       │   │
│  │  │   JWT       │  │    CORS     │                       │   │
│  │  │ Middleware  │  │   Config    │                       │   │
│  │  └─────────────┘  └─────────────┘                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ SQLx
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SQLite Database                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │   │
│  │  │  projects   │  │project_images│  │  user_status    │ │   │
│  │  │    table    │  │    table     │  │     table       │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   File Storage                           │   │
│  │              /uploads/ (local directory)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 + TypeScript | UI framework |
| Build Tool | Vite | Fast dev + optimized builds |
| Styling | Tailwind CSS | Utility-first CSS |
| Components | shadcn/ui | Base component library |
| Backend | Rust + Axum | Fast, safe API server |
| Database | SQLite + sqlx | Simple, file-based storage |
| Auth | JWT + httpOnly cookies | Secure session management |
| Deploy | Vercel + Railway | Edge + serverless hosting |

---

## Data Flow

### 1. Public User Flow
```
User → Vercel CDN → React App → GET /api/projects → SQLite
                                         ↓
                                    JSON Response
                                         ↓
                              Render Project Cards
```

### 2. Admin Authentication Flow
```
Admin → Login Form → POST /api/login → Validate → Set Cookie
                              ↓
                       Redirect to Dashboard
                              ↓
              All requests include auth_token cookie
                              ↓
                    JWT Middleware validates
```

### 3. Image Upload Flow
```
Admin → Drop Images → POST /api/projects (multipart)
                              ↓
                    Save to /uploads/{uuid}.{ext}
                              ↓
                    Store path in project_images table
                              ↓
                    Serve via /uploads/{filename}
```

---

## Security Model

| Layer | Protection |
|-------|------------|
| Transport | HTTPS only |
| Auth | JWT in httpOnly, secure, SameSite=strict cookie |
| CORS | Whitelist frontend domain only |
| Input | Zod validation on frontend, Rust validation on backend |
| SQL | Parameterized queries via sqlx |
| Files | Mime-type validation, size limits (5MB) |

---

## Scalability Considerations

### Current (MVP)
- Single SQLite file
- Local file storage
- Single backend instance

### Future (Phase 2)
- PostgreSQL for concurrent access
- R2/S3 for cloud file storage
- Horizontal scaling with stateless backend

---

## Theme System Architecture

```
┌────────────────────────────────────────┐
│           ThemeProvider                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │Everforest│ │Anime-  │ │ Otaku   │  │
│  │ (default)│ │Subtle  │ │ Theme   │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│         ↓           ↓         ↓        │
│    CSS Variables + localStorage        │
└────────────────────────────────────────┘
```

Themes are:
- Defined as TypeScript objects with color tokens
- Applied via CSS custom properties
- Persisted in localStorage
- Switchable at runtime without reload

---

## Directory Structure

```
showcase-portfolio/
├── docs/                      # Documentation
│   ├── agent/                 # AI context
│   ├── architecture/          # System design (this file)
│   ├── backend/               # API & DB docs
│   └── frontend/              # UI & component docs
│
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # Reusable UI
│   │   ├── contexts/          # Theme & Auth providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Route pages
│   │   ├── styles/            # CSS variables + animations
│   │   └── lib/               # Utilities + API client
│   └── public/themes/         # Theme assets (manga panels)
│
├── backend/                   # Rust application
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── models/            # Data structures
│   │   ├── middleware/        # Auth middleware
│   │   └── db/                # Database operations
│   ├── uploads/               # Image storage
│   └── migrations/            # SQL schema
│
└── PROJECT_GUIDE.md           # Root index (start here)
```

---

See also:
- `/docs/architecture/milestones.md` - Development phases
- `/docs/backend/api-reference.md` - API details
- `/docs/frontend/ui-guide.md` - UI patterns
