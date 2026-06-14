'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { projects } from '@/data/projects'

/* ========== Photos ========== */

const PHOTO_PALETTE = [
  ['#fda4af', '#f43f5e'], ['#fdba74', '#ea580c'], ['#fde047', '#ca8a04'],
  ['#86efac', '#16a34a'], ['#67e8f9', '#0891b2'], ['#93c5fd', '#1d4ed8'],
  ['#c4b5fd', '#6d28d9'], ['#f0abfc', '#a21caf'], ['#fed7aa', '#b45309'],
]

export function PhotosContent() {
  const photos = projects.flatMap((p, i) => [
    { title: p.name, from: PHOTO_PALETTE[i % PHOTO_PALETTE.length][0], to: PHOTO_PALETTE[i % PHOTO_PALETTE.length][1], icon: 'hero' as const },
    { title: `${p.name} · mobile`, from: PHOTO_PALETTE[(i + 4) % PHOTO_PALETTE.length][0], to: PHOTO_PALETTE[(i + 4) % PHOTO_PALETTE.length][1], icon: 'mobile' as const },
  ])
  return (
    <div style={{ paddingBottom: 8 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Camera Roll</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {photos.map((p, i) => (
          <div key={i} style={{
            aspectRatio: '1/1', borderRadius: 4, background: `linear-gradient(135deg,${p.from},${p.to})`,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 4, color: '#fff',
            fontSize: 9, textAlign: 'center', textShadow: '0 1px 2px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden',
          }}>
            <FakePhotoSubject kind={p.icon} />
            <span style={{ position: 'relative', zIndex: 1 }}>{p.title}</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 14, fontSize: 11, color: '#6b7280', textAlign: 'center' }}>{photos.length} photos · sync&apos;d today</p>
    </div>
  )
}

function FakePhotoSubject({ kind }: { kind: 'hero' | 'mobile' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {kind === 'mobile'
        ? <div style={{ width: '34%', height: '60%', border: '2px solid rgba(255,255,255,0.6)', borderRadius: 6, background: 'rgba(255,255,255,0.15)' }} />
        : <div style={{ width: '70%', height: '50%', border: '2px solid rgba(255,255,255,0.55)', borderRadius: 4, background: 'rgba(255,255,255,0.1)' }} />}
    </div>
  )
}

/* ========== Camera ========== */

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
      if (stream) stream.getTracks().forEach(t => t.stop())
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing } })
      setStream(s)
      if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play() }
    } catch (err) { setError((err as Error)?.message || 'Camera unavailable') }
  }, [facing, stream])

  useEffect(() => { return () => { if (stream) stream.getTracks().forEach(t => t.stop()) } }, [stream])

  const capture = () => {
    if (!videoRef.current || !stream) return
    const v = videoRef.current, canvas = document.createElement('canvas')
    canvas.width = v.videoWidth; canvas.height = v.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (facing === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1) }
    ctx.drawImage(v, 0, 0)
    setShot(canvas.toDataURL('image/png'))
    setFlash(true); setTimeout(() => setFlash(false), 200)
  }

  const download = () => {
    if (!shot) return
    const a = document.createElement('a'); a.href = shot; a.download = `camera-${Date.now()}.png`; a.click()
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000', margin: -14, padding: 0 }}>
      <div style={{ flex: 1, position: 'relative', background: '#0a0a0a', overflow: 'hidden' }}>
        {shot ? <img src={shot} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: facing === 'user' ? 'scaleX(-1)' : 'none', background: '#000' }} />
        )}
        {!stream && !shot && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#fff', padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 36 }}>📷</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>Tap to enable the camera.</div>
            <button onClick={start} style={{ background: 'linear-gradient(180deg,#facc15,#f59e0b)', color: '#000', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5),0 2px 4px rgba(0,0,0,0.4)' }}>Enable camera</button>
            {error && <div style={{ color: '#fca5a5', fontSize: 11 }}>{error}</div>}
          </div>
        )}
        {flash && <div style={{ position: 'absolute', inset: 0, background: '#fff', animation: 'ios-flash 0.18s ease-out' }} />}
      </div>
      <div style={{ flex: 'none', height: 100, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        {shot ? <button onClick={download} style={camBtn('#1d4ed8')}>↓</button> : <div style={{ width: 40 }} />}
        {stream && !shot ? (
          <button onClick={capture} style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid #fff', background: '#fff', cursor: 'pointer', boxShadow: 'inset 0 0 0 4px #111' }} />
        ) : shot ? (
          <button onClick={() => setShot(null)} style={{ ...camBtn('#fff'), color: '#111', fontWeight: 700 }}>↺</button>
        ) : <div style={{ width: 64 }} />}
        {stream && !shot ? (
          <button onClick={() => setFacing(f => f === 'user' ? 'environment' : 'user')} style={camBtn('#374151')}>⇋</button>
        ) : <div style={{ width: 40 }} />}
      </div>
      <style jsx>{`@keyframes ios-flash { from { opacity:0.95 } to { opacity:0 } }`}</style>
    </div>
  )
}

function camBtn(color: string): React.CSSProperties {
  return { width: 40, height: 40, borderRadius: 6, background: color, border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }
}

/* ========== Weather ========== */

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

const DEFAULT_LOC = { lat: 26.2183, lon: 78.1828, name: 'Gwalior' }

