'use client'

import { about, experience, featuredProjects, achievements } from '@/data/about'
import { skills } from '@/data/skills'

const MENUS = ['File', 'Edit', 'View', 'Help']

export default function ResumeApp() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#fff', font: '12px "Times New Roman", Times, serif', color: '#000',
    }}>
      {/* Menu bar */}
      <div style={{
        display: 'flex', gap: 12, padding: '2px 6px',
        background: 'var(--w95-face)', borderBottom: '1px solid var(--w95-shadow)',
        boxShadow: 'inset 0 -1px 0 #fff',
        fontFamily: 'var(--font-w95)', fontSize: 11,
      }}>
        {MENUS.map((m) => (
          <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: 6, padding: '4px 6px',
        background: 'var(--w95-face)', borderBottom: '1px solid var(--w95-shadow)',
        fontFamily: 'var(--font-w95)', fontSize: 11,
      }}>
        <a href={about.resume} download style={tbBtn}>📄 Save as PDF</a>
        <a href={`mailto:${about.email}`} style={tbBtn}>✉ Email Me</a>
        <a href={about.linkedin} target="_blank" rel="noopener noreferrer" style={tbBtn}>🔗 LinkedIn</a>
        <a href={about.github} target="_blank" rel="noopener noreferrer" style={tbBtn}>⌥ GitHub</a>
      </div>

      {/* Paper */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: '#e0e0e0', padding: '12px' }}>
        <div style={{
          maxWidth: 720, margin: '0 auto', background: '#fff',
          boxShadow: '0 0 0 1px #000, 4px 4px 0 rgba(0,0,0,0.15)',
          padding: '28px 36px',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: 10, marginBottom: 14 }}>
            <h1 style={{
              margin: 0, fontSize: 26, letterSpacing: 4, fontWeight: 700,
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}>{about.name.toUpperCase()}</h1>
            <div style={{ fontSize: 12, marginTop: 4, color: '#333', fontStyle: 'italic' }}>
              {about.role}
            </div>
            <div style={{ fontSize: 11, marginTop: 6, color: '#000' }}>
              <a href={`mailto:${about.email}`} style={inkLink}>{about.email}</a>
              {'  |  '}{about.phone}{'  |  '}{about.location}
            </div>
            <div style={{ fontSize: 11, marginTop: 2 }}>
              <a href={about.github} target="_blank" rel="noopener noreferrer" style={inkLink}>github.com/ArmanTomar4</a>
              {'  |  '}
              <a href={about.linkedin} target="_blank" rel="noopener noreferrer" style={inkLink}>linkedin.com/in/arman-tomar</a>
            </div>
          </div>

          {/* Experience */}
          <Section title="Experience">
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: 13 }}>
                    {e.company.toUpperCase()} <span style={{ fontWeight: 400 }}>· {e.role}</span>
                  </strong>
                  <span style={{ fontSize: 11, color: '#444', fontStyle: 'italic' }}>
                    {e.start} – {e.end}{e.location ? ` · ${e.location}` : ''}
                  </span>
                </div>
                <ul style={{ margin: '4px 0 0 18px', padding: 0, fontSize: 12, lineHeight: 1.5 }}>
                  {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </Section>

          {/* Projects */}
          <Section title="Projects">
            {featuredProjects.map((p, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div>
                  <strong>{p.name.toUpperCase()}</strong>{' '}
                  <span style={{ fontStyle: 'italic', color: '#444', fontSize: 11 }}>{p.stack}</span>
                </div>
                <ul style={{ margin: '4px 0 0 18px', padding: 0, fontSize: 12, lineHeight: 1.5 }}>
                  {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </Section>

          {/* Two-column row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <Section title="Education">
                <strong>{about.education.school.toUpperCase()}</strong>
                <div style={{ fontSize: 12, marginTop: 2 }}>{about.education.degree}</div>
                <div style={{ fontSize: 11, color: '#444', fontStyle: 'italic', marginTop: 2 }}>
                  Expected {about.education.expected} · {about.education.location}
                </div>
              </Section>
              <Section title="Achievements">
                <ul style={{ margin: '0 0 0 18px', padding: 0, fontSize: 12, lineHeight: 1.6 }}>
                  {achievements.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </Section>
            </div>
            <div>
              <Section title="Skills">
                {skills.map(cat => (
                  <div key={cat.category} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#000' }}>{cat.category}</div>
                    <div style={{ fontSize: 12, color: '#222' }}>{cat.items.join(' · ')}</div>
                  </div>
                ))}
              </Section>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 18, paddingTop: 10, borderTop: '1px solid #999', fontSize: 10, color: '#666', fontStyle: 'italic' }}>
            Page 1 of 1 · Generated by ArmanOS Resume.exe
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        flex: 'none', padding: '2px 6px',
        background: 'var(--w95-face)', borderTop: '1px solid #fff',
        boxShadow: 'inset 0 1px 0 var(--w95-shadow)',
        fontFamily: 'var(--font-w95)', fontSize: 11, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Ready</span>
        <span>Page 1 / 1</span>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{
        margin: '0 0 6px 0', fontSize: 13, letterSpacing: 2, fontWeight: 700,
        borderBottom: '1px solid #000', paddingBottom: 2, textTransform: 'uppercase',
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}>{title}</h2>
      {children}
    </div>
  )
}

const tbBtn: React.CSSProperties = {
  background: 'var(--w95-face)', border: '1px solid var(--w95-shadow)',
  padding: '2px 8px', fontSize: 11, color: '#000', textDecoration: 'none',
  boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 var(--w95-shadow)',
  cursor: 'pointer',
}

const inkLink: React.CSSProperties = {
  color: '#0000aa', textDecoration: 'underline',
}
