'use client'

import Desktop from '@/components/desktop/Desktop'
import Mobile from '@/components/mobile/Mobile'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function Home() {
  const isMobile = useIsMobile()

  if (isMobile === null) return <div className="h-full w-full bg-black" />

  return isMobile ? <Mobile /> : <Desktop />
}
