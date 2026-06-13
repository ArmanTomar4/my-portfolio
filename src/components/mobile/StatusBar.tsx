'use client'

import { useEffect, useState } from 'react'

interface StatusBarProps {
  carrier?: string
}

export default function StatusBar({ carrier = 'Arman' }: StatusBarProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      )
    update()
    const interval = setInterval(update, 10_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="ios-statusbar">
      <div className="ios-statusbar-left">
        <div className="ios-signal" aria-hidden>
          <span className="ios-signal-dot" />
          <span className="ios-signal-dot" />
          <span className="ios-signal-dot" />
          <span className="ios-signal-dot" />
          <span className="ios-signal-dot off" />
        </div>
        <span className="ios-carrier">{carrier}</span>
      </div>

      <span suppressHydrationWarning>{time}</span>

      <div className="ios-statusbar-right">
        <span>100%</span>
        <div className="ios-battery" aria-hidden>
          <div className="ios-battery-body">
            <div className="ios-battery-fill" style={{ width: '100%' }} />
          </div>
          <div className="ios-battery-tip" />
        </div>
      </div>
    </div>
  )
}
