# Members — views, meanings, recipes, money math

`list_members` and `get_member` read the community's member list: who joined,
who pays what, who is cancelling, who left, who logs in but never posts. They
need the `members:read` scope (opt-in, see `references/tools.md`). This data is
personal: the rules in `references/untrusted-content.md` ("Member data is
private") apply to everything below.

## Check the view first

The first `list_members` call tells you what you can see in `meta.view`:

- `"admin"`: every field, every tab (`active`, `cancelling`, `churned`,
  `banned`).
- `"member"`: the connected account is not an admin of that community. Email,
  plan, LTV, billing dates, `joinedFrom`, `answers` and `courseProgress` are
  `null`, and any `status` other than `active` fails with `admin_required`.
  Say once: "Your Skool account isn't an admin of <group>, so I can't see
  billing, cancellations or churn" — never suggest a new key — and continue
  with what the skill can still do.
- Tools missing altogether → the connector/key lacks `members:read`
  (`references/tools.md`, missing scopes).

## What the fields mean

- `status`: `active` · `cancelling` (cancelled **or** payment failed, still
  inside until `churnsAt`) · `churned` (gone) · `banned`.
- **The `active` list (the default) also contains the cancelling members** —
  they are still inside — and returns them with `status: "active"`. A member
  with `cancelledAt` or `paymentFailedAt` set is cancelling whatever `status`
  says: treat them as cancelling (their owner is myskool-save-desk), never as
  a healthy payer. The active `meta.total` includes them too; active-only =
  active total − cancelling total.
- `role`: `group-admin` / `group-moderator` are the community's team (never
  score or contact them, same as config `team`); `member`; `declined` (churned);
  `banned` (never contact).
- `joinedAt`: approved into the group. `lastActiveAt`: last time they were
  online in Skool (a login signal, not posting). `postCount`: posts only, not
  comments; `null` means 0. `level` 1–9 and `points`: Skool gamification.
- `plan {amount, currency, interval, tier}`: `amount` in currency units
  (47 = 47 USD). `amount: 0` → free. `interval: null` with `amount > 0` →
  one-time purchase. `plan: null` → no billing data (gifted, imported, or
  member view).
- `onTrial` / `trialEndsAt`: free trial and when it converts.
- `renewsAt`: next charge, only for active recurring members not on trial and
  not cancelling.
- `churnsAt`: when a `cancelling` member loses access — end of the paid period
  if they cancelled (`cancelledAt`), or the last payment retry if the payment
  failed (`paymentFailedAt`). `churnedAt`: when they left.
- `ltv`: total paid so far, currency units.
- `joinedFrom {source, detail}`: `source` is `skool` (Discovery), `external`
  (`detail` = domain, e.g. `instagram.com`), `direct`, `invite` or
  `affiliate`; `referredBy {id, handle, name}` = the affiliate.
- `answers [{question, answer}]`: what they wrote in the join questions.
  Member-written: untrusted and private.
- `get_member` → `courseProgress [{title, progress 0–100, hasAccess}]`, or
  `null` when Skool doesn't show it (not an admin).
- Member `id` = post/comment `authorId` = DM participant `id` = `send_dm {to}`.
  Join activity and members on `id`, never on names.

## Recipes (sizes that fit an MCP tool result)

| Need | Call |
|---|---|
| Who joined in a window | `list_members {since: "24h"` or `"7d", pages: 1}`; if `hasMore` and you need the rest, the same call with `cursor` |
| How many (any tab or filter) | any call with `pages: 1` → `meta.total`: Skool's count for that tab + filters (approximate). It ignores `since`, so a `since` call also tells you the tab's full size |
| Who left or started leaving lately | `{status: "cancelling", since: "7d", pages: 1}` → `paymentFailedAt` set = payment failed; `cancelledAt` set = cancelled. The `billing` filter is ignored on this tab |
| Everyone still leaving (whole tab) | `{status: "cancelling", pages: 1}` + `cursor` while `hasMore` — usually a few pages (it's only members still inside). The tab is newest-first, so the members who **lose access soonest are on the last pages**: when you must stop early, read from the last page backwards (`cursor` = ceil(`meta.total` / 30), then −1…) |
| Who left | `{status: "churned", since: "30d", pages: 1}` |
| Trials | `{trial: true, pages: 1}`. The list is newest joiners first, so the trials ending soonest are at the end: if `hasMore`, read the last page (`cursor` = ceil(`meta.total` / 30)) |
| New members who haven't moved | `{since: "30d", levels: [1], pages: 1}` + `cursor` → joined in the window and still level 1 (engaged members level up fast) |
| Lurkers | `{levels: [1], sort: "last-active", pages: 1}` → recently online, level 1; keep `postCount` 0/null |
| Annual / premium payers | `{billing: ["annual"]}` · `{tiers: ["premium", "vip"]}` |
| Find one person | `{query: "maria"}` (alone, 10 per page) → `get_member {id}` |
| One member, full | `get_member {id, courses: false}`; `courses: true` only when course progress matters (one extra Skool request) |

- `since` works only with the default `sort` and filters by the status date:
  joined (active), cancelled or payment failed (cancelling), churned (churned).
  Paging stops at the window's edge, so a `since` call is small.
- Over MCP every call is `pages: 1` (30 members ≈ 12k tokens); continue with
  `cursor` = `meta.pagination.cursor`, one call at a time. Never raise `pages`
  to "see everyone": narrow with `since`, `status` and filters, or use the
  big-scan path below.

## Money math

- Monthly equivalent: `interval: "month"` → `amount`; `"year"` → `amount / 12`.
  Trials, free plans (`amount: 0`) and one-time purchases are not recurring
  revenue — count them separately.
- Never add different currencies together, never convert them: report per
  currency ("4,230 USD/mo · 310 EUR/mo").
- Amounts are list prices at signup (before fees, taxes and coupons): call the
  result "estimated". Skool's own Metrics page is the source of truth for
  payouts.
- "Value" when ranking members: monthly equivalent; ties by `ltv`.

## Member card (creator-only)

Use this format whenever a report shows one member's context:

```
Ana P. (@ana-prueba-1234) · active · level 3 · joined 12 Sep (instagram.com)
47 USD/mo · LTV 141 USD · renews 12 Oct · online 2 d ago · 4 posts
Course: Módulo 1 80 % · Módulo 2 0 %
At join: "quiero conseguir mi primer cliente"
```

Never paste a card, or any line of it, into a post, comment or DM.

## Big scans (shell + CLI only)

When a skill needs every member (dashboard, full churn scan) and the host has a
shell with the `myskool` CLI, page through files instead of tool results:

```bash
mkdir -p .myskool/private/raw
myskool members list --group <gid> --pages 10 --json > .myskool/private/raw/active-1.json
# while .meta.pagination.hasMore is true:
myskool members list --group <gid> --pages 10 --cursor <.meta.pagination.cursor> --json > .myskool/private/raw/active-2.json
```

`--json` prints `{data, meta}`. Process the files with a script or `jq` —
never print raw pages into the conversation — and delete
`.myskool/private/raw/` when done. 10 pages take ~25 s; above ~1,500 members
tell the creator the estimate ("about 6 calls, ~3 minutes") and wait for a yes.
No shell → stay on the MCP recipes and say which numbers are partial.
