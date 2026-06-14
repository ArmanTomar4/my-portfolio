import { GlyphName } from './iosGlyphs'

export type IosAppKind =
  | 'stub'
  | 'notes'
  | 'safari'
  | 'contacts'
  | 'messages'
  | 'settings'
  | 'calculator'
  | 'clock'
  | 'photos'
  | 'camera'
  | 'weather'
  | 'calendar'
  | 'mail'
  | 'appstore'
  | 'music'
  | 'phone'
  | 'game2048'
  | 'flappy'
  | 'minesweeper'
  | 'memory'
  | 'tictactoe'
  | 'photobooth'
  | 'translate'

export interface IosAppDefinition {
  id: string
  label: string
  glyph: GlyphName
  /** background gradient — top and bottom stops */
  from: string
  to: string
  /** title bar text inside the app */
  title?: string
  kind: IosAppKind
}

export const iosAppsPage1: IosAppDefinition[] = [
  { id: 'messages-x', label: 'Messages', glyph: 'messages', from: '#a8e063', to: '#1f7a1f', kind: 'messages',  title: 'Messages' },
  { id: 'calendar',   label: 'Calendar', glyph: 'calendar', from: '#f9fafb', to: '#d1d5db', kind: 'calendar',  title: 'Calendar' },
  { id: 'photos',     label: 'Photos',   glyph: 'photos',   from: '#fefefe', to: '#cbd5e1', kind: 'photos',    title: 'Photos' },
  { id: 'camera',     label: 'Camera',   glyph: 'camera',   from: '#a1a1aa', to: '#27272a', kind: 'camera',    title: 'Camera' },
  { id: 'weather',    label: 'Weather',  glyph: 'weather',  from: '#85c5ec', to: '#1a73a8', kind: 'weather',   title: 'Weather' },
  { id: 'clock',      label: 'Clock',    glyph: 'clock',    from: '#1f2937', to: '#0a0a0a', kind: 'clock',     title: 'Clock' },
  { id: 'mail',       label: 'Mail',     glyph: 'mail',     from: '#8acaff', to: '#1976d2', kind: 'mail',      title: 'Mail' },
  { id: 'calculator', label: 'Calculator', glyph: 'calculator', from: '#3a3a3c', to: '#0a0a0a', kind: 'calculator', title: 'Calculator' },
  { id: 'appstore',   label: 'App Store',  glyph: 'appstore',   from: '#7fbcff', to: '#0b3c8a', kind: 'appstore',   title: 'App Store' },
  { id: 'music',      label: 'Music',      glyph: 'music',      from: '#ff7ab8', to: '#a8195d', kind: 'music',      title: 'Music' },
]

export const iosAppsPage2: IosAppDefinition[] = [
  { id: 'game2048',    label: '2048',         glyph: 'game2048',    from: '#f5e6c0', to: '#bb9760', kind: 'game2048',    title: '2048' },
  { id: 'flappy',      label: 'Flappy',       glyph: 'flappy',      from: '#7ed3f7', to: '#1d80b8', kind: 'flappy',      title: 'Flappy Bird' },
  { id: 'minesweeper', label: 'Minesweeper',  glyph: 'minesweeper', from: '#dfe3e6', to: '#7d858d', kind: 'minesweeper', title: 'Minesweeper' },
  { id: 'memory',      label: 'Memory',       glyph: 'memory',      from: '#c4b5fd', to: '#6d28d9', kind: 'memory',      title: 'Memory' },
  { id: 'tictactoe',   label: 'Tic Tac Toe',  glyph: 'tictactoe',   from: '#fef08a', to: '#ca8a04', kind: 'tictactoe',   title: 'Tic Tac Toe' },
  { id: 'photobooth',  label: 'Photo Booth',  glyph: 'photobooth',  from: '#fda4af', to: '#9d174d', kind: 'photobooth',  title: 'Photo Booth' },
  { id: 'translate',   label: 'Translate',    glyph: 'translate',   from: '#86efac', to: '#15803d', kind: 'translate',   title: 'Translate' },
]

export const iosAppPages: IosAppDefinition[][] = [iosAppsPage1, iosAppsPage2]

/** Flat list of all home-screen apps (back-compat for any flat lookups). */
export const iosApps: IosAppDefinition[] = iosAppPages.flat()

export const iosDock: IosAppDefinition[] = [
  { id: 'phone',    label: 'Phone',    glyph: 'phone',    from: '#7ee87e', to: '#1f7a1f', kind: 'phone',    title: 'Phone' },
  { id: 'safari',   label: 'Safari',   glyph: 'safari',   from: '#7fbcff', to: '#0b3c8a', kind: 'safari',   title: 'Safari' },
  { id: 'notes',    label: 'Notes',    glyph: 'notes',    from: '#fff1a8', to: '#f1c25b', kind: 'notes',    title: 'Notes' },
  { id: 'contacts', label: 'Contacts', glyph: 'contacts', from: '#f5e6c0', to: '#bc965a', kind: 'contacts', title: 'Contacts' },
]

export const iosAppsById: Record<string, IosAppDefinition> = [
  ...iosApps,
  ...iosDock,
].reduce((acc, app) => ({ ...acc, [app.id]: app }), {})
