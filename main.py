#!/usr/bin/env python3
"""CODOS Observatory — weekly competitive intelligence scan."""

import json
import os
import re
import sys
import time
from datetime import datetime, timezone

from dotenv import load_dotenv

import config
from collectors.exa_worker import ExaWorker
from collectors.firecrawl_worker import FirecrawlWorker
from collectors.gemini_worker import GeminiWorker


def build_snapshot(
    synthesis: dict,
    competitor_statuses: list[dict],
    insights: list[dict],
    data_sources: list[dict],
    scan_history: list[dict],
    generated_at: str,
    started_at: float,
) -> dict:
    run_seconds = round(time.time() - started_at)

    # diff is internal-only (consumed by Gemini) — strip before the public snapshot
    for comp in competitor_statuses:
        comp.pop("diff", None)

    return {
        "generated_at": generated_at,
        "run_duration_seconds": run_seconds,
        "categories": config.CATEGORIES,
        "statuses": config.STATUSES,
        "data_sources": data_sources,
        "velocity_feed": synthesis.get("velocity_feed", []),
        "competitor_map": competitor_statuses,
        "insights": insights,
        "scan_history": scan_history,
        "meta": {
            "competitors_scanned": len(competitor_statuses),
            "red_alert_count": sum(1 for c in competitor_statuses if c.get("changed")),
        },
    }


def build_data_sources(source_counts: dict, generated_at: str) -> list[dict]:
    """Attach real per-run telemetry to each configured provider."""
    out = []
    for src in config.DATA_SOURCES:
        calls = source_counts.get(src["id"], 0)
        out.append({
            **src,
            "calls": calls,
            "last_call": generated_at if calls else None,
            "status": "healthy" if calls else "idle",
        })
    return out


INSIGHTS_HISTORY_PATH = "data/insights_history.json"
SCAN_HISTORY_PATH = "data/scan_history.json"
DISCOVERED_PATH = "data/discovered_competitors.json"
SCAN_HISTORY_KEEP = 52  # ~1 year of weekly runs
MAX_NEW_DISCOVERIES = 8  # cap per run — guard against a noisy week flooding the board


def _load_json_list(path: str) -> list[dict]:
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def _save_json_list(data: list[dict], path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, path)


def load_insights_history(path: str = INSIGHTS_HISTORY_PATH) -> list[dict]:
    return _load_json_list(path)


def save_insights_history(history: list[dict], path: str = INSIGHTS_HISTORY_PATH) -> None:
    _save_json_list(history, path)
    print(f"[codos] insights history → {path} ({len(history)} total)")


def record_scan(entry: dict, path: str = SCAN_HISTORY_PATH) -> list[dict]:
    """Prepend this run's metrics; keep the most recent SCAN_HISTORY_KEEP."""
    history = ([entry] + _load_json_list(path))[:SCAN_HISTORY_KEEP]
    _save_json_list(history, path)
    print(f"[codos] scan history → {path} ({len(history)} runs)")
    return history


def merge_insights(new_insights: list[dict], history: list[dict], scan_date: str) -> list[dict]:
    """Prepend this week's new insights; tag any prior they supersede (kept visible)."""
    generated_at = datetime.now(timezone.utc).isoformat()
    n = sum(1 for p in history if p.get("scan_date") == scan_date)
    supersede_map = {}  # prior_id -> new_id
    prepared = []

    for ins in new_insights:
        n += 1
        ins_id = f"ins-{scan_date}-{n}"
        supersedes = ins.get("supersedes")
        prepared.append({
            "id": ins_id,
            "scan_date": scan_date,
            "generated_at": generated_at,
            "title": ins.get("title"),
            "insight": ins.get("insight"),
            "trend": ins.get("trend"),
            "category": ins.get("category"),
            "magnitude": ins.get("magnitude"),
            "sources": ins.get("sources", []),
            "evidence": ins.get("evidence", []),
            "supersedes": supersedes,
            "superseded_by": None,
        })
        if supersedes:
            supersede_map[supersedes] = ins_id

    for prior in history:
        if prior.get("id") in supersede_map:
            prior["superseded_by"] = supersede_map[prior["id"]]

    return prepared + history  # newest first


# ---- discovery: auto-add new entrants found by weekly research ----------------

def _norm_domain(url: str) -> str:
    u = (url or "").strip().lower()
    u = re.sub(r"^https?://", "", u)
    u = re.sub(r"^www\.", "", u)
    return u.split("/")[0]


def _slug(s: str) -> str:
    out = re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")
    return out or "entrant"


