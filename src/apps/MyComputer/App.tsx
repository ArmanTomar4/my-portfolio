'use client'

import { useState } from 'react'
import { projects, Project } from '@/data/projects'

interface DriveItem {
  drive: string
  label: string
  freeKB: number
  totalKB: number
  project: Project
}

const DRIVES: DriveItem[] = projects.map((p, i) => ({
  drive: p.drive,
  label: p.name,
  freeKB: 124800 + i * 4097,
  totalKB: 524288,
  project: p,
}))

export default function MyComputerApp() {
  const [openDrive, setOpenDrive] = useState<DriveItem | null>(null)
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
      <MenuBar />
      <Toolbar
        onUp={() => setOpenDrive(null)}
        canUp={!!openDrive}
        path={openDrive ? `My Computer\\${openDrive.drive}` : 'My Computer'}
      />
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
        {openDrive ? (
          <DriveView drive={openDrive} />
        ) : (
          <DriveGrid drives={DRIVES} onOpen={setOpenDrive} />
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
        {openDrive
          ? `${openDrive.project.tech.length} item(s)`
          : `${DRIVES.length} drive(s)`}
      </div>
    </div>
  )
}

function MenuBar() {
  return (
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
  )
}

function Toolbar({ path, canUp, onUp }: { path: string; canUp: boolean; onUp: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 6, borderBottom: '1px solid var(--w95-shadow)', boxShadow: 'inset 0 -1px 0 #fff' }}>
      <button className="w95-btn" disabled={!canUp} onClick={onUp} style={{ opacity: canUp ? 1 : 0.5, minWidth: 56 }}>
        ↑ Up
      </button>
      <span>Address:</span>
      <div
        style={{
          flex: 1,
          padding: '2px 6px',
          background: '#fff',
          boxShadow:
            'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
        }}
      >
        {path}
      </div>
    </div>
  )
}

function DriveGrid({ drives, onOpen }: { drives: DriveItem[]; onOpen: (d: DriveItem) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 16 }}>
      {drives.map((d) => (
        <button
          key={d.drive}
          onDoubleClick={() => onOpen(d)}
          onClick={() => onOpen(d)}
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
          <DriveIcon />
          <span style={{ textAlign: 'center', lineHeight: 1.2 }}>
            ({d.drive})
            <br />
            {d.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function DriveView({ drive }: { drive: DriveItem }) {
  const p = drive.project
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <DriveIcon />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
          <div style={{ color: '#444' }}>Drive {drive.drive}</div>
        </div>
      </div>
      <hr style={{ width: '100%' }} />
      <p style={{ lineHeight: 1.6 }}>{p.description}</p>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Tech used:</div>
        <ul style={{ paddingLeft: 18, lineHeight: 1.7 }}>
          {p.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {p.github && (
          <a className="w95-btn" href={p.github} target="_blank" rel="noopener noreferrer" style={{ textAlign: 'center', textDecoration: 'none', color: '#000', display: 'inline-block', padding: '4px 10px' }}>
            View source
          </a>
        )}
        {p.live && (
          <a className="w95-btn" href={p.live} target="_blank" rel="noopener noreferrer" style={{ textAlign: 'center', textDecoration: 'none', color: '#000', display: 'inline-block', padding: '4px 10px' }}>
            Open live
          </a>
        )}
      </div>
      <div style={{ marginTop: 6 }}>
        <div style={{ fontSize: 11, marginBottom: 2 }}>
          Free space: {(drive.freeKB / 1024).toFixed(0)} MB / {(drive.totalKB / 1024).toFixed(0)} MB
        </div>
        <div
          style={{
            height: 14,
            background: '#fff',
            boxShadow:
              'inset -1px -1px #fff, inset 1px 1px var(--w95-shadow), inset -2px -2px var(--w95-face-light), inset 2px 2px var(--w95-dark)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${((drive.totalKB - drive.freeKB) / drive.totalKB) * 100}%`,
              background: 'repeating-linear-gradient(90deg, #000080 0 6px, #1084d0 6px 10px)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function DriveIcon() {
  return (
    <svg width={36} height={36} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
      <rect x={1} y={4} width={14} height={9} fill="#dfdfdf" stroke="#000" />
      <rect x={3} y={6} width={2} height={2} fill="#22d3ee" />
      <rect x={6} y={6} width={6} height={1} fill="#808080" />
      <rect x={6} y={8} width={6} height={1} fill="#808080" />
      <rect x={6} y={10} width={4} height={1} fill="#808080" />
    </svg>
  )
}
