# AI Context - Showcase Portfolio

> Quick reference for AI assistants. Read this first.

---

## Project Overview

**Showcase Portfolio** - Personal portfolio with admin panel, 3 themes, and rich animations.

| Aspect | Details |
|--------|---------|
| **Stack** | React + TypeScript + Vite + Rust (Axum) + SQLite |
| **Themes** | Everforest (default), Anime-Subtle, Otaku-Theme |
| **Design** | Clean, minimal (inspired by ambiq.com & encoder.digital) |
| **Auth** | JWT via httpOnly cookies |
| **Deploy** | Vercel (frontend) + Railway/Render (backend) |

---

## Quick Navigation

| Need to know about... | Go to... |
|----------------------|----------|
| **Current status & what's next** | `/docs/agent/progression.md` ⬅️ **Start here for active work** |
| Full system design | `/docs/architecture/system-design.md` |
| Backend API & DB | `/docs/backend/api-reference.md` |
| Frontend components & themes | `/docs/frontend/ui-guide.md` |
| Development roadmap | `/docs/architecture/milestones.md` |

---

## Design Philosophy

**Inspired by:** [ambiq.com](https://ambiq.com) & [encoder.digital](https://encoder.digital/en)

- **Clean & Minimal** - Generous whitespace, uncluttered layouts
- **Smooth Animations** - Subtle transitions that enhance without distracting
- **Content-Focused** - Let projects speak for themselves
- **Modern Aesthetic** - Contemporary design with approachable feel

## Common Decisions

| Decision | Choice |
|----------|--------|
| State management | React Context |
| Styling | Tailwind CSS + CSS variables |
| Forms | React Hook Form + Zod |
| HTTP client | Native fetch |
| Animations | CSS keyframes + subtle Framer Motion |
| Icons | Lucide React |

---

## Theme IDs

```typescript
everforest      // Default - rich forest colors, professional dark
anime-subtle    // Professional anime aesthetic  
otaku-theme     // Full anime with CONFIGURABLE manga panel backgrounds
```

### Otaku Theme - Configurable Backgrounds
The Otaku theme supports **user-defined manga panel backgrounds**:
```typescript
interface OtakuBackgroundConfig {
  enabled: boolean;        // Toggle on/off
  opacity: number;         // 0.0 - 1.0 (default: 0.15)
  blur: number;            // px blur (default: 2)
  panels: string[];        // User's manga panel image paths
  shuffle: boolean;        // Randomize order
  interval: number;        // Seconds between transitions
}
```

**Storage:** `/public/themes/otaku/panels/`

See `/docs/frontend/ui-guide.md` for full theme details.

---

## API Quick Reference

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /api/projects` | No | List projects |
| `POST /api/login` | No | Authenticate |
| `POST /api/projects` | Yes | Create project |
| `DELETE /api/projects/:id` | Yes | Delete project |

---

## Continuous Workflow

This project uses a **living documentation** approach:

```
┌─────────────────────────────────────────────────────────────┐
│  ai-context.md  ←──→  progression.md  ←──→  Implementation  │
│   (Context)           (Current State)        (Code Changes)  │
└─────────────────────────────────────────────────────────────┘
```

### How It Works
1. **Read `progression.md`** first to see current status
2. **Check this file (`ai-context.md`)** for quick context
3. **Implement** the next task
4. **Update `progression.md`** when done (move items, update progress bar)

### After Each Session
- [ ] Move completed items to "Completed" section
- [ ] Update progress bar at top of `progression.md`
- [ ] Update "Last Updated" timestamp
- [ ] Add any new blockers or decisions to log
- [ ] Set clear "Next Action" for next session

---

## When Implementing

1. **Read `progression.md`** - know what's next
2. Check `/docs/frontend/ui-guide.md` for component patterns
3. Check `/docs/backend/api-reference.md` for API contracts
4. Follow existing code style (TypeScript strict, functional components)
5. Respect `prefers-reduced-motion` for animations
6. Test all 3 themes when changing UI
7. **Update `progression.md`** when done

---

*See other docs in sibling directories for detailed information.*
