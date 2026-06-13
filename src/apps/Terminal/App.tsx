'use client'

import { useEffect, useRef, useState } from 'react'
import { about } from '@/data/about'
import { projects } from '@/data/projects'
import { skills } from '@/data/skills'

interface Line {
  prompt?: string
  text: string
  color?: string
}

const PROMPT = 'C:\\Users\\Arman>'

const BANNER = [
  '',
  ' Microsoft(R) Windows 95',
  '   (C)Copyright Microsoft Corp 1981-1995.',
  '',
  ' Type HELP to see available commands.',
  '',
]

const HELP_TEXT = `Available commands:
  HELP        Show this list
  WHOAMI      Display info about the user
  PROJECTS    List projects
  SKILLS      List skill categories
  CONTACT     Show contact details
  GITHUB      Open GitHub profile
  LINKEDIN    Open LinkedIn profile
  CLS / CLEAR Clear the screen
  HACK        Initiate hostile takeover
  EXIT        Close the terminal`

export default function TerminalApp() {
  const [history, setHistory] = useState<Line[]>(BANNER.map((t) => ({ text: t })))
  const [input, setInput] = useState('')
  const [matrix, setMatrix] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [history])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [])

  const push = (lines: (string | Line)[]) =>
    setHistory((prev) => [
      ...prev,
      ...lines.map((l) => (typeof l === 'string' ? { text: l } : l)),
    ])

  const exec = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    push([{ prompt: PROMPT, text: raw }])
    if (!cmd) return
    switch (cmd) {
      case 'help':
      case '?':
        push([HELP_TEXT])
        break
      case 'whoami':
        push([
          `${about.name}`,
          `${about.role}`,
          `GitHub:   ${about.github}`,
          `LinkedIn: ${about.linkedin}`,
        ])
        break
      case 'projects':
        push([
          ...projects.map(
            (p) => `${p.drive}  ${p.name.padEnd(18)}  ${p.tech.slice(0, 3).join(', ')}`
          ),
        ])
        break
      case 'skills':
        push([
          ...skills.map(
            (cat) => `[${cat.category}] ${cat.items.join(', ')}`
          ),
        ])
        break
      case 'contact':
        push([
          'Email:    tomararman4@gmail.com',
          `GitHub:   ${about.github}`,
          `LinkedIn: ${about.linkedin}`,
        ])
        break
      case 'github':
        push(['Opening GitHub...'])
        window.open(about.github, '_blank')
        break
      case 'linkedin':
        push(['Opening LinkedIn...'])
        window.open(about.linkedin, '_blank')
        break
      case 'cls':
      case 'clear':
        setHistory([])
        break
      case 'hack':
        push(['Initiating hostile takeover...'])
        setMatrix(true)
        try { localStorage.setItem('ach:used-hack', '1') } catch {}
        break
      case 'exit':
        push(['Bye.'])
        break
      case 'ls':
      case 'dir':
        push([
          'Volume in drive C is WINDOWS95',
          ' Directory of C:\\Users\\Arman',
          '',
          'About.txt     Projects/     Skills.dat',
          'Contact.eml   Resume.doc    Easter.egg',
          '',
          '       6 file(s)         42 bytes',
          '       2 dir(s)   8,192 bytes free',
        ])
        break
      default:
        push([`'${raw}' is not recognized as an internal or external command.`])
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    exec(input)
    setInput('')
  }

  return (
    <div
      style={{
        height: '100%',
        background: '#000',
        color: '#c0c0c0',
        font: '13px "Lucida Console", Consolas, monospace',
        padding: '6px 8px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {history.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', color: line.color ?? '#c0c0c0' }}>
            {line.prompt ? (
              <>
                <span style={{ color: '#fff' }}>{line.prompt}</span> {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
        <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#fff' }}>{PROMPT}</span>
          <span style={{ width: 6 }} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: 1,
              background: 'transparent',
              color: '#c0c0c0',
              border: 'none',
              outline: 'none',
              font: 'inherit',
              padding: 0,
            }}
          />
        </form>
      </div>

      {matrix && <MatrixOverlay onExit={() => setMatrix(false)} />}
    </div>
  )
}

function MatrixOverlay({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => {
      const r = canvas.parentElement?.getBoundingClientRect()
      if (!r) return
      canvas.width = r.width
      canvas.height = r.height
    }
    resize()
    const columns = Math.floor(canvas.width / 14)
    const drops = Array.from({ length: columns }, () => Math.random() * -30)
    const chars = '01アカサタナハマヤラワABCDEF#$%&*+ARMAN'

    let raf = 0
    let frame = 0
    const tick = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '14px monospace'
      ctx.fillStyle = '#00ff66'
      for (let i = 0; i < drops.length; i++) {
        const text = chars[(Math.random() * chars.length) | 0]
        ctx.fillText(text, i * 14, drops[i] * 14)
        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      frame++
      if (frame > 360) {
        cancelAnimationFrame(raf)
        onExit()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onExit])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000',
        cursor: 'pointer',
      }}
      onClick={onExit}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#00ff66',
          font: '11px monospace',
          textShadow: '0 0 4px #00ff66',
        }}
      >
        access granted — click anywhere to exit
      </div>
    </div>
  )
}
