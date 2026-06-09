// Source chip + Data Sources strip

function SourceChip({ id }) {
  const src = window.DATA_SOURCES.find((s) => s.id === id);
  if (!src) return null;
  const G = window.SourceGlyph[src.glyph];
  return (
    <span className="source-chip" title={src.kind}>
      <span className="glyph">{G && <G width="10" height="10" />}</span>
      {src.name}
    </span>
  );
}

function SourceLogo({ src }) {
  const G = window.SourceGlyph[src.glyph];
  const inactive = src.inactive;
  return (
    <span className="source-logo" style={inactive ? { opacity: 0.35, filter: "grayscale(1)", cursor: "default", pointerEvents: "none" } : undefined} title={inactive ? "not connected" : src.kind}>
      <span className="glyph">{G && <G width="12" height="12" />}</span>
      <span>{src.name}</span>
      <span className="sl-kind">· {src.kind}</span>
    </span>
  );
}

function SourcesStrip() {
  return (
    <div className="sources-strip">
      <span className="s-label">Data pipeline</span>
      {window.DATA_SOURCES.map((s) => <SourceLogo key={s.id} src={s} />)}
    </div>
  );
}

window.SourceChip = SourceChip;
window.SourceLogo = SourceLogo;
window.SourcesStrip = SourcesStrip;
