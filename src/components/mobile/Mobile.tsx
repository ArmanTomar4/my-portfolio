'use client'

import { useEffect, useState } from 'react'
import LockScreen from './LockScreen'
import HomeScreen from './HomeScreen'
import AppScreen from './AppScreen'
import { IosAppDefinition } from './iosApps'

const SESSION_FLAG = 'ios-unlocked'

export default function Mobile() {
  const [locked, setLocked] = useState<boolean | null>(null)
  const [activeApp, setActiveApp] = useState<IosAppDefinition | null>(null)

  useEffect(() => {
    setLocked(!sessionStorage.getItem(SESSION_FLAG))
  }, [])

  const handleUnlock = () => {
    try {
      sessionStorage.setItem(SESSION_FLAG, '1')
    } catch {
      // storage unavailable — fine, only affects future sessions
    }
    setLocked(false)
  }

  if (locked === null) return <div className="ios-root" />

  return (
    <div className="ios-root">
      <HomeScreen onOpenApp={setActiveApp} />
      <AppScreen app={activeApp} onClose={() => setActiveApp(null)} />
      {locked && <LockScreen onUnlock={handleUnlock} />}
    </div>
  )
}
