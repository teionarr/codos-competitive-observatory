# Tastewise Competitive Observatory — scan configuration
#
# Spectrum framing (from the competitive map report):
#   Data Feeds      → Group 1 · commoditized / generic data providers
#   Data Vaults     → Group 2 · deep syndicated & panel data + analytics
#   Trend Radars    → Group 3 · AI-native predictive insight platforms
#   Decision Engines→ Group 4 · deep F&B data + agentic execution (Tastewise's band)

# --- Scan settings ---
EXA_DAYS_BACK = 7          # weekly assurance sweep
EXA_NUM_RESULTS = 20
GEMINI_MODEL = "gemini-2.5-flash"

# Discovery scan — auto-detect new entrants not yet on the board
DISCOVERY_ENABLED = True
DISCOVERY_RELEVANCE_THRESHOLD = 60   # 0-100; Gemini relevance score to auto-add

# --- Spectrum groups (the four bands of the data-depth → decision-velocity axis) ---
# "Other" is a non-spectrum catch-all for players that don't fit the four bands
# (e.g. brand-side in-house programs, adjacent references).
CATEGORIES = ["Data Feeds", "Data Vaults", "Trend Radars", "Decision Engines", "Other"]
STATUSES   = ["Incumbent", "Scaling", "Emerging", "Acquired"]

