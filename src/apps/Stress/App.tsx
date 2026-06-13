'use client'

import { useEffect, useState } from 'react'
import { useWindowStore } from '@/store/windowStore'

const ERRORS = [
  'ERROR 0x000000F: kernel.dll not responding',
  'WARNING: stack overflow at module charisma',
  'CRITICAL: CPU temperature out of range (∞°C)',
  'ERROR: out of bandwidth (used 999%)',
  'NOTICE: Personality.dll loaded successfully',
  'WARNING: motivation.exe terminated unexpectedly',
  'ERROR: file not found — coffee.cup',
  'PANIC: too many tabs open in browser of life',
  'ALERT: imposter syndrome process spiked to 100%',
  'INFO: fixing it... fixing it... fixing it...',
]

export default function StressApp() {
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const [lines, setLines] = useState<string[]>([])
  const [cpu, setCpu] = useState(50)

  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      setLines((prev) => [...prev, ERRORS[count % ERRORS.length]].slice(-16))
      setCpu(Math.min(99, 30 + Math.random() * 70))
      count++
      if (count > 24) {
        clearInterval(interval)
        setTimeout(() => closeWindow('stress'), 600)
      }
    }, 240)
    return () => clearInterval(interval)
  }, [closeWindow])

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#000',
        color: '#0f0',
        fontFamily: 'Consolas, "Courier New", monospace',
        fontSize: 11,
        padding: 8,
        overflow: 'hidden',
      }}
    >
      <div style={{ color: '#fff', marginBottom: 4 }}>
        stress.exe — system load test in progress
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 10 }}>
        <span>CPU: {cpu.toFixed(0)}%</span>
        <span>MEM: {(Math.random() * 100).toFixed(0)}%</span>
        <span>DISK: {(Math.random() * 100).toFixed(0)}%</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.startsWith('ERROR') ? '#ff5252' : line.startsWith('WARN') ? '#ffd966' : '#0f0',
              opacity: Math.max(0.3, 1 - (lines.length - 1 - i) * 0.08),
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
