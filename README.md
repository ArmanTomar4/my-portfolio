# Arman Singh Tomar — Portfolio

A retro-themed developer portfolio — **Windows 95 desktop** on large screens · **skeuomorphic early iOS** on mobile. Draggable & resizable windows, working Minesweeper, Snake & Solitaire, a hacker terminal with easter eggs, WinAMP player, and a Redis-powered live guestbook. Built with Next.js 14 · TypeScript · Zustand · Tailwind · Upstash Redis.

---

## Theme Design

### Desktop — Windows 95
Full interactive Windows 95 desktop. Every section is a desktop icon that opens a draggable, resizable window. Boot screen on first visit. Taskbar with Start Menu, active window chips, brightness slider, visitor counter, and live clock.

### Mobile — Skeuomorphic Early iOS (iOS 4–6 era)
On screens under 768px the entire UI switches to an early iPhone aesthetic — glossy app icons, status bar, dock, and full-screen apps that slide up on tap.

---

## Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG, API routes, SEO |
| Language | TypeScript | Typed window state, app registry, props |
| Layout | Tailwind CSS | Breakpoints, spacing, flex/grid only |
| Styling | Plain CSS / CSS Modules | Pixel-perfect skeuomorphic effects |
| State | Zustand | Window manager without Context re-renders |
| Database | Upstash Redis | Visitor counter + guestbook |
| Deploy | Vercel | One-click, integrates with Upstash |
| Font | W95FA / MS Sans Serif | Authentic W95 look |

No UI libraries. Everything is built from scratch.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    Desktop or HomeScreen based on screen width
│   └── api/
│       ├── visitors/route.ts       INCR visitor counter
│       └── guestbook/route.ts      GET / POST guestbook messages
├── components/
│   ├── desktop/                    Windows 95 shell
│   ├── mobile/                     iOS shell
│   └── content/                    Theme-agnostic content components
├── apps/
│   ├── registry.ts                 All app definitions — single source of truth
│   ├── MyComputer/                 Projects (C: D: E: F: drives)
│   ├── Notepad/                    About Me (typewriter effect)
│   ├── Outlook/                    Contact form
│   ├── InternetExplorer/           Fake browser → social links
│   ├── Terminal/                   help / whoami / projects / hack (Matrix)
│   ├── Paint/                      Skills — full-featured paint app
│   ├── WinAMP/                     Working music player
│   ├── Minesweeper/                Fully playable
│   ├── Snake/                      Fully playable
│   ├── Solitaire/                  Fully playable
│   ├── RecycleBin/                 Easter egg — deleted content
│   ├── MSDOS/                      Fake boot sequence
│   └── NetworkPlaces/              Tech stack visualizer
├── hooks/
│   ├── useIsMobile.ts
│   ├── useDraggable.ts
│   └── useWindowManager.ts
├── store/
│   └── windowStore.ts
├── data/
│   ├── about.ts
│   ├── projects.ts
│   └── skills.ts
├── styles/
│   ├── w95/
│   └── ios/
└── types/index.ts
```

---

## Windows 95 Desktop — Final Spec

### Boot Screen
- Shown on first visit only (sessionStorage)
- Windows 95 logo + loading bar animation
- Real Windows 95 branding

### Desktop
- Teal wallpaper (`#008080`)
- Icons are draggable and repositionable
- Single click opens apps
- Right-click context menu

### Windows
- Classic W95 blue gradient title bar
- Draggable, resizable, maximizable
- Clicking an already-open app focuses its window
- No limit on open windows

### Taskbar
```
[ Start ]  [ active window chips ]  [ 🔆 brightness ]  [ 🔊 volume ]  [ 👤 42 ]  [ 10:42 AM ]
```
- Start button: Windows flag SVG + "Start" (pixel-perfect authentic)
- Brightness: functional slider — overlays semi-transparent black div
- Volume: decorative (no actual sounds in the site)
- Visitor counter: live from Redis
- Clock: live time

### Apps

| App | What it does |
|---|---|
| My Computer | Projects shown as drives — C: D: E: F: |
| Notepad | Bio with typewriter typing effect |
| Outlook | Contact form styled as email client |
| Internet Explorer | Fake browser loading fake pages per social |
| Terminal | `help` `whoami` `projects` `hack` → Matrix animation |
| Paint | Full-featured drawing app — skills section |
| WinAMP | Working music player, old school tracks |
| Minesweeper | Fully playable |
| Snake | Fully playable |
| Solitaire | Fully playable |
| Recycle Bin | Easter egg — funny deleted content |
| MS-DOS | Fake boot sequence with scrolling text |
| Network Places | Tech stack visualization |

### Easter Eggs
- **BSOD** — triggered by spam-closing windows, authentic W95 error message
- **Chaos app** — cryptic name in taskbar, clicking makes all open windows fall and break permanently
- **Screensaver** — classic flying Windows logo after idle time
- **Shut Down** — warning dialog → glitch/fade shutdown animation

---

## Responsive Switch

```
< 768px  →  iOS HomeScreen (skeuomorphic)
≥ 768px  →  Windows 95 Desktop
```

---

## Environment Variables

```env
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
```

---

## Implementation Phases

- [x] Phase 1 — Next.js + TypeScript + Tailwind + Zustand + Upstash setup
- [x] Phase 2 — Folder structure, types, store, hooks, registry, API routes, data
- [x] Phase 3 — Windows 95 shell (BootScreen, Desktop, Window, Taskbar, StartMenu)
- [x] Phase 4 — iOS shell (LockScreen, HomeScreen, StatusBar, Dock, AppScreen)
- [x] Phase 5 — App content (all apps + easter eggs)
- [x] Phase 6 — Games (Minesweeper, Snake, Solitaire)
- [x] Phase 7 — Polish (BSOD, Chaos app, screensaver, shutdown animation)
- [ ] Phase 8 — Polish the website (final design pass, copy, perf, deploy)

---

## Local Development

```bash
npm install
npm run dev
# open http://localhost:3000
# resize below 768px to preview iOS view
```
