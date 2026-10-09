# Growth data contract and metric definitions

You fetch and map; the dashboard counts. Build one `DATA` JSON object with the
shape below. Every number on the page (and in `scripts/growth-stats.mjs`) is
computed from `records` + `meta.counts` by the same `computeStats()` function
in `assets/growth.html`, so the charts and the text summary always agree.
Never write aggregate numbers into `records`, and never type a number into
`summary` that you didn't take from the stats output.

## DATA shape

```json
{
  "meta": {
    "group": "Club Agentes IA",
    "groupUrl": "https://www.skool.com/club-agentes-ia",
    "language": "es",
    "generatedAt": "2026-10-08T09:00:00Z",
    "view": "admin",
    "method": "exact",
    "windowDays": 90,
    "counts": { "active": 1822, "cancelling": 30, "churned": 2140 },
    "coverage": { "activeRead": 1822, "cancellingRead": 30, "churnedRead": 412 },
    "partial": [],
    "notes": []
  },
  "records": [ /* one per member, see below */ ],
  "surveyThemes": [{ "name": "Conseguir el primer cliente", "count": 41, "quotes": ["…", "…"] }],
  "history": [{ "date": "2026-09-08", "active": 1751, "mrr": { "USD": 39960, "EUR": 1210 } }],
  "summary": { "headline": "…", "risks": ["…", "…", "…"], "wins": ["…", "…"], "action": "…" }
}
```

`meta`:

