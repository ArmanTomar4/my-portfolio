'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { about } from '@/data/about'
import { projects } from '@/data/projects'
import { skills } from '@/data/skills'

/* ---------- Photos ---------- */

const PHOTO_PALETTE = [
  ['#fda4af', '#f43f5e'],
  ['#fdba74', '#ea580c'],
  ['#fde047', '#ca8a04'],
  ['#86efac', '#16a34a'],
  ['#67e8f9', '#0891b2'],
  ['#93c5fd', '#1d4ed8'],
  ['#c4b5fd', '#6d28d9'],
  ['#f0abfc', '#a21caf'],
  ['#fed7aa', '#b45309'],
]

export function PhotosContent() {
  const photos = projects.flatMap((p, i) => [
    { title: `${p.name}`, from: PHOTO_PALETTE[i % PHOTO_PALETTE.length][0], to: PHOTO_PALETTE[i % PHOTO_PALETTE.length][1], icon: 'hero' as const },
    { title: `${p.name} · mobile`, from: PHOTO_PALETTE[(i + 4) % PHOTO_PALETTE.length][0], to: PHOTO_PALETTE[(i + 4) % PHOTO_PALETTE.length][1], icon: 'mobile' as const },
  ])
  return (
    <div style={{ paddingBottom: 8 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Camera Roll</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {photos.map((p, i) => (
          <div
            key={i}
            style={{
              aspectRatio: '1 / 1',
              borderRadius: 4,
              background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: 4,
              color: '#fff',
              fontSize: 9,
              textAlign: 'center',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <FakePhotoSubject kind={p.icon} />
            <span style={{ position: 'relative', zIndex: 1 }}>{p.title}</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 14, fontSize: 11, color: '#6b7280', textAlign: 'center' }}>
        {photos.length} photos · sync’d today
      </p>
    </div>
  )
}

function FakePhotoSubject({ kind }: { kind: 'hero' | 'mobile' }) {
  if (kind === 'mobile') {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '34%', height: '60%', border: '2px solid rgba(255,255,255,0.6)', borderRadius: 6, background: 'rgba(255,255,255,0.15)' }} />
      </div>
    )
  }
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '70%', height: '50%', border: '2px solid rgba(255,255,255,0.55)', borderRadius: 4, background: 'rgba(255,255,255,0.1)' }} />
    </div>
  )
}

/* ---------- Camera — real webcam via getUserMedia ---------- */

export function CameraContent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [shot, setShot] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)
  const [facing, setFacing] = useState<'user' | 'environment'>('user')

  const start = useCallback(async () => {
    setError(null)
    try {
      if (stream) stream.getTracks().forEach((t) => t.stop())
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing } })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        await videoRef.current.play()
      }
    } catch (err) {
      const e = err as Error
      setError(e?.message || 'Camera unavailable')
    }
  }, [facing, stream])

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [stream])

  const capture = () => {
    if (!videoRef.current || !stream) return
    const v = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = v.videoWidth
    canvas.height = v.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (facing === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(v, 0, 0)
    setShot(canvas.toDataURL('image/png'))
    setFlash(true)
    setTimeout(() => setFlash(false), 200)
  }

  const download = () => {
    if (!shot) return
    const a = document.createElement('a')
    a.href = shot
    a.download = `camera-${Date.now()}.png`
    a.click()
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000', margin: -14, padding: 0 }}>
      <div style={{ flex: 1, position: 'relative', background: '#0a0a0a', overflow: 'hidden' }}>
        {shot ? (
          <img src={shot} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: facing === 'user' ? 'scaleX(-1)' : 'none',
              background: '#000',
            }}
          />
        )}
        {!stream && !shot && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#fff', padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 36 }}>📷</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>Tap to enable the camera. Your browser will ask permission.</div>
            <button
              onClick={start}
              style={{
                background: 'linear-gradient(180deg, #facc15, #f59e0b)',
                color: '#000',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.4)',
              }}
            >
              Enable camera
            </button>
            {error && (
              <div style={{ color: '#fca5a5', fontSize: 11 }}>
                {error}
              </div>
            )}
          </div>
        )}
        {flash && <div style={{ position: 'absolute', inset: 0, background: '#fff', animation: 'ios-flash 0.18s ease-out' }} />}
      </div>
      <div style={{ flex: 'none', height: 100, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        {shot ? (
          <button onClick={download} style={camBtn('square', '#1d4ed8')}>↓</button>
        ) : (
          <div style={{ width: 40 }} />
        )}
        {stream && !shot ? (
          <button
            onClick={capture}
            style={{
              width: 64, height: 64, borderRadius: '50%', border: '3px solid #fff', background: '#fff', cursor: 'pointer',
              boxShadow: 'inset 0 0 0 4px #111',
            }}
          />
        ) : shot ? (
          <button onClick={() => setShot(null)} style={{ ...camBtn('round', '#fff'), color: '#111', fontWeight: 700 }}>↺</button>
        ) : (
          <div style={{ width: 64 }} />
        )}
        {stream && !shot ? (
          <button onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))} style={camBtn('square', '#374151')}>⇋</button>
        ) : (
          <div style={{ width: 40 }} />
        )}
      </div>
      <style jsx>{`
        @keyframes ios-flash {
          from { opacity: 0.95 }
          to { opacity: 0 }
        }
      `}</style>
    </div>
  )
}

