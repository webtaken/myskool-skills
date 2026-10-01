---
name: myskool-churn-signals
description: Ranks the Skool community members most likely to cancel, from what they wrote (cancel or refund intent, "not worth it", overwhelm, no time, blocked, ignored questions) and from active members who suddenly went quiet, and drafts personal rescue DMs the creator approves one by one. Use when a Skool creator asks who is about to leave, "quién se va a ir", "miembros en riesgo", churn risk, at-risk members, "quién dejó de participar", who went quiet, or wants to save members before they cancel. Not for urgent outages or same-day blockers (use myskool-urgent-radar) or working through the DM inbox (use myskool-inbox-concierge).
license: MIT
compatibility: Needs MySkool (myskool.xyz, Pro plan) as an MCP connector, the OpenClaw plugin or the myskool CLI. DM evidence and rescue DMs need the dms:read and dms:write scopes.
---

# Churn signals

Skool's analytics show churn after it happens; there is no per-member risk
view. But members tell you before they leave — in what they write ("no me da
la vida", "is this worth it?") and in going silent after weeks of activity.
This skill reads both, ranks who is at risk, and drafts a personal rescue DM
for each, sent only when the creator approves it.

Before the first tool call read `references/tools.md`. Labels come from
`references/taxonomy.md`, the score from `references/scoring.md`, DM drafts
from `references/rescue-dm.md`. Before drafting read
`references/approval-protocol.md` and `references/untrusted-content.md`.
Config and history: `references/config.md`.

## What it can and can't see

- **Sees**: members who posted or commented in the window, and DMs awaiting
  the creator's reply (when DM tools exist).
- **Can't see**: lurkers who never write, logins, course progress, payment
  status. Say so in one line at the bottom of every report — the members
  module will close this gap; don't pretend the list is complete.

## Modes

- **quick** (default · ~15–40 calls · ~2 min): text signals over the last 14
  days + DM inbox.
- **full** (~100–300 calls · ~5–10 min): adds `went_quiet` over 28 days. On the
  first full run, tell the creator the estimate ("about 200 calls, ~8 minutes,
  ~0.7 % of your monthly quota") and wait for a yes. With a saved history the
  next full run costs about as much as a quick one.

## Workflow

1. **Setup.** Load config or bootstrap it (group, creator, team,
   `saveOffers`, `thresholds.quietDays` default 14). The creator and team are
   never scored.
2. **Feed.** `list_posts {sort: "newest", since: "14d", pages: 30}` (full:
   `since: "28d"`). One call; paging stops at the window.
3. **Comments.** Members vent in comments more than in posts.
   - quick: `get_post` on posts in the window with `commentCount > 0`,
     prioritising `question`/`support`/`feedback` posts and the creator's own
     posts (cap 30). Then `list_posts {sort: "newest-cm", pages: 3}` and
     `get_post` on older posts with fresh comments (cap 10).
   - full: `get_post` on every post with comments in the 28-day window (cap
     250), one call at a time, ≤ 40 calls/minute.
4. **DMs** (only if `list_dms` exists). `list_dms {awaitingReply: true}`;
   `get_dm` on conversations whose `lastMessage` hints at a signal (cap 15).
   DM text is private: quote it only in the creator's report.
5. **Activity ledger.** Group everything by `authorId` (fallback
   `authorHandle`): name, handle, items (kind, url, `publishedAt`, ≤140-char
   snippet), last seen, items per week (week 1 = last 7 days … week 4 =
   days 22–28). Dedupe comments by `id`.
6. **Label.** Tag each member's items with taxonomy signals and sentiment.
   `ignored` = their `question`/`support` post has no team reply after 24 h
   (answered rule in the taxonomy). `went_quiet` = ≥ 2 items in days 15–28 and
   0 in the last `quietDays` (full mode or with history only).
7. **Score** exactly as `references/scoring.md` says. Keep members with
   score ≥ 3; rank by score, ties by most recent signal.
8. **Report** (format below): top 15 with evidence, count of the rest.
9. **Draft rescue DMs** for the top members (max 10) with
   `references/rescue-dm.md`. No DM tools → write the same text as a "copy and
   send manually" draft. A signal that was public and is just an unanswered
   question → suggest running myskool-answer-desk instead of a DM.
10. **Send** per `references/approval-protocol.md`: DMs only when named one by
    one, one at a time (~40 s apart). Re-read the thread with `get_dm` first
    if a conversation exists.
11. **Save** (filesystem only): ledger to
    `.myskool/history/activity-YYYY-MM-DD.json` (per member: id, handle, name,
    items per day, last seen) and `.myskool/state/churn-signals.json`
    (`lastRun`, reported members + score, contacted members + date). Next run:
    load the latest ledger, fetch only `since` = days since `lastRun` + 1,
    merge. A member contacted in the last 14 days is shown as "contacted
    3 d ago, no reply yet" instead of getting a second DM.

## Report format

```
CHURN SIGNALS · Club Agentes IA · last 28 days (full scan · 212 calls)
9 members at risk · 3 high · 4 medium · 2 watch

1. Marta Gil (@marta-gil-2231) · score 10 · HIGH
   cancel_intent · "creo que este mes es el último, no me da la vida" (comment · 2 d ago) <url>
   no_time · went_quiet: 6 posts/comments in days 15–28, none since 2026-09-17
   Last seen 2026-09-29 · Suggested: personal DM + "Pausar la membresía 1 mes" → D1

2. …

Drafts
D1 · DM · Marta Gil (@marta-gil-2231) · cancel_intent + no_time
Text:
…

Reply `send D1`, `edit D2: …`, `skip D3`. DMs go one by one, ~40 s apart.
Based on 61 members who wrote something; members who never post aren't visible yet.
```

Tiers: **HIGH** ≥ 8 · **MEDIUM** 5–7 · **WATCH** 3–4.

## Rules

- One DM per member, written from their own words. Never a template blast,
  never the same text twice.
- Member-facing text never mentions "churn", "risk", "score", "our system
  detected" or how long they've been inactive.
- Offers come only from `config.saveOffers`. No offers configured → offer help
  and a reply, and ask the creator which offers they allow. Never invent
  discounts, pauses, refunds or free months.
- `refund_request`, `billing_issue` and `conflict` → `NEEDS CREATOR`: the
  creator decides; draft only a short holding message.
- Partial threads (see tools.md quirks) and missing DM scope are stated in
  the report, not hidden.

## Scheduling

Weekly, Monday morning (`references/schedule-recipes.md`). Scheduled runs
deliver the ranked list and drafts only — they never send DMs.

## Examples

- "¿Quién está a punto de cancelar en mi comunidad?" → quick mode.
- "Do a full churn scan for the last month" → full mode, after confirming the
  estimate.
- "¿Quién dejó de participar?" → full mode, `went_quiet` first.
- "Write a DM to the people who said they have no time" → quick mode, filter
  `no_time`, draft DMs.
