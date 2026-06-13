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
