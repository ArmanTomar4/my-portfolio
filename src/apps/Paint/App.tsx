'use client'

import { useEffect, useRef, useState } from 'react'
import { skills } from '@/data/skills'

type Tool = 'pencil' | 'brush' | 'eraser' | 'line' | 'rect' | 'ellipse' | 'fill' | 'text'

const COLORS = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200',
  '#22b14c', '#00a2e8', '#3f48cc', '#a349a4', '#ffaec9', '#ffc90e',
  '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7', '#ffffff',
]

const SIZES = [1, 2, 4, 6, 10]

const TOOL_GLYPHS: Record<Tool, string> = {
  pencil: '✏',
  brush: '🖌',
  eraser: '▭',
  line: '╱',
  rect: '▢',
  ellipse: '◯',
  fill: '⛁',
  text: 'T',
}

interface Point { x: number; y: number }

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tool, setTool] = useState<Tool>('pencil')
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(2)
  const drawing = useRef(false)
  const startPoint = useRef<Point | null>(null)
  const lastPoint = useRef<Point | null>(null)
  const [coords, setCoords] = useState<Point>({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    const container = containerRef.current
    if (!canvas || !overlay || !container) return
    const r = container.getBoundingClientRect()
    canvas.width = r.width
    canvas.height = r.height
    overlay.width = r.width
    overlay.height = r.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    drawWelcomeNote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const drawWelcomeNote = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#000080'
    ctx.font = 'bold 22px serif'
    ctx.fillText("Arman's Skills", 24, 36)
    ctx.font = '13px serif'
    ctx.fillStyle = '#000'
    let y = 60
    skills.forEach((cat) => {
      ctx.fillStyle = cat.color
      ctx.font = 'bold 14px serif'
      ctx.fillText(`▸ ${cat.category}`, 24, y)
      y += 18
      ctx.fillStyle = '#000'
      ctx.font = '12px serif'
      cat.items.forEach((s) => {
        ctx.fillText(`  • ${s}`, 30, y)
        y += 15
      })
      y += 6
    })
    ctx.fillStyle = '#444'
    ctx.font = 'italic 11px serif'
    ctx.fillText('(now go ahead and draw on this)', 24, y + 8)
  }

  const getPoint = (e: React.PointerEvent): Point => {
    const r = canvasRef.current!.getBoundingClientRect()
    return { x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) }
  }

  const startDraw = (e: React.PointerEvent) => {
    canvasRef.current?.setPointerCapture(e.pointerId)
    drawing.current = true
    try { localStorage.setItem('ach:painted', '1') } catch {}
    const p = getPoint(e)
    startPoint.current = p
    lastPoint.current = p
    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      const ctx = canvasRef.current!.getContext('2d')!
      ctx.fillStyle = tool === 'eraser' ? bgColor : color
      ctx.beginPath()
      ctx.arc(p.x, p.y, (tool === 'brush' ? size * 2 : size) / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (tool === 'fill') {
      floodFill(p.x, p.y, color)
      drawing.current = false
    }
  }

  const moveDraw = (e: React.PointerEvent) => {
    const p = getPoint(e)
    setCoords(p)
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const overlay = overlayRef.current!.getContext('2d')!
    overlay.clearRect(0, 0, overlayRef.current!.width, overlayRef.current!.height)
    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      const last = lastPoint.current!
      ctx.strokeStyle = tool === 'eraser' ? bgColor : color
      ctx.lineWidth = tool === 'brush' ? size * 2 : size
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      lastPoint.current = p
    } else if (tool === 'line') {
      const s = startPoint.current!
      overlay.strokeStyle = color
      overlay.lineWidth = size
      overlay.beginPath()
      overlay.moveTo(s.x, s.y)
      overlay.lineTo(p.x, p.y)
      overlay.stroke()
    } else if (tool === 'rect') {
      const s = startPoint.current!
      overlay.strokeStyle = color
      overlay.lineWidth = size
      overlay.strokeRect(s.x, s.y, p.x - s.x, p.y - s.y)
    } else if (tool === 'ellipse') {
      const s = startPoint.current!
      overlay.strokeStyle = color
      overlay.lineWidth = size
      overlay.beginPath()
      overlay.ellipse(
        (s.x + p.x) / 2,
        (s.y + p.y) / 2,
        Math.abs(p.x - s.x) / 2,
        Math.abs(p.y - s.y) / 2,
        0, 0, Math.PI * 2,
      )
      overlay.stroke()
    }
  }

  const endDraw = (e: React.PointerEvent) => {
    if (!drawing.current) return
    drawing.current = false
    const p = getPoint(e)
    const ctx = canvasRef.current!.getContext('2d')!
    const overlay = overlayRef.current!.getContext('2d')!
    if (tool === 'line') {
      const s = startPoint.current!
      ctx.strokeStyle = color
      ctx.lineWidth = size
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    } else if (tool === 'rect') {
      const s = startPoint.current!
      ctx.strokeStyle = color
      ctx.lineWidth = size
      ctx.strokeRect(s.x, s.y, p.x - s.x, p.y - s.y)
    } else if (tool === 'ellipse') {
      const s = startPoint.current!
      ctx.strokeStyle = color
      ctx.lineWidth = size
      ctx.beginPath()
      ctx.ellipse(
        (s.x + p.x) / 2,
        (s.y + p.y) / 2,
        Math.abs(p.x - s.x) / 2,
        Math.abs(p.y - s.y) / 2,
        0, 0, Math.PI * 2,
      )
      ctx.stroke()
    }
    overlay.clearRect(0, 0, overlayRef.current!.width, overlayRef.current!.height)
  }

  const floodFill = (x: number, y: number, fillColor: string) => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = img.data
    const target = [data[(y * canvas.width + x) * 4], data[(y * canvas.width + x) * 4 + 1], data[(y * canvas.width + x) * 4 + 2], data[(y * canvas.width + x) * 4 + 3]]
    const fill = hexToRgb(fillColor)
    if (target[0] === fill.r && target[1] === fill.g && target[2] === fill.b) return
    const stack: number[][] = [[x, y]]
    while (stack.length) {
      const [cx, cy] = stack.pop()!
      if (cx < 0 || cy < 0 || cx >= canvas.width || cy >= canvas.height) continue
      const i = (cy * canvas.width + cx) * 4
      if (data[i] !== target[0] || data[i + 1] !== target[1] || data[i + 2] !== target[2] || data[i + 3] !== target[3]) continue
      data[i] = fill.r
      data[i + 1] = fill.g
      data[i + 2] = fill.b
      data[i + 3] = 255
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1])
    }
    ctx.putImageData(img, 0, 0)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const saveCanvas = () => {
    const url = canvasRef.current!.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'arman-paint.png'
    a.click()
  }

  return (
    <div
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
        {['File', 'Edit', 'View', 'Image', 'Help'].map((m) => (
          <span key={m}>
            <u>{m[0]}</u>
            {m.slice(1)}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, padding: 4, borderBottom: '1px solid var(--w95-shadow)', boxShadow: 'inset 0 -1px 0 #fff' }}>
        <button className="w95-btn" onClick={clearCanvas}>Clear</button>
        <button className="w95-btn" onClick={saveCanvas}>Save PNG</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Size:</span>
          {SIZES.map((s) => (
            <button
              key={s}
              className="w95-btn"
              onClick={() => setSize(s)}
              style={{ minWidth: 28, fontWeight: size === s ? 700 : 400, background: size === s ? '#dfdfdf' : undefined }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: 'none', width: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 4, background: 'var(--w95-face)', borderRight: '1px solid var(--w95-shadow)', boxShadow: 'inset -1px 0 0 #fff', alignContent: 'start' }}>
          {(Object.keys(TOOL_GLYPHS) as Tool[]).map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className="w95-btn"
              style={{
                minWidth: 'auto',
                width: 22,
                height: 22,
                padding: 0,
                fontWeight: 700,
                fontSize: 14,
                background: tool === t ? '#dfdfdf' : 'var(--w95-face)',
                boxShadow: tool === t
                  ? 'inset -1px -1px #fff, inset 1px 1px var(--w95-dark), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-shadow)'
                  : undefined,
              }}
              title={t}
            >
              {TOOL_GLYPHS[t]}
            </button>
          ))}
        </div>

        <div
          ref={containerRef}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'var(--w95-face)',
            padding: 6,
            position: 'relative',
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerCancel={endDraw}
            style={{
              position: 'absolute',
              inset: 6,
              width: 'calc(100% - 12px)',
              height: 'calc(100% - 12px)',
              cursor: 'crosshair',
              background: '#fff',
              boxShadow:
                'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
              touchAction: 'none',
            }}
          />
          <canvas
            ref={overlayRef}
            style={{
              position: 'absolute',
              inset: 6,
              width: 'calc(100% - 12px)',
              height: 'calc(100% - 12px)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 'none', display: 'flex', gap: 10, padding: 6, alignItems: 'center', borderTop: '1px solid #fff', boxShadow: 'inset 0 1px 0 var(--w95-shadow)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ColorChip color={color} large />
          <ColorChip color={bgColor} small />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 18px)', gap: 1 }}>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              onContextMenu={(e) => {
                e.preventDefault()
                setBgColor(c)
              }}
              title={`Click: fg · Right-click: bg`}
              style={{
                width: 18,
                height: 18,
                background: c,
                border: '1px solid #000',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11 }}>
          x: {coords.x}, y: {coords.y}
        </div>
      </div>
    </div>
  )
}

function ColorChip({ color, large, small }: { color: string; large?: boolean; small?: boolean }) {
  const size = large ? 18 : small ? 14 : 16
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        border: '1px solid #000',
        boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.3)',
      }}
    />
  )
}

function hexToRgb(hex: string) {
  const v = hex.replace('#', '')
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  }
}