function camBtn(shape: 'square' | 'round', color: string): React.CSSProperties {
  return {
    width: shape === 'round' ? 64 : 40,
    height: shape === 'round' ? 64 : 40,
    borderRadius: shape === 'round' ? '50%' : 6,
    background: color,
    border: shape === 'round' ? '2px solid #fff' : 'none',
    color: '#fff',
    fontSize: 18,
    cursor: 'pointer',
  }
}

/* ---------- Weather — real open-meteo ---------- */

interface WeatherData {
  current: { temp: number; code: number }
  hourly: { time: string; temp: number; code: number }[]
  daily: { day: string; max: number; min: number; code: number }[]
}

const WMO: Record<number, { label: string; icon: string; night: string }> = {
  0:  { label: 'Clear',          icon: '☀',  night: '☾' },
  1:  { label: 'Mostly clear',   icon: '🌤', night: '☾' },
  2:  { label: 'Partly cloudy',  icon: '⛅', night: '☁' },
  3:  { label: 'Overcast',       icon: '☁',  night: '☁' },
  45: { label: 'Foggy',          icon: '🌫', night: '🌫' },
  48: { label: 'Foggy',          icon: '🌫', night: '🌫' },
  51: { label: 'Drizzle',        icon: '🌦', night: '🌧' },
  53: { label: 'Drizzle',        icon: '🌦', night: '🌧' },
  55: { label: 'Drizzle',        icon: '🌧', night: '🌧' },
  61: { label: 'Rain',           icon: '🌧', night: '🌧' },
  63: { label: 'Rain',           icon: '🌧', night: '🌧' },
  65: { label: 'Heavy rain',     icon: '⛈', night: '⛈' },
  71: { label: 'Snow',           icon: '❄', night: '❄' },
  73: { label: 'Snow',           icon: '❄', night: '❄' },
  75: { label: 'Heavy snow',     icon: '❄', night: '❄' },
  80: { label: 'Showers',        icon: '🌦', night: '🌧' },
  81: { label: 'Showers',        icon: '🌧', night: '🌧' },
  82: { label: 'Heavy showers',  icon: '⛈', night: '⛈' },
  95: { label: 'Thunderstorm',   icon: '⛈', night: '⛈' },
  96: { label: 'Thunderstorm',   icon: '⛈', night: '⛈' },
  99: { label: 'Thunderstorm',   icon: '⛈', night: '⛈' },
}

