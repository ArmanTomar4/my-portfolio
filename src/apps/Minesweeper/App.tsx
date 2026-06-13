'use client'

import { useEffect, useMemo, useState } from 'react'

interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  neighbors: number
}

type Difficulty = 'beginner' | 'intermediate'

const PRESETS: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
  beginner:     { rows: 9,  cols: 9,  mines: 10 },
  intermediate: { rows: 12, cols: 12, mines: 25 },
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff', 2: '#008000', 3: '#ff0000', 4: '#000080',
  5: '#800000', 6: '#008080', 7: '#000000', 8: '#808080',
}

function generateBoard(rows: number, cols: number, mines: number, firstR: number, firstC: number): Cell[][] {
  const board: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, neighbors: 0 }))
  )

  const safe = new Set<string>()
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    safe.add(`${firstR + dr},${firstC + dc}`)
  }

  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (board[r][c].mine || safe.has(`${r},${c}`)) continue
    board[r][c].mine = true
    placed++
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue
      let n = 0
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) n++
      }
      board[r][c].neighbors = n
    }
  }
  return board
}

export default function MinesweeperApp() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const { rows, cols, mines } = PRESETS[difficulty]
  const [board, setBoard] = useState<Cell[][] | null>(null)
  const [status, setStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle')
  const [time, setTime] = useState(0)
  const [flagsPlaced, setFlagsPlaced] = useState(0)

  useEffect(() => {
    if (status !== 'playing') return
    const interval = setInterval(() => setTime((t) => Math.min(999, t + 1)), 1000)
    return () => clearInterval(interval)
  }, [status])

  const reset = (d: Difficulty = difficulty) => {
    setDifficulty(d)
    setBoard(null)
    setStatus('idle')
    setTime(0)
    setFlagsPlaced(0)
  }

  const reveal = (r: number, c: number) => {
    if (status === 'won' || status === 'lost') return
    let next = board ? board.map((row) => row.map((cell) => ({ ...cell }))) : generateBoard(rows, cols, mines, r, c)
    if (status === 'idle') setStatus('playing')
    const cell = next[r][c]
    if (cell.flagged || cell.revealed) return

    if (cell.mine) {
      next = next.map((row) => row.map((c) => (c.mine ? { ...c, revealed: true } : c)))
      setBoard(next)
      setStatus('lost')
      return
    }

    const stack: [number, number][] = [[r, c]]
    while (stack.length) {
      const [cr, cc] = stack.pop()!
      if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue
      const cell = next[cr][cc]
      if (cell.revealed || cell.flagged) continue
      cell.revealed = true
      if (cell.neighbors === 0 && !cell.mine) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (dr || dc) stack.push([cr + dr, cc + dc])
        }
      }
    }

    setBoard(next)
    const unrevealed = next.flat().filter((cell) => !cell.revealed).length
    if (unrevealed === mines) setStatus('won')
  }

  const toggleFlag = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault()
    if (!board || status === 'won' || status === 'lost') return
    const next = board.map((row) => row.map((cell) => ({ ...cell })))
    if (next[r][c].revealed) return
    next[r][c].flagged = !next[r][c].flagged
    setBoard(next)
    setFlagsPlaced(next.flat().filter((cell) => cell.flagged).length)
  }

  const minesLeft = mines - flagsPlaced
  const face = status === 'won' ? '😎' : status === 'lost' ? '💀' : '🙂'

  const view = useMemo(() => board ?? generateBoard(rows, cols, mines, -1, -1), [board, rows, cols, mines])

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
      <div style={{ display: 'flex', gap: 4, fontSize: 11 }}>
        {(Object.keys(PRESETS) as Difficulty[]).map((d) => (
          <button
            key={d}
            className="w95-btn"
            onClick={() => reset(d)}
            style={{ minWidth: 80, fontWeight: difficulty === d ? 700 : 400 }}
          >
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <div
        style={{
          background: 'var(--w95-face)',
          padding: 6,
          boxShadow:
            'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Digits value={minesLeft} />
        <button
          className="w95-btn"
          onClick={() => reset()}
          style={{ width: 28, height: 28, padding: 0, fontSize: 18, minWidth: 'auto' }}
        >
          {face}
        </button>
        <Digits value={time} />
      </div>

      <div
        style={{
          background: 'var(--w95-face)',
          padding: 4,
          boxShadow:
            'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 22px)`,
            gridTemplateRows: `repeat(${rows}, 22px)`,
            gap: 0,
            justifyContent: 'center',
          }}
        >
          {view.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => reveal(r, c)}
                onContextMenu={(e) => toggleFlag(r, c, e)}
                style={{
                  width: 22,
                  height: 22,
                  background: cell.revealed ? '#bdbdbd' : 'var(--w95-face)',
                  border: 'none',
                  boxShadow: cell.revealed
                    ? 'inset 1px 1px 0 #808080'
                    : 'inset -1px -1px #000, inset 1px 1px #fff, inset -2px -2px var(--w95-shadow), inset 2px 2px var(--w95-face-light)',
                  fontWeight: 700,
                  fontSize: 14,
                  fontFamily: 'var(--font-w95)',
                  color: NUMBER_COLORS[cell.neighbors] ?? '#000',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'center',
                }}
              >
                {cell.revealed
                  ? cell.mine
                    ? '💣'
                    : cell.neighbors > 0
                      ? cell.neighbors
                      : ''
                  : cell.flagged
                    ? '🚩'
                    : ''}
              </button>
            ))
          )}
        </div>
      </div>

      <div style={{ fontSize: 11, textAlign: 'center', color: 'var(--w95-shadow)' }}>
        Left click to reveal · Right click to flag
      </div>
    </div>
  )
}

function Digits({ value }: { value: number }) {
  const text = Math.max(-99, Math.min(999, value)).toString().padStart(3, '0')
  return (
    <div
      style={{
        background: '#000',
        color: '#ff0000',
        padding: '2px 6px',
        font: 'bold 20px "Lucida Console", Consolas, monospace',
        letterSpacing: 2,
        boxShadow: 'inset 1px 1px 0 #808080',
        minWidth: 56,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  )
}
