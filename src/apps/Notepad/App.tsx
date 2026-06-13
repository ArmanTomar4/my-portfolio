'use client'

import { useEffect, useRef, useState } from 'react'
import { about } from '@/data/about'

const MENUS = ['File', 'Edit', 'Search', 'Help']

export default function NotepadApp() {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    const text = about.bio
    const interval = setInterval(() => {
      indexRef.current += 1
      if (indexRef.current > text.length) {
        clearInterval(interval)
        setDone(true)
        return
      }
      setTyped(text.slice(0, indexRef.current))
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
      })
    }, 22)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#fff',
        font: '13px "Lucida Console", Consolas, monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '2px 6px',
          background: 'var(--w95-face)',
          borderBottom: '1px solid var(--w95-shadow)',
          boxShadow: 'inset 0 -1px 0 #fff',
          fontFamily: 'var(--font-w95)',
          fontSize: 11,
        }}
      >
        {MENUS.map((m) => (
          <span key={m}>
            <u>{m[0]}</u>
            {m.slice(1)}
          </span>
        ))}
      </div>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '8px 10px',
          color: '#000',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.55,
        }}
      >
        {typed}
        <span
          style={{
            display: 'inline-block',
            width: 7,
            height: 14,
            background: '#000',
            marginLeft: 1,
            verticalAlign: 'text-bottom',
            animation: 'w95-blink 1s steps(2) infinite',
          }}
        />
      </div>
      <div
        style={{
          flex: 'none',
          padding: '2px 6px',
          background: 'var(--w95-face)',
          borderTop: '1px solid #fff',
          boxShadow: 'inset 0 1px 0 var(--w95-shadow)',
          fontFamily: 'var(--font-w95)',
          fontSize: 11,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{done ? 'Ready' : 'Typing…'}</span>
        <span>
          Ln {typed.split('\n').length}, Col {(typed.split('\n').pop() ?? '').length + 1}
        </span>
      </div>
    </div>
  )
}