export function WeatherContent() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [city, setCity] = useState(DEFAULT_LOC.name)
  const [error, setError] = useState<string | null>(null)
  const [cityInput, setCityInput] = useState('')

  const loadWeather = useCallback(async (lat: number, lon: number, name: string) => {
    setError(null)
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weather_code` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
        `&temperature_unit=celsius&timezone=auto&forecast_days=6`
      )
      if (!res.ok) throw new Error('fetch failed')
      const json = await res.json()
      const nowHour = new Date().getHours()
      setData({
        current: { temp: Math.round(json.current.temperature_2m), code: json.current.weather_code },
        hourly: (json.hourly?.time ?? []).slice(nowHour, nowHour + 6).map((t: string, i: number) => ({
          time: new Date(t).toLocaleTimeString([], { hour: 'numeric' }),
          temp: Math.round(json.hourly.temperature_2m[nowHour + i]),
          code: json.hourly.weather_code[nowHour + i],
        })),
        daily: (json.daily?.time ?? []).map((t: string, i: number) => ({
          day: new Date(t).toLocaleDateString([], { weekday: 'short' }),
          max: Math.round(json.daily.temperature_2m_max[i]),
          min: Math.round(json.daily.temperature_2m_min[i]),
          code: json.daily.weather_code[i],
        })),
      })
      setCity(name)
    } catch { setError('Could not load forecast') }
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&zoom=10`, { headers: { 'Accept-Language': 'en' } })
            const j = await r.json()
            const name = j.address?.city || j.address?.town || j.address?.village || j.address?.state || 'Your location'
            loadWeather(pos.coords.latitude, pos.coords.longitude, name)
          } catch { loadWeather(pos.coords.latitude, pos.coords.longitude, 'Your location') }
        },
        () => loadWeather(DEFAULT_LOC.lat, DEFAULT_LOC.lon, DEFAULT_LOC.name),
        { timeout: 4000 }
      )
    } else { loadWeather(DEFAULT_LOC.lat, DEFAULT_LOC.lon, DEFAULT_LOC.name) }
  }, [loadWeather])

  const searchCity = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = cityInput.trim()
    if (!q) return
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`, { headers: { 'Accept-Language': 'en' } })
      const results = await r.json()
      if (results.length > 0) await loadWeather(parseFloat(results[0].lat), parseFloat(results[0].lon), results[0].display_name.split(',')[0])
    } catch { /* ignore */ }
    setCityInput('')
  }

  const hour = new Date().getHours()
  const isNight = hour < 6 || hour > 19
  const wmo = (code: number) => WMO[code] ?? WMO[3]
  const current = data?.current
  const condition = current ? wmo(current.code) : null

  return (
    <div style={{
      margin: -14, padding: 18, minHeight: '100%',
      background: isNight ? 'linear-gradient(180deg,#0f172a 0%,#1e293b 60%,#334155 100%)' : 'linear-gradient(180deg,#38bdf8 0%,#60a5fa 60%,#a5b4fc 100%)',
      color: '#fff', display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 300, letterSpacing: 0.5 }}>{city}</div>
        {data ? (
          <>
            <div style={{ fontSize: 84, fontWeight: 200, lineHeight: 1, marginTop: 8 }}>{current!.temp}°</div>
            <div style={{ fontSize: 14, opacity: 0.92 }}>{isNight ? condition?.night : condition?.icon} {condition?.label}</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>H: {data.daily[0]?.max}° L: {data.daily[0]?.min}°</div>
          </>
        ) : (
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 30 }}>{error || 'fetching live forecast…'}</div>
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
      <form onSubmit={searchCity} style={{ display: 'flex', gap: 6 }}>
        <input value={cityInput} onChange={e => setCityInput(e.target.value)} placeholder="Search city…"
          style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', fontSize: 13, background: 'rgba(255,255,255,0.2)', color: '#fff', outline: 'none' }} />
        <button type="submit" style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Go</button>
      </form>
    </div>
  )
}

function panelStyle(): React.CSSProperties {
  return { background: 'rgba(0,0,0,0.18)', borderRadius: 10, padding: 12, border: '1px solid rgba(255,255,255,0.18)', display: 'flex', justifyContent: 'space-between' }
}

/* ========== Calendar ========== */

interface CalEvent {
  id: string
  date: string
  time: string
  title: string
  color: string
}

const CAL_COLORS = ['#dc2626', '#0ea5e9', '#22c55e', '#f59e0b', '#a855f7', '#ec4899']
const dateFmt = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

export function CalendarContent() {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(dateFmt(today.getFullYear(), today.getMonth(), today.getDate()))
  const [events, setEvents] = useState<CalEvent[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTime, setNewTime] = useState('12:00')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('ios-calendar-events')
    if (s) { try { setEvents(JSON.parse(s)) } catch { /* ignore */ } }
    setLoaded(true)
  }, [])

  useEffect(() => { if (loaded) localStorage.setItem('ios-calendar-events', JSON.stringify(events)) }, [events, loaded])

  const year = viewDate.getFullYear(), month = viewDate.getMonth()
  const monthName = viewDate.toLocaleString('en-US', { month: 'long' })
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = dateFmt(today.getFullYear(), today.getMonth(), today.getDate())

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const dayEvents = events.filter(e => e.date === selected)

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setEvents(prev => [...prev, { id: Date.now().toString(), date: selected, time: newTime, title: newTitle.trim(), color: CAL_COLORS[Math.floor(Math.random() * CAL_COLORS.length)] }])
    setNewTitle(''); setShowAdd(false)
  }

  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id))

  const prevMonth = () => { const d = new Date(year, month - 1, 1); setViewDate(d); setSelected(dateFmt(d.getFullYear(), d.getMonth(), 1)) }
  const nextMonth = () => { const d = new Date(year, month + 1, 1); setViewDate(d); setSelected(dateFmt(d.getFullYear(), d.getMonth(), 1)) }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#dc2626' }}>‹</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' }}>{monthName}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{year}</div>
        </div>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#dc2626' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 12 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, color: '#6b7280', textTransform: 'uppercase' }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />
          const ds = dateFmt(year, month, d)
          const isToday = ds === todayStr
          const isSel = ds === selected
          const hasEv = events.some(e => e.date === ds)
          return (
            <button key={i} onClick={() => setSelected(ds)} style={{
              aspectRatio: '1/1', border: 'none', background: isSel ? '#dc2626' : isToday ? '#fee2e2' : 'transparent',
              color: isSel ? '#fff' : '#111', borderRadius: '50%', fontSize: 13, cursor: 'pointer', position: 'relative', fontWeight: isToday ? 700 : 400,
            }}>
              {d}
              {hasEv && <span style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: isSel ? '#fff' : '#dc2626' }} />}
            </button>
          )
        })}
      </div>
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #d4d6da', overflow: 'hidden' }}>
        <div style={{ background: '#f7f8fa', padding: '8px 12px', fontWeight: 700, fontSize: 13, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{new Date(selected + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
          <button onClick={() => setShowAdd(!showAdd)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 18, cursor: 'pointer', fontWeight: 700 }}>+</button>
        </div>
        {showAdd && (
          <form onSubmit={addEvent} style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 6, alignItems: 'center' }}>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Event title" style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #d4d6da', fontSize: 13 }} />
            <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={{ padding: '6px 4px', borderRadius: 6, border: '1px solid #d4d6da', fontSize: 13 }} />
            <button type="submit" style={{ padding: '6px 10px', borderRadius: 6, background: '#dc2626', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Add</button>
          </form>
        )}
        {dayEvents.length === 0 && !showAdd ? (
          <div style={{ padding: 14, fontSize: 12, color: '#6b7280', textAlign: 'center' }}>No events</div>
        ) : dayEvents.sort((a, b) => a.time.localeCompare(b.time)).map((ev, i) => (
          <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: i === 0 && !showAdd ? 'none' : '1px solid #f3f4f6' }}>
            <div style={{ width: 4, height: 24, background: ev.color, borderRadius: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{ev.title}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{ev.time}</div>
            </div>
            <button onClick={() => deleteEvent(ev.id)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 14, cursor: 'pointer' }}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== Mail ========== */

export function MailContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#fff', border: '1px solid #d4d6da', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Send Arman a note</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Goes straight to the guestbook. He&apos;ll see it next time he opens Outlook.</div>
        <a href="mailto:tomararman4@gmail.com?subject=From%20your%20portfolio&body=Hi%20Arman%2C%0A%0A"
          style={{ display: 'block', textAlign: 'center', padding: '10px 14px', borderRadius: 8, background: 'linear-gradient(180deg,#3b82f6,#1d4ed8)', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
          Compose email
        </a>
      </div>
      <RealMessagesList compact />
    </div>
  )
}

/* ========== Messages ========== */

interface GuestbookMessage { name: string; message: string; timestamp: string }

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
    } catch { setMessages([]) }
  }, [])

  useEffect(() => { load() }, [load])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setStatus('sending'); setError('')
    try {
      const res = await fetch('/api/guestbook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim() || 'visitor', message: text.trim() }) })
      if (!res.ok) throw new Error('Could not send')
      setText(''); setStatus('idle'); await load()
    } catch (err) { setStatus('error'); setError((err as Error).message) }
  }

  const shown = messages?.slice(0, compact ? 4 : 30) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {!compact && <div style={{ color: '#6b7280', fontSize: 12, textAlign: 'center' }}>Leave a message</div>}
      {shown === null && <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 12 }}>Loading…</div>}
      {shown && shown.length === 0 && <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 12 }}>No messages yet. Be the first.</div>}
      {shown && shown.map((m, i) => {
        const right = (m.name.charCodeAt(0) + i) % 2 === 0
        return (
          <div key={i} style={{
            alignSelf: right ? 'flex-end' : 'flex-start', maxWidth: '78%', padding: '8px 12px', borderRadius: 16,
            background: right ? '#34c759' : '#e5e7eb', color: right ? '#fff' : '#111', fontSize: 14, lineHeight: 1.35,
          }}>
            <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{m.name}</div>
            {m.message}
          </div>
        )
      })}
      {!compact && (
        <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="your name (optional)"
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d4d6da', fontSize: 13, background: '#fff' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={text} onChange={e => setText(e.target.value)} placeholder="leave a message…"
              style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #d4d6da', fontSize: 13, background: '#fff' }} />
            <button type="submit" disabled={status === 'sending' || !text.trim()} style={{
              padding: '8px 14px', borderRadius: 8, background: '#1d4ed8', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700,
              opacity: status === 'sending' || !text.trim() ? 0.6 : 1, cursor: 'pointer',
            }}>Send</button>
          </div>
          {error && <div style={{ color: '#dc2626', fontSize: 11 }}>{error}</div>}
        </form>
      )}
    </div>
  )
}

export function MessagesContent() { return <RealMessagesList /> }

/* ========== App Store ========== */

const STORE_APPS = [
  { name: 'Instagram', cat: 'Photo & Video', color: '#C13584', rating: 4.7 },
  { name: 'WhatsApp', cat: 'Social Networking', color: '#25D366', rating: 4.8 },
  { name: 'Spotify', cat: 'Music', color: '#1DB954', rating: 4.8 },
  { name: 'YouTube', cat: 'Entertainment', color: '#FF0000', rating: 4.7 },
  { name: 'TikTok', cat: 'Entertainment', color: '#010101', rating: 4.6 },
  { name: 'Snapchat', cat: 'Social', color: '#FFFC00', rating: 4.2 },
  { name: 'Netflix', cat: 'Entertainment', color: '#E50914', rating: 4.5 },
  { name: 'Discord', cat: 'Social', color: '#5865F2', rating: 4.7 },
  { name: 'Uber', cat: 'Travel', color: '#000', rating: 4.3 },
  { name: 'Amazon', cat: 'Shopping', color: '#FF9900', rating: 4.6 },
]

export function AppStoreContent() {
  const [installed, setInstalled] = useState<Set<string>>(new Set())
  const toggle = (n: string) => setInstalled(prev => { const s = new Set(prev); if (s.has(n)) s.delete(n); else s.add(n); return s })

  return (
    <div>
      <div style={{
        borderRadius: 12, padding: 18, marginBottom: 16,
        background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff',
      }}>
        <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase' }}>App of the Day</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Spotify</div>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>Music for everyone</div>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Top Free</div>
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #d4d6da', overflow: 'hidden' }}>
        {STORE_APPS.map((app, i) => (
          <div key={app.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderTop: i === 0 ? 'none' : '1px solid #f3f4f6' }}>
            <div style={{ fontSize: 12, color: '#9ca3af', width: 16 }}>{i + 1}</div>
            <div style={{
              width: 42, height: 42, borderRadius: 10, background: app.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, flex: 'none',
            }}>{app.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{app.cat} · ★ {app.rating}</div>
            </div>
            <button onClick={() => toggle(app.name)} style={{
              padding: '5px 14px', borderRadius: 14, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: installed.has(app.name) ? '#e5e7eb' : '#007AFF', color: installed.has(app.name) ? '#374151' : '#fff',
            }}>{installed.has(app.name) ? 'OPEN' : 'GET'}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== Music ========== */

interface SynthTrack {
  title: string; vibe: string; bpm: number; pattern: number[]; noteLen: number; wave: OscillatorType; cutoff: number
}

const NOTE_FREQ = (s: number) => 261.63 * Math.pow(2, s / 12)

const SYNTH_TRACKS: SynthTrack[] = [
  { title: 'Video Games',         vibe: 'dreamy ballad',     bpm: 72,  pattern: [0, 4, 7, 12, 11, 7, 4, 0],  noteLen: 0.5, wave: 'triangle', cutoff: 1200 },
  { title: 'Summertime Sadness',  vibe: 'melancholic pop',   bpm: 108, pattern: [0, 3, 7, 10, 12, 10, 7, 3], noteLen: 0.25, wave: 'sine', cutoff: 1800 },
  { title: 'Young and Beautiful', vibe: 'orchestral dream',  bpm: 68,  pattern: [0, 4, 7, 11, 12, 11, 7, 4], noteLen: 0.5, wave: 'triangle', cutoff: 1400 },
  { title: 'Born to Die',         vibe: 'cinematic strings', bpm: 82,  pattern: [0, 3, 7, 12, 15, 12, 7, 3], noteLen: 0.5, wave: 'sawtooth', cutoff: 1100 },
  { title: 'West Coast',          vibe: 'surf noir',         bpm: 100, pattern: [0, 5, 7, 10, 12, 10, 7, 5], noteLen: 0.25, wave: 'square', cutoff: 1600 },
  { title: 'Blue Jeans',          vibe: 'retro nostalgia',   bpm: 76,  pattern: [0, 4, 7, 12, 7, 4, 0, -5],  noteLen: 0.5, wave: 'sine', cutoff: 1300 },
]

function fmtTime(sec: number) { return `${Math.floor(sec / 60)}:${(Math.floor(sec) % 60).toString().padStart(2, '0')}` }

export function MusicContent() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [pos, setPos] = useState(0)
  const [bars, setBars] = useState<number[]>(Array(16).fill(0))

  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const beatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const track = SYNTH_TRACKS[index]

  const ensureContext = useCallback(() => {
    if (ctxRef.current) return ctxRef.current
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const master = ctx.createGain(); master.gain.value = volume
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = track.cutoff
    const analyser = ctx.createAnalyser(); analyser.fftSize = 64
    master.connect(filter); filter.connect(analyser); analyser.connect(ctx.destination)
    ctxRef.current = ctx; masterRef.current = master; analyserRef.current = analyser
    return ctx
  }, [track.cutoff, volume])

  const playNote = useCallback((semitones: number, dur: number, when: number) => {
    const ctx = ctxRef.current, master = masterRef.current
    if (!ctx || !master) return
    const osc = ctx.createOscillator(); osc.type = track.wave; osc.frequency.value = NOTE_FREQ(semitones)
    const env = ctx.createGain(); env.gain.value = 0
    env.gain.setValueAtTime(0, when); env.gain.linearRampToValueAtTime(0.5, when + 0.02); env.gain.exponentialRampToValueAtTime(0.0001, when + dur)
    osc.connect(env); env.connect(master); osc.start(when); osc.stop(when + dur + 0.05)
  }, [track.wave])

  const stopAll = useCallback(() => {
    if (beatTimerRef.current) { clearInterval(beatTimerRef.current); beatTimerRef.current = null }
  }, [])

  useEffect(() => {
    if (!playing) { stopAll(); return }
    const ctx = ensureContext()
    if (ctx.state === 'suspended') ctx.resume()
    let step = 0; const stepMs = (60_000 / track.bpm) * track.noteLen; let songSec = 0
    const tick = () => {
      const now = ctx.currentTime, semis = track.pattern[step % track.pattern.length]
      playNote(semis, track.noteLen * (60 / track.bpm), now)
      if (step % 2 === 0) playNote(semis - 12, track.noteLen * (60 / track.bpm), now)
      step++; songSec += stepMs / 1000; setPos(songSec)
    }
    tick(); beatTimerRef.current = setInterval(tick, stepMs)
    return () => stopAll()
  }, [playing, track, ensureContext, playNote, stopAll])

  useEffect(() => { if (masterRef.current) masterRef.current.gain.value = volume }, [volume])

  useEffect(() => {
    let raf = 0; const data = new Uint8Array(32)
    const tick = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(data)
        const next: number[] = []; for (let i = 0; i < 16; i++) next.push(data[i * 2] / 255)
        setBars(next)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => { return () => { stopAll(); ctxRef.current?.close() } }, [stopAll])

  const choose = (i: number) => { setIndex(i); setPos(0); if (!playing) setPlaying(true) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{
        aspectRatio: '1/1', background: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
        borderRadius: 10, boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', color: '#fff', padding: 22,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase' }}>Now Playing</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{track.title}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Lana Del Rey · {track.vibe}</div>
        </div>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 60, width: '100%' }}>
          {bars.map((v, i) => (
            <div key={i} style={{ flex: 1, height: `${5 + v * 100}%`, background: 'linear-gradient(180deg,#e8b4b8,rgba(232,180,184,0.4))', borderRadius: 2, transition: 'height 90ms ease' }} />
          ))}
        </div>
      </div>
      <div>
        <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(100, (pos % 60) / 60 * 100)}%`, background: '#111' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280', marginTop: 4 }}>
          <span>{fmtTime(pos)}</span><span>{playing ? 'live' : 'paused'}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0' }}>
        <button onClick={() => choose((index - 1 + SYNTH_TRACKS.length) % SYNTH_TRACKS.length)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>⏮</button>
        <button onClick={() => setPlaying(!playing)} style={{ background: '#111', color: '#fff', border: 'none', width: 56, height: 56, borderRadius: '50%', fontSize: 22, cursor: 'pointer' }}>{playing ? '⏸' : '▶'}</button>
        <button onClick={() => choose((index + 1) % SYNTH_TRACKS.length)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>⏭</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
        <span>🔈</span>
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ flex: 1 }} />
        <span>🔊</span>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #d4d6da', overflow: 'hidden' }}>
        <div style={{ background: '#f7f8fa', padding: '8px 12px', fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Tracks</div>
        {SYNTH_TRACKS.map((t, i) => (
          <button key={i} onClick={() => choose(i)} style={{
            width: '100%', textAlign: 'left', padding: '8px 12px', background: index === i ? '#eef2ff' : 'transparent',
            border: 'none', borderTop: i === 0 ? 'none' : '1px solid #f3f4f6', cursor: 'pointer', fontSize: 13, display: 'flex', justifyContent: 'space-between',
          }}>
            <div><div style={{ fontWeight: 600 }}>{t.title}</div><div style={{ fontSize: 11, color: '#6b7280' }}>{t.vibe}</div></div>
            <span style={{ alignSelf: 'center', fontSize: 11, color: '#6b7280' }}>{t.bpm} bpm</span>
          </button>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>Live Web Audio synthesis</div>
    </div>
  )
}

/* ========== Phone ========== */

const CALL_LOG: { name: string; sub: string; time: string; type: 'incoming' | 'outgoing' | 'missed' }[] = [
  { name: 'Lana Del Rey', sub: 'side chick ❤️', time: 'Today, 11:42 PM', type: 'incoming' },
  { name: 'Elon Musk', sub: 'mobile', time: 'Today, 6:30 PM', type: 'outgoing' },
  { name: 'Mom ❤️', sub: 'home', time: 'Yesterday', type: 'incoming' },
  { name: 'Lana Del Rey', sub: 'side chick ❤️', time: 'Yesterday, 10:15 PM', type: 'outgoing' },
  { name: 'Elon Musk', sub: 'mobile', time: 'Monday', type: 'missed' },
  { name: 'Dad', sub: 'mobile', time: 'Sunday', type: 'incoming' },
  { name: 'Domino\'s Pizza', sub: 'delivery', time: 'Sunday', type: 'outgoing' },
  { name: 'Lana Del Rey', sub: 'side chick ❤️', time: 'Saturday, 1:30 AM', type: 'incoming' },
  { name: 'Unknown', sub: '+1 (555) 019-2847', time: 'Saturday', type: 'missed' },
  { name: 'Elon Musk', sub: 'mobile', time: 'Friday', type: 'incoming' },
  { name: 'Lana Del Rey', sub: 'side chick ❤️', time: 'Thursday, 11:58 PM', type: 'outgoing' },
  { name: 'Jeff Bezos', sub: 'work', time: 'Thursday', type: 'missed' },
  { name: 'Mom ❤️', sub: 'home', time: 'Wednesday', type: 'incoming' },
  { name: 'Lana Del Rey', sub: 'side chick ❤️', time: 'Wednesday, 9:30 PM', type: 'incoming' },
]

const PHONE_TABS = ['Favorites', 'Recents', 'Contacts', 'Keypad', 'Voicemail']

export function PhoneContent() {
  const [tab, setTab] = useState<'all' | 'missed'>('all')
  const shown = tab === 'all' ? CALL_LOG : CALL_LOG.filter(c => c.type === 'missed')

  const callIcon = (type: string) => {
    if (type === 'incoming') return '↙'
    if (type === 'outgoing') return '↗'
    return '✕'
  }

  const initials = (name: string) => {
    const parts = name.split(' ')
    return parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)
  }

  return (
    <div style={{ margin: -14, minHeight: 'calc(100% + 28px)', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 14px 8px', display: 'flex', gap: 0, background: '#1c1c1e', borderBottom: '1px solid #38383a' }}>
        {(['all', 'missed'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '6px 0', border: '1px solid #48484a', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: tab === t ? '#48484a' : 'transparent', color: tab === t ? '#fff' : '#8e8e93',
            borderRadius: t === 'all' ? '6px 0 0 6px' : '0 6px 6px 0',
          }}>{t === 'all' ? 'All' : 'Missed'}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {shown.map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flex: 'none',
              background: c.type === 'missed' ? '#3a1c1c' : 'linear-gradient(135deg,#2c2c2e,#48484a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: c.type === 'missed' ? '#ef4444' : '#8e8e93',
            }}>{initials(c.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: c.type === 'missed' ? '#ef4444' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.name}
              </div>
              <div style={{ fontSize: 12, color: '#8e8e93', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: c.type === 'missed' ? '#ef4444' : c.type === 'incoming' ? '#30d158' : '#8e8e93' }}>{callIcon(c.type)}</span>
                {c.sub}
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#8e8e93', flex: 'none' }}>{c.time.split(', ').pop()}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 'none', display: 'flex', borderTop: '1px solid #38383a', background: '#1c1c1e', padding: '6px 0 2px' }}>
        {PHONE_TABS.map((t, i) => (
          <div key={t} style={{
            flex: 1, textAlign: 'center', fontSize: 9, color: i === 1 ? '#007AFF' : '#8e8e93', padding: '4px 0', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 18, marginBottom: 1 }}>
              {['★', '⏱', '👤', '⌨', '⊙'][i]}
            </div>
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== 2048 ========== */

type Board2048 = number[][]

const TILE_COLORS_2048: Record<number, { bg: string; fg: string }> = {
  0:    { bg: 'rgba(238,228,218,0.35)', fg: '#776e65' },
  2:    { bg: '#eee4da', fg: '#776e65' },
  4:    { bg: '#ede0c8', fg: '#776e65' },
  8:    { bg: '#f2b179', fg: '#f9f6f2' },
  16:   { bg: '#f59563', fg: '#f9f6f2' },
  32:   { bg: '#f67c5f', fg: '#f9f6f2' },
  64:   { bg: '#f65e3b', fg: '#f9f6f2' },
  128:  { bg: '#edcf72', fg: '#f9f6f2' },
  256:  { bg: '#edcc61', fg: '#f9f6f2' },
  512:  { bg: '#edc850', fg: '#f9f6f2' },
  1024: { bg: '#edc53f', fg: '#f9f6f2' },
  2048: { bg: '#edc22e', fg: '#f9f6f2' },
  4096: { bg: '#3c3a32', fg: '#f9f6f2' },
}

const emptyBoard2048 = (): Board2048 => Array.from({ length: 4 }, () => Array(4).fill(0))
const cloneBoard = (b: Board2048): Board2048 => b.map(r => [...r])

function addRandomTile(b: Board2048): Board2048 {
  const empties: [number, number][] = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (b[r][c] === 0) empties.push([r, c])
  if (empties.length === 0) return b
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  const v = Math.random() < 0.9 ? 2 : 4
  const nb = cloneBoard(b)
  nb[r][c] = v
  return nb
}

function slideLeft(row: number[]): { row: number[]; gained: number } {
  const filtered = row.filter(v => v !== 0)
  let gained = 0
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2
      gained += filtered[i]
      filtered.splice(i + 1, 1)
    }
  }
  while (filtered.length < 4) filtered.push(0)
  return { row: filtered, gained }
}

function move2048(b: Board2048, dir: 'left' | 'right' | 'up' | 'down'): { board: Board2048; gained: number; moved: boolean } {
  let nb = cloneBoard(b)
  let gained = 0
  if (dir === 'right') nb = nb.map(r => r.slice().reverse())
  if (dir === 'up' || dir === 'down') {
    const t = emptyBoard2048()
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) t[c][r] = nb[r][c]
    nb = t
    if (dir === 'down') nb = nb.map(r => r.slice().reverse())
  }
  nb = nb.map(r => { const s = slideLeft(r); gained += s.gained; return s.row })
  if (dir === 'right') nb = nb.map(r => r.slice().reverse())
  if (dir === 'up' || dir === 'down') {
    if (dir === 'down') nb = nb.map(r => r.slice().reverse())
    const t = emptyBoard2048()
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) t[c][r] = nb[r][c]
    nb = t
  }
  const moved = JSON.stringify(nb) !== JSON.stringify(b)
  return { board: nb, gained, moved }
}

function hasMoves2048(b: Board2048): boolean {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (b[r][c] === 0) return true
    if (c < 3 && b[r][c] === b[r][c + 1]) return true
    if (r < 3 && b[r][c] === b[r + 1][c]) return true
  }
  return false
}

export function Game2048Content() {
  const [board, setBoard] = useState<Board2048>(() => addRandomTile(addRandomTile(emptyBoard2048())))
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [over, setOver] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const b = Number(localStorage.getItem('ios-2048-best') || 0)
    setBest(b)
  }, [])

  useEffect(() => {
    if (score > best) {
      setBest(score)
      localStorage.setItem('ios-2048-best', String(score))
    }
  }, [score, best])

  const apply = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    if (over) return
    const { board: nb, gained, moved } = move2048(board, dir)
    if (!moved) return
    const withTile = addRandomTile(nb)
    setBoard(withTile)
    setScore(s => s + gained)
    if (!hasMoves2048(withTile)) setOver(true)
  }, [board, over])

  const reset = () => {
    setBoard(addRandomTile(addRandomTile(emptyBoard2048())))
    setScore(0)
    setOver(false)
  }

  const handleStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const handleEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return
    if (Math.abs(dx) > Math.abs(dy)) apply(dx > 0 ? 'right' : 'left')
    else apply(dy > 0 ? 'down' : 'up')
    touchStart.current = null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div>
          <div style={{ fontSize: 11, color: '#776e65', textTransform: 'uppercase', fontWeight: 700 }}>Score</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#776e65' }}>{score}</div>
        </div>
        <div style={{ background: '#bbada0', padding: '6px 12px', borderRadius: 4, color: '#fff' }}>
          <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.9 }}>Best</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{best}</div>
        </div>
        <button onClick={reset} style={{
          background: '#8f7a66', color: '#f9f6f2', border: 'none', padding: '8px 14px', borderRadius: 4,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>New Game</button>
      </div>
      <div
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        style={{
          background: '#bbada0', padding: 8, borderRadius: 6, aspectRatio: '1/1', position: 'relative',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 8,
          touchAction: 'none',
        }}
      >
        {board.flatMap((row, ri) => row.map((cell, ci) => {
          const c = TILE_COLORS_2048[cell] || TILE_COLORS_2048[4096]
          return (
            <div key={`${ri}-${ci}`} style={{
              background: c.bg, color: c.fg, borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: cell >= 1024 ? 18 : cell >= 128 ? 22 : 26, fontWeight: 800,
              transition: 'background 120ms',
            }}>
              {cell !== 0 ? cell : ''}
            </div>
          )
        }))}
        {over && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(238,228,218,0.73)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderRadius: 6, gap: 10,
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#776e65' }}>Game Over</div>
            <button onClick={reset} style={{
              background: '#8f7a66', color: '#f9f6f2', border: 'none', padding: '10px 18px', borderRadius: 4,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Try Again</button>
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 6, maxWidth: 220, margin: '0 auto', width: '100%' }}>
        <div />
        <button onClick={() => apply('up')} style={arrowBtn}>▲</button>
        <div />
        <button onClick={() => apply('left')} style={arrowBtn}>◀</button>
        <button onClick={() => apply('down')} style={arrowBtn}>▼</button>
        <button onClick={() => apply('right')} style={arrowBtn}>▶</button>
      </div>
      <div style={{ fontSize: 11, textAlign: 'center', color: '#776e65' }}>
        Swipe on the board or tap arrows. Join the tiles to reach <b>2048</b>!
      </div>
    </div>
  )
}

const arrowBtn: React.CSSProperties = {
  background: '#bbada0', color: '#fff', border: 'none', borderRadius: 6,
  padding: '10px 0', fontSize: 18, fontWeight: 700, cursor: 'pointer',
}

/* ========== Flappy Bird ========== */

export function FlappyContent() {
  const W = 280, H = 380
  const GRAVITY = 0.45, FLAP = -7.2, PIPE_W = 50, GAP = 110, PIPE_SPEED = 2
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [over, setOver] = useState(false)
  const [bird, setBird] = useState({ y: H / 2, vy: 0 })
  const [pipes, setPipes] = useState<{ x: number; topH: number; passed: boolean }[]>([])
  const rafRef = useRef<number>(0)
  const birdRef = useRef(bird)
  const pipesRef = useRef(pipes)
  birdRef.current = bird
  pipesRef.current = pipes

  useEffect(() => {
    const b = Number(localStorage.getItem('ios-flappy-best') || 0)
    setBest(b)
  }, [])

  const reset = useCallback(() => {
    setBird({ y: H / 2, vy: 0 })
    setPipes([{ x: W + 50, topH: 80 + Math.random() * 150, passed: false }])
    setScore(0)
    setOver(false)
  }, [])

  const flap = () => {
    if (over) { reset(); setRunning(true); return }
    if (!running) { reset(); setRunning(true); return }
    setBird(b => ({ ...b, vy: FLAP }))
  }

  useEffect(() => {
    if (!running) return
    const tick = () => {
      setBird(b => {
        const ny = b.y + b.vy + GRAVITY
        return { y: ny, vy: b.vy + GRAVITY }
      })
      setPipes(ps => {
        let next = ps.map(p => ({ ...p, x: p.x - PIPE_SPEED }))
        next = next.filter(p => p.x > -PIPE_W)
        const last = next[next.length - 1]
        if (!last || last.x < W - 160) {
          next.push({ x: W + 20, topH: 60 + Math.random() * 180, passed: false })
        }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, reset])

  useEffect(() => {
    if (!running) return
    const b = birdRef.current
    if (b.y < 0 || b.y > H - 20) {
      setRunning(false); setOver(true)
      if (score > best) { setBest(score); localStorage.setItem('ios-flappy-best', String(score)) }
      return
    }
    const newPipes = pipesRef.current.map(p => ({ ...p }))
    let scoreAdd = 0
    for (const p of newPipes) {
      const birdX = 60
      if (p.x < birdX + 16 && p.x + PIPE_W > birdX - 16) {
        if (b.y < p.topH || b.y > p.topH + GAP) {
          setRunning(false); setOver(true)
          if (score > best) { setBest(score); localStorage.setItem('ios-flappy-best', String(score)) }
          return
        }
      }
      if (!p.passed && p.x + PIPE_W < 60) {
        p.passed = true
        scoreAdd++
      }
    }
    if (scoreAdd > 0) {
      setScore(s => s + scoreAdd)
      setPipes(newPipes)
    }
  }, [bird, pipes, running, score, best])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', fontSize: 12 }}>
        <div><b>Score:</b> {score}</div>
        <div><b>Best:</b> {best}</div>
      </div>
      <div
        onClick={flap}
        style={{
          width: W, height: H, background: 'linear-gradient(180deg,#70c5ce 0%,#a3e0e6 80%,#ded895 80%,#ded895 100%)',
          position: 'relative', overflow: 'hidden', borderRadius: 8, cursor: 'pointer',
          boxShadow: 'inset 0 -8px 0 #5a8939',
          border: '2px solid #1d5a72',
          userSelect: 'none', touchAction: 'manipulation',
        }}
      >
        {pipes.map((p, i) => (
          <div key={i}>
            <div style={{ position: 'absolute', left: p.x, top: 0, width: PIPE_W, height: p.topH, background: '#5a8939', border: '2px solid #2d5016', borderBottom: 'none' }} />
            <div style={{ position: 'absolute', left: p.x - 2, top: p.topH - 12, width: PIPE_W + 4, height: 12, background: '#73a948', border: '2px solid #2d5016' }} />
            <div style={{ position: 'absolute', left: p.x, top: p.topH + GAP, width: PIPE_W, height: H - p.topH - GAP, background: '#5a8939', border: '2px solid #2d5016', borderTop: 'none' }} />
            <div style={{ position: 'absolute', left: p.x - 2, top: p.topH + GAP, width: PIPE_W + 4, height: 12, background: '#73a948', border: '2px solid #2d5016' }} />
          </div>
        ))}
        <div style={{
          position: 'absolute', left: 60 - 16, top: bird.y - 12, width: 32, height: 24,
          background: '#fbe34d', borderRadius: '50% 50% 45% 45%', border: '2px solid #000',
          transform: `rotate(${Math.max(-30, Math.min(70, bird.vy * 5))}deg)`,
          transition: 'transform 60ms',
          boxShadow: 'inset -4px -3px 0 #f59e0b',
        }}>
          <div style={{ position: 'absolute', right: 4, top: 5, width: 6, height: 6, background: '#fff', borderRadius: '50%', border: '1px solid #000' }}>
            <div style={{ position: 'absolute', right: 0, top: 1, width: 3, height: 3, background: '#000', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', right: -6, top: 9, width: 8, height: 4, background: '#f97316', border: '1px solid #000', clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
        </div>
        {(!running || over) && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#fff', textAlign: 'center', gap: 8,
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, textShadow: '2px 2px 0 #000' }}>
              {over ? 'Game Over' : 'Tap to Fly'}
            </div>
            <div style={{ fontSize: 13 }}>
              {over ? `Score: ${score} · Tap to retry` : 'Avoid the pipes!'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ========== Minesweeper ========== */

type MSCell = { mine: boolean; revealed: boolean; flagged: boolean; adj: number }
const MS_ROWS = 10, MS_COLS = 8, MS_MINES = 12

function newMSBoard(): MSCell[][] {
  const b: MSCell[][] = Array.from({ length: MS_ROWS }, () =>
    Array.from({ length: MS_COLS }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 }))
  )
  let placed = 0
  while (placed < MS_MINES) {
    const r = Math.floor(Math.random() * MS_ROWS)
    const c = Math.floor(Math.random() * MS_COLS)
    if (!b[r][c].mine) { b[r][c].mine = true; placed++ }
  }
  for (let r = 0; r < MS_ROWS; r++) for (let c = 0; c < MS_COLS; c++) {
    if (b[r][c].mine) continue
    let n = 0
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= MS_ROWS || nc < 0 || nc >= MS_COLS) continue
      if (b[nr][nc].mine) n++
    }
    b[r][c].adj = n
  }
  return b
}

function floodReveal(b: MSCell[][], r: number, c: number): MSCell[][] {
  const nb = b.map(row => row.map(cell => ({ ...cell })))
  const stack: [number, number][] = [[r, c]]
  while (stack.length) {
    const [cr, cc] = stack.pop()!
    if (cr < 0 || cr >= MS_ROWS || cc < 0 || cc >= MS_COLS) continue
    const cell = nb[cr][cc]
    if (cell.revealed || cell.flagged) continue
    cell.revealed = true
    if (cell.adj === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        stack.push([cr + dr, cc + dc])
      }
    }
  }
  return nb
}

export function MinesweeperContent() {
  const [board, setBoard] = useState<MSCell[][]>(() => newMSBoard())
  const [over, setOver] = useState(false)
  const [won, setWon] = useState(false)
  const [flagMode, setFlagMode] = useState(false)
  const [time, setTime] = useState(0)
  const startedRef = useRef<number | null>(null)

  useEffect(() => {
    if (over || won) return
    if (!startedRef.current) startedRef.current = Date.now()
    const id = setInterval(() => {
      if (startedRef.current) setTime(Math.floor((Date.now() - startedRef.current) / 1000))
    }, 500)
    return () => clearInterval(id)
  }, [over, won])

  const reset = () => {
    setBoard(newMSBoard())
    setOver(false)
    setWon(false)
    setTime(0)
    startedRef.current = null
  }

  const tap = (r: number, c: number) => {
    if (over || won) return
    const cell = board[r][c]
    if (cell.revealed) return
    if (flagMode) {
      const nb = board.map(row => row.map(x => ({ ...x })))
      nb[r][c].flagged = !nb[r][c].flagged
      setBoard(nb)
      return
    }
    if (cell.flagged) return
    if (cell.mine) {
      const nb = board.map(row => row.map(x => ({ ...x, revealed: x.mine ? true : x.revealed })))
      setBoard(nb)
      setOver(true)
      return
    }
    const nb = floodReveal(board, r, c)
    let unrevealed = 0
    for (let i = 0; i < MS_ROWS; i++) for (let j = 0; j < MS_COLS; j++) {
      if (!nb[i][j].revealed && !nb[i][j].mine) unrevealed++
    }
    if (unrevealed === 0) setWon(true)
    setBoard(nb)
  }

  const flagsUsed = board.flat().filter(c => c.flagged).length
  const colorFor = (n: number) => ['#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'][n - 1] || '#000'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
        background: '#c0c0c0', border: '3px inset #c0c0c0', padding: '6px 10px',
      }}>
        <div style={{ background: '#000', color: '#f00', fontFamily: 'monospace', fontSize: 18, fontWeight: 700, padding: '2px 6px', minWidth: 40, textAlign: 'center' }}>
          {String(MS_MINES - flagsUsed).padStart(3, '0')}
        </div>
        <button onClick={reset} style={{
          width: 36, height: 36, border: '2px outset #c0c0c0', background: '#c0c0c0', fontSize: 18, cursor: 'pointer',
        }}>{over ? '😵' : won ? '😎' : '🙂'}</button>
        <div style={{ background: '#000', color: '#f00', fontFamily: 'monospace', fontSize: 18, fontWeight: 700, padding: '2px 6px', minWidth: 40, textAlign: 'center' }}>
          {String(time).padStart(3, '0')}
        </div>
      </div>
      <button onClick={() => setFlagMode(f => !f)} style={{
        background: flagMode ? '#fbbf24' : '#e5e7eb', border: '1px solid #9ca3af', padding: '6px 14px',
        borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}>🚩 Flag {flagMode ? 'ON' : 'OFF'}</button>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${MS_COLS}, 1fr)`, gap: 1,
        background: '#7b7b7b', padding: 2, border: '3px inset #c0c0c0', width: '100%', maxWidth: 320,
      }}>
        {board.flatMap((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} onClick={() => tap(r, c)} style={{
            aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: cell.revealed ? '#bdbdbd' : '#c0c0c0',
            border: cell.revealed ? '1px solid #7b7b7b' : '2px outset #fff',
            fontSize: 13, fontWeight: 700, color: cell.mine && cell.revealed ? '#000' : colorFor(cell.adj),
            cursor: 'pointer', userSelect: 'none',
          }}>
            {cell.flagged ? '🚩' : cell.revealed ? (cell.mine ? '💣' : (cell.adj > 0 ? cell.adj : '')) : ''}
          </div>
        )))}
      </div>
      {(over || won) && (
        <div style={{ fontSize: 16, fontWeight: 700, color: won ? '#16a34a' : '#dc2626' }}>
          {won ? '🎉 You won!' : '💥 Game Over'}
        </div>
      )}
    </div>
  )
}

/* ========== Memory Cards ========== */

const MEMORY_EMOJIS = ['🌸', '🚀', '🎸', '🍕', '🐱', '⚡', '🌙', '🦄']

type MemCard = { id: number; emoji: string; flipped: boolean; matched: boolean }

function newMemoryDeck(): MemCard[] {
  const all = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all.map((emoji, id) => ({ id, emoji, flipped: false, matched: false }))
}

export function MemoryContent() {
  const [deck, setDeck] = useState<MemCard[]>(() => newMemoryDeck())
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [best, setBest] = useState<number | null>(null)

  useEffect(() => {
    const b = localStorage.getItem('ios-memory-best')
    if (b) setBest(Number(b))
  }, [])

  useEffect(() => {
    if (flipped.length !== 2) return
    const [a, b] = flipped
    const ca = deck.find(c => c.id === a)!
    const cb = deck.find(c => c.id === b)!
    setMoves(m => m + 1)
    if (ca.emoji === cb.emoji) {
      setDeck(d => d.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c))
      setFlipped([])
    } else {
      const t = setTimeout(() => {
        setDeck(d => d.map(c => c.id === a || c.id === b ? { ...c, flipped: false } : c))
        setFlipped([])
      }, 800)
      return () => clearTimeout(t)
    }
  }, [flipped, deck])

  const won = deck.every(c => c.matched)
  useEffect(() => {
    if (won && moves > 0) {
      if (best === null || moves < best) {
        setBest(moves)
        localStorage.setItem('ios-memory-best', String(moves))
      }
    }
  }, [won, moves, best])

  const tap = (id: number) => {
    const card = deck.find(c => c.id === id)
    if (!card || card.flipped || card.matched || flipped.length === 2) return
    setDeck(d => d.map(c => c.id === id ? { ...c, flipped: true } : c))
    setFlipped(f => [...f, id])
  }

  const reset = () => {
    setDeck(newMemoryDeck())
    setFlipped([])
    setMoves(0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', fontSize: 13 }}>
        <div><b>Moves:</b> {moves}</div>
        <div><b>Best:</b> {best ?? '—'}</div>
        <button onClick={reset} style={{
          background: '#7c3aed', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6,
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>New Game</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, width: '100%' }}>
        {deck.map(card => (
          <div key={card.id} onClick={() => tap(card.id)} style={{
            aspectRatio: '3/4', perspective: '600px', cursor: card.matched ? 'default' : 'pointer',
          }}>
            <div style={{
              width: '100%', height: '100%', position: 'relative',
              transition: 'transform 360ms', transformStyle: 'preserve-3d',
              transform: (card.flipped || card.matched) ? 'rotateY(180deg)' : '',
            }}>
              <div style={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg,#7c3aed,#4c1d95)',
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, color: 'rgba(255,255,255,0.4)', fontWeight: 800,
                border: '2px solid #4c1d95', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}>?</div>
              <div style={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: card.matched ? '#dcfce7' : '#fff',
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, border: `2px solid ${card.matched ? '#16a34a' : '#d4d4d8'}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}>{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {won && (
        <div style={{ fontSize: 18, fontWeight: 700, color: '#7c3aed' }}>
          🎉 Won in {moves} moves!
        </div>
      )}
    </div>
  )
}

