'use client'

import { useEffect } from 'react'
import { useWindowStore } from '@/store/windowStore'

export default function DatamoshApp() {
  const closeWindow = useWindowStore((s) => s.closeWindow)

  useEffect(() => {
    const root = document.querySelector('.w95-root')
    root?.classList.add('glitch')
    const cleanup = setTimeout(() => {
      root?.classList.remove('glitch')
      closeWindow('datamosh')
    }, 2400)
    return () => {
      clearTimeout(cleanup)
      root?.classList.remove('glitch')
    }
  }, [closeWindow])

  return (
    <div
      style={{
        height: '100%',
        background: '#000',
        color: '#ff5252',
        fontFamily: 'var(--font-w95)',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 14,
      }}
    >
      ░▒▓ DATA MOSH IN PROGRESS ▓▒░
    </div>
  )
}
