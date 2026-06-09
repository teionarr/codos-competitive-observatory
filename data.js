// Tastewise Observatory data — mock fallback + live JSON loader
// Mock values render before the first real scan; market_snapshot_latest.json overrides them.

// Only the providers the pipeline actually calls. calls/last_call/status are
// filled with real per-run telemetry from the snapshot; these are pre-scan mocks.
window.DATA_SOURCES = [
  { id: "exa",       name: "Exa.ai",            kind: "neural search",          glyph: "hex",     calls: 132, last_call: "2026-05-31T00:12:00Z", status: "healthy" },
  { id: "firecrawl", name: "Firecrawl",          kind: "change-tracking scrape", glyph: "flame",   calls: 58,  last_call: "2026-05-31T00:12:00Z", status: "healthy" },
  { id: "gemini",    name: "Gemini 2.5 Flash",   kind: "synthesis",              glyph: "diamond", calls: 2,   last_call: "2026-05-31T00:12:00Z", status: "healthy" },
  { id: "web",       name: "Live Web (Google)",  kind: "grounded search",        glyph: "wave",    calls: 1,   last_call: "2026-05-31T00:12:00Z", status: "healthy" },
];

window.VELOCITY_FEED = [
  {
    id: "v1", title: "Datassential ships 'Datassential One' MCP — an API-for-AI over its menu + operator data",
    domain: "datassential.com", hours_ago: 9, velocity: 95,
    why: "Deepest foodservice moat goes agentic — directly contests Tastewise's execution edge.",
    source_url: "https://datassential.com/",
    sources: ["firecrawl", "exa", "gemini"], category: "Decision Engines",
  },
  {
    id: "v2", title: "Mintel completes Black Swan Data integration into GNPD predictive layer",
    domain: "mintel.com", hours_ago: 21, velocity: 90,
    why: "Group-2 incumbent buys its way into prediction — consolidation from below accelerates.",
    source_url: "https://mintel.com/",
    sources: ["exa", "web"], category: "Data Vaults",
  },
  {
    id: "v3", title: "GlobalData folds Ai Palette's Concept Genie into One Platform",
    domain: "globaldata.com", hours_ago: 33, velocity: 86,
    why: "Concept generation + syndicated depth + public-company capital under one roof.",
    source_url: "https://globaldata.com/",
    sources: ["exa", "web"], category: "Decision Engines",
  },
  {
    id: "v4", title: "NIQ begins surfacing Gastrograph sensory scores inside its retail dashboards",
    domain: "nielseniq.com", hours_ago: 48, velocity: 82,
    why: "Currency-grade POS data now paired with flavor prediction — deepest-moat threat.",
    source_url: "https://nielseniq.com/",
    sources: ["firecrawl", "exa"], category: "Data Vaults",
  },
  {
    id: "v5", title: "Starday Foods raises $11M Series A to scale insight→R&D→shelf pipeline",
    domain: "stardayfoods.com", hours_ago: 70, velocity: 78,
    why: "The pure-play most resembling Tastewise's model just got funded.",
    source_url: "https://stardayfoods.com/",
    sources: ["exa", "web"], category: "Decision Engines",
  },
  {
    id: "v6", title: "Foodpairing AI publishes 75–85% liking-prediction benchmark for NPD",
    domain: "foodpairing.com", hours_ago: 96, velocity: 71,
    why: "Predictive formulation moving from insight toward execution-grade output.",
    source_url: "https://foodpairing.com/",
    sources: ["exa", "firecrawl"], category: "Decision Engines",
  },
  {
    id: "v7", title: "Spate expands food-trend coverage to TikTok + Reddit early-signal graph",
    domain: "spate.nyc", hours_ago: 130, velocity: 64,
    why: "Early-signal trend layer widening — feeds the top of every concept funnel.",
    source_url: "https://spate.nyc/",
    sources: ["web", "firecrawl"], category: "Trend Radars",
  },
];