def load_discovered(path: str = DISCOVERED_PATH) -> list[dict]:
    return _load_json_list(path)


def save_discovered(discovered: list[dict], path: str = DISCOVERED_PATH) -> None:
    _save_json_list(discovered, path)
    print(f"[codos] discovered ledger → {path} ({len(discovered)} total)")


def merge_discoveries(candidates, tracked, ledger, scan_date, threshold, cap):
    """Filter raw Gemini candidates into new competitor dicts.

    Returns (new_competitors, updated_ledger). A candidate is kept only if it is
    real (has a domain), clears the relevance threshold, and is not already
    tracked (by domain, name, or id) — including earlier discoveries.
    """
    seen_domains = {_norm_domain(c.get("url", "")) for c in tracked}
    seen_names = {(c.get("name") or "").strip().lower() for c in tracked}
    seen_ids = {c.get("id") for c in tracked}
    new = []

    for cand in candidates:
        if len(new) >= cap:
            break
        name = (cand.get("name") or "").strip()
        dom = _norm_domain(cand.get("url", ""))
        rel = cand.get("relevance")
        if not name or not dom or "." not in dom:
            continue
        if not isinstance(rel, (int, float)) or rel < threshold:
            continue
        if dom in seen_domains or name.lower() in seen_names:
            continue

        cat = cand.get("category") if cand.get("category") in config.CATEGORIES else "Other"
        cid = _slug(name)
        base, k = cid, 2
        while cid in seen_ids:
            cid = f"{base}-{k}"
            k += 1

        new.append({
            "id": cid, "name": name, "url": dom, "category": cat,
            "crawl_paths": ["/"], "funding": "—", "team": None,
            "status": "Emerging", "anchor": False,
            "why": cand.get("why") or "",
            "discovered": True, "discovered_at": scan_date,
            "discovery_relevance": int(rel),
            "evidence": cand.get("evidence"),
        })
        seen_domains.add(dom)
        seen_names.add(name.lower())
        seen_ids.add(cid)

    return new, ledger + new


def discovered_to_row(comp: dict, scan_date: str) -> dict:
    """Board row for a just-discovered player — not yet firecrawl-scanned this run."""
    return {
        "id": comp["id"], "name": comp["name"], "url": comp["url"],
        "category": comp["category"], "status": comp["status"],
        "funding": comp["funding"], "team": comp["team"], "why": comp["why"],
        "anchor": False,
        "discovered": True, "discovered_at": comp["discovered_at"],
        "discovery_relevance": comp.get("discovery_relevance"),
        "scanned": scan_date, "hash": "—", "changed": False,
        "delta": None, "crawl_status": "pending",
    }


def save_snapshot(snapshot: dict, path: str = "data/market_snapshot_latest.json") -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w") as f:
        json.dump(snapshot, f, indent=2)
    os.replace(tmp, path)
    print(f"[codos] snapshot written → {path}")


