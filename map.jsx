// View 2: Competitor Map

function catSlug(c) {
  return {
    "Transformation Titans": "titans",
    "Forward Deployers": "deployers",
    "Agent Foundries": "foundries",
    "Platform Gravity": "gravity",
    "Digital Labor": "labor",
    "Vertical Specialists": "verticals",
    "Other": "other",
  }[c] || "x";
}

function CompetitorMap() {
  const [catFilter, setCatFilter] = React.useState(new Set());
  const [statusFilter, setStatusFilter] = React.useState(new Set());
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState("scanned");
  const [sortDir, setSortDir] = React.useState("desc");
  const [expandedRow, setExpandedRow] = React.useState(null);
  const [alertsOnly, setAlertsOnly] = React.useState(false);

  const toggle = (set, setter) => (v) => {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    setter(next);
  };

  const setSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const rows = React.useMemo(() => {
    let r = [...window.COMPETITORS];
    if (catFilter.size) r = r.filter((x) => catFilter.has(x.category));
    if (statusFilter.size) r = r.filter((x) => statusFilter.has(x.status));
    if (alertsOnly) r = r.filter((x) => x.changed);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter((x) => x.name.toLowerCase().includes(q) || x.url.toLowerCase().includes(q));
    }
    r.sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return r;
  }, [catFilter, statusFilter, alertsOnly, query, sortKey, sortDir]);

  const redCount = window.COMPETITORS.filter((c) => c.changed).length;

  return (
    <div className="view">
      <SectionHeader
        title="Competitor Map"
        sub={"// " + window.COMPETITORS.length + " tracked players · SHA256 hash diff vs last scan"}
        meta={<>{redCount} red alerts this week<br/>data-depth → decision-velocity spectrum</>}
      />

      <div className="map-controls">
        <div className="filter-group">
          <span className="filter-label">Band</span>
          {window.CATEGORIES.map((c) => (
            <button
              key={c}
              className={"chip " + (catFilter.has(c) ? "active" : "")}
              onClick={() => toggle(catFilter, setCatFilter)(c)}
            >{c}</button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Status</span>
          {window.STATUSES.map((s) => (
            <button
              key={s}
              className={"chip " + (statusFilter.has(s) ? "active" : "")}
              onClick={() => toggle(statusFilter, setStatusFilter)(s)}
            >{s}</button>
          ))}
        </div>
        <button
          className={"chip " + (alertsOnly ? "active" : "")}
          onClick={() => setAlertsOnly((x) => !x)}
          style={{ color: alertsOnly ? "var(--red)" : undefined, borderColor: alertsOnly ? "var(--red-line)" : undefined, background: alertsOnly ? "var(--red-dim)" : undefined }}
        >
          ● red alerts only
        </button>
        <div className="map-search">
          <Icon.search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter players…"
          />
          <span className="kbd">/</span>
        </div>
      </div>

      <div className="map-table">
        <div className="map-row head">
          <span>#</span>
          <span className="sortable" onClick={() => setSort("name")}>player {sortKey === "name" && (sortDir === "asc" ? "↑" : "↓")}</span>
          <span className="sortable" onClick={() => setSort("category")}>band {sortKey === "category" && (sortDir === "asc" ? "↑" : "↓")}</span>
          <span className="sortable" onClick={() => setSort("status")}>status {sortKey === "status" && (sortDir === "asc" ? "↑" : "↓")}</span>
          <span className="sortable" onClick={() => setSort("scanned")}>last scanned {sortKey === "scanned" && (sortDir === "asc" ? "↑" : "↓")}</span>
          <span className="sortable" onClick={() => setSort("funding")}>funding</span>
          <span />
        </div>

        {rows.length === 0 && <div className="empty-state">no players match current filters</div>}

        {rows.map((r, i) => {
          const isOpen = expandedRow === r.name;
          return (
            <React.Fragment key={r.name}>
              <div
                className={"map-row data " + (r.changed ? "red " : "") + (r.anchor ? "anchor" : "")}
                onClick={(e) => { if (e.target.closest("a")) return; setExpandedRow(isOpen ? null : r.name); }}
              >
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="project">
                  {r.changed && <span className="change-dot" />}
                  <span className="name">{r.name}</span>
                  {r.anchor && <span className="anchor-badge">anchor</span>}
                  {r.discovered && <span className="new-badge" title="Auto-discovered by weekly research">new</span>}
                  {r.crawl_status === "error" && <span className="unreachable-badge" title="Site couldn't be fetched — verify or fix the URL">site?</span>}
                  <a className="url" href={"https://" + r.url} target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer", color: "var(--fg-3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--fg-3)"}
                  >{r.url}<Icon.extlink /></a>
                </span>
                <span>
                  <span className={"tag cat-" + catSlug(r.category)}>{r.category}</span>
                </span>
                <span className={"status " + r.status.toLowerCase()}>
                  <span className="sdot" />{r.status}
                </span>
                <span className="mono-dim">{r.scanned}</span>
                <span className="mono">{r.funding}</span>
                <span className="row-caret"><Icon.chevron style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.12s" }} /></span>
              </div>
              {isOpen && (
                <div className={"delta-panel" + (r.changed ? "" : " stable")}>
                  {r.discovered && (
                    <div className="discovered-note">
                      ◆ auto-discovered {r.discovered_at ? "on " + r.discovered_at : ""} via weekly research
                      {r.discovery_relevance != null ? " · relevance " + r.discovery_relevance + "/100" : ""}
                    </div>
                  )}
                  {r.changed ? (
                    <>
                      <div className="d-label">● gemini-generated delta summary</div>
                      <div className="d-body">"{r.delta || "site change detected — awaiting synthesis"}"</div>
                    </>
                  ) : (
                    <div className="d-label stable-label">○ no delta — content stable</div>
                  )}
                  {r.why && (
                    <div className="why-tracked">
                      <span className="wt-label">why tracked</span>
                      <span className="wt-body">{r.why}</span>
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

window.CompetitorMap = CompetitorMap;
