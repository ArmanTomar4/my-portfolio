'use client'

import { useEffect, useState } from 'react'
import StatusBar from './StatusBar'
import { IosAppDefinition } from './iosApps'
import { about } from '@/data/about'
import { skills } from '@/data/skills'
import {
  PhotosContent,
  CameraContent,
  WeatherContent,
  CalendarContent,
  MailContent,
  AppStoreContent,
  MusicContent,
  PhoneContent,
  MessagesContent,
} from './iosAppContent'

interface AppScreenProps {
  app: IosAppDefinition | null
  onClose: () => void
}

export default function AppScreen({ app, onClose }: AppScreenProps) {
  const [lastApp, setLastApp] = useState<IosAppDefinition | null>(null)
  useEffect(() => {
    if (app) setLastApp(app)
  }, [app])

  const active = app ?? lastApp
  const hideTitlebar = active?.kind === 'calculator' || active?.kind === 'safari'
  const noBodyPad = active?.kind === 'calculator' || active?.kind === 'safari'

  return (
    <div className={`ios-app-screen ${app ? 'open' : ''}`} aria-hidden={!app}>
      <StatusBar />
      {!hideTitlebar && (
        <div className="ios-app-titlebar">
          {active?.title ?? ''}
        </div>
      )}
      <div className={`ios-app-body${noBodyPad ? ' no-pad' : ''}`}>
        {active ? <AppContent app={active} /> : null}
      </div>
      <div className="ios-home-button-bar">
        <div className="ios-home-button" onClick={onClose}>
          <div className="ios-home-button-glyph" />
        </div>
      </div>
    </div>
  )
}

function AppContent({ app }: { app: IosAppDefinition }) {
  switch (app.kind) {
    case 'notes':       return <NotesContent />
    case 'safari':      return <SafariContent />
    case 'contacts':    return <ContactsContent />
    case 'messages':    return <MessagesContent />
    case 'settings':    return <SettingsContent />
    case 'calculator':  return <CalculatorContent />
    case 'clock':       return <ClockContent />
    case 'photos':      return <PhotosContent />
    case 'camera':      return <CameraContent />
    case 'weather':     return <WeatherContent />
    case 'calendar':    return <CalendarContent />
    case 'mail':        return <MailContent />
    case 'appstore':    return <AppStoreContent />
    case 'music':       return <MusicContent />
    case 'phone':       return <PhoneContent />
    default:            return <StubContent app={app} />
  }
}

function StubContent({ app }: { app: IosAppDefinition }) {
  return (
    <div className="ios-app-stub">
      <strong>{app.label}</strong>
      <span>This app is coming soon.</span>
    </div>
  )
}

/* ---------- Notes ---------- */

interface NoteItem {
  id: string
  title: string
  body: string
  pinned: boolean
  updatedAt: number
}

const ABOUT_NOTE: NoteItem = {
  id: 'about-me',
  title: 'About Me',
  body: [
    about.name,
    about.role,
    '',
    `📍 ${about.location}`,
    `📧 ${about.email}`,
    `📱 ${about.phone}`,
    '',
    `🎓 ${about.education.degree}`,
    about.education.school,
    `Expected: ${about.education.expected}`,
    '',
    `GitHub: ${about.github}`,
    `LinkedIn: ${about.linkedin}`,
  ].join('\n'),
  pinned: true,
  updatedAt: Date.now(),
}

