import json
import re
import time


PROMPT_TEMPLATE = """You are an F&B competitive-intelligence analyst tracking the food & beverage
intelligence market for Tastewise. You map every player on one axis: the
data-depth → decision-velocity spectrum, in four bands:

  Data Feeds       — commoditized / generic data providers (social listening, media monitoring)
  Data Vaults      — deep syndicated & panel data + analytics (NIQ, Circana, Mintel)
  Trend Radars     — AI-native predictive insight platforms (trend/flavor/sensory prediction)
  Decision Engines — deep F&B data + agentic execution (Tastewise's band: insight → finished asset)

You will receive:
1. RAW_SIGNALS — recent market signals (news, press releases, social) from the past 7 days
2. COMPETITOR_MAP — current tracked competitors; changed ones include a `diff` (git-diff of what actually changed on their site)
3. CATEGORIES — Data Feeds | Data Vaults | Trend Radars | Decision Engines

Return a single valid JSON object with exactly this structure (no markdown fences, no preamble):

{{
  "velocity_feed": [
    {{
      "id": "v1",
      "title": "<title from signal>",
      "domain": "<domain only, e.g. fooddive.com>",
      "hours_ago": <integer>,
      "velocity": <integer 1-100; 90+ = paradigm-shift, 50 = notable, <30 = noise>,
      "why": "<max 15 words: the underlying truth this signal reveals for the F&B intel market>",
      "source_url": "<full url>",
      "sources": ["exa"],
      "category": "<Data Feeds | Data Vaults | Trend Radars | Decision Engines>"
    }}
    // top 7 signals only, sorted by velocity descending, id as v1..v7
  ],
  "competitor_deltas": {{
    "<competitor_id>": "<2-sentence max: what changed on their site and why it matters to Tastewise>"
    // only include competitors where changed = true; ground the summary in their `diff`, not speculation
  }}
}}

RULES:
- velocity 90-100: reserved for funding rounds, acquisitions, major product/agent launches, leadership shifts, paradigm pivots
- why must be ≤ 15 words, stating the *implication* not the headline
- Return ONLY the JSON. No markdown. No explanation. No trailing text.

RAW_SIGNALS:
{signals}

COMPETITOR_MAP:
{competitor_map}
"""


INSIGHTS_PROMPT_TEMPLATE = """You are the lead market analyst for Tastewise, the F&B AI intelligence platform.
Produce this week's TOP STRATEGIC INSIGHTS about the food & beverage intelligence market
(players span: Data Feeds → Data Vaults → Trend Radars → Decision Engines).

You have four inputs:
1. RAW_SIGNALS — this week's market signals (news, funding, launches) from neural search
2. COMPETITOR_CHANGES — competitors whose sites changed this week, with a summary of what changed
3. LIVE WEB RESEARCH — use search to research the latest F&B data/intelligence developments over the
   PAST WEEK and fill gaps the signals miss
4. PRIOR_INSIGHTS — insights already published in earlier weeks (id + title + takeaway). This is memory.

Produce ONLY genuinely NEW insights vs PRIOR_INSIGHTS. Quality over quantity — 2 to 5 insights.
- If a development UPDATES or EVOLVES a prior insight, set "supersedes" to that prior insight's id.
- If it is wholly new, set "supersedes": null.
- Do NOT restate prior insights that have not moved this week.

Return a single valid JSON ARRAY (no markdown fences, no preamble). Each element:
{{
  "title": "<6-10 word headline>",
  "insight": "<2-3 sentences: the strategic takeaway for Tastewise>",
  "trend": "<1-2 sentences: WHY this is happening — the underlying market force, not a restatement>",
  "category": "<Data Feeds | Data Vaults | Trend Radars | Decision Engines>",
  "magnitude": <integer 1-100; 90+ = market-defining, 50 = notable, <30 = minor>,
  "sources": ["<exa|web|competition>", ...],
  "evidence": ["<short fact or url backing this>", ...],
  "supersedes": "<prior insight id, or null>"
}}

RULES:
- Ground every insight in the inputs or your web research — no speculation.
- "trend" must explain the causal force (why now), not restate the headline.
- Frame through Tastewise's edge: insight → execution, unifying consumer + foodservice + retail + recipe.
- Return ONLY the JSON array. No markdown. No explanation.

RAW_SIGNALS:
{signals}

COMPETITOR_CHANGES:
{competitor_changes}

PRIOR_INSIGHTS:
{prior_insights}
"""


