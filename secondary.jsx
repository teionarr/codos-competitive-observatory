// Data Sources & Scan History views (secondary) + Tweaks panel

function relTime(iso) {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (isNaN(t)) return iso;
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 60) return mins + "m ago";
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return hrs + "h ago";
  return Math.round(hrs / 24) + "d ago";
}

function fmtUTC(iso) {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (isNaN(t)) return iso;
  return new Date(t).toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

function DataSourcesView() {
  const rows = window.DATA_SOURCES;
  const connected = rows.filter((s) => s.status === "healthy").length;

  return (
    <div className="view">
      <SectionHeader
        title="Data Sources"
        sub="// pipeline ingress · live providers only · telemetry from last scan"
        meta={<>{connected} of {rows.length} active<br/>per-run call counts</>}
      />
      <SourcesStrip />
      <div className="map-table">
        <div className="map-row head" style={{ gridTemplateColumns: "28px 2fr 1fr 1fr 1fr 1fr" }}>
          <span>#</span>
          <span>source</span>
          <span>role</span>
          <span>calls · run</span>
          <span>last call</span>
          <span>status</span>
        </div>
        {rows.map((r, i) => {
          const G = window.SourceGlyph[r.glyph];
          const statusClass = r.status === "healthy" ? "scaling" : r.status === "idle" ? "acquired" : "emerging";
          return (
            <div key={r.id} className="map-row data" style={{ gridTemplateColumns: "28px 2fr 1fr 1fr 1fr 1fr" }}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="project">
                <span style={{ color: "var(--accent)", display: "grid", placeItems: "center" }}>
                  {G && <G width="14" height="14" />}
                </span>
                <span className="name">{r.name}</span>
                <span className="url">{r.id}.api</span>
              </span>
              <span className="mono-dim">{r.kind}</span>
              <span className="mono">{r.calls != null ? r.calls : "—"}</span>
              <span className="mono-dim">{relTime(r.last_call)}</span>
              <span className={"status " + statusClass}>
                <span className="sdot" />{r.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScanHistoryView({ onOpenInsights }) {
  const weeks = window.SCAN_HISTORY || [];
  const insights = window.INSIGHTS || [];
  const competitors = window.COMPETITORS || [];
  const max = Math.max(1, ...weeks.map((w) => w.events_scanned || 0));
  const [expanded, setExpanded] = React.useState(null);

  const GRID = "28px 1fr 2fr 1fr 1fr 20px";

  // Signed delta vs the prior (older) week; null when there's no prior run.
  const delta = (cur, prev) => {
    if (prev == null) return null;
    const d = (cur || 0) - (prev || 0);
    return d > 0 ? "▲ +" + d : d < 0 ? "▼ " + d : "±0";
  };

  return (
    <div className="view">
      <SectionHeader
        title="Scan History"
        sub="// every sunday 00:00 UTC · cron-triggered full sweep"
        meta={<>{weeks.length} runs retained<br/>json snapshots</>}
      />
      <div className="map-table">
        <div className="map-row head" style={{ gridTemplateColumns: GRID }}>
          <span>#</span>
          <span>week</span>
          <span>events scanned</span>
          <span>red deltas</span>
          <span>new insights</span>
          <span />
        </div>
        {weeks.map((w, i) => {
          const isOpen = expanded === w.date;
          const prev = weeks[i + 1];                       // older week, array is newest-first
          const weekInsights = insights.filter((x) => x.scan_date === w.date);
          const weekNew = competitors.filter((c) => c.discovered && c.discovered_at === w.date);
          return (
            <React.Fragment key={w.date}>
              <div
                className="map-row data"
                style={{ gridTemplateColumns: GRID }}
                onClick={(e) => { if (e.target.closest("a,button")) return; setExpanded(isOpen ? null : w.date); }}
              >
                <span className="idx">W{weeks.length - i}</span>
                <span className="mono">{w.date}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden", maxWidth: 240 }}>
                    <span style={{ display: "block", height: "100%", width: `${((w.events_scanned || 0) / max) * 100}%`, background: "var(--accent)" }} />
                  </span>
                  <span className="mono">{w.events_scanned}</span>
                </span>
                <span className="mono" style={{ color: w.red_deltas > 3 ? "var(--red)" : "var(--fg-2)" }}>{w.red_deltas}</span>
                <span className="mono-dim">{w.new_insights}</span>
                <span className="row-caret"><Icon.chevron style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.12s" }} /></span>
              </div>
              {isOpen && (
                <div className="delta-panel stable">
                  <div className="scan-stats">
                    <span>ran <b>{fmtUTC(w.generated_at)}</b></span>
                    <span>duration <b>{w.duration_seconds != null ? w.duration_seconds + "s" : "—"}</b></span>
                    <span>competitors swept <b>{w.competitors_scanned ?? "—"}</b></span>
                    {(w.new_competitors ?? 0) > 0 && <span>new players <b>{w.new_competitors}</b></span>}
                  </div>

                  <div className="scan-stats trend">
                    {prev ? (
                      <>
                        <span>vs prior run:</span>
                        <span>events <b>{delta(w.events_scanned, prev.events_scanned)}</b></span>
                        <span>red deltas <b>{delta(w.red_deltas, prev.red_deltas)}</b></span>
                        <span>insights <b>{delta(w.new_insights, prev.new_insights)}</b></span>
                      </>
                    ) : (
                      <span>first tracked run — no prior week to compare</span>
                    )}
                  </div>

                  <div className="scan-list">
                    <div className="sl-label">insights minted this run</div>
                    {weekInsights.length > 0 ? (
                      weekInsights.map((ins) => (
                        <button
                          key={ins.id}
                          className="sh-link"
                          onClick={(e) => { e.stopPropagation(); onOpenInsights && onOpenInsights(); }}
                          title="Open the Insights feed"
                        >
                          {ins.title}
                        </button>
                      ))
                    ) : (
                      <span className="sl-empty">no new insights this run</span>
                    )}
                  </div>

                  {weekNew.length > 0 && (
                    <div className="scan-list">
                      <div className="sl-label">new competitors discovered</div>
                      {weekNew.map((c) => (
                        <a
                          key={c.id || c.name}
                          className="sh-link"
                          href={"https://" + c.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {c.name}{c.discovery_relevance != null ? " · relevance " + c.discovery_relevance + "/100" : ""}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function TweaksPanel({ density, setDensity, alertStyle, setAlertStyle, onClose, accent, setAccent }) {
  return (
    <div className="tweaks-panel">
      <h4>
        <span>TWEAKS</span>
        <span className="close" onClick={onClose}>×</span>
      </h4>
      <div className="tweak-row">
        <span className="label">Density</span>
        <div className="seg">
          <button className={density === "compact" ? "on" : ""} onClick={() => setDensity("compact")}>compact</button>
          <button className={density === "comfortable" ? "on" : ""} onClick={() => setDensity("comfortable")}>comfortable</button>
        </div>
      </div>
      <div className="tweak-row">
        <span className="label">Accent</span>
        <div className="seg">
          <button className={accent === "cyan" ? "on" : ""} onClick={() => setAccent("cyan")}>cyan</button>
          <button className={accent === "amber" ? "on" : ""} onClick={() => setAccent("amber")}>amber</button>
          <button className={accent === "violet" ? "on" : ""} onClick={() => setAccent("violet")}>violet</button>
        </div>
      </div>
      <div className="tweak-row">
        <span className="label">Alert style</span>
        <div className="seg">
          <button className={alertStyle === "row" ? "on" : ""} onClick={() => setAlertStyle("row")}>row</button>
          <button className={alertStyle === "bar" ? "on" : ""} onClick={() => setAlertStyle("bar")}>left-bar</button>
        </div>
      </div>
    </div>
  );
}

window.DataSourcesView = DataSourcesView;
window.ScanHistoryView = ScanHistoryView;
window.TweaksPanel = TweaksPanel;
