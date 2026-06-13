'use client'

import { useEffect, useState } from 'react'
import StatusBar from './StatusBar'
import { IosAppDefinition } from './iosApps'
import { about } from '@/data/about'
import { skills } from '@/data/skills'
import { projects } from '@/data/projects'
import {
  PhotosContent,
  CameraContent,
  WeatherContent,
  CalendarContent,
  MapsContent,
  MailContent,
  GameCenterContent,
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
  // The screen is always mounted so the slide-up transition can run on open
  // and on close. We track the most recently opened app so the chrome doesn't
  // pop blank during the slide-down.
  const [lastApp, setLastApp] = useState<IosAppDefinition | null>(null)
  useEffect(() => {
    if (app) setLastApp(app)
  }, [app])

  const active = app ?? lastApp

  return (
    <div className={`ios-app-screen ${app ? 'open' : ''}`} aria-hidden={!app}>
      <StatusBar />
      <div className="ios-app-titlebar">
        <button className="ios-app-back" onClick={onClose}>
          Home
        </button>
        {active?.title ?? ''}
      </div>
      <div className="ios-app-body">{active ? <AppContent app={active} /> : null}</div>
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
    case 'maps':        return <MapsContent />
    case 'mail':        return <MailContent />
    case 'gamecenter':  return <GameCenterContent />
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

function NotesContent() {
  return (
    <div className="ios-notes" style={{ paddingTop: 0 }}>
      <div className="ios-notes-header">
        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
      {about.bio.split(/\n\n+/).map((para, i) => (
        <p key={i} style={{ marginTop: i === 0 ? 0 : 12 }}>
          {para}
        </p>
      ))}
    </div>
  )
}

function SafariContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600 }}>Projects</h2>
      {projects.map((p) => (
        <div
          key={p.id}
          style={{
            background: '#fff',
            border: '1px solid #d4d6da',
            borderRadius: 8,
            padding: 12,
            boxShadow: '0 1px 0 #f7f8fa inset',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
          <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 8 }}>{p.description}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {p.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  background: '#e5e7eb',
                  color: '#374151',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

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
        { label: 'Email', value: 'tomararman4@gmail.com', href: 'mailto:tomararman4@gmail.com' },
      ].map((row) => (
        <a
          key={row.label}
          href={row.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '10px 12px',
            borderBottom: '1px solid #e5e7eb',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <div style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase' }}>{row.label}</div>
          <div style={{ color: '#1d4ed8', fontSize: 15 }}>{row.value}</div>
        </a>
      ))}
    </div>
  )
}

function SettingsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Skills</h2>
      {skills.map((cat) => (
        <div key={cat.category}>
          <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6, paddingLeft: 4 }}>
            {cat.category}
          </div>
          <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #d4d6da' }}>
            {cat.items.map((item, i) => (
              <div
                key={item}
                style={{
                  padding: '10px 12px',
                  borderTop: i === 0 ? 'none' : '1px solid #e5e7eb',
                  fontSize: 14,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CalculatorContent() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<string | null>(null)
  const [justEvaluated, setJustEvaluated] = useState(false)

  const press = (key: string) => {
    if (key === 'C') {
      setDisplay('0')
      setPrev(null)
      setOp(null)
      setJustEvaluated(false)
      return
    }
    if (key === '±') {
      setDisplay((d) => (d.startsWith('-') ? d.slice(1) : d === '0' ? d : '-' + d))
      return
    }
    if (key === '%') {
      setDisplay((d) => String(parseFloat(d) / 100))
      return
    }
    if ('+-×÷'.includes(key)) {
      const current = parseFloat(display)
      if (prev !== null && op && !justEvaluated) {
        const result = compute(prev, current, op)
        setDisplay(String(result))
        setPrev(result)
      } else {
        setPrev(current)
      }
      setOp(key)
      setJustEvaluated(false)
      setDisplay((d) => d) // keep current showing
      setTimeout(() => setDisplay('0'), 0)
      return
    }
    if (key === '=') {
      if (prev === null || !op) return
      const result = compute(prev, parseFloat(display), op)
      setDisplay(String(result))
      setPrev(null)
      setOp(null)
      setJustEvaluated(true)
      return
    }
    if (key === '.') {
      setDisplay((d) => (d.includes('.') ? d : d + '.'))
      return
    }
    setDisplay((d) => (d === '0' || justEvaluated ? key : d + key))
    setJustEvaluated(false)
  }

  const compute = (a: number, b: number, operator: string) => {
    switch (operator) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return b === 0 ? 0 : a / b
      default: return b
    }
  }

  const rows = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ]

  return (
    <div style={{ background: '#0a0a0a', borderRadius: 8, padding: 12, color: '#fff', maxWidth: 320, margin: '0 auto' }}>
      <div style={{ textAlign: 'right', fontSize: 38, fontFamily: '-apple-system, Helvetica', padding: '12px 8px', minHeight: 60 }}>
        {display}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 8 }}>
            {row.map((key) => {
              const wide = key === '0'
              const isOp = '+-×÷='.includes(key)
              const isFn = 'C±%'.includes(key)
              return (
                <button
                  key={key}
                  onClick={() => press(key)}
                  style={{
                    flex: wide ? 2.1 : 1,
                    aspectRatio: wide ? '2.1 / 1' : '1 / 1',
                    borderRadius: 999,
                    border: 'none',
                    fontSize: 22,
                    fontFamily: '-apple-system, Helvetica',
                    background: isOp ? '#f59e0b' : isFn ? '#a3a3a3' : '#3f3f46',
                    color: isFn ? '#111' : '#fff',
                  }}
                >
                  {key}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function ClockContent() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!now) return null
  const h = now.getHours() % 12
  const m = now.getMinutes()
  const s = now.getSeconds()
  const hourDeg = (h + m / 60) * 30
  const minDeg = (m + s / 60) * 6
  const secDeg = s * 6

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, paddingTop: 12 }}>
      <div style={{ position: 'relative', width: 240, height: 240, borderRadius: '50%', background: '#fff', boxShadow: 'inset 0 0 0 6px #111, 0 8px 20px rgba(0,0,0,0.25)' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 2,
              height: 18,
              background: '#111',
              transformOrigin: '50% 120px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}
        {[hourDeg, minDeg, secDeg].map((deg, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: i === 2 ? 2 : i === 1 ? 3 : 4,
              height: i === 0 ? 60 : i === 1 ? 88 : 100,
              background: i === 2 ? '#ef4444' : '#111',
              borderRadius: 2,
              transformOrigin: '50% 100%',
              transform: `translate(-50%, -100%) rotate(${deg}deg)`,
            }}
          />
        ))}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 12, height: 12, borderRadius: '50%', background: '#ef4444', transform: 'translate(-50%,-50%)' }} />
      </div>
      <div style={{ color: '#111', fontSize: 18 }}>
        {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
      </div>
    </div>
  )
}
