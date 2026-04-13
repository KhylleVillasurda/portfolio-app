# Development Milestones

> Optimized 6-week roadmap with clear deliverables.

---

## Timeline Overview

```
Week 1    Week 2    Week 3    Week 4    Week 5    Week 6
  M0        M1A       M1B       M2A       M2B       M3
Setup    Database   Auth/API  Frontend  Polish   Deploy
```

---

## M0: Project Setup (Week 1)

**Goal**: Development environment ready.

### Tasks
| Task | Est. Time |
|------|-----------|
| Initialize Git repo | 30min |
| Set up Vite + React + TypeScript | 1hr |
| Set up Rust + Axum | 1hr |
| Configure Tailwind + shadcn/ui | 1hr |
| Set up SQLite + sqlx | 1hr |
| Create folder structure | 30min |
| Configure ESLint + Prettier | 30min |

### Success Criteria
- [ ] `npm run dev` → :5173
- [ ] `cargo run` → :3000
- [ ] Hot reload working

---

## M1A: Database & Models (Week 2)

**Goal**: Data layer complete.

### Deliverables
```
backend/
├── migrations/
│   ├── 001_initial.sql
│   └── 002_indexes.sql
├── src/
│   ├── models/
│   │   ├── project.rs
│   │   └── user.rs
│   └── db/
│       └── mod.rs
```

### Endpoints
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | /api/projects | ⬜ |
| GET | /api/projects/:id | ⬜ |

### Success Criteria
- [ ] Database migrations auto-run
- [ ] Projects return correct JSON
- [ ] Images linked to projects

---

## M1B: Auth & API (Week 3)

**Goal**: Secure admin functionality.

### Deliverables
```
backend/src/
├── middleware/
│   └── auth.rs
├── utils/
│   └── jwt.rs
└── routes/
    ├── auth.rs
    └── uploads.rs
```

### Endpoints
| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| POST | /api/login | No | ⬜ |
| POST | /api/projects | Yes | ⬜ |
| PUT | /api/projects/:id | Yes | ⬜ |
| DELETE | /api/projects/:id | Yes | ⬜ |

### Success Criteria
- [ ] Login sets httpOnly cookie
- [ ] Protected routes reject invalid tokens
- [ ] File uploads validate type/size

---

## M2A: Frontend Core (Week 4)

**Goal**: UI functional with all pages.

### Deliverables
```
frontend/src/
├── contexts/
│   ├── theme-context.tsx
│   └── auth-context.tsx
├── components/
│   ├── project-card.tsx
│   ├── image-carousel.tsx
│   ├── theme-toggle.tsx
│   └── login-form.tsx
├── pages/
│   ├── home-page.tsx
│   ├── admin-login.tsx
│   └── admin-dashboard.tsx
└── lib/
    └── api.ts
```

### Pages
| Page | Route | Features |
|------|-------|----------|
| Home | `/` | Project grid, footer |
| Admin Login | `/admin/login` | Passphrase form |
| Admin Dashboard | `/admin/dashboard` | CRUD operations |

### Success Criteria
- [ ] Projects display from API
- [ ] Theme switcher works (3 themes)
- [ ] Login → Dashboard flow works
- [ ] Admin CRUD functional

---

## M2B: Animations & Polish (Week 5)

**Goal**: Rich interactions at 60fps.

### Deliverables
```
frontend/src/
├── styles/
│   ├── tokens.css
│   └── animations.css
├── components/animations/
│   ├── fade-in.tsx
│   ├── stagger-container.tsx
│   └── particle-background.tsx
└── public/themes/otaku/
    └── manga-panels.jpg
```

### Animation Checklist
| Animation | Location | Theme |
|-----------|----------|-------|
| Page fade-in | All | All |
| Card hover lift | Grid | All |
| Image zoom | Cards | All |
| Stagger reveal | Grid | All |
| Particle bg | Home | Otaku |
| Glitch text | Hero | Otaku |

### Success Criteria
- [ ] 60fps animations
- [ ] `prefers-reduced-motion` support
- [ ] Otaku particles working
- [ ] Smooth theme transitions

---

## M3: Deployment (Week 6)

**Goal**: Production live.

### Deliverables
```
frontend/
├── vercel.json
└── .env.production

backend/
├── .env.example
└── Dockerfile (optional)
```

### Checklist
- [ ] Frontend on Vercel
- [ ] Backend on Railway/Render
- [ ] Environment vars configured
- [ ] CORS configured
- [ ] Image uploads working
- [ ] Mobile responsive
- [ ] Lighthouse score > 90

---

## Post-MVP

### Phase 4
- Cloud storage (R2/S3)
- More themes (Nord, Gruvbox)
- Project categories
- Analytics

### Phase 5
- Real-time updates
- Multi-user support
- Custom theme builder

---

## Quick Stats

| Metric | Target |
|--------|--------|
| MVP Timeline | 6 weeks |
| First Paint | < 1.5s |
| API Response | < 200ms |
| Animation FPS | 60fps |
| Bundle Size | < 200KB |
