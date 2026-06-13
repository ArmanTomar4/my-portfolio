'use client'

import { useEffect, useState } from 'react'

const BOOT_LINES: { text: string; delay: number }[] = [
  { text: 'Award Modular BIOS v4.51PG', delay: 250 },
  { text: 'Copyright (C) 1984-95, Award Software, Inc.', delay: 50 },
  { text: '', delay: 200 },
  { text: 'Pentium-S CPU at 133MHz', delay: 250 },
  { text: 'Memory Test: 65536K OK', delay: 400 },
  { text: '', delay: 200 },
  { text: 'Award Plug and Play BIOS Extension v1.0A', delay: 200 },
  { text: 'Detecting IDE Primary Master ... HARD DISK', delay: 250 },
  { text: 'Detecting IDE Primary Slave  ... NONE', delay: 200 },
  { text: 'Detecting IDE Secondary Master ... CDROM', delay: 200 },
  { text: '', delay: 200 },
  { text: 'Loading MS-DOS...', delay: 400 },
  { text: '', delay: 200 },
  { text: 'Microsoft(R) MS-DOS(R) Version 6.22', delay: 250 },
  { text: '            (C)Copyright Microsoft Corp 1981-1994.', delay: 100 },
  { text: '', delay: 200 },
  { text: 'HIMEM is testing extended memory...done.', delay: 350 },
  { text: '', delay: 150 },
  { text: 'C:\\>WIN', delay: 300 },
  { text: '', delay: 200 },
  { text: 'Just kidding. Type HELP for commands.', delay: 200 },
]

export default function MSDOSApp() {
  const [shown, setShown] = useState<string[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    let i = 0
    const run = () => {
      if (cancelled) return
      if (i >= BOOT_LINES.length) {
        setDone(true)
        return
      }
      const line = BOOT_LINES[i]
      setShown((prev) => [...prev, line.text])
      i++
      setTimeout(run, line.delay)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      style={{
        height: '100%',
        background: '#000',
        color: '#c6c6c6',
        font: '13px "Lucida Console", Consolas, monospace',
        padding: '8px 10px',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
      }}
    >
      {shown.map((line, i) => (
        <div key={i}>{line || ' '}</div>
      ))}
      {done && (
        <div>
          <span>C:\&gt; </span>
          <span
            style={{
              display: 'inline-block',
              width: 9,
              height: 14,
              background: '#c6c6c6',
              verticalAlign: 'text-bottom',
              marginLeft: 2,
              animation: 'w95-blink 1s steps(2) infinite',
            }}
          />
        </div>
      )}
    </div>
  )
}
