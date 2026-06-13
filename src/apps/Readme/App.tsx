'use client'

import { useEffect } from 'react'

export default function ReadmeApp() {
  useEffect(() => {
    try { localStorage.setItem('ach:opened-readme', '1') } catch {}
  }, [])
  return (
    <div style={{ padding: 16, fontFamily: 'var(--font-w95)', fontSize: 12, lineHeight: 1.6, color: '#000', whiteSpace: 'pre-wrap' }}>
{`==============================
   README.txt
   Last modified: 06/12/2026
==============================

You found the README. Nice.

This whole thing is a Windows 95 recreation built in Next.js +
TypeScript. No UI libraries, no shortcuts. Plain CSS, hand-placed
shadows, custom cursor, real window manager.

Things worth trying:
  - Terminal → type "hack"
  - Right-click anywhere on the desktop
  - Start → Shut Down
  - Drag any window by its title bar, double-click to maximize
  - Switch the wallpaper from right-click → Properties
  - There are easter eggs. A few of them.

Stack:
  Next.js 14 · TypeScript · Tailwind (layout only) ·
  plain CSS for everything skeuomorphic · Zustand window
  manager · Upstash Redis for the guestbook + visitor counter.

- Arman`}
    </div>
  )
}
