'use client'

import { PixelIcon, TitleGlyph } from './icons'

export interface MessageBoxState {
  title: string
  text: string
  mode?: 'info' | 'confirm'
  onOK?: () => void
}

interface MessageBoxProps extends MessageBoxState {
  onClose: () => void
}

export default function MessageBox({ title, text, mode = 'info', onOK, onClose }: MessageBoxProps) {
  const handleOK = () => {
    onClose()
    onOK?.()
  }

  return (
    <div className="w95-modal-backdrop" onMouseDown={(e) => e.stopPropagation()}>
      <div className="w95-msgbox">
        <div className="w95-titlebar">
          <span className="w95-titlebar-text">{title}</span>
          <div className="w95-titlebar-btns">
            <button className="w95-titlebar-btn" onClick={onClose} aria-label="Close">
              <TitleGlyph type="close" />
            </button>
          </div>
        </div>
        <div className="w95-msgbox-body">
          <PixelIcon name="warning" size={36} />
          <p>{text}</p>
        </div>
        <div className="w95-msgbox-btns">
          <button className="w95-btn" onClick={handleOK} autoFocus>
            OK
          </button>
          {mode === 'confirm' && (
            <button className="w95-btn" onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
