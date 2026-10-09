# Lanes and ranking — deterministic

Same inputs → same order, so the creator can trust it day after day. Compute
with code when the host can run code; otherwise by hand, showing the sum.

## Lane rules

| Lane | From | In the lane when |
|---|---|---|
| 1 · `payment_failed` | `status: "cancelling"` | `paymentFailedAt` set |
| 2 · `cancelled` | `status: "cancelling"` | `cancelledAt` set and `churnsAt` in the future |
| 3 · `trial_ending` | `trial: true` | `trialEndsAt` within `thresholds.trialWarnDays` (default 3) |
| 4 · `win_back` | `status: "churned"` | `churnedAt` within `thresholds.winBackDays` (default 30) and they paid (`ltv > 0`, or a plan with `amount > 0`) |

A member in both 1 and 2 (rare) goes to lane 1. Members outside every lane are
not listed.

## Score

| Part | Points |
|---|---|
| Lane | lane 1 = 4 · lane 2 = 3 · lane 3 = 2 · lane 4 = 1 |
| Days left (`churnsAt`, or `trialEndsAt` for lane 3) | ≤ 2 d +3 · ≤ 7 d +2 · ≤ 14 d +1 |
| Days since left (lane 4 only) | ≤ 7 d +2 · ≤ 14 d +1 |
| Value | monthly equivalent above the median of the listed members +1 · annual, `premium` or `vip` +1 · `ltv` ≥ 2× the median `ltv` +1 |
| Reachable and engaged | `lastActiveAt` within 7 days +1 · an existing DM thread +1 |

Monthly equivalent and medians per `references/members.md` (money math);
compare values in the same currency only — a member in another currency gets
the value points against that currency's median, or none if they're alone.

Ties: fewer days left first, then higher monthly equivalent, then higher
`ltv`.

Top 10 get drafts. The rest are listed in one line each under their lane
("+4 more in payment_failed: Pedro V., …") so nothing is hidden.

## Money at stake (report header)

- Sum of monthly equivalents for lanes 1–2, per currency.
- Lane 3: the monthly equivalent of their plan after the trial, per currency,
  shown separately ("trials: ≈94 USD/mo if they convert").
- Lane 4 is not "at stake" — it's already gone; show the count and total LTV.

## Worked example

Ana P. — lane 1 (4), `churnsAt` in 2 days (+3), 47 USD/mo vs median 47
(not above, 0), online yesterday (+1), no DM thread (0). Total **8**.

Marta G. — lane 2 (3), `churnsAt` in 23 days (0), annual 470 USD (+1 annual;
monthly equivalent 39.2 USD, below median, 0), `ltv` 940 vs median 141
(+1, ≥ 2×), online 30 days ago (0), DM thread (+1). Total **6**.

Sofía L. — lane 4 (1), left 9 days ago (+1), `ltv` 282 (+1, ≥ 2× 141), DM
thread (+1). Total **4**.

Order: Ana (8), Marta (6), Sofía (4).