const DEFAULT_LOC = { lat: 28.6139, lon: 77.2090, name: 'New Delhi' }

export function WeatherContent() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [city, setCity] = useState(DEFAULT_LOC.name)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetchWeather = async (lat: number, lon: number, name: string) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,weather_code` +
          `&hourly=temperature_2m,weather_code` +
          `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
          `&temperature_unit=celsius&timezone=auto&forecast_days=6`
        )
        if (!res.ok) throw new Error('weather fetch failed')
        const json = await res.json()
        if (cancelled) return
        const nowHour = new Date().getHours()
        const hourly = (json.hourly?.time ?? []).slice(nowHour, nowHour + 6).map((t: string, i: number) => ({
          time: new Date(t).toLocaleTimeString([], { hour: 'numeric' }),
          temp: Math.round(json.hourly.temperature_2m[nowHour + i]),
          code: json.hourly.weather_code[nowHour + i],
        }))
        const daily = (json.daily?.time ?? []).map((t: string, i: number) => ({
          day: new Date(t).toLocaleDateString([], { weekday: 'short' }),
          max: Math.round(json.daily.temperature_2m_max[i]),
          min: Math.round(json.daily.temperature_2m_min[i]),
          code: json.daily.weather_code[i],
        }))
        setData({
          current: { temp: Math.round(json.current.temperature_2m), code: json.current.weather_code },
          hourly,
          daily,
        })
        setCity(name)
      } catch (e) {
        if (!cancelled) setError((e as Error).message)
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&zoom=10`, {
              headers: { 'Accept-Language': 'en' },
            })
            const j = await r.json()
            const name = j.address?.city || j.address?.town || j.address?.village || j.address?.state || j.name || 'Your location'
            fetchWeather(pos.coords.latitude, pos.coords.longitude, name)
          } catch {
            fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Your location')
          }
        },
        () => fetchWeather(DEFAULT_LOC.lat, DEFAULT_LOC.lon, DEFAULT_LOC.name),
        { timeout: 4000 }
      )
    } else {
      fetchWeather(DEFAULT_LOC.lat, DEFAULT_LOC.lon, DEFAULT_LOC.name)
    }

    return () => {
      cancelled = true
    }
  }, [])

  const hour = new Date().getHours()
  const isNight = hour < 6 || hour > 19
  const wmo = (code: number) => WMO[code] ?? WMO[3]
  const current = data?.current
  const condition = current ? wmo(current.code) : null

  return (
    <div style={{
      margin: -14,
      padding: 18,
      minHeight: '100%',
      background: isNight
        ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 60%, #334155 100%)'
        : 'linear-gradient(180deg, #38bdf8 0%, #60a5fa 60%, #a5b4fc 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 300, letterSpacing: 0.5 }}>{city}</div>
        {data ? (
          <>
            <div style={{ fontSize: 84, fontWeight: 200, lineHeight: 1, marginTop: 8 }}>{current!.temp}°</div>
            <div style={{ fontSize: 14, opacity: 0.92 }}>
              {isNight ? condition?.night : condition?.icon} {condition?.label}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
              H: {data.daily[0]?.max}° L: {data.daily[0]?.min}°
            </div>
          </>
        ) : (
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 30 }}>
            {error ? `couldn't load forecast` : 'fetching live forecast…'}
          </div>
        )}
      </div>

      {data && (
        <>
          <div style={panelStyle()}>
            {data.hourly.map((h, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 12 }}>
                <div style={{ opacity: 0.85 }}>{i === 0 ? 'Now' : h.time}</div>
                <div style={{ fontSize: 16, margin: '4px 0' }}>{isNight ? wmo(h.code).night : wmo(h.code).icon}</div>
                <div>{h.temp}°</div>
              </div>
            ))}
          </div>

          <div style={{ ...panelStyle(), display: 'block' }}>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', marginBottom: 4 }}>This Week</div>
            {data.daily.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i === data.daily.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                <span>{i === 0 ? 'Today' : d.day}</span>
                <span>{isNight ? wmo(d.code).night : wmo(d.code).icon}</span>
                <span>{d.max}° / {d.min}°</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function panelStyle(): React.CSSProperties {
  return {
    background: 'rgba(0,0,0,0.18)',
    borderRadius: 10,
    padding: 12,
    border: '1px solid rgba(255,255,255,0.18)',
    display: 'flex',
    justifyContent: 'space-between',
  }
}

/* ---------- Calendar ---------- */

const EVENTS: Record<number, { time: string; title: string; color: string }[]> = {
  3:  [{ time: '10:00', title: 'Standup',           color: '#ef4444' }],
  7:  [{ time: '14:00', title: 'Design review',     color: '#0ea5e9' }],
  12: [{ time: '09:00', title: 'Refactor windows',  color: '#22c55e' }, { time: '15:00', title: 'Read the docs', color: '#a855f7' }],
  18: [{ time: '11:00', title: 'Pair on auth',      color: '#0ea5e9' }],
  23: [{ time: '17:00', title: 'Ship something',    color: '#f59e0b' }],
}

export function CalendarContent() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const monthName = today.toLocaleString('en-US', { month: 'long' })
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDate = today.getDate()
  const [selected, setSelected] = useState(todayDate)

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const events = EVENTS[selected] ?? []

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 14, color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' }}>{monthName}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>{year}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 12 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, color: '#6b7280', textTransform: 'uppercase' }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />
          const isToday = d === todayDate
          const isSelected = d === selected
          const hasEvent = !!EVENTS[d]
          return (
            <button
              key={i}
              onClick={() => setSelected(d)}
              style={{
                aspectRatio: '1 / 1',
                border: 'none',
                background: isSelected ? '#dc2626' : isToday ? '#fee2e2' : 'transparent',
                color: isSelected ? '#fff' : '#111',
                borderRadius: '50%',
                fontSize: 13,
                cursor: 'pointer',
                position: 'relative',
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {d}
              {hasEvent && (
                <span style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: isSelected ? '#fff' : '#dc2626' }} />
              )}
            </button>
          )
        })}
      </div>
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #d4d6da', overflow: 'hidden' }}>
        <div style={{ background: '#f7f8fa', padding: '8px 12px', fontWeight: 700, fontSize: 13, borderBottom: '1px solid #e5e7eb' }}>
          {monthName} {selected}
        </div>
        {events.length === 0 ? (
          <div style={{ padding: 14, fontSize: 12, color: '#6b7280', textAlign: 'center' }}>No events</div>
        ) : (
          events.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: i === 0 ? 'none' : '1px solid #f3f4f6' }}>
              <div style={{ width: 4, height: 24, background: e.color, borderRadius: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{e.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ---------- Maps ---------- */

export function MapsContent() {
  return (
    <div style={{ margin: -14, height: 'calc(100% + 28px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 30% 30%, #cfe6a8 0%, #a3c585 35%, #7ab859 70%, #4f8b3a 100%)',
      }} />
      <svg viewBox="0 0 375 700" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path d="M 0 220 Q 180 160 375 240" stroke="#d4b886" strokeWidth="14" fill="none" />
        <path d="M 0 220 Q 180 160 375 240" stroke="#fff8e1" strokeWidth="2" strokeDasharray="6 6" fill="none" />
        <path d="M 80 0 L 110 700" stroke="#d4b886" strokeWidth="10" fill="none" />
        <path d="M 80 0 L 110 700" stroke="#fff8e1" strokeWidth="1.5" strokeDasharray="6 6" fill="none" />
        <path d="M 0 430 L 375 440" stroke="#d4b886" strokeWidth="9" fill="none" />
        <path d="M 0 430 L 375 440" stroke="#fff8e1" strokeWidth="1.5" strokeDasharray="6 6" fill="none" />
        <rect x="40" y="280" width="60" height="40" fill="#cbd5e1" stroke="#6b7280" />
        <rect x="170" y="300" width="60" height="50" fill="#cbd5e1" stroke="#6b7280" />
        <rect x="240" y="500" width="80" height="60" fill="#cbd5e1" stroke="#6b7280" />
        <circle cx="265" cy="350" r="12" fill="#dc2626" stroke="#fff" strokeWidth="3" />
        <circle cx="265" cy="350" r="4" fill="#fff" />
      </svg>
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        background: '#fff',
        borderRadius: 10,
        padding: 10,
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 6, background: 'linear-gradient(135deg, #fecaca, #ef4444)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Dropped pin</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Approximate location</div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Mail — real composer that posts to /api/guestbook ---------- */

export function MailContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#fff', border: '1px solid #d4d6da', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Send Arman a note</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          Goes straight to the guestbook. He&apos;ll see it next time he opens Outlook.
        </div>
        <a
          href="mailto:tomararman4@gmail.com?subject=From%20your%20portfolio&body=Hi%20Arman%2C%0A%0A"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px 14px',
            borderRadius: 8,
            background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          Compose email
        </a>
      </div>
      <RealMessagesList compact />
    </div>
  )
}

/* ---------- Messages — real Redis guestbook ---------- */

interface GuestbookMessage {
  name: string
  message: string
  timestamp: string
}

function RealMessagesList({ compact }: { compact?: boolean }) {
  const [messages, setMessages] = useState<GuestbookMessage[] | null>(null)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/guestbook', { cache: 'no-store' })
      const json = await res.json()
      setMessages(Array.isArray(json.messages) ? json.messages : [])
    } catch {
      setMessages([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || 'visitor', message: text.trim() }),
      })
      if (!res.ok) throw new Error('Could not send')
      setText('')
      setStatus('idle')
      await load()
    } catch (err) {
      setStatus('error')
      setError((err as Error).message)
    }
  }

  const shown = messages?.slice(0, compact ? 4 : 30) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {!compact && (
        <div style={{ color: '#6b7280', fontSize: 12, textAlign: 'center' }}>Live from the guestbook</div>
      )}
      {shown === null && <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 12 }}>Loading…</div>}
      {shown && shown.length === 0 && (
        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 12 }}>No messages yet. Be the first.</div>
      )}
      {shown && shown.map((m, i) => {
        const right = (m.name.charCodeAt(0) + i) % 2 === 0
        return (
          <div
            key={i}
            style={{
              alignSelf: right ? 'flex-end' : 'flex-start',
              maxWidth: '78%',
              padding: '8px 12px',
              borderRadius: 16,
              background: right ? '#34c759' : '#e5e7eb',
              color: right ? '#fff' : '#111',
              fontSize: 14,
              lineHeight: 1.35,
            }}
          >
            <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{m.name}</div>
            {m.message}
          </div>
        )
      })}
      {!compact && (
        <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your name (optional)"
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #d4d6da',
              fontSize: 13,
              background: '#fff',
            }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="leave a message…"
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #d4d6da',
                fontSize: 13,
                background: '#fff',
              }}
            />
            <button
              type="submit"
              disabled={status === 'sending' || !text.trim()}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                background: '#1d4ed8',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                opacity: status === 'sending' || !text.trim() ? 0.6 : 1,
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
          {error && <div style={{ color: '#dc2626', fontSize: 11 }}>{error}</div>}
        </form>
      )}
    </div>
  )
}

