// Shell: brand, top status bar, sidebar, main container

function Shell({ active, setActive, children, density }) {
  return (
    <div className="shell" data-density={density}>
      <div className="brand">
        <span className="brand-mark"><img src="favicon.png" alt="CODOS" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} /></span>
        <span className="brand-name">CODOS<span> / observatory</span></span>
      </div>
      <TopBar active={active} />
      <Sidebar active={active} setActive={setActive} />
      <div className="main">{children}</div>
    </div>
  );
}

function TopBar({ active }) {
  return (
    <div className="topbar">
      <div className="topbar-breadcrumb">
        <span>codos</span>
        <span className="sep">/</span>
        <span>observatory</span>
        <span className="sep">/</span>
        <span style={{ color: "var(--fg)" }}>{activeLabel(active)}</span>
      </div>
      <div className="topbar-actions">
        <AddCompany />
        <a
          className="repo-link"
          href="https://github.com/teionarr/codos-competitive-observatory"
          target="_blank"
          rel="noreferrer"
          title="View source on GitHub"
          aria-label="View source on GitHub"
        >
          <Icon.github />
        </a>
        <ThemeToggle />
      </div>
    </div>
  );
}

// Topbar quick-add: instant (in-memory + this-browser), then best-effort durable
// sync to /api/add (cross-browser + picked up by the weekly scan) when an add-key is set.
function AddCompany() {
  const [url, setUrl] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const raw = url.trim();
    if (!raw) return;
    const domain = raw.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./i, "");
    if (!domain || !domain.includes(".")) return;
    const id = domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const exists = (window.COMPETITORS || []).some((c) => (c.id || c.url) === id || c.url === domain);
    if (exists) { setUrl(""); return; }

    const today = new Date().toISOString().slice(0, 10);
    const entry = {
      id, name: domain, url: domain, category: "Other", status: "Emerging",
      funding: "—", team: null, why: "Added to watchlist.", anchor: false,
      scanned: "—", hash: "—", changed: false, changed_pages: [], delta: null,
      crawl_status: "pending", discovered: true, discovered_at: today,
    };

    // Instant: in-memory + this-browser persistence, then re-render the board.
    window.COMPETITORS = [...(window.COMPETITORS || []), entry];
    try {
      const wl = JSON.parse(localStorage.getItem("obs.watchlist") || "[]");
      wl.push(entry);
      localStorage.setItem("obs.watchlist", JSON.stringify(wl));
    } catch (_) {}
    setUrl("");
    window.dispatchEvent(new CustomEvent("obs:data-changed"));

    // Durable: sync to the watchlist API so it survives across browsers + feeds the scan.
    setBusy(true);
    try {
      let key = localStorage.getItem("obs.addkey");
      if (key === null) {
        key = window.prompt("Add-key to sync this across devices & the weekly scan\n(leave blank to keep adds in this browser only):") || "";
        localStorage.setItem("obs.addkey", key);
      }
      if (key) {
        await fetch("/api/add", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-add-key": key },
          body: JSON.stringify({ url: domain, name: domain }),
        });
      }
    } catch (_) { /* stays local-only */ }
    setBusy(false);
  };

  return (
    <form className="add-company" onSubmit={submit}>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="add company url…"
        spellCheck={false}
        aria-label="Add a company by URL"
      />
      <button type="submit" title="Add to watchlist" aria-label="Add company" disabled={busy}>
        <Icon.plus />
      </button>
    </form>
  );
}

function ThemeToggle() {
  // Initial theme is set pre-paint in index.html (stored choice, else system).
  const [theme, setTheme] = React.useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Follow the OS only while the user hasn't made an explicit choice.
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e) => {
      if (!localStorage.getItem("obs.theme")) setTheme(e.matches ? "light" : "dark");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => setTheme((t) => {
    const next = t === "dark" ? "light" : "dark";
    localStorage.setItem("obs.theme", next);  // explicit choice — stop following OS
    return next;
  });

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
    </button>
  );
}

function activeLabel(a) {
  return {
    feed:      "velocity_feed",
    map:       "competitor_map",
    insights:  "insights",
    sources:   "data_sources",
    history:   "scan_history",
  }[a] || a;
}

function Sidebar({ active, setActive }) {
  const items = [
    { id: "feed",     label: "Velocity Feed",  icon: <Icon.feed />,  count: window.VELOCITY_FEED.length },
    { id: "map",      label: "Competitor Map", icon: <Icon.map />,   count: window.COMPETITORS.length },
    { id: "insights", label: "Insights",       icon: <Icon.radar />, count: (window.INSIGHTS || []).length },
  ];
  const sec2 = [
    { id: "sources",  label: "Data Sources",  icon: <Icon.sources />,  count: window.DATA_SOURCES.length },
    { id: "history",  label: "Scan History",  icon: <Icon.history />,  count: (window.SCAN_HISTORY || []).length },
  ];
  const redCount = window.COMPETITORS.filter((c) => c.changed).length;

  return (
    <div className="sidebar">
      <div className="nav-group-label">Observatory</div>
      {items.map((i) => (
        <div key={i.id} className={"nav-item " + (active === i.id ? "active" : "")} onClick={() => setActive(i.id)}>
          <span className="icon">{i.icon}</span>
          <span>{i.label}</span>
          <span className="count">{i.count}</span>
        </div>
      ))}
      <div className="nav-group-label">Instruments</div>
      {sec2.map((i) => (
        <div key={i.id} className={"nav-item " + (active === i.id ? "active" : "")} onClick={() => setActive(i.id)}>
          <span className="icon">{i.icon}</span>
          <span>{i.label}</span>
          <span className="count">{i.count}</span>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div className="sidebar-footer">
        <div className="row"><span>state</span><span>healthy</span></div>
        <div className="row"><span>red_alerts</span><span style={{ color: "var(--red)" }}>{redCount}</span></div>
        <div className="row"><span>last_scan</span><span>{
          window.LAST_SCAN_AT
            ? new Date(window.LAST_SCAN_AT).toISOString().slice(0, 10)
            : "—"
        }</span></div>
        <div className="row"><span>scan_cron</span><span>sun 00:00</span></div>
      </div>
    </div>
  );
}

function SectionHeader({ title, sub, meta }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        <div className="sub">{sub}</div>
      </div>
      {meta && <div className="meta">{meta}</div>}
    </div>
  );
}

window.Shell = Shell;
window.SectionHeader = SectionHeader;
