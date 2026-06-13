'use client'

import { useState } from 'react'
import { about } from '@/data/about'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function OutlookApp() {
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) {
      setError('Please fill in both Subject and Message.')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: from.trim() || 'Anonymous',
          message: `[${subject.trim()}] ${body.trim()}`,
        }),
      })
      if (!res.ok) throw new Error('Network error')
      setStatus('sent')
    } catch {
      setStatus('error')
      setError('Could not send. Try emailing directly: tomararman4@gmail.com')
    }
  }

  if (status === 'sent') {
    return (
      <div
        style={{
          height: '100%',
          background: 'var(--w95-face)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontFamily: 'var(--font-w95)',
          fontSize: 12,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 36 }}>✉</div>
        <strong>Message sent!</strong>
        <p style={{ maxWidth: 320, lineHeight: 1.5 }}>
          Thanks for reaching out. Arman will get back to you as soon as the
          dial-up connects.
        </p>
        <button
          className="w95-btn"
          onClick={() => {
            setFrom('')
            setSubject('')
            setBody('')
            setStatus('idle')
          }}
        >
          Compose another
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={send}
      style={{
        height: '100%',
        background: 'var(--w95-face)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-w95)',
        fontSize: 11,
      }}
    >
      <div style={{ display: 'flex', gap: 12, padding: '2px 6px', borderBottom: '1px solid var(--w95-shadow)', boxShadow: 'inset 0 -1px 0 #fff' }}>
        {['File', 'Edit', 'View', 'Insert', 'Help'].map((m) => (
          <span key={m}>
            <u>{m[0]}</u>
            {m.slice(1)}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, padding: 6, borderBottom: '1px solid var(--w95-shadow)', boxShadow: 'inset 0 -1px 0 #fff' }}>
        <button
          type="submit"
          className="w95-btn"
          disabled={status === 'sending'}
          style={{ minWidth: 70 }}
        >
          {status === 'sending' ? 'Sending…' : '✉ Send'}
        </button>
        <button
          type="button"
          className="w95-btn"
          onClick={() => { setSubject(''); setBody(''); setFrom('') }}
        >
          Clear
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 6, padding: 8 }}>
        <Label>To:</Label>
        <ReadOnlyField value={`Arman Singh Tomar <tomararman4@gmail.com>`} />
        <Label>From:</Label>
        <Input value={from} onChange={setFrom} placeholder="Your name or email (optional)" />
        <Label>Subject:</Label>
        <Input value={subject} onChange={setSubject} placeholder="Subject" />
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type your message here..."
        style={{
          flex: 1,
          minHeight: 0,
          margin: '0 8px 8px',
          padding: 6,
          font: '12px "Lucida Console", Consolas, monospace',
          resize: 'none',
          background: '#fff',
          color: '#000',
          border: 'none',
          boxShadow:
            'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
        }}
      />

      {error && (
        <div style={{ padding: '4px 8px', color: '#a00', fontSize: 11 }}>{error}</div>
      )}

      <div
        style={{
          flex: 'none',
          padding: '2px 6px',
          borderTop: '1px solid #fff',
          boxShadow: 'inset 0 1px 0 var(--w95-shadow)',
        }}
      >
        Connected · 28.8 kbps
      </div>
    </form>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '4px 4px 0 0', textAlign: 'right', fontWeight: 700 }}>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        font: '11px var(--font-w95)',
        padding: '3px 4px',
        background: '#fff',
        color: '#000',
        border: 'none',
        boxShadow:
          'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
      }}
    />
  )
}

function ReadOnlyField({ value }: { value: string }) {
  return (
    <div
      style={{
        font: '11px var(--font-w95)',
        padding: '3px 4px',
        background: '#dfdfdf',
        color: '#000',
        boxShadow:
          'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
      }}
    >
      {value}
    </div>
  )
}
