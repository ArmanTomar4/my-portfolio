'use client'

import { useEffect, useRef, useState } from 'react'
import { apps } from '@/apps/registry'
import { useWindowStore } from '@/store/windowStore'
import { PixelIcon } from './icons'

// fetch once per page load, even across React strict-mode double effects
let visitorPromise: Promise<number | null> | null = null
function fetchVisitorCount(): Promise<number | null> {
  if (!visitorPromise) {
    visitorPromise = fetch('/api/visitors')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d && typeof d.count === 'number' ? d.count : null))
      .catch(() => null)
  }
  return visitorPromise
}

interface TaskbarProps {
  startOpen: boolean
  onToggleStart: () => void
  activeWindowId: string | null
  brightness: number
  onBrightnessChange: (value: number) => void
}

export default function Taskbar({
  startOpen,
  onToggleStart,
  activeWindowId,
  brightness,
  onBrightnessChange,
}: TaskbarProps) {
  const windows = useWindowStore((s) => s.windows)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)
  const focusWindow = useWindowStore((s) => s.focusWindow)

  const [time, setTime] = useState('')
  const [visitors, setVisitors] = useState<number | null>(null)
  const [popup, setPopup] = useState<'volume' | 'brightness' | null>(null)
  const [volume, setVolume] = useState(60)
  const trayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      )
    update()
    const interval = setInterval(update, 10_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchVisitorCount().then(setVisitors)
  }, [])

  // close tray popups when clicking anywhere outside the tray
  useEffect(() => {
    if (!popup) return
    const onDown = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        setPopup(null)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [popup])

  const handleChipClick = (id: string, isMinimized: boolean) => {
    if (isMinimized) restoreWindow(id)
    else if (id === activeWindowId) minimizeWindow(id)
    else focusWindow(id)
  }

  return (
    <div className="w95-taskbar" onMouseDown={(e) => e.stopPropagation()}>
      <button className={`w95-start ${startOpen ? 'active' : ''}`} onClick={onToggleStart}>
        <PixelIcon name="start-flag" size={20} />
        Start
      </button>
      <div className="w95-taskbar-divider" />
      <div className="w95-chips">
        {windows.map((win) => {
          const app = apps.find((a) => a.id === win.appId)
          const isActive = win.id === activeWindowId && !win.isMinimized
          return (
            <button
              key={win.id}
              className={`w95-chip ${isActive ? 'active' : ''}`}
              onClick={() => handleChipClick(win.id, win.isMinimized)}
            >
              <PixelIcon name={app?.icon ?? 'doc'} size={16} />
              <span>{win.title}</span>
            </button>
          )
        })}
      </div>
      <div className="w95-tray" ref={trayRef}>
        <button
          className="w95-tray-icon"
          title="Brightness"
          onClick={() => setPopup(popup === 'brightness' ? null : 'brightness')}
        >
          <PixelIcon name="brightness" size={16} />
        </button>
        <button
          className="w95-tray-icon"
          title="Volume"
          onClick={() => setPopup(popup === 'volume' ? null : 'volume')}
        >
          <PixelIcon name="volume" size={16} />
        </button>
        {visitors !== null && (
          <span title={`You are visitor #${visitors}`}>#{visitors}</span>
        )}
        <span suppressHydrationWarning>{time}</span>

        {popup === 'brightness' && (
          <div className="w95-tray-popup">
            <span className="w95-tray-popup-label">Brightness</span>
            <input
              type="range"
              min={30}
              max={100}
              value={brightness}
              onChange={(e) => onBrightnessChange(Number(e.target.value))}
            />
          </div>
        )}
        {popup === 'volume' && (
          <div className="w95-tray-popup">
            <span className="w95-tray-popup-label">Volume</span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
            <div style={{ marginTop: 6, color: '#808080' }}>
              This computer has no speakers.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
