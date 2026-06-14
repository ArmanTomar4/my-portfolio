/* SVG glyphs that sit inside iOS app icons.
   All sized to a 36×36 viewBox so they read well on any tile background. */

type GlyphProps = { size?: number }

const wrap = (size: number, children: React.ReactNode) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    {children}
  </svg>
)

export function SafariGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <circle cx="18" cy="18" r="15" fill="#f1f5f9" />
      <circle cx="18" cy="18" r="11" fill="#1e3a8a" />
      <path d="M18 7 L20 16 L29 18 L20 20 L18 29 L16 20 L7 18 L16 16 Z" fill="#fff" />
      <polygon points="18,8 21,17 30,18 21,19 18,28 15,19 6,18 15,17" fill="#dc2626" opacity="0.85" />
    </>
  )
}

export function NotesGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="6" y="5" width="24" height="26" rx="2" fill="#fffbe6" />
      <rect x="6" y="5" width="24" height="4" fill="#8b6f2a" />
      <line x1="9" y1="14" x2="27" y2="14" stroke="#c79a3a" strokeWidth="0.6" />
      <line x1="9" y1="19" x2="27" y2="19" stroke="#c79a3a" strokeWidth="0.6" />
      <line x1="9" y1="24" x2="27" y2="24" stroke="#c79a3a" strokeWidth="0.6" />
    </>
  )
}

export function ContactsGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="6" y="5" width="24" height="26" rx="2" fill="#fdf6e3" />
      <rect x="6" y="5" width="24" height="26" rx="2" fill="none" stroke="#92642a" strokeWidth="1" />
      <circle cx="18" cy="15" r="4" fill="#a06a3a" />
      <path d="M11 27 C 12 22 24 22 25 27 Z" fill="#a06a3a" />
      <rect x="26" y="9" width="3" height="2" fill="#b1854a" />
      <rect x="26" y="13" width="3" height="2" fill="#b1854a" />
      <rect x="26" y="17" width="3" height="2" fill="#b1854a" />
    </>
  )
}

export function MessagesGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <path d="M6 9 C 6 7 8 5 10 5 H 26 C 28 5 30 7 30 9 V 21 C 30 23 28 25 26 25 H 16 L 10 30 L 10 25 H 10 C 8 25 6 23 6 21 Z" fill="#fff" />
      <circle cx="13" cy="15" r="1.6" fill="#7dd87d" />
      <circle cx="18" cy="15" r="1.6" fill="#7dd87d" />
      <circle cx="23" cy="15" r="1.6" fill="#7dd87d" />
    </>
  )
}

export function PhotosGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      {[
        { c: '#ef4444', a: 0 },
        { c: '#f59e0b', a: 1 },
        { c: '#eab308', a: 2 },
        { c: '#84cc16', a: 3 },
        { c: '#06b6d4', a: 4 },
        { c: '#6366f1', a: 5 },
        { c: '#a855f7', a: 6 },
        { c: '#ec4899', a: 7 },
      ].map(({ c, a }) => {
        const angle = (a * Math.PI) / 4
        const cx = 18 + Math.cos(angle) * 8
        const cy = 18 + Math.sin(angle) * 8
        return <ellipse key={a} cx={cx} cy={cy} rx={6} ry={4.5} fill={c} transform={`rotate(${(a * 45)} ${cx} ${cy})`} />
      })}
      <circle cx="18" cy="18" r="3" fill="#fff" />
    </>
  )
}

export function CameraGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="4" y="10" width="28" height="20" rx="3" fill="#3f3f46" />
      <rect x="11" y="7" width="9" height="5" rx="1" fill="#3f3f46" />
      <circle cx="18" cy="20" r="6" fill="#0a0a0a" />
      <circle cx="18" cy="20" r="4" fill="#1e3a8a" />
      <circle cx="16.5" cy="18.5" r="1" fill="#fff" opacity="0.6" />
      <circle cx="27" cy="14" r="1.2" fill="#fca5a5" />
    </>
  )
}

