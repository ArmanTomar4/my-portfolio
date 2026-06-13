'use client'

import { useEffect, useRef, useState } from 'react'

interface Track {
  artist: string
  title: string
  durationSec: number
  src?: string
}

const PLAYLIST: Track[] = [
  { artist: 'Aphex Twin',       title: 'Windowlicker',          durationSec: 366 },
  { artist: 'Daft Punk',        title: 'Around the World',      durationSec: 425 },
  { artist: 'Boards of Canada', title: 'Roygbiv',               durationSec: 142 },
  { artist: 'The Prodigy',      title: 'Firestarter',           durationSec: 281 },
  { artist: 'Radiohead',        title: 'Karma Police',          durationSec: 261 },
  { artist: 'Massive Attack',   title: 'Teardrop',              durationSec: 331 },
]

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function WinAMPApp() {
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [volume, setVolume] = useState(70)
  const [showList, setShowList] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const current = PLAYLIST[trackIndex]

  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= current.durationSec) {
          setTrackIndex((i) => (i + 1) % PLAYLIST.length)
          return 0
        }
        return p + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [playing, current.durationSec])

  useEffect(() => {
    setPosition(0)
  }, [trackIndex])

  const toggle = () => setPlaying((p) => !p)
  const stop = () => {
    setPlaying(false)
    setPosition(0)
  }
  const next = () => setTrackIndex((i) => (i + 1) % PLAYLIST.length)
  const prev = () => setTrackIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length)

  return (
    <div
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #6a747f 0%, #2c3540 100%)',
        color: '#0afc4f',
        fontFamily: '"Lucida Console", Consolas, monospace',
        display: 'flex',
        flexDirection: 'column',
        padding: 4,
      }}
    >
      <audio ref={audioRef} />
      <div
        style={{
          background: 'linear-gradient(180deg, #1d2129 0%, #0a0c12 100%)',
          padding: '4px 8px',
          fontSize: 11,
          letterSpacing: 1,
          textShadow: '0 0 4px #0afc4f',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #555',
        }}
      >
        <span>★ WINAMP 2.95</span>
        <span style={{ color: '#a4ff9a' }}>{Math.round((position / current.durationSec) * 1000) / 10}%</span>
      </div>

      <div
        style={{
          background: 'linear-gradient(180deg, #060810 0%, #0d1320 100%)',
          padding: '8px 10px',
          margin: '4px 0',
          border: '1px solid #444',
          flex: 'none',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 1, textShadow: '0 0 5px #0afc4f' }}>
          {formatTime(position)} / {formatTime(current.durationSec)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4 }}>
          <span>kbps: 128</span>
          <span>kHz: 44</span>
          <span>STEREO</span>
        </div>
      </div>

      <div style={{ background: '#0a0c12', padding: 6, border: '1px solid #444', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Marquee text={`${current.artist} — ${current.title}`} />
        <Visualizer playing={playing} />
      </div>

      <div style={{ display: 'flex', gap: 4, padding: '6px 2px', justifyContent: 'space-between' }}>
        <WaButton onClick={prev}>⏮</WaButton>
        <WaButton onClick={toggle} highlight={playing}>{playing ? '⏸' : '▶'}</WaButton>
        <WaButton onClick={stop}>⏹</WaButton>
        <WaButton onClick={next}>⏭</WaButton>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px 6px', color: '#a4ff9a', fontSize: 11 }}>
        <span>VOL</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#0afc4f' }}
        />
        <span>{volume}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px 4px' }}>
        <button
          onClick={() => setShowList((s) => !s)}
          style={{ background: 'transparent', border: '1px solid #444', color: '#a4ff9a', font: '10px monospace', padding: '2px 6px', cursor: 'pointer' }}
        >
          {showList ? 'HIDE PL' : 'SHOW PL'}
        </button>
        <span style={{ fontSize: 10, color: '#a4ff9a' }}>Track {trackIndex + 1} / {PLAYLIST.length}</span>
      </div>

      {showList && (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            background: '#0a0c12',
            border: '1px solid #444',
            padding: 4,
            fontSize: 11,
          }}
        >
          {PLAYLIST.map((t, i) => (
            <button
              key={i}
              onClick={() => { setTrackIndex(i); setPlaying(true) }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                background: i === trackIndex ? '#082814' : 'transparent',
                color: i === trackIndex ? '#0afc4f' : '#a4ff9a',
                border: 'none',
                font: 'inherit',
                padding: '2px 4px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <span>{(i + 1).toString().padStart(2, '0')}. {t.artist} – {t.title}</span>
              <span>{formatTime(t.durationSec)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function WaButton({ children, onClick, highlight }: { children: React.ReactNode; onClick: () => void; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: 26,
        background: highlight
          ? 'linear-gradient(180deg, #4a5566 0%, #1c232f 100%)'
          : 'linear-gradient(180deg, #2c3441 0%, #11161e 100%)',
        border: '1px solid #444',
        boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.15), inset -1px -1px 0 rgba(0,0,0,0.5)',
        color: '#a4ff9a',
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function Marquee({ text }: { text: string }) {
  return (
    <div style={{ overflow: 'hidden', height: 16, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          whiteSpace: 'nowrap',
          animation: 'winamp-marquee 12s linear infinite',
          fontSize: 12,
          color: '#0afc4f',
          textShadow: '0 0 3px #0afc4f',
        }}
      >
        ★ {text} ★ {text} ★
      </div>
      <style>{`
        @keyframes winamp-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

function Visualizer({ playing }: { playing: boolean }) {
  const [bars, setBars] = useState<number[]>(Array.from({ length: 20 }, () => Math.random()))
  useEffect(() => {
    if (!playing) {
      setBars((prev) => prev.map((v) => Math.max(0, v - 0.05)))
      return
    }
    const interval = setInterval(() => {
      setBars((prev) => prev.map((v) => Math.max(0.05, Math.min(1, v + (Math.random() - 0.5) * 0.6))))
    }, 90)
    return () => clearInterval(interval)
  }, [playing])
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 32 }}>
      {bars.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${v * 100}%`,
            background: 'linear-gradient(180deg, #f59e0b 0%, #ef4444 50%, #0afc4f 100%)',
            transition: 'height 90ms ease',
          }}
        />
      ))}
    </div>
  )
}
