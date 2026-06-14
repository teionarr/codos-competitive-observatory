// View 1: Velocity Feed

function FeedCard({ e }) {
  return (
    <a className="feed-card" href={e.source_url} target="_blank" rel="noreferrer">
      <div className="meta">
        <span>{e.hours_ago}h ago</span>
        <span>·</span>
        <span>{e.domain}</span>
      </div>
      <h3>{e.title}</h3>
      <div className="why">{e.why}</div>
    </a>
  );
}

function VelocityFeed() {
  const feed = window.VELOCITY_FEED || [];

  // Group by scan_date (week), newest first. Items with no scan_date = current week.
  const weeks = [];
  const byWeek = {};
  feed.forEach((e) => {
    const k = e.scan_date || "current";
    if (!byWeek[k]) { byWeek[k] = []; weeks.push(k); }
    byWeek[k].push(e);
  });
  weeks.sort((a, b) => (a < b ? 1 : -1)); // newest first; "current" sorts above dates

  const thisWeek = byWeek[weeks[0]] || [];
  const carried = feed.length - thisWeek.length;

  return (
    <div className="view">
      <SectionHeader
        title="Velocity Feed"
        sub="// top signals · ranked by impact velocity · last week kept, dimmed"
        meta={<>{thisWeek.length} new this week{carried > 0 ? <><br/>+{carried} from last week</> : null}</>}
      />
      {weeks.map((wk, gi) => (
        <React.Fragment key={wk}>
          {gi > 0 && (
            <div className="feed-week-divider">
              <span>last week{wk !== "current" ? " · " + wk : ""}</span>
            </div>
          )}
          <div className={"feed-grid" + (gi > 0 ? " past" : "")}>
            {byWeek[wk].map((e) => <FeedCard key={e.id} e={e} />)}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

window.VelocityFeed = VelocityFeed;