export function CalculatorGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="6" y="4" width="24" height="28" rx="2" fill="#1f1f1f" />
      <rect x="8" y="6" width="20" height="6" rx="1" fill="#0a0a0a" />
      <text x="26" y="11" textAnchor="end" fill="#fff" fontSize="6" fontFamily="monospace">0</text>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <rect key={`${row}-${col}`} x={8 + col * 5} y={14 + row * 4.5} width="4" height="3.5" rx="0.6" fill="#3f3f3f" />
        ))
      )}
      {[0, 1, 2, 3].map((row) => (
        <rect key={row} x="24" y={14 + row * 4.5} width="4" height="3.5" rx="0.6" fill="#f97316" />
      ))}
    </>
  )
}

export function ClockGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <circle cx="18" cy="18" r="14" fill="#fff" />
      <circle cx="18" cy="18" r="14" fill="none" stroke="#0a0a0a" strokeWidth="1.4" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6
        const x1 = 18 + Math.cos(a) * 11
        const y1 = 18 + Math.sin(a) * 11
        const x2 = 18 + Math.cos(a) * 13
        const y2 = 18 + Math.sin(a) * 13
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0a0a0a" strokeWidth="1" />
      })}
      <line x1="18" y1="18" x2="18" y2="9" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="18" y1="18" x2="25" y2="18" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="18" y1="18" x2="14" y2="24" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
      <circle cx="18" cy="18" r="1.2" fill="#0a0a0a" />
    </>
  )
}

export function SettingsGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <g transform="translate(18 18)">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="-2"
            y="-15"
            width="4"
            height="6"
            fill="#9ca3af"
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r="10" fill="#374151" />
        <circle r="7" fill="#9ca3af" />
        <circle r="3.5" fill="#1f2937" />
      </g>
    </>
  )
}

export function MapsGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="4" y="6" width="28" height="24" fill="#b9d493" />
      <path d="M4 18 Q 18 12 32 18" stroke="#d4b886" strokeWidth="3" fill="none" />
      <path d="M4 24 Q 14 22 22 26 T 32 24" stroke="#d4b886" strokeWidth="2" fill="none" />
      <path d="M18 8 L18 26" stroke="#fff" strokeWidth="2" strokeDasharray="2 2" />
      <path d="M22 12 C 22 14 26 14 26 18 C 26 21 22 23 22 26 Z" fill="#ef4444" />
      <circle cx="22" cy="16" r="1.4" fill="#fff" />
    </>
  )
}

export function WeatherGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="0" y="0" width="36" height="36" fill="#5dade2" />
      <circle cx="14" cy="14" r="6" fill="#fff8c4" />
      <circle cx="14" cy="14" r="4.5" fill="#ffe66d" />
      <ellipse cx="22" cy="22" rx="10" ry="6" fill="#fff" />
      <ellipse cx="16" cy="24" rx="7" ry="4.5" fill="#fff" />
    </>
  )
}

export function MailGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="4" y="9" width="28" height="18" rx="2" fill="#fff" stroke="#9ca3af" />
      <path d="M4 9 L18 21 L32 9" stroke="#9ca3af" strokeWidth="1.4" fill="none" />
    </>
  )
}

export function AppStoreGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <circle cx="18" cy="18" r="14" fill="#1e3a8a" />
      <path d="M11 22 L17 12 L23 22 M14 19 H 20" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

export function MusicGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <path d="M14 8 L26 6 V 22 C 26 24 24 26 22 26 C 20 26 18 24 18 22 C 18 20 20 18 22 18 C 23 18 23.5 18.2 24 18.5 V 12 L 16 13.5 V 25 C 16 27 14 29 12 29 C 10 29 8 27 8 25 C 8 23 10 21 12 21 C 13 21 13.5 21.2 14 21.5 Z" fill="#fff" />
    </>
  )
}

export function PhoneGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <path
        d="M11 7 C 9 8 8 11 8 14 C 8 22 14 28 22 28 C 25 28 28 27 29 25 L 26 22 C 25 23 23 23.5 22 23 L 17 18 C 16 17 16.5 15 17.5 14 L 14 11 C 13 10 12 9 11 7 Z"
        fill="#fff"
      />
    </>
  )
}

