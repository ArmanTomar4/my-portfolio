'use client'

import { useState } from 'react'
import { TitleGlyph } from './icons'

export type WallpaperId = 'teal' | 'purple' | 'vapor' | 'hotdog' | 'plasma'

export const WALLPAPERS: { id: WallpaperId; label: string; preview: string }[] = [
  { id: 'teal',   label: 'Classic Teal',   preview: '#008080' },
  { id: 'purple', label: 'Purple Haze',    preview: 'linear-gradient(135deg, #c084fc 0%, #22d3ee 100%)' },
  { id: 'vapor',  label: 'Vaporwave',      preview: 'linear-gradient(180deg, #ff79c6 0%, #bd93f9 50%, #8be9fd 100%)' },
  { id: 'hotdog', label: 'Hot Dog Stand',  preview: 'linear-gradient(180deg, #ff2d00 50%, #ffe600 50%)' },
  { id: 'plasma', label: 'Plasma',         preview: 'radial-gradient(circle at 20% 30%, #4040c0 0%, transparent 40%), radial-gradient(circle at 80% 20%, #008080 0%, transparent 40%), radial-gradient(circle at 60% 80%, #800080 0%, transparent 40%), #0a0a3a' },
]

interface DisplayPropertiesProps {
  current: WallpaperId
  onApply: (id: WallpaperId) => void
  onClose: () => void
}

export default function DisplayProperties({ current, onApply, onClose }: DisplayPropertiesProps) {
  const [selected, setSelected] = useState<WallpaperId>(current)
  const preview = WALLPAPERS.find((w) => w.id === selected)?.preview ?? '#008080'

  return (
    <div className="w95-modal-backdrop" onMouseDown={(e) => e.stopPropagation()}>
      <div className="w95-msgbox w95-display-props">
        <div className="w95-titlebar">
          <span className="w95-titlebar-text">Display Properties</span>
          <div className="w95-titlebar-btns">
            <button className="w95-titlebar-btn" onClick={onClose} aria-label="Close">
              <TitleGlyph type="close" />
            </button>
          </div>
        </div>
        <div className="w95-display-props-body">
          <div style={{ marginBottom: 10, fontWeight: 700 }}>Background:</div>
          <div className="w95-display-props-row">
            <div className="w95-display-preview">
              <div className="w95-display-preview-screen" style={{ background: preview }}>
                <div className="w95-display-preview-bar" />
              </div>
            </div>
            <div className="w95-display-list">
              {WALLPAPERS.map((w) => (
                <div
                  key={w.id}
                  className={`w95-display-list-item ${selected === w.id ? 'selected' : ''}`}
                  onClick={() => setSelected(w.id)}
                  onDoubleClick={() => {
                    onApply(w.id)
                    onClose()
                  }}
                >
                  {w.label}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w95-msgbox-btns">
          <button
            className="w95-btn"
            onClick={() => {
              onApply(selected)
              onClose()
            }}
          >
            OK
          </button>
          <button className="w95-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="w95-btn" onClick={() => onApply(selected)}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
