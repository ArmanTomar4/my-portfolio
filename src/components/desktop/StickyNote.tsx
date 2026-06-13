'use client'

import { useState } from 'react'

interface StickyNoteProps {
  onOpenResume: () => void
}

export default function StickyNote({ onOpenResume }: StickyNoteProps) {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null

  return (
    <div className="w95-sticky" onMouseDown={(e) => e.stopPropagation()}>
      <button
        onClick={() => setHidden(true)}
        title="Crumple up"
        style={{
          position: 'absolute',
          top: 4,
          right: 6,
          background: 'transparent',
          border: 'none',
          fontSize: 13,
          color: '#4a3a00',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        ✕
      </button>
      <strong>
        Hey recruiter <span className="wave">👋</span>
      </strong>
      The resume is in{' '}
      <button
        onClick={onOpenResume}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          color: '#0033cc',
          textDecoration: 'underline',
          font: 'inherit',
          cursor: 'pointer',
        }}
      >
        Documents → Resume.doc
      </button>
      .
      <div style={{ marginTop: 8, fontSize: 11, opacity: 0.7 }}>— Arman</div>
    </div>
  )
}
