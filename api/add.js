// Vercel serverless function: append a user-added company to data/watchlist.json
// in the GitHub repo, so adds survive across browsers and feed the weekly scan.
//
// Required env vars (set in Vercel → Project → Settings → Environment Variables):
//   ADD_SECRET    — shared secret; the topbar prompts for it and sends it as `x-add-key`
//   GITHUB_TOKEN  — fine-grained PAT with Contents: Read/Write on the repo
//   GITHUB_REPO   — "teionarr/ai-native-observatory"
//
// Until these are set, the topbar add still works (instant + this-browser localStorage);
// this endpoint just returns a clear error and the add stays local.

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const ADD_SECRET = process.env.ADD_SECRET;
  const TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPO;
  if (!ADD_SECRET || !TOKEN || !REPO) {
    return res.status(501).json({ error: "watchlist sync not configured (set ADD_SECRET, GITHUB_TOKEN, GITHUB_REPO)" });
  }
  if (req.headers["x-add-key"] !== ADD_SECRET) {
    return res.status(401).json({ error: "invalid add-key" });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  const rawUrl = body && body.url;
  if (!rawUrl) return res.status(400).json({ error: "url required" });

  const domain = String(rawUrl).replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./i, "").trim();
  if (!domain || !domain.includes(".")) return res.status(400).json({ error: "invalid url" });
  const id = domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const today = new Date().toISOString().slice(0, 10);

  const entry = {
    id, name: (body.name || domain), url: domain,
    category: body.category || "Other", status: "Emerging",
    funding: "—", team: null, why: "Added to watchlist.", anchor: false,
    scanned: "—", hash: "—", changed: false, changed_pages: [], delta: null,
    crawl_status: "pending", discovered: true, discovered_at: today,
  };

  const api = `https://api.github.com/repos/${REPO}/contents/data/watchlist.json`;
  const gh = (url, opts) => fetch(url, Object.assign({}, opts, {
    headers: Object.assign({
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "ai-native-observatory",
    }, (opts && opts.headers) || {}),
  }));

  try {
    const cur = await gh(api).then((r) => r.json());
    let list = [];
    let sha;
    if (cur && cur.content) {
      sha = cur.sha;
      try { list = JSON.parse(Buffer.from(cur.content, "base64").toString("utf8")); } catch (_) {}
    }
    if (!Array.isArray(list)) list = [];
    if (list.some((e) => e.id === id)) return res.status(200).json({ ok: true, dup: true, entry });

    list.push(entry);
    const put = await gh(api, {
      method: "PUT",
      body: JSON.stringify({
        message: `watchlist: add ${domain}`,
        content: Buffer.from(JSON.stringify(list, null, 2)).toString("base64"),
        sha,
      }),
    });
    if (!put.ok) return res.status(502).json({ error: "commit failed", detail: await put.text() });
    return res.status(200).json({ ok: true, entry });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
};