export function MessagesContent() {
  return <RealMessagesList />
}

/* ---------- Game Center — real localStorage tracking ---------- */

interface Achievement {
  key: string
  name: string
  desc: string
  points: number
}

const ACHIEVEMENTS: Achievement[] = [
  { key: 'opened-readme',   name: 'Curious',      desc: 'Opened README.txt.',                    points: 5 },
  { key: 'used-hack',       name: 'Hacker',       desc: 'Typed "hack" in the Terminal.',         points: 25 },
  { key: 'found-rabbit',    name: 'White Rabbit', desc: 'Followed the rabbit down the hole.',    points: 50 },
  { key: 'wallpaper-swap',  name: 'Decorator',    desc: 'Changed the desktop wallpaper.',        points: 10 },
  { key: 'shut-down',       name: 'Sleeper',      desc: 'Properly shut down Windows 95.',        points: 15 },
  { key: 'painted',         name: 'Picasso',      desc: 'Drew something in Paint.',              points: 20 },
]

export function GameCenterContent() {
  const [unlockedSet, setUnlockedSet] = useState<Set<string>>(new Set())

  useEffect(() => {
    const ks = new Set<string>()
    ACHIEVEMENTS.forEach((a) => {
      if (localStorage.getItem(`ach:${a.key}`)) ks.add(a.key)
    })
    setUnlockedSet(ks)
  }, [])

  const got = ACHIEVEMENTS.filter((a) => unlockedSet.has(a.key)).reduce((s, a) => s + a.points, 0)
  const total = ACHIEVEMENTS.reduce((s, a) => s + a.points, 0)
  const unlocked = unlockedSet.size

  return (
    <div>
      <div style={{ background: 'linear-gradient(180deg, #4b5563, #1f2937)', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>You</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Visitor · Level {Math.max(1, Math.floor(got / 25) + 1)}</div>
        <div style={{ marginTop: 10, fontSize: 11 }}>{unlocked}/{ACHIEVEMENTS.length} achievements · {got}/{total} pts</div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
          <div style={{ width: `${(got / total) * 100}%`, height: '100%', background: '#facc15' }} />
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>Achievements</div>
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #d4d6da', overflow: 'hidden' }}>
        {ACHIEVEMENTS.map((a, i) => {
          const isUnlocked = unlockedSet.has(a.key)
          return (
            <div key={a.key} style={{
              display: 'flex',
              gap: 10,
              padding: '10px 12px',
              borderTop: i === 0 ? 'none' : '1px solid #e5e7eb',
              opacity: isUnlocked ? 1 : 0.55,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: isUnlocked ? 'linear-gradient(135deg, #fde047, #ca8a04)' : '#e5e7eb',
                color: isUnlocked ? '#5a3e02' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flex: 'none',
              }}>
                ★
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{a.desc}</div>
              </div>
              <div style={{ fontSize: 11, color: '#6b7280', alignSelf: 'center' }}>{a.points} pts</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- App Store — Tech Stack ---------- */

export function AppStoreContent() {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Featured</div>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>The tools, frameworks, and toys.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {skills.map((cat) => (
          <div key={cat.category} style={{ background: '#fff', borderRadius: 8, border: '1px solid #d4d6da', overflow: 'hidden' }}>
            <div style={{
              padding: 12,
              background: 'linear-gradient(135deg, ' + cat.color + ', #ffffff)',
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}>
              <div style={{ fontSize: 12, opacity: 0.85, textTransform: 'uppercase' }}>{cat.category}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{cat.items.length} apps</div>
            </div>
            <div>
              {cat.items.map((tech, i) => (
                <div key={tech} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'linear-gradient(135deg, ' + cat.color + ', #1f2937)',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700,
                  }}>
                    {tech[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{tech}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Rank #{i + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Music — real Web Audio synthesis ---------- */

interface SynthTrack {
  title: string
  vibe: string
  bpm: number
  /** semitone offsets from C4 root */
  pattern: number[]
  /** how long each note plays in beats */
  noteLen: number
  /** waveform */
  wave: OscillatorType
  /** filter cutoff */
  cutoff: number
}

const NOTE_FREQ = (semitones: number) => 261.63 * Math.pow(2, semitones / 12)

const SYNTH_TRACKS: SynthTrack[] = [
  { title: 'Bliss',     vibe: 'ambient pad',     bpm: 80,  pattern: [0, 4, 7, 12, 7, 4, 0, -5],          noteLen: 0.5, wave: 'triangle', cutoff: 1400 },
  { title: 'Boot',      vibe: 'chiptune lead',   bpm: 140, pattern: [0, 5, 7, 12, 10, 7, 5, 3],          noteLen: 0.25, wave: 'square', cutoff: 2800 },
  { title: 'Cassette',  vibe: 'lofi groove',     bpm: 90,  pattern: [0, 3, 7, 10, 7, 3, 0, -2],          noteLen: 0.5, wave: 'sine', cutoff: 1100 },
  { title: 'Glow',      vibe: 'arpeggio',        bpm: 110, pattern: [0, 4, 7, 11, 12, 11, 7, 4],         noteLen: 0.25, wave: 'sawtooth', cutoff: 1700 },
  { title: 'Driver',    vibe: 'synthwave bass',  bpm: 120, pattern: [0, 0, 7, 7, 5, 5, 3, 3],            noteLen: 0.5, wave: 'square', cutoff: 1500 },
  { title: 'Frozen',    vibe: 'crystal bells',   bpm: 70,  pattern: [12, 7, 4, 12, 14, 11, 7, 14],       noteLen: 0.5, wave: 'triangle', cutoff: 3500 },
]

function fmtTime(sec: number) {
  return `${Math.floor(sec / 60)}:${(Math.floor(sec) % 60).toString().padStart(2, '0')}`
}

export function MusicContent() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [pos, setPos] = useState(0)
  const [bars, setBars] = useState<number[]>(Array(16).fill(0))

  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const scheduledRef = useRef<{ stopAt: number }[]>([])
  const beatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const visualTimerRef = useRef<number>(0)

  const track = SYNTH_TRACKS[index]

  const ensureContext = useCallback(() => {
    if (ctxRef.current) return ctxRef.current
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const master = ctx.createGain()
    master.gain.value = volume
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = track.cutoff
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 64
    master.connect(filter)
    filter.connect(analyser)
    analyser.connect(ctx.destination)
    ctxRef.current = ctx
    masterRef.current = master
    analyserRef.current = analyser
    return ctx
  }, [track.cutoff, volume])

  const playNote = useCallback((semitones: number, durationSec: number, when: number) => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    const osc = ctx.createOscillator()
    osc.type = track.wave
    osc.frequency.value = NOTE_FREQ(semitones)
    const env = ctx.createGain()
    env.gain.value = 0
    env.gain.setValueAtTime(0, when)
    env.gain.linearRampToValueAtTime(0.5, when + 0.02)
    env.gain.exponentialRampToValueAtTime(0.0001, when + durationSec)
    osc.connect(env)
    env.connect(master)
    osc.start(when)
    osc.stop(when + durationSec + 0.05)
  }, [track.wave])

  const stopAll = useCallback(() => {
    if (beatTimerRef.current) {
      clearInterval(beatTimerRef.current)
      beatTimerRef.current = null
    }
    scheduledRef.current = []
  }, [])

  useEffect(() => {
    if (!playing) {
      stopAll()
      return
    }
    const ctx = ensureContext()
    if (ctx.state === 'suspended') ctx.resume()
    let step = 0
    const beatMs = 60_000 / track.bpm
    const stepMs = beatMs * track.noteLen
    let songSeconds = 0
    const tick = () => {
      const now = ctx.currentTime
      const semis = track.pattern[step % track.pattern.length]
      playNote(semis, track.noteLen * (60 / track.bpm), now)
      if (step % 2 === 0) {
        playNote(semis - 12, track.noteLen * (60 / track.bpm), now)
      }
      step++
      songSeconds += stepMs / 1000
      setPos(songSeconds)
    }
    tick()
    beatTimerRef.current = setInterval(tick, stepMs)
    return () => stopAll()
  }, [playing, track, ensureContext, playNote, stopAll])

  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = volume
  }, [volume])

  // Visualizer animation
  useEffect(() => {
    let raf = 0
    const data = new Uint8Array(32)
    const tick = () => {
      const analyser = analyserRef.current
      if (analyser) {
        analyser.getByteFrequencyData(data)
        const next: number[] = []
        for (let i = 0; i < 16; i++) {
          next.push(data[i * 2] / 255)
        }
        setBars(next)
      }
      visualTimerRef.current = raf
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    return () => {
      stopAll()
      ctxRef.current?.close()
    }
  }, [stopAll])

  const choose = (i: number) => {
    setIndex(i)
    setPos(0)
    if (!playing) setPlaying(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{
        aspectRatio: '1 / 1',
        background: 'linear-gradient(135deg, #f43f5e, #6d28d9)',
        borderRadius: 10,
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fff',
        padding: 22,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase' }}>Now Playing</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{track.title}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{track.vibe} · {track.bpm} bpm</div>
        </div>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 60, width: '100%' }}>
          {bars.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${5 + v * 100}%`,
                background: 'linear-gradient(180deg, #fff, rgba(255,255,255,0.4))',
                borderRadius: 2,
                transition: 'height 90ms ease',
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(100, (pos % 60) / 60 * 100)}%`, background: '#111' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280', marginTop: 4 }}>
          <span>{fmtTime(pos)}</span>
          <span>{playing ? 'live' : 'paused'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0' }}>
        <button onClick={() => choose((index - 1 + SYNTH_TRACKS.length) % SYNTH_TRACKS.length)}
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>⏮</button>
        <button onClick={() => setPlaying(!playing)}
          style={{ background: '#111', color: '#fff', border: 'none', width: 56, height: 56, borderRadius: '50%', fontSize: 22, cursor: 'pointer' }}>
          {playing ? '⏸' : '▶'}
        </button>
        <button onClick={() => choose((index + 1) % SYNTH_TRACKS.length)}
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>⏭</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
        <span>🔈</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span>🔊</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #d4d6da', overflow: 'hidden' }}>
        <div style={{ background: '#f7f8fa', padding: '8px 12px', fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Tracks</div>
        {SYNTH_TRACKS.map((t, i) => (
          <button
            key={i}
            onClick={() => choose(i)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              background: index === i ? '#eef2ff' : 'transparent',
              border: 'none',
              borderTop: i === 0 ? 'none' : '1px solid #f3f4f6',
              cursor: 'pointer',
              fontSize: 13,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{t.vibe}</div>
            </div>
            <span style={{ alignSelf: 'center', fontSize: 11, color: '#6b7280' }}>{t.bpm} bpm</span>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>
        Live Web Audio · no asset files
      </div>
    </div>
  )
}

/* ---------- Phone — speed dial ---------- */

export function PhoneContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ textAlign: 'center', padding: '20px 0 6px' }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4338ca, #0891b2)',
          color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38, fontWeight: 700, fontFamily: '-apple-system, Helvetica',
        }}>A</div>
        <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600 }}>{about.name}</div>
        <div style={{ color: '#6b7280', fontSize: 12 }}>{about.role}</div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d4d6da', overflow: 'hidden' }}>
        <DialRow
          icon="✉"
          label="Email"
          value="tomararman4@gmail.com"
          href="mailto:tomararman4@gmail.com"
          color="#1d4ed8"
        />
        <DialRow
          icon="◧"
          label="GitHub"
          value="@ArmanTomar4"
          href={about.github}
          color="#111"
        />
        <DialRow
          icon="in"
          label="LinkedIn"
          value="arman-tomar"
          href={about.linkedin}
          color="#0a66c2"
        />
      </div>
    </div>
  )
}

function DialRow({ icon, label, value, href, color }: { icon: string; label: string; value: string; href: string; color: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderTop: '1px solid #f3f4f6',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 700,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 14 }}>{value}</div>
      </div>
      <span style={{ color: '#1d4ed8', fontSize: 13 }}>›</span>
    </a>
  )
}
