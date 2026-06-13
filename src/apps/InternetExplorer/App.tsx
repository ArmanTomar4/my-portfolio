'use client'

import { useEffect, useState } from 'react'
import { about } from '@/data/about'
import { projects } from '@/data/projects'

interface FakePage {
  url: string
  title: string
  external?: string
  body: React.ReactNode
}

export default function InternetExplorerApp() {
  const pages: Record<string, FakePage> = {
    'home://arman': {
      url: 'home://arman',
      title: 'Welcome to ArmanNET',
      body: <HomePage />,
    },
    'http://github.com/ArmanTomar4': {
      url: 'http://github.com/ArmanTomar4',
      title: 'GitHub - ArmanTomar4',
      external: about.github,
      body: <GitHubPage />,
    },
    'http://linkedin.com/in/arman-tomar': {
      url: 'http://linkedin.com/in/arman-tomar',
      title: 'LinkedIn - Arman Singh Tomar',
      external: about.linkedin,
      body: <LinkedInPage />,
    },
  }

  const [historyStack, setHistoryStack] = useState<string[]>(['home://arman'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [addressInput, setAddressInput] = useState('home://arman')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const currentUrl = historyStack[historyIndex]
  const currentPage = pages[currentUrl] ?? pages['home://arman']

  const navigate = (url: string) => {
    if (!pages[url]) return
    setLoading(true)
    setProgress(0)
    const next = historyStack.slice(0, historyIndex + 1)
    next.push(url)
    setHistoryStack(next)
    setHistoryIndex(next.length - 1)
    setAddressInput(url)
  }

  useEffect(() => {
    if (!loading) return
    let p = 0
    const interval = setInterval(() => {
      p += 12 + Math.random() * 18
      if (p >= 100) {
        clearInterval(interval)
        setProgress(100)
        setTimeout(() => setLoading(false), 80)
      } else {
        setProgress(p)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [loading])

  const back = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1
      setHistoryIndex(idx)
      setAddressInput(historyStack[idx])
      setLoading(true)
    }
  }

  const forward = () => {
    if (historyIndex < historyStack.length - 1) {
      const idx = historyIndex + 1
      setHistoryIndex(idx)
      setAddressInput(historyStack[idx])
      setLoading(true)
    }
  }

  const refresh = () => {
    setLoading(true)
  }

  const home = () => navigate('home://arman')

  const submitAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (pages[addressInput]) navigate(addressInput)
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--w95-face)' }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Toolbar back={back} forward={forward} refresh={refresh} home={home}
        canBack={historyIndex > 0}
        canForward={historyIndex < historyStack.length - 1}
      />
      <AddressBar value={addressInput} onChange={setAddressInput} onSubmit={submitAddress} pages={pages} onNavigate={navigate} />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: '#fff', color: '#000', position: 'relative' }}>
        {loading ? <LoadingScreen url={currentUrl} /> : currentPage.body}
      </div>
      <Statusbar
        url={currentUrl}
        loading={loading}
        progress={progress}
      />
    </div>
  )
}

function Toolbar({
  back, forward, refresh, home, canBack, canForward,
}: {
  back: () => void
  forward: () => void
  refresh: () => void
  home: () => void
  canBack: boolean
  canForward: boolean
}) {
  const btn = (label: string, disabled: boolean, onClick: () => void) => (
    <button
      className="w95-btn"
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 56,
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--font-w95)',
      }}
    >
      {label}
    </button>
  )
  return (
    <div style={{ display: 'flex', gap: 4, padding: '4px 6px', flex: 'none', fontFamily: 'var(--font-w95)', fontSize: 11 }}>
      {btn('◄ Back', !canBack, back)}
      {btn('Forward ►', !canForward, forward)}
      {btn('Refresh', false, refresh)}
      {btn('Home', false, home)}
    </div>
  )
}

