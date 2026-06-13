'use client'

import { useEffect, useState } from 'react'
import { useWindowStore } from '@/store/windowStore'

const RABBIT = `        (\\(\\
        (-.-)
        o_(")(")`

export default function RabbitApp() {
  const triggerChaos = useWindowStore((s) => s.triggerChaos)
  const [warned, setWarned] = useState(false)

  useEffect(() => {
    try { localStorage.setItem('ach:found-rabbit', '1') } catch {}
  }, [])

  const onFollow = () => {
    if (!warned) {
      setWarned(true)
      return
    }
    try { localStorage.setItem('ach:chaos', '1') } catch {}
    triggerChaos()
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        background: '#fff',
        color: '#000',
        fontFamily: 'var(--font-w95)',
        fontSize: 12,
        padding: 14,
      }}
    >
      <pre
        style={{
          fontFamily: 'Consolas, "Courier New", monospace',
          fontSize: 18,
          lineHeight: 1,
          margin: 0,
        }}
      >
        {RABBIT}
      </pre>

      {!warned ? (
        <>
          <div style={{ textAlign: 'center', maxWidth: 320 }}>
            “Wake up. The Matrix has you. Follow the white rabbit.”
          </div>
          <button className="w95-btn" onClick={onFollow}>
            Follow
          </button>
        </>
      ) : (
        <>
          <div style={{ textAlign: 'center', maxWidth: 320, color: '#a00' }}>
            <strong>Are you sure?</strong>
            <br />
            There is no going back from this. Everything will fall.
          </div>
          <button className="w95-btn" onClick={onFollow}>
            Yes, I&apos;m sure
          </button>
        </>
      )}
    </div>
  )
}
