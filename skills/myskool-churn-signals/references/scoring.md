# Churn risk score — deterministic weights

Same inputs → same score, so the creator can trust week-over-week changes.
Compute it with code when the host can run code; otherwise by hand, showing
the sum per member.

## Signal weights (per member)

| Signal | Points | Counted |
|---|---|---|
| `cancel_intent` | 5 | once |
| `refund_request` | 5 | once |
| `billing_issue` | 3 | once |
| `value_doubt` | 3 | once |
| `ignored` | 3 | once; +1 if the oldest unanswered item waited > 72 h |
| `access_blocked` | 2 | once |
| `tech_blocked` | 2 | once |
| `overwhelm` | 2 | once |
| `no_time` | 2 | once |
| `conflict` | 2 | once |
| `went_quiet` | 2 | +1 if ≥ 5 items in days 15–28; +1 if their last item carried a negative signal or `frustrated`/`angry` sentiment |

Repeat evidence: +1 per extra item carrying any negative signal, max +2.

## Modifiers

| Condition | Points |
|---|---|
| Newer member (intro post in the last 30 days, or says "I just joined") | +1 |
| Latest negative item is `angry` | +1 |
| Shared a `win` in the last 14 days | −2 |
| Last item is positive (thanks, "it worked", solved) and newer than the negative ones | −1 |
| Creator/team already replied and the member confirmed it's solved | ignore that item's signal |

## Recency

Signals from items older than 14 days count half (round down at the end).
`went_quiet` is by definition about older activity and is not halved.

## Tiers

- **HIGH** ≥ 8 — contact this week, personally.
- **MEDIUM** 5–7 — contact or answer publicly.
- **WATCH** 3–4 — no DM yet; mention in the report.
- < 3 — not listed.

## Worked example

Marta: comment 2 days ago "creo que este mes es el último, no me da la vida"
(`cancel_intent` 5 + `no_time` 2), plus 6 items in days 15–28 and none since
(`went_quiet` 2 + 1 for ≥ 5 items + 1 because her last item was negative).
Repeat evidence: one extra negative item → +1. Total 12 → HIGH.

Luis: post 18 days ago "¿esto realmente funciona para principiantes?"
(`value_doubt` 3, halved → 1.5), win shared 5 days ago (−2). Total < 3 →
not listed.
