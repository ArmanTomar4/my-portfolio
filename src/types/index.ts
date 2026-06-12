export interface AppDefinition {
  id: string
  label: string
  icon: string
  component: () => Promise<{ default: React.ComponentType }>
  defaultSize: { width: number; height: number }
  defaultPosition: { x: number; y: number }
  resizable?: boolean
}

export interface WindowInstance {
  id: string
  appId: string
  title: string
  isOpen: boolean
  isMinimized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

export interface GuestbookMessage {
  name: string
  message: string
  timestamp: string
}
