'use client'

import { useEffect, useState } from 'react'
import { apps } from '@/apps/registry'
import { useWindowStore } from '@/store/windowStore'
import BootScreen from './BootScreen'
import Bsod from './Bsod'
import ContextMenu from './ContextMenu'
import DesktopIcon from './DesktopIcon'
import DisplayProperties, { WallpaperId } from './DisplayProperties'
import MessageBox, { MessageBoxState } from './MessageBox'
import StartMenu from './StartMenu'
import Taskbar from './Taskbar'
import Window from './Window'

type IconPositions = Record<string, { x: number; y: number }>

const ICONS_PER_COLUMN = 7
const STORAGE_KEY = 'w95-icon-positions'
const WALLPAPER_KEY = 'w95-wallpaper'

function defaultIconPositions(): IconPositions {
  const positions: IconPositions = {}
  apps.forEach((app, i) => {
    const col = Math.floor(i / ICONS_PER_COLUMN)
    const row = i % ICONS_PER_COLUMN
    positions[app.id] = { x: 14 + col * 86, y: 10 + row * 82 }
  })
  return positions
}

export default function Desktop() {
  const windows = useWindowStore((s) => s.windows)
  const openWindow = useWindowStore((s) => s.openWindow)
  const bsod = useWindowStore((s) => s.bsod)
  const chaos = useWindowStore((s) => s.chaos)

  const [iconPositions, setIconPositions] = useState<IconPositions>(defaultIconPositions)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [startOpen, setStartOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [messageBox, setMessageBox] = useState<MessageBoxState | null>(null)
  const [brightness, setBrightness] = useState(100)
  const [shutdown, setShutdown] = useState<'none' | 'wait' | 'off'>('none')
  const [refreshKey, setRefreshKey] = useState(0)
  const [wallpaper, setWallpaper] = useState<WallpaperId>('teal')
  const [displayPropsOpen, setDisplayPropsOpen] = useState(false)

  // restore saved icon layout + wallpaper after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setIconPositions((prev) => ({ ...prev, ...JSON.parse(saved) }))
    } catch {
      // corrupted layout — defaults are fine
    }
    try {
      const savedWallpaper = localStorage.getItem(WALLPAPER_KEY) as WallpaperId | null
      if (savedWallpaper) setWallpaper(savedWallpaper)
    } catch {
      // ignore
    }
  }, [])

  const applyWallpaper = (id: WallpaperId) => {
    setWallpaper(id)
    try {
      localStorage.setItem(WALLPAPER_KEY, id)
      localStorage.setItem('ach:wallpaper-swap', '1')
    } catch {
      // ignore
    }
  }

  const moveIcon = (appId: string, pos: { x: number; y: number }) => {
    setIconPositions((prev) => {
      const next = { ...prev, [appId]: pos }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // storage full/blocked — layout just won't persist
      }
      return next
    })
  }

  const openApp = (appId: string) => {
    const app = apps.find((a) => a.id === appId)
    if (!app) return
    // cascade so newly opened windows don't stack exactly on top of each other
    const cascade = (windows.length % 6) * 26
    openWindow({
      id: app.id,
      appId: app.id,
      title: app.label,
      isOpen: true,
      position: { x: app.defaultPosition.x + cascade, y: app.defaultPosition.y + cascade },
      size: { ...app.defaultSize },
    })
  }

  const activeWindowId =
    windows
      .filter((w) => !w.isMinimized)
      .reduce<{ id: string; z: number } | null>(
        (top, w) => (top === null || w.zIndex > top.z ? { id: w.id, z: w.zIndex } : top),
        null
      )?.id ?? null

  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null)
      setStartOpen(false)
      setContextMenu(null)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setStartOpen(false)
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 184),
      y: Math.min(e.clientY, window.innerHeight - 200),
    })
  }

  const startShutdown = () => {
    setShutdown('wait')
    try { localStorage.setItem('ach:shut-down', '1') } catch {}
    setTimeout(() => setShutdown('off'), 2000)
  }

  const confirmShutdown = () =>
    setMessageBox({
      title: 'Shut Down Windows',
      text: 'Are you sure you want to shut down the computer?',
      mode: 'confirm',
      onOK: startShutdown,
    })

  const dimOpacity = ((100 - brightness) / 100) * 0.85

  return (
    <div
      className={`w95-root${chaos ? ' chaos' : ''}`}
      data-wallpaper={wallpaper}
      onMouseDown={handleDesktopMouseDown}
      onContextMenu={handleContextMenu}
    >
      {apps.map((app) => (
        <DesktopIcon
          key={`${app.id}-${refreshKey}`}
          app={app}
          position={iconPositions[app.id] ?? { x: 14, y: 10 }}
          selected={selectedIcon === app.id}
          onSelect={() => {
            setSelectedIcon(app.id)
            setStartOpen(false)
            setContextMenu(null)
          }}
          onOpen={() => openApp(app.id)}
          onMove={(pos) => moveIcon(app.id, pos)}
        />
      ))}

      {windows.map((win) => {
        const app = apps.find((a) => a.id === win.appId)
        if (!app) return null
        return <Window key={win.id} win={win} app={app} isActive={win.id === activeWindowId} />
      })}

      <Taskbar
        startOpen={startOpen}
        onToggleStart={() => {
          setStartOpen((open) => !open)
          setContextMenu(null)
        }}
        activeWindowId={activeWindowId}
        brightness={brightness}
        onBrightnessChange={setBrightness}
      />

      {startOpen && (
        <StartMenu
          onOpenApp={openApp}
          onShutDown={confirmShutdown}
          onMessageBox={setMessageBox}
          onClose={() => setStartOpen(false)}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onArrangeIcons={() => {
            setIconPositions(defaultIconPositions())
            try {
              localStorage.removeItem(STORAGE_KEY)
            } catch {
              // nothing to clean up
            }
          }}
          onRefresh={() => setRefreshKey((k) => k + 1)}
          onProperties={() => setDisplayPropsOpen(true)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {messageBox && <MessageBox {...messageBox} onClose={() => setMessageBox(null)} />}

      {displayPropsOpen && (
        <DisplayProperties
          current={wallpaper}
          onApply={applyWallpaper}
          onClose={() => setDisplayPropsOpen(false)}
        />
      )}

      {shutdown === 'wait' && (
        <div className="w95-shutdown">
          <div className="w95-shutdown-wait">Please wait while your computer shuts down…</div>
        </div>
      )}
      {shutdown === 'off' && (
        <div
          className="w95-shutdown"
          onClick={() => {
            sessionStorage.removeItem('w95-booted')
            window.location.reload()
          }}
        >
          <div className="w95-shutdown-off">
            It&apos;s now safe to turn off your computer.
            <span className="w95-shutdown-hint">(Click anywhere to turn it back on)</span>
          </div>
        </div>
      )}

      {dimOpacity > 0 && <div className="w95-dim" style={{ opacity: dimOpacity }} />}

      {bsod && <Bsod />}

      <BootScreen />
    </div>
  )
}
