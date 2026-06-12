'use client'

import { useIsMobile } from '@/hooks/useIsMobile'

export default function Home() {
  const isMobile = useIsMobile()

  return isMobile ? (
    <div className="h-full w-full bg-black">
      {/* iOS HomeScreen — coming next */}
      <p className="text-white p-4">Mobile — iOS view coming soon</p>
    </div>
  ) : (
    <div className="h-full w-full bg-[#008080]">
      {/* Windows 95 Desktop — coming next */}
      <p className="text-white p-4">Desktop — W95 view coming soon</p>
    </div>
  )
}