| Field | Rule |
|---|---|
| `language` | `es`, `en` or `pt`, the community's language (others fall back to `en`). |
| `generatedAt` | Now, ISO UTC. Every window is measured back from it. |
| `view` | `meta.view` of the first `list_members` call: `admin` or `member`. |
| `method` | `exact` (shell path, or MCP for ≤ ~120 active) or `windowed` (MCP, bigger groups). |
| `windowDays` | `90` for exact reads (churned read with `since: "90d"`), `30` for windowed. |
| `counts` | `meta.total` of the first page of each tab: `active`, `cancelling`, `churned` (Skool's approximate count). Skool's active tab also counts the cancelling members (still inside): `active` here = active total − cancelling total (the `--raw` path does it). Records from the active tab with `cancelledAt`/`paymentFailedAt` are `cancelling` (`toRecord` does it). Windowed reads add `monthly`, `annual`, `free`, `trial` (and `oneTime` if you read it) from `pages: 1` calls with that filter. |
| `coverage` | How many records you read per status: `activeRead`, `cancellingRead`, `churnedRead`. |
| `partial` | Statuses whose read stopped with `hasMore` still true (page cap): `"active"`, `"cancelling"`, `"churned"`. Numbers that need the missing part become "no data". |
| `notes` | Short free-text notes shown in the footer (e.g. "survey themes not computed"). |

## One record per member

```json
{
  "id": "8a1c…", "name": "Ana P.", "status": "active", "role": "member",
  "joinedAt": "2026-03-10T15:00:00Z", "lastActiveAt": "2026-10-07T09:00:00Z",
  "level": 4, "points": 210, "postCount": 6,
  "onTrial": false, "trialEndsAt": null, "renewsAt": "2026-10-10T12:00:00Z",
  "churnsAt": null, "cancelledAt": null, "paymentFailedAt": null, "churnedAt": null,
  "plan": { "amount": 49, "currency": "USD", "interval": "month", "tier": "standard" },
  "ltv": 343, "source": "external", "sourceDetail": "instagram.com", "referredBy": null
}
```

Map each API member exactly as `toRecord()` in `assets/growth.html` does
(`--raw` mode runs it for you):

| Field | From the API |
|---|---|
| `id` | `id` (dedupe on it). |
| `name` | First name + last initial ("Ana P."). Never full surname, handle or email. |
| `status`, `role`, `joinedAt`, `lastActiveAt`, `level`, `points`, `postCount` | As returned. |
| `onTrial`, `trialEndsAt`, `renewsAt`, `churnsAt`, `cancelledAt`, `paymentFailedAt`, `churnedAt`, `ltv` | As returned (`null` in member view). |
| `plan` | `{amount, currency, interval, tier}` as returned, or `null`. |
| `source`, `sourceDetail` | `joinedFrom.source`, `joinedFrom.detail`. |
| `referredBy` | `referredBy.name` shortened to "Carlos M.", or `null`. |

Never copy `email`, `handle`, `answers`, `bio`, `avatarUrl`, `location`,
`links` or `courseProgress` into `DATA`. Skip `banned` members.

## Survey themes, history, summary

- `surveyThemes`: 3–6 themes from the join answers of members who joined in
  the last 30 days, named in the members' words. `count` = answers on that
  theme; ≤ 2 quotes each, ≤ 120 characters, no names, never an answer with an
  email, phone or URL (or `redacted: true` from `--answers`). Empty array if
  not admin or no answers.
- `history`: earlier runs, oldest first, `{date, active, mrr}` from
  `.myskool/history/growth-*.json`; from `members-*.json` (daily brief) only
  the active count with `mrr: null`. Today's point is added by the page.
- `summary`: written from the stats. `headline` (one sentence), exactly 3
  `risks`, 2 `wins`, 1 `action`.

## Metric definitions (computed by the dashboard)

"Team" = `role` containing admin or moderator; excluded from revenue, plan
mix, sources and engagement. "Inside" = `active` or `cancelling`. Recurring
plan = `amount > 0` and `interval` `month` or `year`. Monthly equivalent =
`amount` (month) or `amount / 12` (year). All money is per currency; nothing
is ever added across currencies or converted. Windows are `(now − N days, now]`.

| Metric | Definition |
|---|---|
| Est. MRR | Exact: Σ monthly equivalent of `active`, non-team, `!onTrial`, recurring records, per currency. Cancelling members are **not** in MRR (they are money at risk). Windowed: `counts.monthly × price + counts.annual × price / 12`, only when every monthly (and every annual) plan in the records has the same amount and currency; otherwise `null`. |
| Est. ARR | 12 × MRR, per currency. |
| Paying members | Count of the MRR set (windowed: `counts.monthly + counts.annual`, may include trials). |
| ARPU | MRR ÷ paying members, per currency. |
| Primary currency | The currency with the most paying members (ties: higher MRR). KPIs show it big, others as chips. |
| One-time / free | `amount > 0` with `interval: null` / `amount: 0`. Counted, never in MRR. |
| Plan mix | Active non-team members: monthly, annual, one-time, free, trial, no billing data (`plan: null`). Tiers: paid, non-trial plans by `tier`. Windowed: from `meta.counts`. |
| Trials | Active non-team `onTrial`: count, MRR if they convert (monthly equivalent of their plan), how many end within 7 days. Windowed: `counts.trial` only. |
| Money at risk | Non-team `cancelling` members split into **payment failed** (`paymentFailedAt` set) and **cancelled** (the rest): count, monthly equivalent per currency, first upcoming `churnsAt` and last `churnsAt`. |
| Joins (N d) | Records of any status with `joinedAt` in the window. "no data" if `active` is in `partial` and the oldest active record read joined inside the window. |
| Churned (N d) | `churned` records with `churnedAt` in the window (same `partial` rule for `churned`). |
| Net growth | Joins − churned. |
| Churn rate 30 d | churned30 ÷ (activeNow + cancellingNow + churned30 − joins30). activeNow/cancellingNow = records read (exact, complete) or `meta.counts`. "no data" when any part is missing or the denominator ≤ 0. |
| Paying churn rate 30 d | Paying churned30 ÷ (paying + paying cancelling + paying churned30 − paying joins30). Paying = non-team, recurring, not on trial, and for churned `ltv ≠ 0` (trials that never paid don't count). |
| Weekly joins vs churn | `floor(windowDays / 7)` full weeks ending now; a week before a `partial` floor is "no data". |
| Cohort retention | Exact + admin only. Join months whose first day is inside the window (older months lost their early churners): members who joined that month, how many are still inside, share. The current month is "in progress". |
| LTV | Avg `ltv` per currency of members who churned in the window with `ltv > 0`; avg `ltv` of current payers (exact only). |
| Sources | Non-team joins in the window per `source` (`external` split by domain), how many are still inside, avg `ltv` of every record of that source in the primary currency. Up to 8 rows (top 7 + "Other" when there are more). |
| Affiliates | Joins in the window per `referredBy`, and how many are still inside. Top 8. |
| Engagement | Exact only, inside non-team members: level histogram 1–9, share online in 7 / 30 days (`lastActiveAt`), share with `postCount` 0 or `null`. |
| Renewals next 30 d | Exact + admin: active, non-team, recurring, not on trial, `renewsAt` in `[now, now + 30 d)`. Buckets days 0–7, 7–14, 14–21, 21–30, with the actual charge (monthly or annual amount) per currency. Annual renewals listed; `lastActiveAt` older than 21 days (or missing) → "stale login". |
| vs last month | History point closest to 30 days ago (20–45 days old): MRR change in the primary currency (%) and active change. |
| History entry | `{date, method, active, cancelling, paying, mrr, joins30, churned30}`: printed by the script, saved as `.myskool/history/growth-YYYY-MM-DD.json`. Totals only. |

Anything not computable is `null` and renders "no data", never 0.

## Windowed reads (big groups over MCP)

Renewals, engagement and cohorts are not computed; MRR only from counts with
uniform prices; joins/churn only if the `since: "30d"` reads ended at the
window edge (`hasMore: false`). The page lists what's missing in a banner and
points to the shell path for exact numbers.

## Expected values for `assets/sample-data.json`

Fictional group, `generatedAt` 2026-10-08 09:00 UTC, exact, admin, 40 records
(26 active incl. 2 team, 5 cancelling, 9 churned). Run
`node scripts/growth-stats.mjs assets/sample-data.json`; it must print:

| Metric | Value | Hand check |
|---|---|---|
| MRR | 807.5 USD · 170.83 EUR | USD 8×49 + 2×149 + 3×470/12 = 392 + 298 + 117.5; EUR 3×45 + 430/12 |
| ARR | 9,690 USD · 2,050 EUR | 12 × MRR |
| Paying / ARPU | 17 (13 USD, 4 EUR) · 62.12 USD · 42.71 EUR | 807.5 / 13; 170.83 / 4 |
| vs 2026-09-08 | MRR +6.2 % (760 → 807.5 USD), active +1 (25 → 26) | |
| Last 30 d | 9 joins, 5 churned, net +4, churn 18.5 % (5/27), paying churn 15 % (3/20) | 27 = 26 + 5 + 5 − 9; 20 = 17 + 5 + 3 − 5 |
| Last 90 d | 22 joins, 9 churned, net +13 | |
| At risk | failed 2 (49 USD + 45 EUR/mo, first leaves 17 Oct) · cancelled 3 (237.17 USD/mo, 49 + 149 + 470/12) | |
| Trials | 2, 98 USD/mo if they convert, 1 ends within 7 d | |
| Renewals 30 d | 16 · 1,630 USD · 565 EUR; buckets 4 / 5 / 2 / 5; 3 annual, 2 stale (Lucas H., Martín A.) | |
| LTV | left: 242.67 USD (6) · 270 EUR (1); payers 252.62 USD · 208.75 EUR | USD 1,456 / 6 |
| Sources (90 d) | affiliate 7 (6 in, avg LTV 135.83 USD) · instagram.com 5 (4) · skool 5 (4) · youtube.com 4 (3) · direct 1 (1) | |
| Affiliates | Carlos M. 5 joins (4 in) · Marta G. 2 (2) | |
| Plan mix | monthly 13 · annual 4 · one-time 1 · free 3 · trial 2 · no data 1; tiers standard 16, premium 2 | |
| Cohorts | Aug 8 → 6 (75 %) · Sep 7 → 6 (85.7 %) · Oct 3 → 3 (in progress) | |
| Engagement | 29 members inside: 58.6 % online 7 d, 86.2 % online 30 d, 37.9 % never posted | |

One cancelling member is named `</script><img src=x onerror=alert(1)>`: the
filled page must show it as text in "Next to lose access".