function AddressBar({
  value, onChange, onSubmit, pages, onNavigate,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  pages: Record<string, { url: string }>
  onNavigate: (url: string) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 6px 4px', flex: 'none', fontFamily: 'var(--font-w95)', fontSize: 11, alignItems: 'center' }}>
      <span>Address:</span>
      <form onSubmit={onSubmit} style={{ flex: 1 }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          list="ie-history"
          style={{
            width: '100%',
            font: '11px var(--font-w95)',
            padding: '2px 4px',
            background: '#fff',
            border: 'none',
            boxShadow: 'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
          }}
        />
        <datalist id="ie-history">
          {Object.values(pages).map((p) => (
            <option key={p.url} value={p.url} />
          ))}
        </datalist>
      </form>
      <button className="w95-btn" onClick={() => onNavigate(value)}>
        Go
      </button>
    </div>
  )
}

function Statusbar({ url, loading, progress }: { url: string; loading: boolean; progress: number }) {
  return (
    <div
      style={{
        flex: 'none',
        height: 18,
        background: 'var(--w95-face)',
        borderTop: '1px solid #fff',
        boxShadow: 'inset 0 1px 0 var(--w95-shadow)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 6px',
        fontFamily: 'var(--font-w95)',
        fontSize: 11,
      }}
    >
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {loading ? `Loading ${url}` : url}
      </span>
      {loading && (
        <div
          style={{
            width: 90,
            height: 10,
            background: '#fff',
            boxShadow: 'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'repeating-linear-gradient(90deg, #000080 0 6px, #1084d0 6px 10px)',
            }}
          />
        </div>
      )}
    </div>
  )
}

function LoadingScreen({ url }: { url: string }) {
  return (
    <div style={{ padding: 20, fontFamily: 'Times, serif' }}>
      <p>Connecting to {url}...</p>
      <p>Please wait while the page loads.</p>
    </div>
  )
}

function HomePage() {
  return (
    <div style={{ padding: 18, fontFamily: 'Times, "Times New Roman", serif' }}>
      <h1 style={{ fontSize: 24, color: '#000080', textAlign: 'center', borderBottom: '2px solid #000080', paddingBottom: 6 }}>
        Welcome to ArmanNET
      </h1>
      <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#444' }}>
        Your one-stop destination for one developer&apos;s portfolio. Est. 2024.
      </p>
      <hr />
      <h3 style={{ color: '#800080' }}>About this site:</h3>
      <p>
        This is a fake Internet Explorer rendering fake web pages from inside a fake Windows 95 desktop.
        Pretty meta, huh? Use the address bar above or the links below to visit my real profiles.
      </p>
      <h3 style={{ color: '#800080' }}>Bookmarks:</h3>
      <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.open(about.github, '_blank') }} style={{ color: '#0000ff' }}>
            GitHub - @ArmanTomar4
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); window.open(about.linkedin, '_blank') }} style={{ color: '#0000ff' }}>
            LinkedIn - Arman Singh Tomar
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); window.open('mailto:tomararman4@gmail.com') }} style={{ color: '#0000ff' }}>
            Email - tomararman4@gmail.com
          </a>
        </li>
      </ul>
      <hr />
      <p style={{ textAlign: 'center', fontSize: 11, color: '#999' }}>
        Best viewed in Netscape Navigator 3.0 at 800x600. Site Under Construction. ⚠
      </p>
      <p style={{ textAlign: 'center', color: '#999', fontSize: 11 }}>
        Visitor count: probably more than expected.
      </p>
    </div>
  )
}

function GitHubPage() {
  return (
    <div style={{ padding: 18, fontFamily: 'Times, "Times New Roman", serif' }}>
      <h1 style={{ borderBottom: '1px solid #ccc' }}>github.com/ArmanTomar4</h1>
      <p>
        <strong>Arman Singh Tomar</strong> — Full Stack Developer & UI Designer
      </p>
      <p>Followers: a respectable number · Following: more than that</p>
      <h3>Pinned Repositories</h3>
      <ul style={{ paddingLeft: 18, lineHeight: 1.7 }}>
        {projects.map((p) => (
          <li key={p.id}>
            <a href="#" style={{ color: '#0000ff' }} onClick={(e) => e.preventDefault()}>
              {p.name}
            </a>
            {' — '}
            <span style={{ color: '#444' }}>{p.description}</span>
            <br />
            <span style={{ fontSize: 11, color: '#999' }}>{p.tech.join(' · ')}</span>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 20 }}>
        <a
          href={about.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0000ff' }}
        >
          → Open real GitHub in a new window
        </a>
      </p>
    </div>
  )
}

function LinkedInPage() {
  return (
    <div style={{ padding: 18, fontFamily: 'Times, "Times New Roman", serif' }}>
      <div style={{ background: '#0a66c2', color: '#fff', padding: 12, marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{about.name}</h2>
        <div>{about.role}</div>
      </div>
      <h3>About</h3>
      <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{about.bio}</p>
      <p>
        <a
          href={about.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0a66c2' }}
        >
          → Open real LinkedIn in a new window
        </a>
      </p>
    </div>
  )
}
