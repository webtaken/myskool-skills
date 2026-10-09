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
| `offline` (members:read) | 2 | paying member, `lastActiveAt` ≥ `offlineDays` (21) ago; +1 if ≥ 2× `offlineDays` |
| `renewal_soon` (members:read) | 2 | +1 if the plan is annual; counted **only** together with `offline`, `went_quiet` or a negative text signal — a renewal alone is not a risk |

Repeat evidence: +1 per extra item carrying any negative signal, max +2.

## Modifiers

| Condition | Points |
|---|---|
| Newer member (intro post in the last 30 days, or says "I just joined") | +1 |
| Latest negative item is `angry` | +1 |
| Shared a `win` in the last 14 days | −2 |
| Last item is positive (thanks, "it worked", solved) and newer than the negative ones | −1 |
| Creator/team already replied and the member confirmed it's solved | ignore that item's signal |

Member-data signals don't stack with themselves: `offline` and `went_quiet`
on the same member both count (one is logins, the other is writing).

## Plan value

Never part of the score. Show it next to the member as money at risk
("47 USD/mo", "annual 470 USD") and use it to break ties between equal scores
(higher monthly equivalent first, `references/members.md`).

## Recency

Signals from items older than 14 days count half (round down at the end).
`went_quiet`, `offline` and `renewal_soon` are about the present state and
are not halved.

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

Pablo (silent payer, full mode with members:read): no items in 28 days,
annual plan, `lastActiveAt` 47 days ago, renews in 9 days. `offline` 2 + 1
(≥ 42 days) + `renewal_soon` 2 + 1 (annual) = 6 → MEDIUM, "annual 470 USD at
risk, renews in 9 d".

Luis: post 18 days ago "¿esto realmente funciona para principiantes?"
(`value_doubt` 3, halved → 1.5), win shared 5 days ago (−2). Total < 3 →
not listed.
