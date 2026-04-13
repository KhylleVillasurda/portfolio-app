# Showcase Portfolio - Project Guide

> Welcome! This is your starting point for the Showcase Portfolio project.

---

## What is This Project?

A personal portfolio website featuring:
- 🎨 **3 Themes**: Everforest (default), Anime-Subtle, Otaku-Theme
- 🖼️ **Configurable Manga Backgrounds**: Otaku theme with user-defined panels
- 🔐 **Secure Admin**: JWT authentication with httpOnly cookies
- 🖼️ **Project Gallery**: Image uploads with carousel
- ✨ **Rich Animations**: 60fps interactions
- 🚀 **Modern Stack**: React + TypeScript + Rust + SQLite

### Design Philosophy

**Inspired by:** [ambiq.com](https://ambiq.com) & [encoder.digital](https://encoder.digital/en)

- **Clean & Minimal** - Generous whitespace, uncluttered layouts
- **Smooth Animations** - Subtle transitions that enhance without distracting
- **Content-Focused** - Let projects speak for themselves

---

## Quick Start

### For AI Assistants
👉 Start here: [`/docs/agent/ai-context.md`](./docs/agent/ai-context.md)

### For Developers
1. Read the architecture: [`/docs/architecture/system-design.md`](./docs/architecture/system-design.md)
2. Check the roadmap: [`/docs/architecture/milestones.md`](./docs/architecture/milestones.md)
3. Dive into backend: [`/docs/backend/api-reference.md`](./docs/backend/api-reference.md)
4. Explore frontend: [`/docs/frontend/ui-guide.md`](./docs/frontend/ui-guide.md)

---

## Documentation Map

```
docs/
├── agent/
│   ├── ai-context.md          ← AI assistants start here
│   └── progression.md         ← Current status & next steps (living doc)
│
├── architecture/
│   ├── system-design.md       ← System architecture & tech stack
│   └── milestones.md          ← 6-week development roadmap
│
├── backend/
│   └── api-reference.md       ← API endpoints & database schema
│
└── frontend/
    └── ui-guide.md            ← Components, themes & animations
```

---

## Project Structure

```
showcase-portfolio/
├── docs/                      # Documentation (you are here)
│   ├── agent/
│   ├── architecture/
│   ├── backend/
│   └── frontend/
│
├── PROJECT_GUIDE.md           # This file - root index
│
├── frontend/                  # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── contexts/          # Theme & Auth providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Route pages
│   │   ├── styles/            # CSS variables + animations
│   │   └── lib/               # Utilities + API client
│   └── public/themes/         # Theme assets
│
└── backend/                   # Rust + Axum
    ├── src/
    │   ├── routes/            # API endpoints
    │   ├── models/            # Data structures
    │   ├── middleware/        # Auth middleware
    │   └── db/                # Database operations
    ├── uploads/               # Image storage
    └── migrations/            # SQL schema
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Rust + Axum |
| Database | SQLite + sqlx |
| Auth | JWT (httpOnly cookies) |
| Deploy | Vercel + Railway/Render |

---

## Development Timeline

```
Week 1:  Setup (M0)
Week 2:  Database & Models (M1A)
Week 3:  Auth & API (M1B)
Week 4:  Frontend Core (M2A)
Week 5:  Animations & Polish (M2B)
Week 6:  Deployment (M3)
```

**Total: ~6 weeks for MVP**

See [`/docs/architecture/milestones.md`](./docs/architecture/milestones.md) for detailed breakdown.

---

## Key Features

### Theme System
- 3 themes with expandable architecture
- CSS variable-based theming
- Runtime theme switching
- Persistent preference (localStorage)

### Animations
- Scroll-triggered fade-ins
- Staggered list reveals
- Hover effects (lift, glow, scale)
- Particle background (Otaku theme)
- 60fps performance target

### Security
- JWT in httpOnly, secure, SameSite=strict cookies
- CORS whitelist
- Input validation (Zod + Rust)
- SQL injection prevention (sqlx)
- File upload validation

---

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=sqlite://./database.db
ADMIN_PASSPHRASE=your_secure_passphrase
JWT_SECRET=random_32_char_string
FRONTEND_URL=https://your-domain.vercel.app
PORT=3000
```

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend.com
```

---

## API Quick Reference

| Endpoint | Method | Auth |
|----------|--------|------|
| `/api/projects` | GET | No |
| `/api/projects/:id` | GET | No |
| `/api/login` | POST | No |
| `/api/projects` | POST | Yes |
| `/api/projects/:id` | PUT | Yes |
| `/api/projects/:id` | DELETE | Yes |

See [`/docs/backend/api-reference.md`](./docs/backend/api-reference.md) for full details.

---

## Theme IDs

```typescript
everforest       // Default - rich forest colors, professional dark
anime-subtle     // Professional anime aesthetic
otaku-theme      // Full anime with CONFIGURABLE manga panel backgrounds
```

### Otaku Theme Backgrounds
The Otaku theme features **user-configurable manga panel backgrounds**:
- Upload your own manga panel images
- Adjustable opacity and blur
- Background transitions
- Stored in `/public/themes/otaku/panels/`

See [`/docs/frontend/ui-guide.md`](./docs/frontend/ui-guide.md) for theme details.

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| API Response Time | < 200ms |
| Animation Frame Rate | 60fps |
| Bundle Size | < 200KB |

---

## Contributing

When making changes:
1. Check relevant docs in `/docs/`
2. Follow existing code style
3. Test all 3 themes for UI changes
4. Respect `prefers-reduced-motion`
5. Update docs if architecture changes

---

## Post-MVP Ideas

- [ ] Cloud storage (R2/S3) for images
- [ ] Additional themes (Nord, Gruvbox, Catppuccin)
- [ ] Project categories/filtering
- [ ] Privacy-focused analytics
- [ ] Custom theme builder

---

## Need Help?

| Question | See... |
|----------|--------|
| **What's the current status?** | `/docs/agent/progression.md` ⬅️ **Start here** |
| How does the system work? | `/docs/architecture/system-design.md` |
| What's the API contract? | `/docs/backend/api-reference.md` |
| How do I use themes? | `/docs/frontend/ui-guide.md` |
| What's the full roadmap? | `/docs/architecture/milestones.md` |
| Quick context for AI? | `/docs/agent/ai-context.md` |

---

*Last updated: 2026-04-12*