DISCOVERY_PROMPT_TEMPLATE = """You are a market scout for Tastewise, the F&B AI intelligence platform.
Your job: surface NEW companies entering the food & beverage intelligence market that are
NOT already on Tastewise's tracked board — real competitors, entrants, or adjacent players.

The market spans five bands:
  Data Feeds        — commoditized / generic data providers (social listening, media monitoring)
  Data Vaults       — deep syndicated & panel data + analytics
  Trend Radars      — AI-native predictive insight platforms (trend/flavor/sensory prediction)
  Decision Engines  — deep F&B data + agentic execution (Tastewise's band)
  Other             — anything real and relevant that doesn't fit the four bands above
                      (e.g. brand-side in-house AI programs, adjacent references)

Inputs:
1. RAW_SIGNALS — this week's market signals (news, funding, launches) from neural search
2. LIVE WEB RESEARCH — use search to find NEW F&B data/intelligence companies, funding rounds,
   product launches, and stealth exits from the PAST WEEK
3. ALREADY_TRACKED — companies already on the board. Do NOT return any of these (match by name OR domain).

Return a single valid JSON ARRAY (no markdown fences, no preamble). Only include a company if it is:
- REAL (you can name its website domain), and
- relevant to the F&B intelligence / consumer-insight / product-development market, and
- NOT already in ALREADY_TRACKED.
If nothing new and credible surfaced this week, return an empty array [].

Each element:
{{
  "name": "<company name>",
  "url": "<bare domain, e.g. example.com — no https://, no path>",
  "category": "<Data Feeds | Data Vaults | Trend Radars | Decision Engines | Other>",
  "why": "<1-2 sentences: what they do and why they belong on Tastewise's board>",
  "relevance": <integer 0-100; how directly they compete with / matter to Tastewise>,
  "evidence": "<short fact or url backing this — funding, launch, etc.>"
}}

RULES:
- Quality over quantity. Better to return [] than to invent or pad.
- Never guess a domain. If you can't name a real website, omit the company.
- Do not return parent brands of products, generic agencies, or anything not F&B-intelligence relevant.
- Return ONLY the JSON array.

RAW_SIGNALS:
{signals}

ALREADY_TRACKED:
{tracked}
"""


