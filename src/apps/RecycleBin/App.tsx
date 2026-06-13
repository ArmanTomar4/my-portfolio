'use client'

import { useState } from 'react'

interface DeletedItem {
  name: string
  type: string
  size: string
  deleted: string
  origin: string
  description: string
}

const ITEMS: DeletedItem[] = [
  {
    name: 'portfolio_v1_with_bootstrap.html',
    type: 'HTML Document',
    size: '47 KB',
    deleted: '03/14/2022',
    origin: 'C:\\OldStuff',
    description: 'My first portfolio. Used Bootstrap for everything. Looked like every other portfolio in 2022. Forgive me.',
  },
  {
    name: 'dark_mode_toggle_v3.psd',
    type: 'Photoshop File',
    size: '12.4 MB',
    deleted: '08/02/2023',
    origin: 'C:\\Designs\\Rejected',
    description: 'Spent two days designing the perfect dark mode toggle. Client wanted a basic switch. Three versions later, they picked v1.',
  },
  {
    name: 'side_project_idea_47.txt',
    type: 'Text Document',
    size: '2 KB',
    deleted: '11/19/2024',
    origin: 'C:\\Ideas',
    description: '"AI-powered todo list" — yeah, that ship has sailed about a million times.',
  },
  {
    name: 'css_centering_attempt_8.css',
    type: 'CSS File',
    size: '3 KB',
    deleted: '01/05/2025',
    origin: 'C:\\Projects\\WhyDoesntThisWork',
    description: 'I just wanted to center a div. This file alone has 8 different approaches. None worked. (Flexbox saved me eventually.)',
  },
  {
    name: 'freelance_client_no_signal.eml',
    type: 'Email',
    size: '4 KB',
    deleted: '06/12/2025',
    origin: 'C:\\Emails\\Ghosted',
    description: '"Hey! Loved the proposal. Will send the contract Monday." — Sent on a Tuesday. Last heard from: never.',
  },
  {
    name: 'sleep_schedule.bak',
    type: 'Backup File',
    size: '0 KB',
    deleted: '02/28/2026',
    origin: 'C:\\Lifestyle',
    description: 'File is corrupted. Has been corrupted since 2020. Will probably never be restored.',
  },
  {
    name: 'TODO_for_today.docx',
    type: 'Word Document',
    size: '8 KB',
    deleted: '06/12/2026',
    origin: 'C:\\Documents',
    description: '47 items. 2 completed. Both were "make coffee." Moved to recycle bin out of mercy.',
  },
]

const FOLDER_PIXELS = [
  '................',
  '..kkkkk.........',
  '.kFFFFFkkkkkkkk.',
  '.kFFFFFFFFFFFFk.',
  '.kFFFFFFFFFFFFk.',
  '.kFFFFFFFFFFFFk.',
  '.kFFFFFFFFFFFFk.',
  '.kFFFFFFFFFFFFk.',
  '.kkkkkkkkkkkkkk.',
  '................',
]

export default function RecycleBinApp() {
  const [selected, setSelected] = useState<DeletedItem | null>(null)

  if (selected) {
    return <DetailView item={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          background: '#fff',
          color: '#000',
          fontFamily: 'var(--font-w95)',
          fontSize: 11,
          padding: 8,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--w95-face)', textAlign: 'left' }}>
              {['Name', 'Original Location', 'Deleted', 'Type', 'Size'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '3px 8px',
                    borderRight: '1px solid var(--w95-shadow)',
                    fontWeight: 700,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, i) => (
              <tr
                key={item.name}
                onClick={() => setSelected(item)}
                style={{
                  cursor: 'pointer',
                  background: i % 2 === 0 ? '#fff' : '#f6f6f6',
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <td style={{ padding: '3px 8px', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <FolderPixel />
                  {item.name}
                </td>
                <td style={{ padding: '3px 8px' }}>{item.origin}</td>
                <td style={{ padding: '3px 8px' }}>{item.deleted}</td>
                <td style={{ padding: '3px 8px' }}>{item.type}</td>
                <td style={{ padding: '3px 8px' }}>{item.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Statusbar count={ITEMS.length} />
    </div>
  )
}

function Toolbar() {
  return (
    <div
      style={{
        flex: 'none',
        padding: '2px 6px',
        background: 'var(--w95-face)',
        borderBottom: '1px solid var(--w95-shadow)',
        boxShadow: 'inset 0 -1px 0 #fff',
        fontFamily: 'var(--font-w95)',
        fontSize: 11,
        display: 'flex',
        gap: 12,
      }}
    >
      {['File', 'Edit', 'View', 'Help'].map((m) => (
        <span key={m}>
          <u>{m[0]}</u>
          {m.slice(1)}
        </span>
      ))}
    </div>
  )
}

function Statusbar({ count }: { count: number }) {
  return (
    <div
      style={{
        flex: 'none',
        padding: '2px 6px',
        background: 'var(--w95-face)',
        borderTop: '1px solid #fff',
        boxShadow: 'inset 0 1px 0 var(--w95-shadow)',
        fontFamily: 'var(--font-w95)',
        fontSize: 11,
      }}
    >
      {count} object(s)
    </div>
  )
}

function FolderPixel() {
  const P: Record<string, string> = { k: '#000', F: '#ffd24a' }
  return (
    <svg viewBox="0 0 16 10" width={16} height={10} shapeRendering="crispEdges" aria-hidden>
      {FOLDER_PIXELS.flatMap((row, y) => {
        const rects = []
        let x = 0
        while (x < row.length) {
          const c = row[x]
          if (c === '.') {
            x++
            continue
          }
          let end = x + 1
          while (end < row.length && row[end] === c) end++
          rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} fill={P[c]} />)
          x = end
        }
        return rects
      })}
    </svg>
  )
}

function DetailView({ item, onBack }: { item: DeletedItem; onBack: () => void }) {
  return (
    <div
      style={{
        height: '100%',
        background: '#fff',
        fontFamily: 'var(--font-w95)',
        fontSize: 12,
        padding: 14,
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div>
        <button className="w95-btn" onClick={onBack}>
          ← Back
        </button>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 14px', fontSize: 11 }}>
        <span>Type:</span><span>{item.type}</span>
        <span>Size:</span><span>{item.size}</span>
        <span>Origin:</span><span>{item.origin}</span>
        <span>Deleted:</span><span>{item.deleted}</span>
      </div>
      <hr style={{ width: '100%' }} />
      <p style={{ lineHeight: 1.6 }}>{item.description}</p>
      <div style={{ marginTop: 'auto', color: 'var(--w95-shadow)', fontSize: 10 }}>
        Note: Permanently deleted. Please don&apos;t ask to restore it.
      </div>
    </div>
  )
}
