import { useRef, useCallback } from 'react'
import { useWindowStore } from '@/store/windowStore'

export function useDraggable(windowId: string) {
  const updatePosition = useWindowStore((s) => s.updatePosition)
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      dragging.current = true
      offset.current = { x: e.clientX, y: e.clientY }
      focusWindow(windowId)

      const onMouseMove = (e: MouseEvent) => {
        if (!dragging.current) return
        const dx = e.clientX - offset.current.x
        const dy = e.clientY - offset.current.y
        offset.current = { x: e.clientX, y: e.clientY }
        updatePosition(windowId, {
          x: Math.max(0, dx),
          y: Math.max(0, dy),
        })
      }

      const onMouseUp = () => {
        dragging.current = false
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [windowId, updatePosition, focusWindow]
  )

  return { onMouseDown }
}
