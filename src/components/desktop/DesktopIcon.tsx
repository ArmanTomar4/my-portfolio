'use client'

import { AppDefinition } from '@/types'
import { PixelIcon } from './icons'

interface DesktopIconProps {
  app: AppDefinition
  position: { x: number; y: number }
  selected: boolean
  onSelect: () => void
  onOpen: () => void
  onMove: (pos: { x: number; y: number }) => void
}

const DRAG_THRESHOLD = 5

export default function DesktopIcon({
  app,
  position,
  selected,
  onSelect,
  onOpen,
  onMove,
}: DesktopIconProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    onSelect()
    const startX = e.clientX
    const startY = e.clientY
    const orig = { ...position }
    let moved = false

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) moved = true
      if (moved) {
        onMove({
          x: Math.min(Math.max(0, orig.x + dx), window.innerWidth - 76),
          y: Math.min(Math.max(0, orig.y + dy), window.innerHeight - 100),
        })
      }
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      // a clean click (no drag) opens the app — W95 purists double-click,
      // but single click was the call here
      if (!moved) onOpen()
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      className={`w95-icon ${selected ? 'selected' : ''}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <PixelIcon name={app.icon} size={32} />
      <span className="w95-icon-label">{app.label}</span>
    </div>
  )
}
