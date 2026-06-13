'use client'

import { useEffect } from 'react'
import { useWindowStore } from '@/store/windowStore'

export default function Bsod() {
  const clearBsod = useWindowStore((s) => s.clearBsod)

  useEffect(() => {
    try { localStorage.setItem('ach:bsod', '1') } catch {}
    const dismiss = (e: KeyboardEvent | MouseEvent) => {
      e.preventDefault()
      clearBsod()
    }
    window.addEventListener('keydown', dismiss, { once: true })
    window.addEventListener('mousedown', dismiss, { once: true })
    return () => {
      window.removeEventListener('keydown', dismiss)
      window.removeEventListener('mousedown', dismiss)
    }
  }, [clearBsod])

  return (
    <div className="w95-bsod" role="alert">
      <div className="w95-bsod-inner">
        <div className="w95-bsod-banner">Windows</div>

        <p>
          A fatal exception 0E has occurred at 0028:C001E36 in VXD VMM(01) +
          00010E36. The current application will be terminated.
        </p>

        <p>
          *  Press any key to terminate the current application.
          <br />
          *  Press CTRL+ALT+DEL again to restart your computer. You will
          <br />
          {'   '}lose any unsaved information in all applications.
        </p>

        <p className="w95-bsod-prompt">Press any key to continue _</p>
      </div>
    </div>
  )
}
