'use client'

import { useEffect, useState } from 'react'
import { PixelIcon } from './icons'

export default function BootScreen() {
  const [phase, setPhase] = useState<'idle' | 'boot' | 'fade' | 'done'>('idle')

  useEffect(() => {
    if (sessionStorage.getItem('w95-booted')) {
      setPhase('done')
      return
    }
    setPhase('boot')
    const t1 = setTimeout(() => setPhase('fade'), 2600)
    const t2 = setTimeout(() => {
      sessionStorage.setItem('w95-booted', '1')
      setPhase('done')
    }, 3200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'idle' || phase === 'done') return null

  return (
    <div className={`w95-boot ${phase === 'fade' ? 'fade' : ''}`}>
      <PixelIcon name="start-flag" size={128} />
      <div className="w95-boot-title">
        Microsoft<sup>®</sup> Windows<sup>®</sup> 95
      </div>
      <div className="w95-boot-sub">Starting up…</div>
      <div className="w95-boot-bar">
        <div className="w95-boot-bar-inner" />
      </div>
    </div>
  )
}
