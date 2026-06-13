'use client'

import { IosAppDefinition } from './iosApps'
import { glyphs } from './iosGlyphs'

interface AppIconProps {
  app: IosAppDefinition
  onOpen: () => void
  onLongPress?: () => void
}

const LONG_PRESS_MS = 550

export default function AppIcon({ app, onOpen, onLongPress }: AppIconProps) {
  let longPressTimer: ReturnType<typeof setTimeout> | null = null
  let longPressed = false

  const startPress = () => {
    longPressed = false
    if (!onLongPress) return
    longPressTimer = setTimeout(() => {
      longPressed = true
      onLongPress?.()
    }, LONG_PRESS_MS)
  }

  const endPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
    if (!longPressed) onOpen()
  }

  const cancelPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
  }

  const Glyph = glyphs[app.glyph]
  const style = { ['--ios-from' as string]: app.from, ['--ios-to' as string]: app.to } as React.CSSProperties

  return (
    <div
      className="ios-app"
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerCancel={cancelPress}
      onPointerLeave={cancelPress}
    >
      <div className="ios-app-tile" style={style}>
        <div className="ios-app-badge">−</div>
        <div className="ios-app-glyph">
          <Glyph size={32} />
        </div>
      </div>
      <span className="ios-app-label">{app.label}</span>
    </div>
  )
}
