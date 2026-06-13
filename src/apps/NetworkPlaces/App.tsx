'use client'

import { useState } from 'react'
import { skills } from '@/data/skills'

export default function NetworkPlacesApp() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const current = skills.find((s) => s.category === openCategory)

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
      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '2px 6px',
          borderBottom: '1px solid var(--w95-shadow)',
          boxShadow: 'inset 0 -1px 0 #fff',
        }}
      >
        {['File', 'Edit', 'View', 'Help'].map((m) => (
          <span key={m}>
            <u>{m[0]}</u>
            {m.slice(1)}
          </span>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: 6,
          alignItems: 'center',
          borderBottom: '1px solid var(--w95-shadow)',
          boxShadow: 'inset 0 -1px 0 #fff',
        }}
      >
        <button
          className="w95-btn"
          onClick={() => setOpenCategory(null)}
          disabled={!openCategory}
          style={{ opacity: openCategory ? 1 : 0.5, minWidth: 56 }}
        >
          ↑ Up
        </button>
        <span>Path:</span>
        <div
          style={{
            flex: 1,
            padding: '2px 6px',
            background: '#fff',
            boxShadow:
              'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
          }}
        >
          \\\\ARMAN-NET\\TechStack{openCategory ? `\\${openCategory}` : ''}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: '#fff',
          color: '#000',
          padding: 14,
        }}
      >
        {current ? (
          <CategoryView name={current.category} items={current.items} color={current.color} />
        ) : (
          <CategoryGrid onOpen={setOpenCategory} />
        )}
      </div>

      <div
        style={{
          flex: 'none',
          padding: '2px 6px',
          borderTop: '1px solid #fff',
          boxShadow: 'inset 0 1px 0 var(--w95-shadow)',
        }}
      >
        {current ? `${current.items.length} item(s)` : `${skills.length} category(s)`}
      </div>
    </div>
  )
}

function CategoryGrid({ onOpen }: { onOpen: (name: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 16 }}>
      {skills.map((s) => (
        <button
          key={s.category}
          onClick={() => onOpen(s.category)}
          onDoubleClick={() => onOpen(s.category)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: 6,
            color: '#000',
            font: 'inherit',
          }}
        >
          <ServerIcon color={s.color} />
          <span style={{ textAlign: 'center', lineHeight: 1.2 }}>{s.category}</span>
        </button>
      ))}
    </div>
  )
}

function CategoryView({ name, items, color }: { name: string; items: string[]; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <ServerIcon color={color} large />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
          <div style={{ color: '#444' }}>{items.length} technologies</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: 6,
            }}
          >
            <CableIcon color={color} />
            <span style={{ textAlign: 'center', lineHeight: 1.2, fontSize: 11 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServerIcon({ color, large }: { color: string; large?: boolean }) {
  const s = large ? 48 : 36
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
      <rect x={2} y={1} width={12} height={5} fill="#c0c0c0" stroke="#000" />
      <rect x={4} y={3} width={6} height={1} fill={color} />
      <rect x={11} y={3} width={2} height={1} fill="#fff" />
      <rect x={2} y={7} width={12} height={5} fill="#c0c0c0" stroke="#000" />
      <rect x={4} y={9} width={6} height={1} fill={color} />
      <rect x={11} y={9} width={2} height={1} fill="#fff" />
      <rect x={7} y={13} width={2} height={2} fill="#808080" />
    </svg>
  )
}

function CableIcon({ color }: { color: string }) {
  return (
    <svg width={32} height={32} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
      <rect x={5} y={2} width={6} height={10} fill="#dfdfdf" stroke="#000" />
      <rect x={6} y={3} width={4} height={3} fill={color} />
      <rect x={6} y={7} width={4} height={1} fill="#000" />
      <rect x={6} y={9} width={4} height={2} fill="#808080" />
      <rect x={4} y={12} width={8} height={2} fill="#808080" stroke="#000" />
    </svg>
  )
}
