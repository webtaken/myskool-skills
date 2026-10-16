# Running a MySkool skill on a schedule

Scheduled runs are **unattended**: they read, analyse and deliver drafts and
alerts, but never publish or DM (see approval-protocol.md). The creator
approves later in a live chat ("send D1").

Keep `list_posts` windows small on frequent schedules (hourly: `since: "2h"`,
`pages: 3`) and cap `get_post` at 40 calls on scheduled weekly reports to
protect the 30,000 calls/month quota.

## Claude Code

- **In-session loop**: `/loop 1h run myskool-urgent-radar` (stops when the
  session ends).
- **Cloud routine** (runs with the laptop closed): `/schedule` → "every hour,
  run the myskool-urgent-radar skill and email me the report". Routines clone a
  GitHub repo and do not load plugins, so commit the skill folder to that repo
  under `.claude/skills/myskool-urgent-radar/`. They use your claude.ai
  connectors: add the MySkool connector and a
  Gmail or Slack connector for delivery. Minimum interval: 1 hour.

## OpenClaw (24/7, alerts to WhatsApp/Telegram)

```bash
openclaw cron add --cron "7 * * * *" --session isolated \
  --message "Run the myskool-urgent-radar skill. Only report P0/P1; reply NO_REPLY if nothing new." \
  --announce --channel whatsapp --to <your-number-or-jid>
```

Use `--channel telegram --to <chat-id>` for Telegram. Isolated sessions are
unattended. To approve drafts from the phone, reply to the bot in a normal
chat: "run myskool-urgent-radar and send D1" — that run is attended.

Suggested cadence:

| Skill | Cron | Why |
|---|---|---|
| urgent-radar | `7 * * * *` (hourly) | blockers and cancel intent can't wait |
| answer-desk | `15 9,15,21 * * *` | three sweeps a day |
| inbox-concierge | `30 9,18 * * *` | twice a day |
| daily-brief | `0 8 * * *` | the morning overview, before anything else |
| welcome-intros | `0 10 * * *` | daily |
| save-desk | `0 10 * * *` | payment failures and cancellations have days, not weeks |
| pulse / churn-signals / wins-amplifier / weekly-digest | `0 9 * * 1` | weekly, Monday morning |
| activation-coach | `0 11 * * 1` | weekly, after the Monday reports |
| growth-dashboard | `0 9 1 * *` | monthly (or weekly, `0 9 * * 1`) |

Member skills on a schedule need `members:read` (and `dms:read` for the inbox
parts): the connector has them; a key needs them minted in — still no write
scopes on a key. Their scheduled
deliveries carry first names and totals only (`references/untrusted-content.md`).

## claude.ai, ChatGPT, Cowork

Run on demand ("run my urgent radar"). Where the host offers scheduled tasks
with connectors, use the same prompt as above and keep it draft-only.