# --- Competitors (49 verified players from the competitive map report) ---
# why = one-line rationale for why the player sits on the board (powers the "why added?" popup)
COMPETITORS = [
    # ── Decision Engines — Group 4 · Tastewise's direct band ─────────────────
    {"id": "tastewise",   "name": "Tastewise",            "url": "tastewise.io",          "category": "Decision Engines", "crawl_paths": ["/", "/product"], "funding": "$72M / Series B", "team": 100,  "status": "Scaling",   "anchor": True,
     "why": "ANCHOR. F&B-native GenAI/agentic intelligence unifying consumer, foodservice, e-retail and recipe signals; agents produce sell-in kits, briefs and concepts (TasteGPT). Defines the decision-velocity band — insight + execution in one workflow."},
    {"id": "datassential", "name": "Datassential",        "url": "datassential.com",      "category": "Decision Engines", "crawl_paths": ["/", "/products"], "funding": "PE / New Mountain", "team": None, "status": "Incumbent",
     "why": "Deepest foodservice/operator data moat (reinforced by CHD Expert + Brizo acquisitions), 90%+ penetration of top foodservice/CPG, moving aggressively on the same agentic thesis (Datassential One GenAI search + MCP 'API for AI'). Tastewise's most resourced direct rival."},
    {"id": "aipalette",   "name": "Ai Palette",           "url": "aipalette.com",         "category": "Decision Engines", "crawl_paths": ["/", "/features"], "funding": "Acq. GlobalData $11.5M", "team": None, "status": "Acquired",
     "why": "Foresight Engine (61B data points) + Concept Genie GenAI concept generation + Screen Winner + FoodGPT. Trend → concept → screen workflow = decision acceleration, now with GlobalData's syndicated depth and public-company capital."},
    {"id": "foodpairing", "name": "Foodpairing AI",       "url": "foodpairing.com",       "category": "Decision Engines", "crawl_paths": ["/", "/products"], "funding": "Private", "team": None, "status": "Scaling",
     "why": "Flavor-intelligence + predictive NPD: Consumer Flavor Intelligence, FlavorID, ~140k digital-twin consumers, predicts liking/buying intent 75-85%, turns months into days. Predictive + prescriptive formulation/concept execution, F&B-native."},
    {"id": "notco",       "name": "NotCo (Giuseppe)",     "url": "notco.com",             "category": "Decision Engines", "crawl_paths": ["/", "/giuseppe"], "funding": "$400M+", "team": None, "status": "Scaling",
     "why": "Proprietary AI formulation engine (300k+ plant database, FTIR/GC sensory corpus); B2B 'AI infrastructure for FMCG', Kraft Heinz JV. Executes the deepest decision — generates manufacturable formulas — though scoped to formulation."},
    {"id": "spoonshot",   "name": "Spoonshot",            "url": "spoonshot.com",         "category": "Decision Engines", "crawl_paths": ["/", "/features"], "funding": "Acq. Target Research", "team": None, "status": "Acquired",
     "why": "AI food/beverage intelligence (food science + #foodbrain): trend prediction + concept creation + competitive analysis. F&B-native, action-oriented insight; smaller data scale than Tastewise."},
    {"id": "starday",     "name": "Starday Foods",        "url": "stardayfoods.com",      "category": "Decision Engines", "crawl_paths": ["/", "/about"], "funding": "$11M / Series A", "team": None, "status": "Scaling",
     "why": "AI + culinary R&D: trend exploration, consumer-content analysis, predictions, review insights, retail DB → R&D briefs/concepts in weeks. End-to-end insight→R&D→shelf execution; emerging challenger most resembling Tastewise's model."},
    {"id": "halla",       "name": "Halla",                "url": "halla.io",              "category": "Decision Engines", "crawl_paths": ["/"], "funding": "Acq. Wynshop", "team": None, "status": "Acquired",
     "why": "'Taste Intelligence' AI for grocery (recommend/substitute/search, 100B+ data points). Real-time decision automation, but retail-recommendation scoped."},
    {"id": "chew",        "name": "CHEW Innovation",      "url": "chewinnovation.com",    "category": "Decision Engines", "crawl_paths": ["/"], "funding": "Bootstrapped", "team": None, "status": "Scaling",
     "why": "Consumer-first culinary innovation + commercialization (5,000+ products, $8B+ client value). Executes product development end-to-end (services + tools), though lab/consultancy model rather than pure software."},

    # ── Trend Radars — Group 3 · AI-native predictive insight ────────────────
    {"id": "blackswan",   "name": "Black Swan Data",      "url": "blackswan.com",         "category": "Trend Radars", "crawl_paths": ["/"], "funding": "Acq. Mintel", "team": None, "status": "Acquired",
     "why": "Trendscope social-prediction SaaS; TPV algorithm claims 89% accuracy six-months out, ~500k product-level trends/month (PepsiCo, Unilever, Mars). Strong predictive layer — now feeding Mintel."},
    {"id": "spate",       "name": "Spate",                "url": "spate.nyc",             "category": "Trend Radars", "crawl_paths": ["/", "/features"], "funding": "Seed / YC", "team": None, "status": "Emerging",
     "why": "AI search-based trend prediction (900B Google signals, 200M TikTok/IG posts), beauty + food, 200+ brands. Early-signal prediction, not full F&B execution."},
    {"id": "gastrograph", "name": "Gastrograph AI",       "url": "gastrograph.com",       "category": "Trend Radars", "crawl_paths": ["/"], "funding": "Acq. NIQ", "team": None, "status": "Acquired",
     "why": "AI sensory/flavor prediction modeling preference across demographics (backed by Sony/BASF). Deep sensory prediction; now part of NIQ's data stack."},
    {"id": "tastry",      "name": "Tastry",               "url": "tastry.com",            "category": "Trend Radars", "crawl_paths": ["/"], "funding": "—", "team": None, "status": "Emerging",
     "why": "Sensory-science AI: chemistry 'digital twins' + consumer palate matrices to predict preference (wine/beer/CPG). Predictive + recommends GTM moves, but narrow sensory niche."},
    {"id": "suzy",        "name": "Suzy",                 "url": "suzy.com",              "category": "Trend Radars", "crawl_paths": ["/"], "funding": "VC", "team": None, "status": "Scaling",
     "why": "Real-time consumer research (70+ panels, Suzy Speaks AI interviews, Suzy Signals trend engine). Fast iterative insight + AI moderation; decision-support, not F&B-native execution."},
    {"id": "zappi",       "name": "Zappi",                "url": "zappi.io",              "category": "Trend Radars", "crawl_paths": ["/"], "funding": "$192M / PE", "team": None, "status": "Scaling",
     "why": "Agile consumer insights / ad + concept testing (1.2B historical data points; PepsiCo/McDonald's/Heineken). Predictive ad/innovation testing; iterative but generic CPG."},
    {"id": "attest",      "name": "Attest",               "url": "askattest.com",         "category": "Trend Radars", "crawl_paths": ["/"], "funding": "VC", "team": None, "status": "Scaling",
     "why": "Fast consumer research across 150+ markets. Quick-turn survey data, decision-support."},
    {"id": "vypr",        "name": "Vypr",                 "url": "vyprclients.com",       "category": "Trend Radars", "crawl_paths": ["/"], "funding": "—", "team": None, "status": "Scaling",
     "why": "Product intelligence platform (100k+ consumer community, AI-powered Vypr Predict). Fast product-decision testing; predictive but survey-led."},
    {"id": "toluna",      "name": "Toluna",               "url": "toluna.com",            "category": "Trend Radars", "crawl_paths": ["/"], "funding": "Private", "team": None, "status": "Incumbent",
     "why": "Consumer intelligence with 79M+ panel and HarmonAIze synthetic personas. Panel + AI personas; cross-industry."},
    {"id": "quantilope",  "name": "Quantilope",           "url": "quantilope.com",        "category": "Trend Radars", "crawl_paths": ["/"], "funding": "VC", "team": None, "status": "Scaling",
     "why": "Automated/agile consumer insights (used by Kraft Heinz for trend-to-campaign). Automated insight, decision-support."},
    {"id": "gwi",         "name": "GWI",                  "url": "gwi.com",               "category": "Trend Radars", "crawl_paths": ["/"], "funding": "—", "team": None, "status": "Scaling",
     "why": "Audience/consumer data platform. Audience profiling input."},
    {"id": "upsiide",     "name": "Upsiide",              "url": "upsiide.com",           "category": "Trend Radars", "crawl_paths": ["/"], "funding": "—", "team": None, "status": "Scaling",
     "why": "Swipe-based innovation screening (up to 50 ideas/study) by Dig Insights. Early-funnel idea screening, predictive-ish."},
    {"id": "trendhunter", "name": "Trend Hunter",         "url": "trendhunter.com",       "category": "Trend Radars", "crawl_paths": ["/"], "funding": "Private", "team": None, "status": "Incumbent",
     "why": "Crowd + AI trend reports across industries. Broad ideation, low F&B specificity but trend-oriented."},
    {"id": "gravelai",    "name": "Gravel AI",            "url": "gravelai.com",          "category": "Trend Radars", "crawl_paths": ["/", "/features"], "funding": "Seed", "team": None, "status": "Emerging",
     "why": "AI/NLP ingredient + market-trend intelligence (positioned as a Mintel GNPD alternative), beauty/personal-care-leaning. Trend/ingredient prediction, adjacent to F&B."},
    {"id": "journeyfoods","name": "Journey Foods",        "url": "journeyfoods.com",      "category": "Trend Radars", "crawl_paths": ["/"], "funding": "$3M / Seed", "team": None, "status": "Emerging",
     "why": "JourneyAI — AI ingredient intelligence + formulation/portfolio optimization software for CPG. Predictive formulation insight, early-stage."},
    {"id": "climaxfoods", "name": "Climax Foods",         "url": "climaxfoods.com",       "category": "Trend Radars", "crawl_paths": ["/"], "funding": "$26M / VC", "team": None, "status": "Emerging",
     "why": "AI 'Deep Plant Intelligence' formulation for animal-free cheese (Bel Group partnership). AI-driven formulation prediction sitting between insight and execution, narrow category."},

    # ── Data Vaults — Group 2 · deep syndicated & panel data ─────────────────
    {"id": "niq",         "name": "NielsenIQ (NIQ)",      "url": "nielseniq.com",         "category": "Data Vaults", "crawl_paths": ["/"], "funding": "Public", "team": None, "status": "Incumbent",
     "why": "Global retail measurement (POS scanner, Homescan panel 250k+ households/25 countries); agreed to acquire Gastrograph AI and merged GfK. Deepest retail-sales data; AI/decision layer still emerging."},
    {"id": "circana",     "name": "Circana",              "url": "circana.com",           "category": "Data Vaults", "crawl_paths": ["/"], "funding": "PE / New Mountain", "team": None, "status": "Incumbent",
     "why": "Syndicated POS, MULO/MULO+, foodservice (ex-NPD). Vast proprietary data; analytics-led, not agentic execution."},
    {"id": "numerator",   "name": "Kantar / Numerator",   "url": "numerator.com",         "category": "Data Vaults", "crawl_paths": ["/"], "funding": "PE / Bain", "team": 5800, "status": "Incumbent",
     "why": "Combined (Jan 2025) zero-party consumer/shopper panel data, ~5B consumers. Currency-grade panel depth, descriptive shopper insight."},
    {"id": "spins",       "name": "SPINS",                "url": "spins.com",             "category": "Data Vaults", "crawl_paths": ["/"], "funding": "Private", "team": None, "status": "Incumbent",
     "why": "Natural/organic/specialty retail data; health-and-wellness ontology and product attribution. Deep niche data, dashboards over decision-execution."},
    {"id": "gfk",         "name": "GfK",                  "url": "gfk.com",               "category": "Data Vaults", "crawl_paths": ["/"], "funding": "Acq. NIQ", "team": None, "status": "Acquired",
     "why": "Consumer/retail intelligence (now merged into NIQ). Point-of-sale and consumer panels, descriptive."},
    {"id": "euromonitor", "name": "Euromonitor",          "url": "euromonitor.com",       "category": "Data Vaults", "crawl_paths": ["/"], "funding": "Private", "team": None, "status": "Incumbent",
     "why": "Syndicated global market research (Passport DB, 210 countries). Macro market sizing and long-range strategy, slow-cycle."},
    {"id": "mintel",      "name": "Mintel",               "url": "mintel.com",            "category": "Data Vaults", "crawl_paths": ["/"], "funding": "Private", "team": 1100, "status": "Incumbent",
     "why": "Market intelligence, Global New Products Database (GNPD), Spark concept tool; acquired Black Swan Data. Deep product-launch + claims data; report-led but actively bolting on a predictive layer."},
    {"id": "globaldata",  "name": "GlobalData",           "url": "globaldata.com",        "category": "Data Vaults", "crawl_paths": ["/"], "funding": "Public £285M rev", "team": 3600, "status": "Incumbent",
     "why": "Market intelligence (One Platform, Intelligence Centers); acquired Ai Palette. Broad syndicated data; pushing into AI."},
    {"id": "innova",      "name": "Innova Market Insights","url": "innovamarketinsights.com","category": "Data Vaults", "crawl_paths": ["/"], "funding": "Private", "team": None, "status": "Incumbent",
     "why": "F&B-specialized market intelligence (product launches, ingredient/claims tracking), 30+ years. Deep F&B product database, descriptive/innovation-tracking."},
    {"id": "technomic",   "name": "Technomic",            "url": "technomic.com",         "category": "Data Vaults", "crawl_paths": ["/"], "funding": "Owned / Informa", "team": None, "status": "Incumbent",
     "why": "Foodservice research/consulting (Ignite platform, Top 500, menu/operator data); launched Ignite AI. Deep foodservice data; adding AI agents but consulting-led."},
    {"id": "chdexpert",   "name": "CHD Expert",           "url": "chd-expert.com",        "category": "Data Vaults", "crawl_paths": ["/"], "funding": "Acq. Datassential", "team": None, "status": "Acquired",
     "why": "Foodservice operator database; acquired by Datassential 2022. Operator data feed, now folded into Datassential's platform."},
    {"id": "bedrock",     "name": "Bedrock Analytics",    "url": "bedrockanalytics.com",  "category": "Data Vaults", "crawl_paths": ["/"], "funding": "—", "team": None, "status": "Scaling",
     "why": "CPG data harmonization across NIQ/Circana/SPINS for retailer-ready stories. Harmonization/visualization layer atop syndicated data."},
    {"id": "profitero",   "name": "Profitero",            "url": "profitero.com",         "category": "Data Vaults", "crawl_paths": ["/"], "funding": "Acq. Publicis", "team": None, "status": "Acquired",
     "why": "E-commerce/digital-shelf analytics (owned by Publicis). Online sales/shelf data, descriptive."},

    # ── Data Feeds — Group 1 · commoditized / generic data providers ─────────
    {"id": "brandwatch",  "name": "Brandwatch",           "url": "brandwatch.com",        "category": "Data Feeds", "crawl_paths": ["/"], "funding": "Acq. Cision", "team": None, "status": "Acquired",
     "why": "Enterprise social listening / consumer intelligence (Iris AI, 1.7T historical conversations); cross-industry, not F&B-native. Broad social data, no F&B ontology or decision tooling."},
    {"id": "meltwater",   "name": "Meltwater",            "url": "meltwater.com",         "category": "Data Feeds", "crawl_paths": ["/"], "funding": "Public", "team": None, "status": "Incumbent",
     "why": "Media monitoring + social listening; PR/brand-reputation focus. Generic listening, F&B is just one vertical."},
    {"id": "talkwalker",  "name": "Talkwalker",           "url": "talkwalker.com",        "category": "Data Feeds", "crawl_paths": ["/"], "funding": "Acq. Hootsuite", "team": None, "status": "Acquired",
     "why": "Social listening with Blue Silk AI, 187-language sentiment, image recognition; part of Hootsuite. Breadth over F&B depth."},
    {"id": "sprinklr",    "name": "Sprinklr",             "url": "sprinklr.com",          "category": "Data Feeds", "crawl_paths": ["/"], "funding": "Public", "team": None, "status": "Incumbent",
     "why": "Unified CXM + social listening suite (Sprinklr AI+); enterprise, cross-industry. Customer-experience platform, not F&B decisions."},
    {"id": "sproutsocial","name": "Sprout Social",        "url": "sproutsocial.com",      "category": "Data Feeds", "crawl_paths": ["/"], "funding": "Public", "team": None, "status": "Incumbent",
     "why": "Social management + listening; publishing-led. Marketing tool, shallow F&B specificity."},
    {"id": "netbasequid", "name": "NetBase Quid",         "url": "netbasequid.com",       "category": "Data Feeds", "crawl_paths": ["/"], "funding": "PE", "team": None, "status": "Incumbent",
     "why": "Social + market intelligence with network/semantic mapping (Nestlé, PepsiCo). Strong analytics but generic, not execution-oriented."},
    {"id": "pulsar",      "name": "Pulsar",               "url": "pulsarplatform.com",    "category": "Data Feeds", "crawl_paths": ["/"], "funding": "—", "team": None, "status": "Scaling",
     "why": "Audience intelligence / cultural insight platform (TikTok, Reddit, Bluesky). Trend-spotting input, not F&B decisions."},
    {"id": "latana",      "name": "Latana",               "url": "latana.com",            "category": "Data Feeds", "crawl_paths": ["/"], "funding": "—", "team": None, "status": "Emerging",
     "why": "AI-driven brand tracking. Brand metrics, not F&B trend/decision tooling."},
    {"id": "youscan",     "name": "YouScan",              "url": "youscan.io",            "category": "Data Feeds", "crawl_paths": ["/"], "funding": "—", "team": None, "status": "Scaling",
     "why": "Visual/image social listening (logo + object detection). Visual signal feed, generic."},
    {"id": "synthesio",   "name": "Synthesio",            "url": "synthesio.com",         "category": "Data Feeds", "crawl_paths": ["/"], "funding": "Acq. Ipsos", "team": None, "status": "Acquired",
     "why": "Social listening / brand health; owned by Ipsos. Generic social intelligence."},
    {"id": "crisp",       "name": "Crisp",                "url": "gocrisp.com",           "category": "Data Feeds", "crawl_paths": ["/"], "funding": "$26M / VC", "team": None, "status": "Scaling",
     "why": "Vertical AI for retail data integration (POS/supply-chain from 40+ retailers/distributors). Data plumbing/supply-chain optimization, not consumer-trend decisioning — a raw-data conduit."},

    # ── Other — adjacent references that don't sit on the spectrum ───────────
    {"id": "cocacola",    "name": "Coca-Cola / large-CPG internal AI", "url": "coca-colacompany.com", "category": "Other", "crawl_paths": ["/"], "funding": "Public / in-house", "team": None, "status": "Incumbent",
     "why": "Adjacent reference, not a vendor. In-house generative-AI flavor & innovation initiatives (e.g. Coca-Cola Y3000) represent the 'build vs. buy' alternative large brands weigh against Tastewise. Captive decision-engines inside the very customers Tastewise sells to — a long-run substitution risk."},
]