export function GameCenterGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <circle cx="13" cy="18" r="9" fill="#6b7280" opacity="0.9" />
      <circle cx="23" cy="14" r="7" fill="#9ca3af" opacity="0.9" />
      <circle cx="22" cy="24" r="6" fill="#374151" opacity="0.9" />
    </>
  )
}

export function CalendarGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="6" y="6" width="24" height="24" rx="2" fill="#fff" />
      <rect x="6" y="6" width="24" height="7" fill="#dc2626" />
      <text x="18" y="12" textAnchor="middle" fill="#fff" fontSize="5" fontFamily="-apple-system,Helvetica" fontWeight="700">
        THU
      </text>
      <text x="18" y="26" textAnchor="middle" fill="#111" fontSize="13" fontFamily="-apple-system,Helvetica" fontWeight="300">
        12
      </text>
    </>
  )
}

export function Game2048Glyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="4" y="4" width="28" height="28" rx="3" fill="#bbada0" />
      <rect x="6" y="6" width="11" height="11" rx="1.5" fill="#eee4da" />
      <rect x="19" y="6" width="11" height="11" rx="1.5" fill="#ede0c8" />
      <rect x="6" y="19" width="11" height="11" rx="1.5" fill="#f2b179" />
      <rect x="19" y="19" width="11" height="11" rx="1.5" fill="#f59563" />
      <text x="11.5" y="14.5" textAnchor="middle" fill="#776e65" fontSize="7" fontWeight="700" fontFamily="-apple-system,Helvetica">2</text>
      <text x="24.5" y="14.5" textAnchor="middle" fill="#776e65" fontSize="7" fontWeight="700" fontFamily="-apple-system,Helvetica">4</text>
      <text x="11.5" y="27.5" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="-apple-system,Helvetica">8</text>
      <text x="24.5" y="27.5" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="700" fontFamily="-apple-system,Helvetica">16</text>
    </>
  )
}

export function FlappyGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="2" y="2" width="32" height="32" rx="3" fill="#70c5ce" />
      <ellipse cx="18" cy="20" rx="9" ry="7" fill="#fbe34d" />
      <ellipse cx="18" cy="20" rx="9" ry="7" fill="none" stroke="#000" strokeWidth="0.8" />
      <ellipse cx="22" cy="18" rx="2.5" ry="2.5" fill="#fff" />
      <circle cx="23" cy="18.5" r="1.2" fill="#000" />
      <path d="M11 20 L7 18 L8 22 Z" fill="#f59e0b" stroke="#000" strokeWidth="0.6" />
      <path d="M26 20 L29 22 L26 24 Z" fill="#f97316" stroke="#000" strokeWidth="0.6" />
      <ellipse cx="16" cy="23" rx="4" ry="2" fill="#fff" opacity="0.6" />
    </>
  )
}

export function MinesweeperGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="3" y="3" width="30" height="30" rx="2" fill="#bdbdbd" />
      <rect x="3" y="3" width="30" height="2" fill="#fff" />
      <rect x="3" y="3" width="2" height="30" fill="#fff" />
      <rect x="3" y="31" width="30" height="2" fill="#7b7b7b" />
      <rect x="31" y="3" width="2" height="30" fill="#7b7b7b" />
      <circle cx="18" cy="18" r="7.5" fill="#1f2937" />
      <rect x="17" y="7" width="2" height="3" fill="#1f2937" />
      <rect x="17" y="26" width="2" height="3" fill="#1f2937" />
      <rect x="7" y="17" width="3" height="2" fill="#1f2937" />
      <rect x="26" y="17" width="3" height="2" fill="#1f2937" />
      <line x1="11" y1="11" x2="13" y2="13" stroke="#1f2937" strokeWidth="2" />
      <line x1="25" y1="11" x2="23" y2="13" stroke="#1f2937" strokeWidth="2" />
      <line x1="11" y1="25" x2="13" y2="23" stroke="#1f2937" strokeWidth="2" />
      <line x1="25" y1="25" x2="23" y2="23" stroke="#1f2937" strokeWidth="2" />
      <circle cx="15" cy="15" r="1.5" fill="#fff" />
    </>
  )
}

