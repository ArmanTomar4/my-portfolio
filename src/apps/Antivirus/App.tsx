'use client'

import { useEffect, useState } from 'react'

const FILES = [
  'C:\\Windows\\System32\\charisma.dll',
  'C:\\Windows\\System32\\humour.dll',
  'C:\\Windows\\System32\\creativity.exe',
  'C:\\Windows\\Fonts\\PixelatedMSSansSerif.ttf',
  'C:\\Program Files\\Arman\\portfolio.exe',
  'C:\\Program Files\\Arman\\side-projects.dat',
  'C:\\Program Files\\Common\\hire-me.cfg',
  'C:\\Documents\\Resume.doc',
]

export default function AntivirusApp() {
  const [scanIndex, setScanIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => {
      setScanIndex((i) => {
        if (i + 1 >= FILES.length) {
          clearInterval(interval)
          setDone(true)
          return i
        }
        return i + 1
      })
    }, 380)
    return () => clearInterval(interval)
  }, [done])

  const progress = ((scanIndex + 1) / FILES.length) * 100

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--w95-face)',
        padding: 10,
        fontFamily: 'var(--font-w95)',
        fontSize: 11,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: '#000',
          color: '#0f0',
          padding: 8,
          fontFamily: 'Consolas, "Courier New", monospace',
          fontSize: 11,
          overflowY: 'auto',
        }}
      >
        <div style={{ marginBottom: 6, color: '#fff' }}>
          Dr. Marburg AntiVirus v3.1 — Initiating full system scan...
        </div>
        {FILES.slice(0, scanIndex + 1).map((file, i) => (
          <div key={file}>
            {i === scanIndex && !done ? '> ' : '  '}
            scan: {file}
            {i < scanIndex || done ? <span style={{ color: '#fff' }}> ... OK</span> : null}
          </div>
        ))}
        {done && (
          <>
            <br />
            <div style={{ color: '#ff5252' }}>
              ⚠ WARNING: 3 anomalies detected
            </div>
            <div>- excessive enthusiasm for box-shadow inset bevels</div>
            <div>- chronic preference for plain CSS over Tailwind</div>
            <div>- mild allergy to UI libraries</div>
            <div style={{ color: '#0f0', marginTop: 6 }}>
              Diagnosis: incurable. Continue as normal.
            </div>
          </>
        )}
      </div>
      <div
        style={{
          marginTop: 8,
          height: 18,
          background: '#fff',
          boxShadow: 'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'repeating-linear-gradient(90deg, #000080 0 8px, #1084d0 8px 12px)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div style={{ marginTop: 4, textAlign: 'center' }}>
        {done ? 'Scan complete.' : `Scanning... ${Math.round(progress)}%`}
      </div>
    </div>
  )
}
