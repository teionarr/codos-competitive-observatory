// Icons + glyphs — minimal line/geometric only

const Icon = {
  feed: (p) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <path d="M2 4h12M2 8h12M2 12h8" strokeLinecap="round"/>
    </svg>
  ),
  map: (p) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <rect x="2" y="3" width="12" height="3" rx="0.5"/>
      <rect x="2" y="7.5" width="12" height="3" rx="0.5"/>
      <rect x="2" y="12" width="12" height="1.5" rx="0.5"/>
    </svg>
  ),
  radar: (p) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <circle cx="8" cy="8" r="5.5"/>
      <circle cx="8" cy="8" r="2.5"/>
      <path d="M8 8 L12 5" strokeLinecap="round"/>
    </svg>
  ),
  sources: (p) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <circle cx="4" cy="4" r="1.5"/>
      <circle cx="12" cy="4" r="1.5"/>
      <circle cx="8" cy="12" r="1.5"/>
      <path d="M5 5 L7 11 M11 5 L9 11" />
    </svg>
  ),
  history: (p) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <path d="M2 8a6 6 0 1 0 2-4.5" strokeLinecap="round"/>
      <path d="M2 2v3h3" strokeLinecap="round"/>
      <path d="M8 5v3l2 2" strokeLinecap="round"/>
    </svg>
  ),
  settings: (p) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <circle cx="8" cy="8" r="2"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"/>
    </svg>
  ),
  chevron: (p) => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <path d="M3.5 2.5 L6 5 L3.5 7.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  extlink: (p) => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M4 2H2v6h6V6 M6 2h2v2 M5 5l3-3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: (p) => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <path d="M5 1.5v7M1.5 5h7" strokeLinecap="round"/>
    </svg>
  ),
  search: (p) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <circle cx="5" cy="5" r="3.5"/>
      <path d="M7.5 7.5 L10 10" strokeLinecap="round"/>
    </svg>
  ),
  logo: (p) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <rect x="2" y="2" width="14" height="14" rx="2"/>
      <path d="M5 9 L9 5 L13 9 L9 13 Z" fill="currentColor" fillOpacity="0.2"/>
      <circle cx="9" cy="9" r="1" fill="currentColor"/>
    </svg>
  ),
  sun: (p) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <circle cx="8" cy="8" r="3"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" strokeLinecap="round"/>
    </svg>
  ),
  moon: (p) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" {...p}>
      <path d="M13.5 9.5A5.5 5.5 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7z" strokeLinejoin="round"/>
    </svg>
  ),
  github: (p) => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" {...p}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  ),
};

// Simple geometric glyphs for data sources (NOT brand marks)
const SourceGlyph = {
  hex: (p) => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M6 1 L10.5 3.5 L10.5 8.5 L6 11 L1.5 8.5 L1.5 3.5 Z"/>
    </svg>
  ),
  flame: (p) => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M6 1 C6 4 9 5 9 8 A3 3 0 0 1 3 8 C3 6 4.5 6 5 4 Z"/>
    </svg>
  ),
  wave: (p) => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M1 6 Q3 3 6 6 T11 6" strokeLinecap="round"/>
      <path d="M1 9 Q3 6 6 9 T11 9" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  cross: (p) => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M2 2 L10 10 M10 2 L2 10" strokeLinecap="round"/>
    </svg>
  ),
  diamond: (p) => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M6 1 L11 6 L6 11 L1 6 Z"/>
      <path d="M6 3.5 L8.5 6 L6 8.5 L3.5 6 Z" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  ),
  node: (p) => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <circle cx="3" cy="3" r="1.5"/>
      <circle cx="9" cy="3" r="1.5"/>
      <circle cx="6" cy="9" r="1.5"/>
      <path d="M3.8 4 L5.5 8 M8.2 4 L6.5 8" opacity="0.6"/>
    </svg>
  ),
  stack: (p) => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <rect x="2" y="2" width="8" height="2"/>
      <rect x="2" y="5" width="8" height="2"/>
      <rect x="2" y="8" width="8" height="2"/>
    </svg>
  ),
};

window.Icon = Icon;
window.SourceGlyph = SourceGlyph;
