# Pulse data contract and metric definitions

You label; the dashboard counts. Build one `DATA` JSON object with the shape
below. Every number on the dashboard (and in `scripts/pulse-stats.mjs`) is
computed from `records` by the same `computeStats()` function, so the charts
and the text summary always agree. Never write aggregate numbers into
`records` yourself, and never type numbers into `summary` that you didn't take
from the stats output.

## DATA shape

```json
{
  "meta": {
    "group": "Club Agentes IA",
    "groupUrl": "https://www.skool.com/club-agentes-ia",
    "language": "es",
    "generatedAt": "2026-10-01T09:00:00Z",
    "windowDays": 14,
    "weekSplitAt": "2026-09-24T09:00:00Z",
    "creator": "@lucia-ramos-1234",
    "sampled": false,
    "totalPostsInWindow": 87,
    "partialThreads": 1,
    "notes": []
  },
  "records": [ /* one per post, see below */ ],
  "themes": [{ "name": "Instalar Claude Code", "count": 3, "quotes": ["…", "…"] }],
  "toTeach": [{ "topic": "Instalar Claude Code en Windows", "count": 3, "why": "3 hilos, no está en el FAQ" }],
  "summary": { "health": "…", "risks": ["…", "…", "…"], "wins": ["…", "…"], "action": "…" }
}
```

`meta`:

| Field | Rule |
|---|---|
| `language` | `es`, `en` or `pt` — the community's language; the dashboard chrome follows it (others fall back to `en`). |
| `generatedAt` | Now, ISO UTC. |
| `windowDays` | 14 unless the creator asked otherwise. |
| `weekSplitAt` | `generatedAt − 7 days`. Posts on/after it are "this week", before it "previous week". |
| `sampled` / `totalPostsInWindow` | `sampled: true` when the window had more than 200 posts and you kept 200 (see SKILL.md). `totalPostsInWindow` = all posts `list_posts` returned for the window. |
| `partialThreads` | How many records have `partial: true`. |

## One record per post

```json
{
  "id": "54cf…a601",
  "url": "https://www.skool.com/…/no-puedo-descargar",
  "title": "No puedo descargar los recursos del módulo 3",
  "author": "Ana P.",
  "authorId": "8a1c…",
  "isTeam": false,
  "publishedAt": "2026-09-30T14:10:00Z",
  "type": "support",
  "sentiment": "frustrated",
  "signals": ["access_blocked"],
  "urgency": "P0",
  "theme": "Descargas y acceso",
  "commentCount": 2,
  "likeCount": 1,
  "uniqueCommenters": 2,
  "firstTeamReplyMinutes": null,
  "answered": false,
  "partial": false,
  "helpers": [{ "author": "Marcos D.", "authorId": "1f0e…", "count": 1 }],
  "comments": [
    { "author": "Raúl T.", "sentiment": "frustrated", "signals": ["cancel_intent"], "excerpt": "Si no veo avance este mes creo que cancelo", "urgency": "P0", "publishedAt": "…", "url": "…" }
  ]
}
```

| Field | How to fill it |
|---|---|
| `title` | Post title; if empty, the first ~80 chars of content. Member text, used as-is (the dashboard escapes it). |
| `author` | First name + last initial ("Ana P."). Never full surname, handle or email. |
| `authorId` | `authorId` from the API (fallback: `authorHandle`). Only used to count unique people; not displayed. |
| `isTeam` | Author is the creator (`whoami`) or in config `team`. |
| `type`, `sentiment`, `signals`, `urgency`, `theme` | Per `references/taxonomy.md`. `signals` = only what the post itself says. |
| `commentCount`, `likeCount` | From the API. |
| `uniqueCommenters` | Distinct comment authors (after deduping comments by id). `0` if you didn't fetch comments. |
| `firstTeamReplyMinutes` | Minutes from post to the first comment by creator/team. `null` if none, if not fetched, or if `partial`. |
| `answered` | Only for `question`/`support` posts by members: `true`/`false` per the "Answered" rule in the taxonomy. `null` for every other type. |
| `partial` | `true` when `commentCount` is far above the comments received (huge pinned threads). Partial records are excluded from comment totals, unanswered % and reply times. |
| `helpers` | Non-team members whose comment answered or meaningfully helped the asker, with how many helpful comments. Feeds **Champions**. |
| `comments` | **Only** member comments that carry a signal or are `angry` — 140-char `excerpt`, no handles. Leave out everything else to keep the file small. |

Records with `get_post` skipped (no comments, or over the call cap) still go
in with `uniqueCommenters: 0` and `firstTeamReplyMinutes: null`. Their
`answered` is `false` when `commentCount` is 0, and `null` (unknown) when
comments exist but weren't fetched — unknowns are left out of unanswered %.

## Themes and "what to teach next"

- `themes`: 3–8 entries, `count` = records with that `theme`; 1–2 quotes each
  (≤140 chars, from post titles/excerpts, public posts only).
- `toTeach`: recurring questions (2+ records on the same need in the window)
  that the knowledge base (`.myskool/faq.md`) does not cover, or that keep
  coming back although it does. `why` = one short line of evidence.

## Metric definitions (computed by the dashboard)

All "this week vs previous week" deltas compare posts **created** in each
7-day half of the window. Cumulative counters (likes, total comments on old
posts) are never used for deltas.

| Metric | Definition |
|---|---|
| Posts | Records published in the week (team posts included). |
| Comments | Sum of `commentCount` of that week's non-partial records. |
| Members posting | Distinct `authorId` of non-team records. |
| Unanswered questions | Non-team, non-partial `question`/`support` records with `answered: false` ÷ all such records whose `answered` is known (not `null`). Shown as %. |
| Median first team reply | Median `firstTeamReplyMinutes` over the same question/support set, ignoring `null`. |
| Churn signals | Number of signal labels on posts + listed comments. |
| Wins | Records with `type: "win"`. |
| Sentiment | Count of non-team records per sentiment, per week. |
| Signals chart | Signal labels over the whole window, with this/previous week split in the tooltip. |
| Types chart | Non-team records per type, whole window. |
| Waiting for the team | Unanswered question/support records, P0 first, then oldest. |
| Voices at risk | Records or listed comments with `cancel_intent`, `refund_request`, `billing_issue`, `access_blocked`, `value_doubt`, `conflict`, or `angry` sentiment. |
| Champions | `helpers` summed by person, top 8. |