function NotesContent() {
  const [notes, setNotes] = useState<NoteItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ios-notes')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setNotes(Array.isArray(parsed) && parsed.length > 0 ? parsed : [ABOUT_NOTE])
      } catch {
        setNotes([ABOUT_NOTE])
      }
    } else {
      setNotes([ABOUT_NOTE])
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem('ios-notes', JSON.stringify(notes))
  }, [notes, loaded])

  const addNote = () => {
    const n: NoteItem = { id: Date.now().toString(), title: '', body: '', pinned: false, updatedAt: Date.now() }
    setNotes(prev => [n, ...prev])
    setActiveId(n.id)
  }

  const updateNote = (id: string, u: Partial<NoteItem>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...u, updatedAt: Date.now() } : n))
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const active = notes.find(n => n.id === activeId)

  if (active) {
    return (
      <div style={{
        margin: -14, padding: '0 18px', minHeight: 'calc(100% + 28px)',
        background: '#fdf6c4',
        backgroundImage: 'repeating-linear-gradient(180deg, rgba(150,110,0,0) 0, rgba(150,110,0,0) 25px, rgba(150,110,0,0.22) 25px, rgba(150,110,0,0.22) 26px)',
        fontFamily: '"Marker Felt","Bradley Hand","Comic Sans MS",cursive',
        color: '#1a1a1a', lineHeight: '26px', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontFamily: '-apple-system,Helvetica Neue,sans-serif' }}>
          <button onClick={() => setActiveId(null)} style={{ background: 'none', border: 'none', color: '#c49a3c', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            ‹ Notes
          </button>
          {!active.pinned && (
            <button onClick={() => deleteNote(active.id)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 13, cursor: 'pointer' }}>
              Delete
            </button>
          )}
        </div>
        <input
          value={active.title}
          onChange={e => updateNote(active.id, { title: e.target.value })}
          placeholder="Title"
          style={{ fontSize: 22, fontWeight: 700, border: 'none', background: 'transparent', width: '100%', fontFamily: 'inherit', color: 'inherit', outline: 'none', lineHeight: '26px', marginBottom: 4 }}
        />
        <textarea
          value={active.body}
          onChange={e => updateNote(active.id, { body: e.target.value })}
          placeholder="Start writing..."
          style={{ flex: 1, border: 'none', background: 'transparent', resize: 'none', width: '100%', fontFamily: 'inherit', fontSize: 16, lineHeight: '26px', color: 'inherit', outline: 'none', minHeight: 300 }}
        />
      </div>
    )
  }

  const sorted = notes
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => { if (a.pinned !== b.pinned) return a.pinned ? -1 : 1; return b.updatedAt - a.updatedAt })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input
        value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"
        style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d4d6da', fontSize: 14, background: '#e8e8ed', outline: 'none' }}
      />
      <div style={{ fontSize: 12, color: '#6b7280' }}>{sorted.length} {sorted.length === 1 ? 'Note' : 'Notes'}</div>
      {sorted.map(note => (
        <div key={note.id} onClick={() => setActiveId(note.id)} style={{ background: '#fff', borderRadius: 8, border: '1px solid #d4d6da', padding: '10px 12px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {note.pinned && <span style={{ fontSize: 11 }}>📌</span>}
            <span style={{ fontWeight: 600, fontSize: 14 }}>{note.title || 'New Note'}</span>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {note.body.split('\n')[0] || 'No additional text'}
          </div>
          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
            {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      ))}
      <button onClick={addNote} style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(180deg,#f1c25b,#c49a3c)', border: 'none',
        color: '#fff', fontSize: 24, fontWeight: 300, cursor: 'pointer', alignSelf: 'flex-end',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)', position: 'sticky', bottom: 0,
      }}>+</button>
    </div>
  )
}

/* ---------- Safari ---------- */