export function MemoryGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="3" y="3" width="30" height="30" rx="3" fill="#7c3aed" />
      <rect x="5" y="5" width="11" height="13" rx="1.5" fill="#fff" />
      <rect x="20" y="5" width="11" height="13" rx="1.5" fill="#fff" />
      <rect x="5" y="20" width="11" height="13" rx="1.5" fill="#fff" />
      <rect x="20" y="20" width="11" height="13" rx="1.5" fill="#fef3c7" />
      <text x="10.5" y="14" textAnchor="middle" fill="#7c3aed" fontSize="9" fontWeight="700" fontFamily="-apple-system,Helvetica">?</text>
      <text x="25.5" y="14" textAnchor="middle" fill="#7c3aed" fontSize="9" fontWeight="700" fontFamily="-apple-system,Helvetica">?</text>
      <text x="10.5" y="29" textAnchor="middle" fill="#7c3aed" fontSize="9" fontWeight="700" fontFamily="-apple-system,Helvetica">?</text>
      <text x="25.5" y="29.5" textAnchor="middle" fontSize="9" fontFamily="Apple Color Emoji,Segoe UI Emoji">⭐</text>
    </>
  )
}

export function TicTacToeGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="3" y="3" width="30" height="30" rx="3" fill="#fff8e1" />
      <line x1="14" y1="6" x2="14" y2="30" stroke="#1f2937" strokeWidth="1.6" />
      <line x1="22" y1="6" x2="22" y2="30" stroke="#1f2937" strokeWidth="1.6" />
      <line x1="6" y1="14" x2="30" y2="14" stroke="#1f2937" strokeWidth="1.6" />
      <line x1="6" y1="22" x2="30" y2="22" stroke="#1f2937" strokeWidth="1.6" />
      <line x1="7" y1="7" x2="13" y2="13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      <line x1="13" y1="7" x2="7" y2="13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      <circle cx="26" cy="18" r="3" fill="none" stroke="#2563eb" strokeWidth="2" />
      <line x1="16" y1="25" x2="20" y2="29" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="25" x2="16" y2="29" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
    </>
  )
}

export function PhotoBoothGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="3" y="3" width="30" height="30" rx="4" fill="#f5f5f7" />
      <rect x="6" y="6" width="24" height="20" rx="2" fill="#3b82f6" />
      <circle cx="18" cy="16" r="6" fill="#1e40af" />
      <circle cx="18" cy="16" r="3.5" fill="#0a0a0a" />
      <circle cx="16" cy="14" r="1.2" fill="#fff" opacity="0.9" />
      <path d="M10 28 L26 28 L24 30 L12 30 Z" fill="#9ca3af" />
      <circle cx="29" cy="9" r="1.5" fill="#fbbf24" />
      <path d="M27 6 L29.5 4 L31 7 Z" fill="#fbbf24" />
      <path d="M28.5 11 L31 13 L29 13.5 Z" fill="#fbbf24" />
    </>
  )
}

export function TranslateGlyph({ size = 28 }: GlyphProps) {
  return wrap(
    size,
    <>
      <rect x="3" y="3" width="30" height="30" rx="4" fill="#22c55e" />
      <text x="10" y="18" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="-apple-system,Helvetica">A</text>
      <path d="M14 20 L18 17 L22 20" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="26" y="28" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="-apple-system,Helvetica">文</text>
    </>
  )
}

export const glyphs = {
  safari: SafariGlyph,
  notes: NotesGlyph,
  contacts: ContactsGlyph,
  messages: MessagesGlyph,
  photos: PhotosGlyph,
  camera: CameraGlyph,
  calculator: CalculatorGlyph,
  clock: ClockGlyph,
  settings: SettingsGlyph,
  maps: MapsGlyph,
  weather: WeatherGlyph,
  mail: MailGlyph,
  appstore: AppStoreGlyph,
  music: MusicGlyph,
  phone: PhoneGlyph,
  gamecenter: GameCenterGlyph,
  calendar: CalendarGlyph,
  game2048: Game2048Glyph,
  flappy: FlappyGlyph,
  minesweeper: MinesweeperGlyph,
  memory: MemoryGlyph,
  tictactoe: TicTacToeGlyph,
  photobooth: PhotoBoothGlyph,
  translate: TranslateGlyph,
} as const

export type GlyphName = keyof typeof glyphs
