'use client'

import { useState } from 'react'
import AppIcon from './AppIcon'
import StatusBar from './StatusBar'
import { iosApps, iosDock, IosAppDefinition } from './iosApps'

interface HomeScreenProps {
  onOpenApp: (app: IosAppDefinition) => void
}

export default function HomeScreen({ onOpenApp }: HomeScreenProps) {
  const [editing, setEditing] = useState(false)

  const exitEditMode = () => setEditing(false)
  const enterEditMode = () => setEditing(true)

  return (
    <div
      className="ios-screen"
      onClick={editing ? exitEditMode : undefined}
    >
      <StatusBar />
      <div className={`ios-home ${editing ? 'editing' : ''}`}>
        <div className="ios-home-grid">
          {iosApps.map((app) => (
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
        <div className="ios-page-dots" aria-hidden>
          <span className="ios-page-dot active" />
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