/* ========== Tic Tac Toe ========== */

type TTTCell = 'X' | 'O' | null

function checkWinner(b: TTTCell[]): { winner: TTTCell; line: number[] | null } {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ]
  for (const l of lines) {
    const [a, c, d] = l
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { winner: b[a], line: l }
  }
  return { winner: null, line: null }
}

function minimax(b: TTTCell[], isMax: boolean): number {
  const { winner } = checkWinner(b)
  if (winner === 'O') return 1
  if (winner === 'X') return -1
  if (b.every(c => c !== null)) return 0
  let best = isMax ? -Infinity : Infinity
  for (let i = 0; i < 9; i++) {
    if (b[i] === null) {
      b[i] = isMax ? 'O' : 'X'
      const s = minimax(b, !isMax)
      b[i] = null
      best = isMax ? Math.max(best, s) : Math.min(best, s)
    }
  }
  return best
}

function bestMove(b: TTTCell[]): number {
  let best = -Infinity, move = -1
  for (let i = 0; i < 9; i++) {
    if (b[i] === null) {
      b[i] = 'O'
      const s = minimax(b, false)
      b[i] = null
      if (s > best) { best = s; move = i }
    }
  }
  return move
}

export function TicTacToeContent() {
  const [board, setBoard] = useState<TTTCell[]>(Array(9).fill(null))
  const [xTurn, setXTurn] = useState(true)
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 })

  useEffect(() => {
    const s = localStorage.getItem('ios-ttt-stats')
    if (s) try { setStats(JSON.parse(s)) } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('ios-ttt-stats', JSON.stringify(stats))
  }, [stats])

  const { winner, line } = checkWinner(board)
  const isDraw = !winner && board.every(c => c !== null)
  const gameEnded = winner !== null || isDraw

  useEffect(() => {
    if (gameEnded) {
      if (winner === 'X') setStats(s => ({ ...s, wins: s.wins + 1 }))
      else if (winner === 'O') setStats(s => ({ ...s, losses: s.losses + 1 }))
      else if (isDraw) setStats(s => ({ ...s, draws: s.draws + 1 }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, isDraw])

  useEffect(() => {
    if (gameEnded || xTurn) return
    const t = setTimeout(() => {
      const move = bestMove(board.slice())
      if (move !== -1) {
        const nb = board.slice()
        nb[move] = 'O'
        setBoard(nb)
        setXTurn(true)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [xTurn, board, gameEnded])

  const tap = (i: number) => {
    if (board[i] || gameEnded || !xTurn) return
    const nb = board.slice()
    nb[i] = 'X'
    setBoard(nb)
    setXTurn(false)
  }

  const reset = () => {
    setBoard(Array(9).fill(null))
    setXTurn(true)
  }

  const resetStats = () => setStats({ wins: 0, losses: 0, draws: 0 })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 600 }}>
        <div style={{ color: '#16a34a' }}>You: {stats.wins}</div>
        <div style={{ color: '#dc2626' }}>AI: {stats.losses}</div>
        <div style={{ color: '#6b7280' }}>Draw: {stats.draws}</div>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gridTemplateRows: 'repeat(3, 80px)',
        gap: 4, background: '#000', padding: 4, borderRadius: 8,
      }}>
        {board.map((cell, i) => (
          <div key={i} onClick={() => tap(i)} style={{
            background: line && line.includes(i) ? '#fef08a' : '#fff8e1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, fontWeight: 800, cursor: gameEnded || cell ? 'default' : 'pointer',
            color: cell === 'X' ? '#dc2626' : '#2563eb', borderRadius: 4,
            transition: 'background 200ms',
          }}>
            {cell}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, minHeight: 22 }}>
        {winner === 'X' ? '🎉 You win!' :
         winner === 'O' ? '🤖 AI wins!' :
         isDraw ? '🤝 Draw!' :
         xTurn ? 'Your turn (X)' : 'AI thinking…'}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={reset} style={{
          background: '#ca8a04', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6,
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>New Game</button>
        <button onClick={resetStats} style={{
          background: '#e5e7eb', color: '#111', border: 'none', padding: '8px 16px', borderRadius: 6,
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Reset Stats</button>
      </div>
    </div>
  )
}

/* ========== Photo Booth ========== */

const PB_FILTERS = [
  { name: 'Normal', css: 'none' },
  { name: 'Grayscale', css: 'grayscale(1)' },
  { name: 'Sepia', css: 'sepia(1)' },
  { name: 'Invert', css: 'invert(1)' },
  { name: 'Vivid', css: 'saturate(2) contrast(1.2)' },
  { name: 'Blur', css: 'blur(3px)' },
  { name: 'Hue', css: 'hue-rotate(180deg)' },
  { name: 'Cold', css: 'hue-rotate(200deg) saturate(1.4)' },
  { name: 'Warm', css: 'sepia(0.4) saturate(1.6)' },
]

export function PhotoBoothContent() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [filter, setFilter] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [snapshot, setSnapshot] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (e) {
        setError('Camera not available. Allow camera access to use Photo Booth.')
      }
    }
    start()
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [])

  const snap = () => {
    const v = videoRef.current; const c = canvasRef.current
    if (!v || !c) return
    c.width = v.videoWidth; c.height = v.videoHeight
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.filter = PB_FILTERS[filter].css
    ctx.translate(c.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(v, 0, 0)
    setSnapshot(c.toDataURL('image/jpeg', 0.92))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <div style={{ width: '100%', aspectRatio: '4/3', background: '#000', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
        {snapshot ? (
          <img src={snapshot} alt="snapshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <video ref={videoRef} playsInline muted style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: PB_FILTERS[filter].css, transform: 'scaleX(-1)',
          }} />
        )}
        {error && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {snapshot ? (
          <>
            <a href={snapshot} download="photobooth.jpg" style={{
              background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
            }}>Download</a>
            <button onClick={() => setSnapshot(null)} style={{
              background: '#e5e7eb', color: '#111', border: 'none', padding: '8px 16px', borderRadius: 6,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>Retake</button>
          </>
        ) : (
          <button onClick={snap} disabled={!!error} style={{
            background: error ? '#9ca3af' : '#dc2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 20,
            fontSize: 14, fontWeight: 700, cursor: error ? 'not-allowed' : 'pointer',
          }}>📷 Snap</button>
        )}
      </div>
      <div style={{ width: '100%', overflowX: 'auto', display: 'flex', gap: 6, paddingBottom: 4 }}>
        {PB_FILTERS.map((f, i) => (
          <button key={f.name} onClick={() => setFilter(i)} style={{
            flex: 'none', background: filter === i ? '#9d174d' : '#fff', color: filter === i ? '#fff' : '#111',
            border: `1px solid ${filter === i ? '#9d174d' : '#d4d4d8'}`, padding: '6px 12px', borderRadius: 14,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{f.name}</button>
        ))}
      </div>
    </div>
  )
}

/* ========== Translate ========== */

const TR_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
]

export function TranslateContent() {
  const [from, setFrom] = useState('en')
  const [to, setTo] = useState('es')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const translate = useCallback(async (text: string) => {
    if (!text.trim()) { setOutput(''); return }
    setLoading(true); setError(null)
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
      const r = await fetch(url)
      const j = await r.json()
      if (j.responseStatus === 200 || j.responseData?.translatedText) {
        setOutput(j.responseData.translatedText || '')
      } else {
        setError('Translation failed')
      }
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [from, to])

  useEffect(() => {
    const t = setTimeout(() => translate(input), 500)
    return () => clearTimeout(t)
  }, [input, translate])

  const swap = () => {
    setFrom(to); setTo(from)
    setInput(output); setOutput(input)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select value={from} onChange={e => setFrom(e.target.value)} style={selStyle}>
          {TR_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <button onClick={swap} style={{
          background: '#15803d', color: '#fff', border: 'none', borderRadius: '50%',
          width: 32, height: 32, fontSize: 16, cursor: 'pointer', flex: 'none',
        }}>⇄</button>
        <select value={to} onChange={e => setTo(e.target.value)} style={selStyle}>
          {TR_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #d4d6da', padding: 10 }}>
        <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
          {TR_LANGUAGES.find(l => l.code === from)?.name}
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter text…"
          style={{
            width: '100%', border: 'none', resize: 'none', outline: 'none',
            fontSize: 16, minHeight: 90, background: 'transparent', color: '#111',
            fontFamily: 'inherit',
          }}
        />
      </div>
      <div style={{ background: '#f0fdf4', borderRadius: 8, border: '1px solid #86efac', padding: 10, minHeight: 100 }}>
        <div style={{ fontSize: 11, color: '#15803d', textTransform: 'uppercase', marginBottom: 4 }}>
          {TR_LANGUAGES.find(l => l.code === to)?.name}
          {loading && <span style={{ marginLeft: 6 }}>· translating…</span>}
        </div>
        <div style={{ fontSize: 16, color: '#111', whiteSpace: 'pre-wrap' }}>
          {error ? <span style={{ color: '#dc2626' }}>{error}</span> : (output || <span style={{ color: '#9ca3af' }}>Translation will appear here</span>)}
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
        Powered by MyMemory · free translation API
      </div>
    </div>
  )
}

const selStyle: React.CSSProperties = {
  flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #d4d6da',
  background: '#fff', fontSize: 14, outline: 'none',
}