window.COMPETITORS = [
  { id: "tastewise",   name: "Tastewise",      url: "tastewise.io",      category: "Decision Engines", status: "Scaling",   anchor: true,  scanned: "2026-05-31 00:12", hash: "a3f19c2b7d", changed: false, delta: null, funding: "$72M / Series B", team: 100, why: "ANCHOR. F&B-native GenAI/agentic intelligence unifying consumer, foodservice, e-retail and recipe signals; agents produce sell-in kits, briefs and concepts (TasteGPT)." },
  { id: "datassential", name: "Datassential",  url: "datassential.com",  category: "Decision Engines", status: "Incumbent", scanned: "2026-05-31 00:14", hash: "e71b5d9a2c", changed: true,  delta: "Homepage now leads with 'Datassential One' + 'API for AI'; menu-intelligence agents promoted above data products.", funding: "PE / New Mountain", team: null, why: "Deepest foodservice/operator data moat (CHD Expert + Brizo); 90%+ penetration; moving aggressively on the same agentic thesis. Tastewise's most resourced direct rival." },
  { id: "aipalette",   name: "Ai Palette",     url: "aipalette.com",     category: "Decision Engines", status: "Acquired",  scanned: "2026-05-31 00:16", hash: "8c2e1f4b91", changed: true,  delta: "GlobalData branding applied across site; Concept Genie repositioned under 'One Platform'.", funding: "Acq. GlobalData $11.5M", team: null, why: "Foresight Engine + Concept Genie + FoodGPT. Trend → concept → screen workflow, now with GlobalData's syndicated depth." },
  { id: "foodpairing", name: "Foodpairing AI", url: "foodpairing.com",   category: "Decision Engines", status: "Scaling",   scanned: "2026-05-31 00:18", hash: "14a7d3e8cb", changed: false, delta: null, funding: "Private", team: null, why: "Consumer Flavor Intelligence + FlavorID, ~140k digital-twin consumers; predicts liking/buying intent 75–85%. Predictive + prescriptive, F&B-native." },
  { id: "starday",     name: "Starday Foods",  url: "stardayfoods.com",  category: "Decision Engines", status: "Scaling",   scanned: "2026-05-31 00:20", hash: "bd2091a4ef", changed: true,  delta: "New funding banner ($11M Series A); added 'brief in weeks' R&D pipeline section.", funding: "$11M / Series A", team: null, why: "AI + culinary R&D: trend → R&D briefs/concepts in weeks. End-to-end insight→R&D→shelf; emerging challenger most resembling Tastewise." },
  { id: "blackswan",   name: "Black Swan Data",url: "blackswan.com",     category: "Trend Radars",     status: "Acquired",  scanned: "2026-05-31 00:22", hash: "7e5c3b1208", changed: false, delta: null, funding: "Acq. Mintel", team: null, why: "Trendscope TPV algorithm claims 89% six-month accuracy, ~500k trends/month. Strong predictive layer — now feeding Mintel." },
  { id: "spate",       name: "Spate",          url: "spate.nyc",         category: "Trend Radars",     status: "Emerging",  scanned: "2026-05-31 00:24", hash: "29f6a8d47b", changed: true,  delta: "Added food vertical case studies; new TikTok + Reddit signal-source callouts on homepage.", funding: "Seed / YC", team: null, why: "AI search-based trend prediction (900B Google signals, 200M TikTok/IG posts). Early-signal prediction, not full execution." },
  { id: "gastrograph", name: "Gastrograph AI", url: "gastrograph.com",   category: "Trend Radars",     status: "Acquired",  scanned: "2026-05-31 00:26", hash: "c1e48f2a06", changed: false, delta: null, funding: "Acq. NIQ", team: null, why: "AI sensory/flavor preference modeling. Deep sensory prediction; now part of NIQ's data stack." },
  { id: "niq",         name: "NielsenIQ (NIQ)",url: "nielseniq.com",     category: "Data Vaults",      status: "Incumbent", scanned: "2026-05-31 00:28", hash: "4b8d72e3a9", changed: true,  delta: "Sensory-score module (Gastrograph) now linked from retail measurement pages.", funding: "Public", team: null, why: "Global retail measurement (POS scanner, Homescan 250k+ households). Deepest retail-sales data; AI layer emerging." },
  { id: "circana",     name: "Circana",        url: "circana.com",       category: "Data Vaults",      status: "Incumbent", scanned: "2026-05-31 00:30", hash: "f06c29b1de", changed: false, delta: null, funding: "PE / New Mountain", team: null, why: "Syndicated POS, MULO/MULO+, foodservice. Vast proprietary data; analytics-led, not agentic execution." },
  { id: "mintel",      name: "Mintel",         url: "mintel.com",        category: "Data Vaults",      status: "Incumbent", scanned: "2026-05-31 00:32", hash: "3a7f18c94e", changed: true,  delta: "GNPD pages now reference Black Swan predictive scoring; 'Spark' concept tool surfaced in nav.", funding: "Private", team: 1100, why: "GNPD product-launch + claims data; acquired Black Swan. Report-led but bolting on a predictive layer." },
  { id: "datassential2", name: "Spoonshot",    url: "spoonshot.com",     category: "Decision Engines", status: "Acquired",  scanned: "2026-05-31 00:34", hash: "9d1b6fa25c", changed: false, delta: null, funding: "Acq. Target Research", team: null, why: "AI food/beverage intelligence: trend prediction + concept creation + competitive analysis. Smaller data scale than Tastewise." },
  { id: "brandwatch",  name: "Brandwatch",     url: "brandwatch.com",    category: "Data Feeds",       status: "Acquired",  scanned: "2026-05-31 00:36", hash: "5e2c840f7b", changed: false, delta: null, funding: "Acq. Cision", team: null, why: "Enterprise social listening (Iris AI, 1.7T conversations); cross-industry. Broad social data, no F&B ontology." },
  { id: "crisp",       name: "Crisp",          url: "gocrisp.com",       category: "Data Feeds",       status: "Scaling",   scanned: "2026-05-31 00:38", hash: "ab7319d60c", changed: true,  delta: "New retailer-integration partners listed; raised $26M banner added.", funding: "$26M / VC", team: null, why: "Vertical AI for retail data integration (POS/supply-chain from 40+ retailers). Data plumbing, not consumer-trend decisioning." },
  { id: "cocacola",    name: "Coca-Cola / large-CPG internal AI", url: "coca-colacompany.com", category: "Other", status: "Incumbent", scanned: "2026-05-31 00:40", hash: "—", changed: false, delta: null, funding: "Public / in-house", team: null, why: "Adjacent reference, not a vendor. In-house generative-AI flavor & innovation initiatives (e.g. Coca-Cola Y3000) represent the 'build vs. buy' alternative large brands weigh against Tastewise — captive decision-engines inside Tastewise's own customers." },
];