const SAFARI_FAVS = [
  { name: 'Google', url: 'https://www.google.com', letter: 'G', color: '#4285F4' },
  { name: 'YouTube', url: 'https://www.youtube.com', letter: '▶', color: '#FF0000' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org', letter: 'W', color: '#636466' },
  { name: 'GitHub', url: 'https://github.com', letter: '⌥', color: '#24292e' },
  { name: 'Reddit', url: 'https://www.reddit.com', letter: 'R', color: '#FF4500' },
  { name: 'Twitter', url: 'https://x.com', letter: '𝕏', color: '#000' },
  { name: 'Amazon', url: 'https://www.amazon.com', letter: 'a', color: '#FF9900' },
  { name: 'Stack\nOverflow', url: 'https://stackoverflow.com', letter: '⊞', color: '#F48024' },
]

function SafariContent() {
  const [input, setInput] = useState('')
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null)

  const nav = (q: string) => {
    q = q.trim()
    if (!q) return
    if (/^https?:\/\//i.test(q)) setLoadedUrl(q)
    else if (q.includes('.') && !q.includes(' ')) setLoadedUrl('https://' + q)
    else setLoadedUrl(`https://www.google.com/search?igu=1&q=${encodeURIComponent(q)}`)
    setInput(q)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 'none', padding: '8px 10px', background: 'linear-gradient(180deg,#b9c2cc,#8e99a4)', borderBottom: '1px solid rgba(0,0,0,0.2)' }}>
        <form onSubmit={e => { e.preventDefault(); nav(input) }} style={{ display: 'flex', gap: 6 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            placeholder="Search or enter website name"
            style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.15)', fontSize: 13, background: '#fff', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)', outline: 'none' }}
          />
          <button type="submit" style={{
            padding: '7px 12px', borderRadius: 6, border: 'none',
            background: 'linear-gradient(180deg,#5d6b7b,#3f4a59)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3),0 1px 1px rgba(0,0,0,0.3)',
          }}>Go</button>
        </form>
      </div>
      {loadedUrl ? (
        <div style={{ flex: 1, position: 'relative' }}>
          <iframe src={loadedUrl} style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title="Safari" />
          <button onClick={() => { setLoadedUrl(null); setInput('') }} style={{
            position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', fontSize: 14, cursor: 'pointer',
          }}>×</button>
        </div>
      ) : (
        <div style={{ flex: 1, padding: 18, background: '#f2f3f5' }}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>Favorites</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {SAFARI_FAVS.map(s => (
              <div key={s.name} onClick={() => nav(s.url)} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12, margin: '0 auto 6px', background: s.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}>{s.letter}</div>
                <div style={{ fontSize: 10, color: '#374151', whiteSpace: 'pre-line', lineHeight: 1.2 }}>{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Contacts ---------- */

function ContactsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #d4d6da' }}>
      <div style={{ padding: '14px 12px', borderBottom: '1px solid #e5e7eb', background: '#f7f8fa' }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{about.name}</div>
        <div style={{ color: '#6b7280', fontSize: 13 }}>{about.role}</div>
      </div>
      {[
        { label: 'GitHub', value: 'ArmanTomar4', href: about.github },
        { label: 'LinkedIn', value: 'arman-tomar', href: about.linkedin },
        { label: 'Email', value: about.email, href: `mailto:${about.email}` },
      ].map((row) => (
        <a key={row.label} href={row.href} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', padding: '10px 12px', borderBottom: '1px solid #e5e7eb', color: 'inherit', textDecoration: 'none' }}>
          <div style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase' }}>{row.label}</div>
          <div style={{ color: '#1d4ed8', fontSize: 15 }}>{row.value}</div>
        </a>
      ))}
    </div>
  )
}

/* ---------- Settings (Skills) ---------- */

function SettingsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Skills</h2>
      {skills.map((cat) => (
        <div key={cat.category}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6, paddingLeft: 4 }}>{cat.category}</div>
          <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #d4d6da' }}>
            {cat.items.map((item, i) => (
              <div key={item} style={{ padding: '10px 12px', borderTop: i === 0 ? 'none' : '1px solid #e5e7eb', fontSize: 14 }}>{item}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Calculator ---------- */

function CalculatorContent() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<string | null>(null)
  const [reset, setReset] = useState(false)

  const compute = (a: number, b: number, o: string) => {
    switch (o) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return b === 0 ? 0 : a / b
      default: return b
    }
  }

  const press = (key: string) => {
    if (key === 'C') { setDisplay('0'); setPrev(null); setOp(null); setReset(false); return }
    if (key === '±') { setDisplay(d => d.startsWith('-') ? d.slice(1) : d === '0' ? d : '-' + d); return }
    if (key === '%') { setDisplay(d => String(parseFloat(d) / 100)); return }
    if ('+-×÷'.includes(key)) {
      const cur = parseFloat(display)
      if (prev !== null && op && !reset) {
        const r = compute(prev, cur, op)
        setDisplay(String(r)); setPrev(r)
      } else { setPrev(cur) }
      setOp(key); setReset(true); return
    }
    if (key === '=') {
      if (prev === null || !op) return
      const r = compute(prev, parseFloat(display), op)
      setDisplay(String(r)); setPrev(null); setOp(null); setReset(true); return
    }
    if (key === '.') { setDisplay(d => d.includes('.') ? d : d + '.'); return }
    setDisplay(d => d === '0' || reset ? key : d + key)
    setReset(false)
  }

  const rows = [['C', '±', '%', '÷'], ['7', '8', '9', '×'], ['4', '5', '6', '-'], ['1', '2', '3', '+'], ['0', '.', '=']]
  const fs = display.length > 9 ? 36 : display.length > 7 ? 48 : display.length > 5 ? 60 : 72

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '0 24px 12px' }}>
        <div style={{ fontSize: fs, fontWeight: 200, fontFamily: '-apple-system,"Helvetica Neue",Helvetica', color: '#fff', lineHeight: 1, transition: 'font-size 0.15s' }}>
          {display}
        </div>
      </div>
      <div style={{ flex: 'none', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 12 }}>
            {row.map(key => {
              const isOp = '÷×-+='.includes(key)
              const isFn = 'C±%'.includes(key)
              const wide = key === '0'
              return (
                <button key={key} onClick={() => press(key)} style={{
                  flex: wide ? 2.15 : 1, height: 64, borderRadius: 32, border: 'none',
                  fontSize: isOp ? 28 : 22, fontFamily: '-apple-system,Helvetica', fontWeight: isOp ? 400 : 500,
                  background: isOp ? '#f59e0b' : isFn ? '#a3a3a3' : '#333', color: isFn ? '#000' : '#fff',
                  cursor: 'pointer', textAlign: wide ? 'left' : 'center', paddingLeft: wide ? 26 : 0,
                }}>{key}</button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Clock ---------- */

function ClockContent() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  if (!now) return null
  const h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds()
  const hDeg = (h + m / 60) * 30, mDeg = (m + s / 60) * 6, sDeg = s * 6
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, paddingTop: 12 }}>
      <div style={{ position: 'relative', width: 240, height: 240, borderRadius: '50%', background: '#fff', boxShadow: 'inset 0 0 0 6px #111, 0 8px 20px rgba(0,0,0,0.25)' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: 0, left: '50%', width: 2, height: 18, background: '#111', transformOrigin: '50% 120px', transform: `translateX(-50%) rotate(${i * 30}deg)` }} />
        ))}
        {[hDeg, mDeg, sDeg].map((deg, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: i === 2 ? 2 : i === 1 ? 3 : 4, height: i === 0 ? 60 : i === 1 ? 88 : 100,
            background: i === 2 ? '#ef4444' : '#111', borderRadius: 2, transformOrigin: '50% 100%',
            transform: `translate(-50%, -100%) rotate(${deg}deg)`,
          }} />
        ))}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 12, height: 12, borderRadius: '50%', background: '#ef4444', transform: 'translate(-50%,-50%)' }} />
      </div>
      <div style={{ color: '#111', fontSize: 18 }}>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</div>
    </div>
  )
}
