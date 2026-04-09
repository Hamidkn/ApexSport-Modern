# ApexSport v2 — React + TypeScript

A modern, production-grade athlete training platform built with React, TypeScript, and Framer Motion.

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React 18 + TypeScript               |
| Build tool   | Vite                                |
| Routing      | React Router v6                     |
| Animations   | Framer Motion                       |
| Icons        | Lucide React                        |
| Fonts        | Outfit + Fraunces (Google Fonts)    |
| State        | React hooks + localStorage          |

## Project Structure

```
src/
├── components/
│   └── Navbar.tsx          # Sticky animated nav, auth-aware
├── pages/
│   ├── HomePage.tsx        # Hero, features, programs, coaches, CTA
│   ├── ProgramsPage.tsx    # Filterable program grid
│   ├── CoachesPage.tsx     # Expandable coach cards
│   ├── LoginPage.tsx       # Glassmorphic login form
│   ├── SignupPage.tsx      # Animated 4-step signup flow
│   └── DashboardPage.tsx   # Full 5-tab athlete dashboard
├── data/
│   └── index.ts            # Programs & coaches data
├── utils/
│   └── auth.ts             # Auth helpers, localStorage
├── types/
│   └── index.ts            # TypeScript interfaces
└── index.css               # Design tokens + global styles
```

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → /dist
```

## Demo Login

- **Email:** alex@apexsport.com
- **Password:** demo1234

## Pages

| Route         | Description                                    |
|---------------|------------------------------------------------|
| `/`           | Landing page with hero, features, programs     |
| `/programs`   | Filter by sport & level, search, enroll        |
| `/coaches`    | Meet all 6 coaches with expandable bios        |
| `/login`      | Sign in with demo or registered account        |
| `/signup`     | 4-step animated enrollment flow                |
| `/dashboard`  | Full athlete dashboard (5 tabs)                |

## Dashboard Tabs

1. **Dashboard** — Stat cards, weekly bar chart, program progress, sessions, metrics, coach note
2. **My Program** — Full 10-week accordion schedule with session checkboxes
3. **Progress** — Line charts, personal bests grid, training heatmap
4. **Messages** — Two-pane live chat with coach
5. **Settings** — Profile, goals, notifications, privacy, account (animated toggles)

## Visual Features

- Framer Motion page transitions + scroll-triggered stagger animations
- Glassmorphism cards + radial glow backgrounds
- CSS noise texture overlay for depth
- Animated SVG bar + line charts
- GitHub-style training activity heatmap
- Spring-physics sidebar indicator + toggle switches
- Marquee sports ticker
- Animated progress bar & step stepper