window.INSIGHTS = [
  {
    id: "ins-2026-05-31-1", scan_date: "2026-05-31", generated_at: "2026-05-31T00:40:00Z",
    title: "Incumbents are buying their way into prediction",
    insight: "NIQ (Gastrograph), Mintel (Black Swan) and GlobalData (Ai Palette) each absorbed an AI-native predictive layer this quarter. The deep-data vaults are closing the prediction gap by acquisition, not by building — shrinking the Trend Radar band into the Data Vaults.",
    trend: "Currency-grade panel owners can't grow organically into AI, so they monetize their data moat by bolting on prediction — cheaper than losing accounts to nimble insurgents.",
    category: "Data Vaults", magnitude: 88,
    sources: ["exa", "competition", "web"],
    evidence: ["NIQ surfaces Gastrograph sensory scores in retail dashboards", "Mintel folds Black Swan into GNPD"],
    supersedes: null, superseded_by: null,
  },
  {
    id: "ins-2026-05-31-2", scan_date: "2026-05-31", generated_at: "2026-05-31T00:40:00Z",
    title: "Datassential's MCP turns its data moat agentic",
    insight: "'Datassential One' ships an API-for-AI over menu + operator data, letting agents query the deepest foodservice corpus directly. This is the first incumbent to contest Tastewise on execution velocity, not just data depth.",
    trend: "Once a buyer's stack is agentic, whoever exposes the richest queryable data wins the workflow — so the foodservice data leader is racing to become the default tool call.",
    category: "Decision Engines", magnitude: 82,
    sources: ["competition", "exa"],
    evidence: ["https://datassential.com/"],
    supersedes: null, superseded_by: null,
  },
];

// Scan ledger — one entry per weekly run (real data appended by main.py); these are pre-scan mocks
window.SCAN_HISTORY = [
  { date: "2026-05-31", generated_at: "2026-05-31T00:12:00Z", events_scanned: 97, red_deltas: 6, new_insights: 2, competitors_scanned: 49, duration_seconds: 412 },
  { date: "2026-05-24", generated_at: "2026-05-24T00:11:00Z", events_scanned: 88, red_deltas: 4, new_insights: 3, competitors_scanned: 49, duration_seconds: 398 },
  { date: "2026-05-17", generated_at: "2026-05-17T00:13:00Z", events_scanned: 91, red_deltas: 5, new_insights: 1, competitors_scanned: 49, duration_seconds: 405 },
];

window.CATEGORIES = ["Data Feeds", "Data Vaults", "Trend Radars", "Decision Engines", "Other"];
window.STATUSES   = ["Incumbent", "Scaling", "Emerging", "Acquired"];

window.LAST_SCAN_AT = null;

// Live data loader — tries to fetch market_snapshot_latest.json, falls back to mock above
window.__obsDataReady = false;

async function initObservatoryData() {
  try {
    const res = await fetch("data/market_snapshot_latest.json");
    if (!res.ok) throw new Error("no snapshot");
    const d = await res.json();
    if (d.data_sources)      window.DATA_SOURCES  = d.data_sources;
    if (d.velocity_feed)     window.VELOCITY_FEED = d.velocity_feed;
    if (d.competitor_map)    window.COMPETITORS   = d.competitor_map;
    if (d.insights)          window.INSIGHTS      = d.insights;
    if (d.scan_history)      window.SCAN_HISTORY  = d.scan_history;
    if (d.categories)        window.CATEGORIES    = d.categories;
    if (d.statuses)          window.STATUSES      = d.statuses;
    if (d.generated_at)      window.LAST_SCAN_AT  = d.generated_at;
  } catch (_) {
    // Mock data already set above — render will use that
  }

  window.__obsDataReady = true;
  window.dispatchEvent(new CustomEvent("obs:data-ready"));
}

initObservatoryData();