def main():
    load_dotenv()

    exa_key       = os.getenv("EXA_API_KEY")
    firecrawl_key = os.getenv("FIRECRAWL_API_KEY")
    gemini_key    = os.getenv("GEMINI_API_KEY")

    missing = [k for k, v in [("EXA_API_KEY", exa_key), ("FIRECRAWL_API_KEY", firecrawl_key), ("GEMINI_API_KEY", gemini_key)] if not v]
    if missing:
        print(f"[codos] missing env vars: {', '.join(missing)}")
        print("[codos] run via Doppler (doppler run -- python main.py) or export the keys directly")
        sys.exit(1)

    started_at = time.time()
    print(f"[codos] scan started at {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")

    # Step 1 — Exa neural search
    print("[codos] step 1/3: Exa neural search…")
    exa = ExaWorker(api_key=exa_key)
    signals = exa.run(
        competitors=config.COMPETITORS,
        topics=config.SEARCH_TOPICS,
        days_back=config.EXA_DAYS_BACK,
        num_results=config.EXA_NUM_RESULTS,
    )

    # Earlier auto-discovered entrants are folded into the tracked set so they
    # get scraped + change-tracked alongside the curated board.
    discovered_ledger = load_discovered()
    tracked = config.COMPETITORS + discovered_ledger
    if discovered_ledger:
        print(f"[codos] {len(discovered_ledger)} previously-discovered entrant(s) folded in "
              f"→ {len(tracked)} tracked")

    # Step 2 — Firecrawl change-tracking
    print("[codos] step 2/5: Firecrawl change-tracking scan…")
    firecrawl = FirecrawlWorker(api_key=firecrawl_key)
    competitor_statuses = firecrawl.run(tracked)
    scanned_count = len(competitor_statuses)
    red_alerts = sum(1 for c in competitor_statuses if c.get("changed"))
    print(f"  [firecrawl] {red_alerts} red alerts detected")

    # Step 3 — Gemini synthesis (velocity feed + competitor deltas)
    print("[codos] step 3/5: Gemini synthesis…")
    gemini = GeminiWorker(api_key=gemini_key, model_name=config.GEMINI_MODEL)
    synthesis = gemini.run(signals, competitor_statuses)

    # Merge delta summaries into rows now — the insights pass reads them
    deltas = synthesis.get("competitor_deltas", {})
    for comp in competitor_statuses:
        if comp["id"] in deltas:
            comp["delta"] = deltas[comp["id"]]

    # Step 4 — Gemini deep-research insights (accumulating, supersede-aware feed)
    print("[codos] step 4/5: Gemini deep-research insights…")
    history = load_insights_history()
    new_insights = gemini.research_insights(signals, competitor_statuses, history)
    scan_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    insights = merge_insights(new_insights, history, scan_date)
    save_insights_history(insights)
    print(f"  [gemini] {len(new_insights)} new insights this week")

    # Step 5 — Discovery scout: auto-add new entrants found via web research
    new_competitors = []
    if config.DISCOVERY_ENABLED:
        print("[codos] step 5/5: discovery scout…")
        candidates = gemini.discover_entrants(signals, tracked)
        new_competitors, discovered_ledger = merge_discoveries(
            candidates, tracked, discovered_ledger, scan_date,
            config.DISCOVERY_RELEVANCE_THRESHOLD, MAX_NEW_DISCOVERIES,
        )
        if new_competitors:
            save_discovered(discovered_ledger)
            for comp in new_competitors:
                competitor_statuses.append(discovered_to_row(comp, scan_date))
        print(f"  [gemini] {len(new_competitors)} new competitor(s) discovered this week"
              + (": " + ", ".join(c["name"] for c in new_competitors) if new_competitors else ""))

    # Real per-run telemetry from the workers' call counters
    generated_at = datetime.now(timezone.utc).isoformat()
    source_counts = {
        "exa": exa.call_count,
        "firecrawl": firecrawl.call_count,
        "gemini": gemini.gemini_calls,
        "web": gemini.web_calls,
    }
    data_sources = build_data_sources(source_counts, generated_at)

    # Record this run in the durable scan-history ledger
    scan_history = record_scan({
        "date": scan_date,
        "generated_at": generated_at,
        "events_scanned": len(signals),
        "red_deltas": red_alerts,
        "new_insights": len(new_insights),
        "new_competitors": len(new_competitors),
        "competitors_scanned": scanned_count,
        "duration_seconds": round(time.time() - started_at),
    })

    # Velocity feed: tag this week's signals and carry last week's forward
    # (the UI dims the prior week below a divider instead of dropping it).
    this_week_velocity = synthesis.get("velocity_feed", [])
    for v in this_week_velocity:
        v["scan_date"] = scan_date
    prev_velocity = []
    try:
        with open("data/market_snapshot_latest.json") as f:
            _prev = json.load(f)
        _items = _prev.get("velocity_feed", [])
        _pdate = (_prev.get("generated_at") or "")[:10]
        for v in _items:
            v.setdefault("scan_date", _pdate)
        _dates = sorted({v.get("scan_date") for v in _items if v.get("scan_date")}, reverse=True)
        _keep = next((d for d in _dates if d and d != scan_date), None)
        if _keep:
            prev_velocity = [v for v in _items if v.get("scan_date") == _keep]
    except Exception:
        pass
    synthesis["velocity_feed"] = this_week_velocity + prev_velocity

    # Build + save
    snapshot = build_snapshot(
        synthesis, competitor_statuses, insights,
        data_sources, scan_history, generated_at, started_at,
    )
    save_snapshot(snapshot)

    print(f"[codos] done in {snapshot['run_duration_seconds']}s — "
          f"{red_alerts} red alerts, "
          f"{len(snapshot['velocity_feed'])} velocity events, "
          f"{len(new_insights)} new insights ({len(insights)} total), "
          f"{len(new_competitors)} new competitors — "
          f"exa:{source_counts['exa']} firecrawl:{source_counts['firecrawl']} "
          f"gemini:{source_counts['gemini']} web:{source_counts['web']}")


if __name__ == "__main__":
    main()
