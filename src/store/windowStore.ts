import { create } from 'zustand'
import { WindowInstance } from '@/types'

const BSOD_CLOSE_COUNT = 5
const BSOD_CLOSE_WINDOW_MS = 3000

interface WindowStore {
  windows: WindowInstance[]
  topZIndex: number
  closeTimestamps: number[]
  bsod: boolean
  chaos: boolean
  openWindow: (
    window: Omit<WindowInstance, 'zIndex' | 'isMinimized' | 'isMaximized' | 'prevBounds'>
  ) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  toggleMaximize: (id: string) => void
  updatePosition: (id: string, position: { x: number; y: number }) => void
  updateSize: (id: string, size: { width: number; height: number }) => void
  triggerBsod: () => void
  clearBsod: () => void
  triggerChaos: () => void
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  topZIndex: 10,
  closeTimestamps: [],
  bsod: false,
  chaos: false,

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
      windows: [
        ...windows,
        { ...window, zIndex: topZIndex + 1, isMinimized: false, isMaximized: false },
      ],
      topZIndex: topZIndex + 1,
    })
  },

  closeWindow: (id) =>
    set((state) => {
      const now = Date.now()
      const recent = [...state.closeTimestamps.filter((t) => now - t < BSOD_CLOSE_WINDOW_MS), now]
      const shouldBsod = !state.bsod && recent.length >= BSOD_CLOSE_COUNT
      return {
        windows: state.windows.filter((w) => w.id !== id),
        closeTimestamps: shouldBsod ? [] : recent,
        bsod: shouldBsod ? true : state.bsod,
      }
    }),

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

  toggleMaximize: (id) => {
    const { topZIndex } = get()
    set((state) => ({
      topZIndex: topZIndex + 1,
      windows: state.windows.map((w) => {
        if (w.id !== id) return w
        if (!w.isMaximized) {
          return {
            ...w,
            isMaximized: true,
            prevBounds: { position: w.position, size: w.size },
            zIndex: topZIndex + 1,
          }
        }
        return {
          ...w,
          isMaximized: false,
          position: w.prevBounds?.position ?? w.position,
          size: w.prevBounds?.size ?? w.size,
          prevBounds: undefined,
          zIndex: topZIndex + 1,
        }
      }),
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

  triggerBsod: () => set({ bsod: true, closeTimestamps: [] }),
  clearBsod: () => set({ bsod: false, closeTimestamps: [] }),
  triggerChaos: () => set({ chaos: true }),
}))
