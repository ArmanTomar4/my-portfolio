'use client'

import { useEffect, useState } from 'react'
import { useWindowStore } from '@/store/windowStore'

export default function DoNotOpenApp() {
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const [stage, setStage] = useState<'open' | 'shame'>('open')

  useEffect(() => {
    const t1 = setTimeout(() => setStage('shame'), 1200)
    const t2 = setTimeout(() => closeWindow('donotopen'), 2800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [closeWindow])

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#0f0',
        fontFamily: 'var(--font-w95)',
        fontSize: 18,
        textAlign: 'center',
        padding: 14,
      }}
    >
      {stage === 'open' ? (
        <span>You opened it.</span>
      ) : (
        <span>
          The README told you not to.
          <br />
          <span style={{ fontSize: 11, color: '#888' }}>(closing window…)</span>
        </span>
      )}
    </div>
  )
}
