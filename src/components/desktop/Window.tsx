'use client'

import { ComponentType, LazyExoticComponent, Suspense, lazy } from 'react'
import { AppDefinition, WindowInstance } from '@/types'
import { useWindowStore } from '@/store/windowStore'
import { useDraggable } from '@/hooks/useDraggable'
import { PixelIcon, TitleGlyph } from './icons'

const MIN_WIDTH = 220
const MIN_HEIGHT = 140
const TASKBAR_HEIGHT = 28

// lazy() must return the same instance across renders, so cache per app
const lazyCache = new Map<string, LazyExoticComponent<ComponentType>>()
function getAppComponent(app: AppDefinition) {
  let cached = lazyCache.get(app.id)
  if (!cached) {
    cached = lazy(app.component)
    lazyCache.set(app.id, cached)
  }
  return cached
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const RESIZE_DIRS: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

interface WindowProps {
  win: WindowInstance
  app: AppDefinition
  isActive: boolean
}

export default function Window({ win, app, isActive }: WindowProps) {
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize)
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const { onMouseDown: onTitleMouseDown } = useDraggable(win.id)

  const startResize = (e: React.MouseEvent, dir: ResizeDir) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    focusWindow(win.id)
    const startX = e.clientX
    const startY = e.clientY
    const orig = { ...win.position }
    const origSize = { ...win.size }

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      let { x, y } = orig
      let { width, height } = origSize

      if (dir.includes('e')) width = Math.max(MIN_WIDTH, origSize.width + dx)
      if (dir.includes('s')) height = Math.max(MIN_HEIGHT, origSize.height + dy)
      if (dir.includes('w')) {
        width = Math.max(MIN_WIDTH, origSize.width - dx)
        x = orig.x + (origSize.width - width)
      }
      if (dir.includes('n')) {
        height = Math.max(MIN_HEIGHT, origSize.height - dy)
        y = Math.max(0, orig.y + (origSize.height - height))
        height = origSize.height + (orig.y - y)
      }

      const store = useWindowStore.getState()
      store.updateSize(win.id, { width, height })
      if (dir.includes('w') || dir.includes('n')) {
        store.updatePosition(win.id, { x, y })
      }
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const AppContent = getAppComponent(app)
  const resizable = (app.resizable ?? true) && !win.isMaximized

  const style: React.CSSProperties = win.isMaximized
    ? {
        left: 0,
        top: 0,
        width: '100%',
        height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
        zIndex: win.zIndex,
      }
    : {
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      }

  if (win.isMinimized) style.display = 'none'

  return (
    <div className="w95-window" style={style} onMouseDown={() => focusWindow(win.id)}>
      <div
        className={`w95-titlebar ${isActive ? '' : 'inactive'}`}
        onMouseDown={onTitleMouseDown}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <span className="w95-titlebar-text">
          <PixelIcon name={app.icon} size={16} />
          {win.title}
        </span>
        <div className="w95-titlebar-btns" onMouseDown={(e) => e.stopPropagation()}>
          <button
            className="w95-titlebar-btn"
            onClick={() => minimizeWindow(win.id)}
            aria-label="Minimize"
          >
            <TitleGlyph type="min" />
          </button>
          <button
            className="w95-titlebar-btn"
            onClick={() => toggleMaximize(win.id)}
            aria-label={win.isMaximized ? 'Restore' : 'Maximize'}
          >
            <TitleGlyph type={win.isMaximized ? 'restore' : 'max'} />
          </button>
          <button
            className="w95-titlebar-btn"
            onClick={() => closeWindow(win.id)}
            aria-label="Close"
          >
            <TitleGlyph type="close" />
          </button>
        </div>
      </div>
      <div className="w95-window-body">
        <div className="w95-window-content">
          <Suspense fallback={<div style={{ padding: 8 }}>Loading…</div>}>
            <AppContent />
          </Suspense>
        </div>
      </div>
      {resizable &&
        RESIZE_DIRS.map((dir) => (
          <div key={dir} className={`w95-rs w95-rs-${dir}`} onMouseDown={(e) => startResize(e, dir)} />
        ))}
    </div>
  )
}
