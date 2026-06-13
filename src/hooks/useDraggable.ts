import { useCallback } from 'react'
import { useWindowStore } from '@/store/windowStore'

export function useDraggable(windowId: string, enabled = true) {
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (e.button !== 0) return
      const store = useWindowStore.getState()
      const win = store.windows.find((w) => w.id === windowId)
      if (!win) return
      store.focusWindow(windowId)
      if (!enabled || win.isMaximized) return

      // offset of the grab point inside the title bar, so the window
      // doesn't jump to the cursor
      const grabX = e.clientX - win.position.x
      const grabY = e.clientY - win.position.y

      const onMouseMove = (ev: MouseEvent) => {
        const current = useWindowStore
          .getState()
          .windows.find((w) => w.id === windowId)
        if (!current) return
        // keep at least 60px of the title bar reachable
        const minX = -(current.size.width - 60)
        const maxX = window.innerWidth - 60
        const maxY = window.innerHeight - 60
        useWindowStore.getState().updatePosition(windowId, {
          x: Math.min(Math.max(minX, ev.clientX - grabX), maxX),
          y: Math.min(Math.max(0, ev.clientY - grabY), maxY),
        })
      }

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [windowId, enabled]
  )

  return { onMouseDown }
}
