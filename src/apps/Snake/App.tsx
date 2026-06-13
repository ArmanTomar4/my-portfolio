'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const COLS = 20
const ROWS = 18
const CELL = 14

type Dir = 'up' | 'down' | 'left' | 'right'

interface Point { x: number; y: number }

const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }
const VECTORS: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

function randomFood(snake: Point[]): Point {
  while (true) {
    const f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f
  }
}

export default function SnakeApp() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }])
  const [dir, setDir] = useState<Dir>('right')
  const [pendingDir, setPendingDir] = useState<Dir>('right')
  const [food, setFood] = useState<Point>({ x: 14, y: 9 })
  const [status, setStatus] = useState<'idle' | 'playing' | 'over'>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    const start: Point[] = [{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }]
    setSnake(start)
    setDir('right')
    setPendingDir('right')
    setFood(randomFood(start))
    setScore(0)
    setStatus('playing')
  }, [])

  useEffect(() => {
    if (status !== 'playing') return
    const interval = 100 - Math.min(60, score * 4)
    const tick = () => {
      setSnake((prev) => {
        let nextDir = pendingDir
        if (OPPOSITE[nextDir] === dir) nextDir = dir
        setDir(nextDir)
        const v = VECTORS[nextDir]
        const head = { x: prev[0].x + v.x, y: prev[0].y + v.y }
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
          setStatus('over')
          setBest((b) => Math.max(b, score))
          return prev
        }
        if (prev.some((p) => p.x === head.x && p.y === head.y)) {
          setStatus('over')
          setBest((b) => Math.max(b, score))
          return prev
        }
        const grew = head.x === food.x && head.y === food.y
        const next = [head, ...prev]
        if (!grew) next.pop()
        else {
          setScore((s) => s + 1)
          setFood(randomFood(next))
        }
        return next
      })
      tickRef.current = setTimeout(tick, interval)
    }
    tickRef.current = setTimeout(tick, interval)
    return () => {
      if (tickRef.current) clearTimeout(tickRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pendingDir, score])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault()
      if (status === 'idle' || status === 'over') {
        if (e.key === ' ' || e.key === 'Enter') reset()
      }
      const map: Record<string, Dir> = {
        ArrowUp: 'up', w: 'up', W: 'up',
        ArrowDown: 'down', s: 'down', S: 'down',
        ArrowLeft: 'left', a: 'left', A: 'left',
        ArrowRight: 'right', d: 'right', D: 'right',
      }
      if (map[e.key]) setPendingDir(map[e.key])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reset, status])

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--w95-face)',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontFamily: 'var(--font-w95)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span>Score: <b>{score}</b></span>
        <span>Best: <b>{best}</b></span>
        <button className="w95-btn" onClick={reset}>New</button>
      </div>
      <div
        style={{
          position: 'relative',
          width: COLS * CELL,
          height: ROWS * CELL,
          margin: '0 auto',
          background: '#0b1f0b',
          boxShadow:
            'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
        }}
      >
        {snake.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x * CELL,
              top: s.y * CELL,
              width: CELL,
              height: CELL,
              background: i === 0 ? '#a4ff9a' : '#2dd72d',
              border: '1px solid #052305',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: food.x * CELL,
            top: food.y * CELL,
            width: CELL,
            height: CELL,
            background: '#ff5252',
            borderRadius: '50%',
            border: '1px solid #4a0000',
          }}
        />
        {status !== 'playing' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontFamily: 'var(--font-w95)',
            }}
          >
            <div style={{ fontSize: 18 }}>{status === 'over' ? 'Game Over' : 'Snake'}</div>
            <button className="w95-btn" onClick={reset}>
              {status === 'over' ? 'Play again' : 'Start'}
            </button>
            <div style={{ fontSize: 10, opacity: 0.8 }}>arrows / WASD · space to restart</div>
          </div>
        )}
      </div>
      <div style={{ fontSize: 11, textAlign: 'center', color: 'var(--w95-shadow)' }}>
        Click into the desktop first so the game gets keyboard focus.
      </div>
    </div>
  )
}
