// View 3: Insights — accumulating, supersede-aware deep-research feed

// Evidence comes through either as an article title (plain text) or a raw URL.
// Show a readable title for both: derive one from the URL slug when that's all we have.
function factLabel(ev) {
  if (!/^https?:\/\//.test(ev)) return ev;
  try {
    const u = new URL(ev);
    let seg = u.pathname.split("/").filter(Boolean).pop() || u.hostname;
    seg = seg.replace(/\.(html?|php|aspx)$/i, "").replace(/-\d{4,}$/, "");
    seg = decodeURIComponent(seg).replace(/[-_]+/g, " ").trim();
    return seg || u.hostname;
  } catch (e) {
    return ev;
  }
}

function InsightsFeed() {
  const insights = window.INSIGHTS || [];

  // Title lookup so supersede references can show the human name, not just the id
  const titleById = {};
  insights.forEach((i) => { titleById[i.id] = i.title; });

  // Group by scan_date (week), newest first — the feed "pushes" prior weeks down
  const groups = [];
  const byDate = {};
  insights.forEach((i) => {
    const k = i.scan_date || "—";
    if (!byDate[k]) { byDate[k] = []; groups.push(k); }
    byDate[k].push(i);
  });
  groups.sort((a, b) => (a < b ? 1 : -1));

  const newest = groups[0];
  const lastSynth = window.LAST_SCAN_AT
    ? new Date(window.LAST_SCAN_AT).toISOString().slice(0, 16).replace("T", " ") + " UTC"
    : "—";

  return (
    <div className="view">
      <SectionHeader
        title="Insights"
        sub="// weekly deep research · exa + competitor deltas + live web · supersedes, never deletes"
        meta={<>{insights.length} insights tracked<br/>last synthesis {lastSynth}</>}
      />
      <div className="insights-feed">
        {groups.map((date) => (
          <div key={date} className="insight-week">
            <div className="week-rail">
              <span className="week-dot" />
              <span className="week-date">{date}</span>
              {date === newest && <span className="week-new">latest</span>}
            </div>
            <div className="week-cards">
              {byDate[date].map((i) => {
                const superseded = !!i.superseded_by;
                return (
                  <div key={i.id} className="insight-card">
                    <div className="insight-top">
                      <span className="insight-id">{i.id}</span>
                    </div>

                    <h3 className="insight-title">{i.title}</h3>

                    {i.supersedes && titleById[i.supersedes] && (
                      <div className="supersede-note evolves">
                        evolves <b>{i.supersedes}</b> · {titleById[i.supersedes]}
                      </div>
                    )}
                    {superseded && (
                      <div className="supersede-note retired">
                        superseded by <b>{i.superseded_by}</b>
                        {titleById[i.superseded_by] ? " · " + titleById[i.superseded_by] : ""}
                      </div>
                    )}

                    <div className="insight-body">{i.insight}</div>

                    {i.trend && (
                      <div className="insight-trend">
                        <span className="trend-label">why now</span>
                        <span>{i.trend}</span>
                      </div>
                    )}

                    {(i.evidence || []).length > 0 && (
                      <div className="insight-foot">
                        <div className="evidence">
                          {i.evidence.map((ev, idx) => {
                            const isUrl = /^https?:\/\//.test(ev);
                            const href = isUrl
                              ? ev
                              : "https://www.google.com/search?q=" + encodeURIComponent(ev);
                            return (
                              <a key={idx} href={href} target="_blank" rel="noreferrer"
                                 className="evidence-fact"
                                 title={isUrl ? ev : "Search: " + ev}>
                                {factLabel(ev)}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.InsightsFeed = InsightsFeed;
