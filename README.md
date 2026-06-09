# CODOS Observatory

A weekly **F&B competitive-intelligence dashboard**. Every Sunday it sweeps the
competitive landscape — news velocity, competitor website changes, and
AI-synthesized insights — and renders them as a live, zero-build dashboard.

It maps every player on one axis: the **data-depth → decision-velocity
spectrum** (Data Feeds → Data Vaults → Trend Radars → Decision Engines).

---

## What it shows

- **Velocity Feed** — top market signals from the last 7 days (Exa news search).
- **Competitor Map** — the tracked players across the four-band spectrum, with
  weekly site-change detection (Firecrawl) and red-flag deltas.
- **Insights** — Gemini-synthesized deep-research insights that accumulate and
  *supersede* (never delete) week over week.
- **Data Sources / Scan History** — pipeline telemetry and a ledger of past runs.

## Architecture

```
Exa        (news / signal search) ─┐
Firecrawl  (competitor site diff)  ─┼─→  main.py  ─→  data/*.json  ─→  static frontend
Gemini     (synthesis + discovery) ─┘   (orchestrator)               (index.html)
```

- **Backend** (Python) — `main.py` orchestrates three collectors and writes JSON to `data/`:
  - `collectors/exa_worker.py` — weekly news / signal search.
  - `collectors/firecrawl_worker.py` — competitor site change-tracking (new / changed / removed + diff).
  - `collectors/gemini_worker.py` — synthesizes the velocity feed, deltas and insights, and auto-discovers new entrants.
- **Frontend** (no build step) — `index.html` + React 18 via in-browser Babel.
  Each view is a plain `.jsx` file attached to `window` (`feed.jsx`, `map.jsx`,
  `insights.jsx`, `secondary.jsx`, `shell.jsx`, `icons.jsx`, `sources.jsx`).
  Styling is in `styles.css` (CSS variables, dark/light themes). The page
  `fetch()`es `data/market_snapshot_latest.json`; `data.js` is the mock fallback
  used before the first real scan.
- **Config** — `config.py`: scan settings + the seed competitor board.
- **Automation** — `.github/workflows/weekly_scan.yml`: runs the scan every
  Sunday 00:00 UTC, commits refreshed `data/`, and optionally deploys.

## Prerequisites

- **Python 3.11+** (the code uses `X | None` type syntax).
- API keys: [Exa](https://exa.ai) · [Firecrawl](https://firecrawl.dev) · [Google Gemini](https://aistudio.google.com/apikey).

## Run it locally

### 1. Backend — run a scan

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # then paste in your three API keys
python main.py              # writes data/*.json — takes a few minutes
```

### 2. Frontend — view the dashboard

The dashboard `fetch()`es `data/*.json`, so it **must be served over HTTP** —
opening `index.html` directly (`file://`) will show an empty board.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Before your first scan the board renders mock data from `data.js`. After a scan
it shows the real `data/market_snapshot_latest.json`.

## Configuration

- **Competitor board** — edit the `COMPETITORS` list in `config.py`. Each entry:
  `id`, `name`, `url`, `category`, `crawl_paths`, `funding`, `status`, and a
  one-line `why` (powers the "why tracked" popup).
- **Scan tuning** — `EXA_DAYS_BACK`, `EXA_NUM_RESULTS`, `GEMINI_MODEL`,
  `DISCOVERY_RELEVANCE_THRESHOLD`, etc., also in `config.py`.

## Weekly automation (GitHub Actions)

The workflow runs the scan, commits refreshed `data/` back to the repo, and
optionally deploys the data to your own server.

**Required** repository *secrets* (Settings → Secrets and variables → Actions → Secrets):

| Secret | Purpose |
| --- | --- |
| `EXA_API_KEY` | Exa news search |
| `FIRECRAWL_API_KEY` | Firecrawl site diff |
| `GEMINI_API_KEY` | Gemini synthesis |

**Optional** deploy — the deploy step is **skipped automatically unless `VPS_HOST` is set**.
To enable it, add these *variables* and *secret*:

| Name | Type | Example |
| --- | --- | --- |
| `VPS_HOST` | Variable | `user@1.2.3.4` |
| `VPS_PATH` | Variable | `/var/www/your-site/data/` |
| `VPS_SSH_KEY` | Secret | the private key used for rsync over SSH |

You can also trigger a run manually from the **Actions** tab (`workflow_dispatch`).

## Hosting the frontend

Any static host works — GitHub Pages, Netlify, an nginx box, etc. Serve the
repo root and make sure `data/` is reachable at `./data/`.

> ⚠️ **Never** place a `.env` (or any secret) inside the served directory, and
> block dotfiles at the web server (e.g. nginx `location ~ /\. { deny all; }`).
> Serve only the frontend assets, not the Python source.

## Data files

`data/*.json` are committed sample outputs from a real scan and are overwritten
on each weekly run. Safe to delete — the dashboard falls back to `data.js`.

## Security

- Secrets come from environment variables only (`.env` locally, GitHub Actions
  secrets in CI). `.env` is gitignored — never commit real keys.
- If a key is ever exposed, **rotate it** at the provider; removing the file
  doesn't un-leak what may already have been scraped.

## License

[MIT](LICENSE) © 2026 Codos.