class GeminiWorker:
    def __init__(self, api_key: str, model_name: str = "gemini-2.5-flash"):
        from google import genai
        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name
        # Telemetry: real API calls this run. Grounded calls (Google Search) count
        # as the "web" provider; plain synthesis/JSON calls count as "gemini".
        self.gemini_calls = 0
        self.web_calls = 0

    # ---- view 1+2: velocity feed + competitor deltas -------------------------
    def run(self, signals: list[dict], competitor_statuses: list[dict]) -> dict:
        print(f"  [gemini] synthesizing {len(signals)} signals + {len(competitor_statuses)} competitors…")

        signals_json = json.dumps(signals[:40], indent=2)
        comp_json = json.dumps(competitor_statuses, indent=2)

        prompt = PROMPT_TEMPLATE.format(signals=signals_json, competitor_map=comp_json)
        raw = self._generate(prompt, self._json_config())
        return self._parse_json(raw, expect="object")

    # ---- view 3: accumulating insights feed (fused deep research) ------------
    def research_insights(
        self,
        signals: list[dict],
        competitor_statuses: list[dict],
        prior_insights: list[dict],
    ) -> list[dict]:
        changes = [
            {"id": c["id"], "name": c["name"], "changed": c.get("delta")}
            for c in competitor_statuses
            if c.get("changed") and c.get("delta")
        ]
        # compact memory: only id/title/insight, most recent 30
        prior_compact = [
            {"id": p["id"], "title": p.get("title"), "insight": p.get("insight")}
            for p in prior_insights[:30]
        ]
        print(f"  [gemini] deep-research insights — {len(changes)} competitor changes, "
              f"{len(prior_compact)} prior insights in memory…")

        prompt = INSIGHTS_PROMPT_TEMPLATE.format(
            signals=json.dumps(signals[:40], indent=2),
            competitor_changes=json.dumps(changes, indent=2),
            prior_insights=json.dumps(prior_compact, indent=2),
        )

        # Grounded call (live web research). Tools and forced-JSON mode are mutually
        # exclusive, so we parse JSON out of the text and fall back if grounding is
        # unavailable in the installed SDK / model.
        raw = None
        grounded = self._grounded_config()
        if grounded is not None:
            try:
                raw = self._generate(prompt, grounded)
            except Exception as e:
                print(f"    [gemini] grounded research failed ({e}); retrying without web search")
        if raw is None:
            raw = self._generate(prompt, self._text_config())

        insights = self._parse_json(raw, expect="array")
        return insights if isinstance(insights, list) else []

    # ---- discovery: surface NEW entrants not yet on the board -----------------
    def discover_entrants(
        self,
        signals: list[dict],
        tracked: list[dict],
    ) -> list[dict]:
        """Grounded web scout for new players. Returns raw candidates
        [{name, url, category, why, relevance, evidence}]; caller filters + dedups."""
        tracked_compact = [{"name": c.get("name"), "url": c.get("url")} for c in tracked]
        print(f"  [gemini] discovery scout — scanning for entrants beyond {len(tracked_compact)} tracked…")

        prompt = DISCOVERY_PROMPT_TEMPLATE.format(
            signals=json.dumps(signals[:40], indent=2),
            tracked=json.dumps(tracked_compact, indent=2),
        )

        raw = None
        grounded = self._grounded_config()
        if grounded is not None:
            try:
                raw = self._generate(prompt, grounded)
            except Exception as e:
                print(f"    [gemini] grounded discovery failed ({e}); retrying without web search")
        if raw is None:
            raw = self._generate(prompt, self._text_config())

        candidates = self._parse_json(raw, expect="array")
        return candidates if isinstance(candidates, list) else []

    # ---- generation + config -------------------------------------------------
    def _generate(self, prompt: str, config, max_retries: int = 3) -> str:
        grounded = bool(getattr(config, "tools", None))
        for attempt in range(max_retries):
            if grounded:
                self.web_calls += 1
            else:
                self.gemini_calls += 1
            try:
                resp = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=config,
                )
                return resp.text
            except Exception as e:
                if attempt < max_retries - 1:
                    wait = 2 ** attempt * 5
                    print(f"    [gemini] retry {attempt + 1} after {wait}s: {e}")
                    time.sleep(wait)
                else:
                    raise

    def _json_config(self):
        # gemini-2.5-flash is a thinking model: reasoning tokens share the output budget,
        # so keep it generous or the JSON truncates. JSON mode guarantees parseable output.
        from google import genai
        return genai.types.GenerateContentConfig(
            temperature=0.3,
            top_p=0.8,
            max_output_tokens=16384,
            response_mime_type="application/json",
        )

    def _text_config(self):
        from google import genai
        return genai.types.GenerateContentConfig(
            temperature=0.4,
            top_p=0.9,
            max_output_tokens=16384,
        )

    def _grounded_config(self):
        """Text config with Google Search grounding; None if SDK doesn't support it."""
        from google import genai
        try:
            tools = [genai.types.Tool(google_search=genai.types.GoogleSearch())]
            return genai.types.GenerateContentConfig(
                temperature=0.4,
                top_p=0.9,
                max_output_tokens=16384,
                tools=tools,
            )
        except Exception:
            return None

    # ---- parsing -------------------------------------------------------------
    def _parse_json(self, text: str, expect: str = "object"):
        text = (text or "").strip()
        text = re.sub(r"^```json\s*", "", text)
        text = re.sub(r"^```\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Salvage: slice the outermost array/object (grounded calls add prose).
            open_ch, close_ch = ("[", "]") if expect == "array" else ("{", "}")
            start = text.find(open_ch)
            end = text.rfind(close_ch)
            if start != -1 and end != -1 and end > start:
                return json.loads(text[start:end + 1])
            raise
