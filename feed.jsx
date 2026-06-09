// View 1: Velocity Feed

function VelocityFeed() {
  const feed = window.VELOCITY_FEED;

  return (
    <div className="view">
      <SectionHeader
        title="Velocity Feed"
        sub="// top signals · last 168h · ranked by impact velocity"
        meta={<>showing {feed.length} events<br/>window: last 7 days</>}
      />
      <div className="feed-grid">
        {feed.map((e) => (
          <a
            key={e.id}
            className="feed-card"
            href={e.source_url}
            target="_blank"
            rel="noreferrer"
          >
            <div className="meta">
              <span>{e.hours_ago}h ago</span>
              <span>·</span>
              <span>{e.domain}</span>
            </div>
            <h3>{e.title}</h3>
            <div className="why">{e.why}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

window.VelocityFeed = VelocityFeed;
