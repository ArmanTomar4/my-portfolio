'use client'

import { apps } from '@/apps/registry'
import { about } from '@/data/about'
import { MessageBoxState } from './MessageBox'
import { PixelIcon } from './icons'

interface StartMenuProps {
  onOpenApp: (appId: string) => void
  onShutDown: () => void
  onMessageBox: (msg: MessageBoxState) => void
  onClose: () => void
}

export default function StartMenu({ onOpenApp, onShutDown, onMessageBox, onClose }: StartMenuProps) {
  return (
    <div className="w95-startmenu" onMouseDown={(e) => e.stopPropagation()}>
      <div className="w95-startmenu-side">
        <span>
          <b>Windows</b>95
        </span>
      </div>
      <div className="w95-menu-items">
        <div className="w95-menu-item">
          <PixelIcon name="folder" size={20} />
          Programs
          <span className="w95-menu-arrow">▶</span>
          <div className="w95-menu-sub">
            {apps.map((app) => (
              <div
                key={app.id}
                className="w95-menu-item"
                onClick={() => {
                  onClose()
                  onOpenApp(app.id)
                }}
              >
                <PixelIcon name={app.icon} size={16} />
                {app.label}
              </div>
            ))}
          </div>
        </div>
        <div className="w95-menu-item">
          <PixelIcon name="folder" size={20} />
          Documents
          <span className="w95-menu-arrow">▶</span>
          <div className="w95-menu-sub">
            <div
              className="w95-menu-item"
              onClick={() => {
                onClose()
                if (about.resume) {
                  window.open(about.resume, '_blank')
                } else {
                  onMessageBox({
                    title: 'Resume.doc',
                    text: 'This document is still being written. Check back soon.',
                  })
                }
              }}
            >
              <PixelIcon name="doc" size={16} />
              Resume.doc
            </div>
          </div>
        </div>
        <div
          className="w95-menu-item"
          onClick={() => {
            onClose()
            onMessageBox({
              title: 'Run',
              text: 'Type the name of a program. Just kidding — use the desktop icons.',
            })
          }}
        >
          <PixelIcon name="doc" size={20} />
          Run…
        </div>
        <div className="w95-menu-sep" />
        <div
          className="w95-menu-item"
          onClick={() => {
            onClose()
            onShutDown()
          }}
        >
          <PixelIcon name="my-computer" size={20} />
          Shut Down…
        </div>
      </div>
    </div>
  )
}
