'use client'

import { useEffect, useRef, useState } from 'react'
import { PixelIcon } from './icons'

const BOOT_MS = 5200
const BLOCKS = 20

const LOG_LINES = [
  'Detecting CPU... Intel Pentium 100MHz',
  'Memory test... 16384 KB OK',
  'Detecting IDE devices...',
  'Primary master: C: 1.2GB',
  'Initializing PCI bus...',
  'Loading C:\\WINDOWS\\HIMEM.SYS',
  'Loading C:\\WINDOWS\\EMM386.EXE',
  'Mounting C:\\... done',
  'Loading registry... 89%',
  'Starting Windows 95...',
]

export default function BootScreen() {
  const [phase, setPhase] = useState<'idle' | 'boot' | 'fade' | 'done'>('idle')
  const [pct, setPct] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('w95-booted')) {
      setPhase('done')
      return
    }
    setPhase('boot')

    // Try to play the startup chime — most browsers require a user gesture,
    // so on first visit this may silently fail (which is fine).
    playStartupChime(audioCtxRef)

    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / BOOT_MS)
      setPct(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    let raf = requestAnimationFrame(tick)

    // Drip-feed log lines
    const logTimers: ReturnType<typeof setTimeout>[] = LOG_LINES.map((line, i) =>
      setTimeout(() => setLogs(prev => [...prev, line]), (BOOT_MS / LOG_LINES.length) * i + 200)
    )

    const t1 = setTimeout(() => setPhase('fade'), BOOT_MS + 200)
    const t2 = setTimeout(() => {
      sessionStorage.setItem('w95-booted', '1')
      setPhase('done')
    }, BOOT_MS + 800)

    return () => {
      cancelAnimationFrame(raf)
      logTimers.forEach(clearTimeout)
      clearTimeout(t1)
      clearTimeout(t2)
      audioCtxRef.current?.close().catch(() => {})
    }
  }, [])

  if (phase === 'idle' || phase === 'done') return null

  const filled = Math.round(pct * BLOCKS)

  return (
    <div className={`w95-boot ${phase === 'fade' ? 'fade' : ''}`}>
      <PixelIcon name="start-flag" size={128} />
      <div className="w95-boot-title">
        Microsoft<sup>®</sup> Windows<sup>®</sup> 95
      </div>
      <div className="w95-boot-sub">Starting up…</div>

      <div className="w95-boot-progress-wrap">
        <div className="w95-boot-progress-label">
          <span>Loading…</span>
          <span>{Math.round(pct * 100)}%</span>
        </div>
        <div className="w95-boot-progress">
          {Array.from({ length: BLOCKS }).map((_, i) => (
            <div key={i} className={`w95-boot-progress-block ${i < filled ? 'fill' : ''}`} />
          ))}
        </div>
      </div>

      <div className="w95-boot-log">
        {logs.slice(-5).map((line, i, arr) => (
          <div key={logs.length - arr.length + i} className="w95-boot-log-line in">
            &gt; {line}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Plays a Web Audio approximation of the Windows 95 startup chime —
 * a warm F-major pad swell that fades in, sustains, and resolves.
 */
function playStartupChime(ref: React.MutableRefObject<AudioContext | null>) {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    ref.current = ctx
    const now = ctx.currentTime

    // Master gain — slow swell in, sustain, fade out
    const master = ctx.createGain()
    master.connect(ctx.destination)
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.18, now + 1.5)
    master.gain.setValueAtTime(0.18, now + 3.5)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 5.5)

    // Gentle lowpass for warmth
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 2400
    filter.Q.value = 0.6
    filter.connect(master)

    // F major triad with octave doubling — soft pad voicing
    const notes = [174.61, 220.00, 261.63, 349.23, 440.00, 523.25]
    notes.forEach((freq, i) => {
      // Slight detune pair for chorus thickness
      ;[-3, 3].forEach((cents) => {
        const osc = ctx.createOscillator()
        osc.type = i < 3 ? 'sine' : 'triangle'
        osc.frequency.value = freq
        osc.detune.value = cents
        const g = ctx.createGain()
        g.gain.value = 0.18 / notes.length
        osc.connect(g)
        g.connect(filter)
        osc.start(now)
        osc.stop(now + 5.6)
      })
    })

    // Single bell-like high note that pings around 1.8s — gives it character
    const bellOsc = ctx.createOscillator()
    bellOsc.type = 'sine'
    bellOsc.frequency.value = 1046.5 // C6
    const bellGain = ctx.createGain()
    bellGain.gain.setValueAtTime(0.0001, now + 1.6)
    bellGain.gain.exponentialRampToValueAtTime(0.06, now + 1.75)
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5)
    bellOsc.connect(bellGain)
    bellGain.connect(filter)
    bellOsc.start(now + 1.6)
    bellOsc.stop(now + 3.6)
  } catch {
    // Audio blocked — silent fallback is fine
  }
}
