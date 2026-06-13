@AGENTS.md

# Portfolio Project — Claude Context

## What this project is
A retro-themed developer portfolio. Desktop = Windows 95 UI. Mobile (< 768px) = skeuomorphic early iOS (iOS 4–6 era). Two completely separate component trees, same content data.

## Owner
- Name: Arman Singh Tomar
- Role: Full Stack Developer & UI Designer
- GitHub: https://github.com/ArmanTomar4
- LinkedIn: https://www.linkedin.com/in/arman-tomar
- Resume: has PDF, link not ready yet — leave as empty string in about.ts

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind for layout/spacing only
- Plain CSS / CSS Modules for all skeuomorphic visual details
- Zustand for window manager state (`src/store/windowStore.ts`)
- Upstash Redis for visitor counter + guestbook (`src/app/api/`)

## Critical rules
- Never use UI libraries. Everything is custom.
- Tailwind handles layout. Plain CSS handles visual details (shadows, gradients, textures).
- Content components in `src/components/content/` are theme-agnostic — no W95 or iOS styles inside them.
- The `resizable` flag in `src/apps/registry.ts` controls whether a window can be resized. Mobile is always full-screen.
- Adding a new app = create `src/apps/AppName/App.tsx` + one entry in `src/apps/registry.ts`. Nothing else changes.
- `useIsMobile` (< 768px) drives the Desktop ↔ iOS switch in `src/app/page.tsx`.

## Final design decisions — Windows 95 Desktop

### General
- OS name: "Microsoft Windows 95" (real name, not ArmanOS)
- Desktop wallpaper: #008080 (classic teal) — may change later
- Desktop icons: draggable and repositionable by user
- Open apps: single click
- Right-click context menu on desktop: yes

### Windows
- Title bar: classic W95 blue gradient (authentic)
- Maximize: yes, windows can go full screen
- Already open: focus existing window, do not open duplicate
- Max windows open: no limit

### Taskbar
- Start button: exactly as W95 — Windows flag logo SVG + "Start" text
- Start Menu: Programs, Documents (resume download), Shut Down
- Shut Down: warning dialog first → then shutdown animation
- System tray: volume icon (no actual sound), brightness slider (overlays semi-transparent black div over page), live clock, visitor counter

### Boot screen
- Show on first visit only (sessionStorage flag)
- Content: Windows 95 logo + loading bar animation
- No "ArmanOS" — use real Windows 95 branding

### Sounds
- No system sounds at all
- Volume icon in taskbar is decorative only
- Brightness slider is functional (dims the page with overlay)

### Font
- MS Sans Serif — use W95FA free font or system font stack: `"W95FA", "MS Sans Serif", "Geneva", sans-serif`
- Load W95FA from a CDN or local file in `/public/fonts/`

### Icons
- Pixel art W95 style (authentic) — source from opengameart.org or recreate as SVGs

## App-specific decisions

| App | Decision |
|---|---|
| Notepad (About Me) | Typewriter effect typing out bio |
| Terminal | `help`, `whoami`, `projects`, `hack` (Matrix-style animation) |
| Recycle Bin | Creative "deleted" content — old projects, funny rejected ideas |
| WinAMP | Fully working music player — user will provide old school tracks |
| Paint (Skills) | Full-featured Paint app — as creative as possible, all tools |
| Internet Explorer | Fake browser — loads a fake "webpage" per social link |
| My Computer | Projects as drives — C:, D:, E:, F: (one per project) |
| MS-DOS | Fake boot sequence with scrolling text |
| Screensaver | Classic flying Windows logo (activates after idle) |

## Easter eggs
- BSOD: triggered by spam-closing windows — show genuine W95-style error message
- Chaos app: appears in taskbar with a weird/cryptic name — clicking it makes ALL open windows "fall" to the bottom with CSS animation and become permanently broken for that session
- Shut Down animation: screen fades/glitches out after confirming shutdown

## Window manager
All window state is in `src/store/windowStore.ts` (Zustand). Methods: `openWindow`, `closeWindow`, `minimizeWindow`, `restoreWindow`, `focusWindow`, `updatePosition`, `updateSize`. Drag logic in `src/hooks/useDraggable.ts`.

## File locations
- App registry: `src/apps/registry.ts`
- All app content: `src/apps/[AppName]/App.tsx`
- Desktop shell: `src/components/desktop/`
- iOS shell: `src/components/mobile/`
- Shared content: `src/components/content/`
- W95 styles: `src/styles/w95/`
- iOS styles: `src/styles/ios/`
- Data: `src/data/projects.ts`, `src/data/skills.ts`, `src/data/about.ts`
- Types: `src/types/index.ts`
- API routes: `src/app/api/visitors/route.ts`, `src/app/api/guestbook/route.ts`

## Redis keys
- `visitors` — INCR on each page load
- `guestbook` — LPUSH new messages, LRANGE to read

## Current phase
Phases 1 and 2 complete. Data files populated with dummy content.
Next: Phase 3 — Windows 95 Desktop shell.
Order: BootScreen → Desktop → DesktopIcon (draggable) → Window (drag/resize/maximize) → Taskbar → StartMenu → RightClickMenu
