'use client'

import { useRef, useState } from 'react'
import AppIcon from './AppIcon'
import StatusBar from './StatusBar'
import { iosAppPages, iosDock, IosAppDefinition } from './iosApps'

interface HomeScreenProps {
  onOpenApp: (app: IosAppDefinition) => void
}

export default function HomeScreen({ onOpenApp }: HomeScreenProps) {
  const [editing, setEditing] = useState(false)
  const [page, setPage] = useState(0)
  const pagerRef = useRef<HTMLDivElement | null>(null)

  const exitEditMode = () => setEditing(false)
  const enterEditMode = () => setEditing(true)

  const handleScroll = () => {
    const el = pagerRef.current
    if (!el) return
    const w = el.clientWidth
    if (w === 0) return
    const idx = Math.round(el.scrollLeft / w)
    if (idx !== page) setPage(idx)
  }

  return (
    <div
      className="ios-screen"
      onClick={editing ? exitEditMode : undefined}
    >
      <StatusBar />
      <div className={`ios-home ${editing ? 'editing' : ''}`}>
        <div className="ios-home-pager" ref={pagerRef} onScroll={handleScroll}>
          {iosAppPages.map((apps, i) => (
            <div className="ios-home-page" key={i}>
              <div className="ios-home-grid">
                {apps.map((app) => (
                  <AppIcon
                    key={app.id}
                    app={app}
                    onOpen={() => {
                      if (editing) {
                        setEditing(false)
                        return
                      }
                      onOpenApp(app)
                    }}
                    onLongPress={enterEditMode}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="ios-page-dots" aria-hidden>
          {iosAppPages.map((_, i) => (
            <span key={i} className={`ios-page-dot ${i === page ? 'active' : ''}`} />
          ))}
        </div>
        <div className="ios-dock">
          {iosDock.map((app) => (
            <AppIcon
              key={app.id}
              app={app}
              onOpen={() => {
                if (editing) {
                  setEditing(false)
                  return
                }
                onOpenApp(app)
              }}
              onLongPress={enterEditMode}
            />
          ))}
        </div>
      </div>
      <div className="ios-home-button-bar">
        <div className="ios-home-button" onClick={exitEditMode}>
          <div className="ios-home-button-glyph" />
        </div>
      </div>
    </div>
  )
}
