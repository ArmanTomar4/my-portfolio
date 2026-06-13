'use client'

import { useEffect, useRef, useState } from 'react'
import StatusBar from './StatusBar'

interface LockScreenProps {
  onUnlock: () => void
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [thumbX, setThumbX] = useState(0)
  const [unlocking, setUnlocking] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startX: number; max: number } | null>(null)

  useEffect(() => {
    const update = () => {
      const d = new Date()
      setTime(
        d.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).replace(/\s?(AM|PM)$/i, '')
      )
      setDate(
        d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      )
    }
    update()
    const interval = setInterval(update, 30_000)
    return () => clearInterval(interval)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current
    if (!track) return
    track.setPointerCapture(e.pointerId)
    const max = track.clientWidth - 70 // thumb width + small inset
    dragState.current = { startX: e.clientX, max }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return
    const dx = e.clientX - dragState.current.startX
    const x = Math.min(Math.max(0, dx), dragState.current.max)
    setThumbX(x)
    if (x >= dragState.current.max - 4) {
      // committed — release pointer and trigger unlock
      dragState.current = null
      setUnlocking(true)
      setTimeout(onUnlock, 380)
    }
  }

  const onPointerUp = () => {
    if (!dragState.current) return
    dragState.current = null
    // snap back if not committed
    setThumbX(0)
  }

  return (
    <div className={`ios-lock ${unlocking ? 'unlocking' : ''}`}>
      <StatusBar />
      <div className="ios-lock-time-block">
        <div className="ios-lock-time" suppressHydrationWarning>
          {time}
        </div>
        <div className="ios-lock-date" suppressHydrationWarning>
          {date}
        </div>
      </div>
      <div className="ios-lock-footer">
        <div className="ios-slide-track" ref={trackRef}>
          <span className="ios-slide-text">slide to unlock</span>
          <div
            className="ios-slide-thumb"
            style={{ transform: `translateX(${thumbX}px)`, transition: thumbX === 0 ? 'transform 0.25s ease' : 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            ▸
          </div>
        </div>
      </div>
    </div>
  )
}
