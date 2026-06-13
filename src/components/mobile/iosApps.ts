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
  | 'maps'
  | 'mail'
  | 'gamecenter'
  | 'appstore'
  | 'music'
  | 'phone'

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

export const iosApps: IosAppDefinition[] = [
  // Row 1
  { id: 'messages-x', label: 'Messages', glyph: 'messages', from: '#a8e063', to: '#1f7a1f', kind: 'messages',  title: 'Guestbook' },
  { id: 'calendar',   label: 'Calendar', glyph: 'calendar', from: '#f9fafb', to: '#d1d5db', kind: 'calendar',  title: 'Calendar' },
  { id: 'photos',     label: 'Photos',   glyph: 'photos',   from: '#fefefe', to: '#cbd5e1', kind: 'photos',    title: 'Photos' },
  { id: 'camera',     label: 'Camera',   glyph: 'camera',   from: '#a1a1aa', to: '#27272a', kind: 'camera',    title: 'Camera' },
  // Row 2
  { id: 'weather',    label: 'Weather',  glyph: 'weather',  from: '#85c5ec', to: '#1a73a8', kind: 'weather',   title: 'Weather' },
  { id: 'clock',      label: 'Clock',    glyph: 'clock',    from: '#1f2937', to: '#0a0a0a', kind: 'clock',     title: 'Clock' },
  { id: 'maps',       label: 'Maps',     glyph: 'maps',     from: '#cfe6a8', to: '#7ab859', kind: 'maps',      title: 'Maps' },
  { id: 'mail',       label: 'Mail',     glyph: 'mail',     from: '#8acaff', to: '#1976d2', kind: 'mail',      title: 'Mail' },
  // Row 3
  { id: 'calculator', label: 'Calculator', glyph: 'calculator', from: '#3a3a3c', to: '#0a0a0a', kind: 'calculator', title: 'Calculator' },
  { id: 'gamecenter', label: 'Game Center', glyph: 'gamecenter', from: '#444',     to: '#111',    kind: 'gamecenter', title: 'Game Center' },
  { id: 'appstore',   label: 'App Store',  glyph: 'appstore',   from: '#7fbcff', to: '#0b3c8a', kind: 'appstore',   title: 'Tech Stack' },
  { id: 'music',      label: 'Music',      glyph: 'music',      from: '#ff7ab8', to: '#a8195d', kind: 'music',      title: 'Music' },
]

export const iosDock: IosAppDefinition[] = [
  { id: 'phone',    label: 'Phone',    glyph: 'phone',    from: '#7ee87e', to: '#1f7a1f', kind: 'phone',    title: 'Phone' },
  { id: 'safari',   label: 'Safari',   glyph: 'safari',   from: '#7fbcff', to: '#0b3c8a', kind: 'safari',   title: 'Projects' },
  { id: 'notes',    label: 'Notes',    glyph: 'notes',    from: '#fff1a8', to: '#f1c25b', kind: 'notes',    title: 'About Me' },
  { id: 'contacts', label: 'Contacts', glyph: 'contacts', from: '#f5e6c0', to: '#bc965a', kind: 'contacts', title: 'Contacts' },
]

export const iosAppsById: Record<string, IosAppDefinition> = [
  ...iosApps,
  ...iosDock,
].reduce((acc, app) => ({ ...acc, [app.id]: app }), {})
