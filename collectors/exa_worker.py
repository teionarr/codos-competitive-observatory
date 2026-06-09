import time
from datetime import datetime, timedelta, timezone


class ExaWorker:
    def __init__(self, api_key: str):
        from exa_py import Exa
        self.client = Exa(api_key=api_key)
        self.call_count = 0  # real API calls this run (telemetry)

    def run(
        self,
        competitors: list[dict],
        topics: list[str],
        days_back: int = 7,
        num_results: int = 20,
    ) -> list[dict]:
        now = datetime.now(timezone.utc)
        start = now - timedelta(days=days_back)
        start_iso = start.strftime("%Y-%m-%dT%H:%M:%SZ")

        all_results: dict[str, dict] = {}

        # Topic-level neural searches
        for topic in topics:
            print(f"  [exa] topic: {topic[:60]}…")
            for r in self._search_neural(topic, start_iso, num_results):
                if r["url"] not in all_results:
                    all_results[r["url"]] = r
            time.sleep(1)

        # Per-competitor searches
        for comp in competitors:
            query = f"{comp['name']} {comp['url']} AI product update news"
            print(f"  [exa] competitor: {comp['name']}")
            for r in self._search_neural(query, start_iso, 10):
                if r["url"] not in all_results:
                    all_results[r["url"]] = r
            time.sleep(1)

        # X/Twitter social signals
        for topic in topics[:3]:
            for r in self._search_social(topic, start_iso):
                if r["url"] not in all_results:
                    all_results[r["url"]] = r
            time.sleep(1)

        now_ts = now.timestamp()
        signals = list(all_results.values())
        for s in signals:
            try:
                pub = datetime.fromisoformat(s["published_date"].replace("Z", "+00:00"))
                s["hours_ago"] = max(1, int((now_ts - pub.timestamp()) / 3600))
            except Exception:
                s["hours_ago"] = days_back * 24

        print(f"  [exa] {len(signals)} signals collected")
        return signals

    def _search_neural(self, query: str, start_iso: str, num_results: int) -> list[dict]:
        self.call_count += 1
        try:
            resp = self.client.search_and_contents(
                query,
                type="neural",
                num_results=num_results,
                start_published_date=start_iso,
                text=True,
            )
            return [self._to_signal(r) for r in resp.results]
        except Exception as e:
            print(f"    [exa] error: {e}")
            return []

    def _search_social(self, query: str, start_iso: str) -> list[dict]:
        self.call_count += 1
        try:
            resp = self.client.search_and_contents(
                query,
                type="keyword",
                num_results=5,
                start_published_date=start_iso,
                include_domains=["twitter.com", "x.com"],
                text=True,
            )
            return [self._to_signal(r, source_type="social") for r in resp.results]
        except Exception as e:
            print(f"    [exa] social error: {e}")
            return []

    def _to_signal(self, r, source_type: str = None) -> dict:
        url = getattr(r, "url", "")
        title = getattr(r, "title", "") or url
        text = ""
        if hasattr(r, "text") and r.text:
            text = r.text[:500]
        pub = getattr(r, "published_date", None) or datetime.now(timezone.utc).isoformat()

        if source_type is None:
            source_type = self._classify_source(url)

        domain = url.split("/")[2] if url.startswith("http") else url

        return {
            "url": url,
            "title": title,
            "domain": domain,
            "published_date": pub,
            "hours_ago": 0,  # filled by caller
            "velocity": 0,   # filled by GeminiWorker
            "why": text[:200],
            "source_url": url,
            "sources": self._source_ids(source_type),
            "category": "",  # filled by GeminiWorker
            "source_type": source_type,
        }

    def _classify_source(self, url: str) -> str:
        if any(d in url for d in ["twitter.com", "x.com"]):
            return "social"
        if any(d in url for d in ["prnewswire", "businesswire", "globenewswire", "accesswire"]):
            return "press_release"
        if any(d in url for d in ["github.com"]):
            return "github"
        return "news"

    def _source_ids(self, source_type: str) -> list[str]:
        mapping = {
            "social": ["twitter", "exa"],
            "press_release": ["exa"],
            "github": ["github", "exa"],
            "news": ["exa"],
        }
        return mapping.get(source_type, ["exa"])