# --- Exa search topics (food-tech / CPG competitive intel) ---
SEARCH_TOPICS = [
    "food intelligence platform CPG AI trend analysis 2025 2026",
    "restaurant menu trend data analytics startup funding",
    "consumer taste preference AI food product development",
    "food tech B2B SaaS product launch partnership acquisition 2026",
    "CPG market research consumer insights AI platform",
    "food and beverage innovation flavor prediction AI",
]

# Discovery topics — aimed at surfacing NEW entrants, not the tracked set
DISCOVERY_TOPICS = [
    "new AI food intelligence startup launch funding 2026",
    "stealth food tech consumer insights platform seed round",
    "AI agent CPG product development concept generation new company",
]

# --- Data sources (pipeline shown in the dashboard) ---
# Only providers the pipeline actually calls. Telemetry (calls/last_call/status)
# is filled per-run by main.py from the workers' real call counters.
DATA_SOURCES = [
    {"id": "exa",       "name": "Exa.ai",          "kind": "neural search",        "glyph": "hex"},
    {"id": "firecrawl", "name": "Firecrawl",       "kind": "change-tracking scrape", "glyph": "flame"},
    {"id": "gemini",    "name": "Gemini 2.5 Flash", "kind": "synthesis",            "glyph": "diamond"},
    {"id": "web",       "name": "Live Web (Google)", "kind": "grounded search",     "glyph": "wave"},
]
