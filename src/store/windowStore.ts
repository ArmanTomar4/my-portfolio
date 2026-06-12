import { create } from 'zustand'
import { WindowInstance } from '@/types'

interface WindowStore {
  windows: WindowInstance[]
  topZIndex: number
  openWindow: (window: Omit<WindowInstance, 'zIndex' | 'isMinimized'>) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updatePosition: (id: string, position: { x: number; y: number }) => void
  updateSize: (id: string, size: { width: number; height: number }) => void
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  topZIndex: 10,

  openWindow: (window) => {
    const { windows, topZIndex } = get()
    const existing = windows.find((w) => w.id === window.id)
    if (existing) {
      set({
        windows: windows.map((w) =>
          w.id === window.id
            ? { ...w, isMinimized: false, zIndex: topZIndex + 1 }
            : w
        ),
        topZIndex: topZIndex + 1,
      })
      return
    }
    set({
      windows: [...windows, { ...window, zIndex: topZIndex + 1, isMinimized: false }],
      topZIndex: topZIndex + 1,
    })
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
    })),

  restoreWindow: (id) => {
    const { topZIndex } = get()
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: topZIndex + 1 } : w
      ),
      topZIndex: topZIndex + 1,
    }))
  },

  focusWindow: (id) => {
    const { topZIndex } = get()
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: topZIndex + 1 } : w
      ),
      topZIndex: topZIndex + 1,
    }))
  },

  updatePosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    })),

  updateSize: (id, size) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    })),
}))
