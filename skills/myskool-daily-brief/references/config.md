# Config and memory — `.myskool/`

Skills work with zero setup, but they get much better once they know who the
team is, how the creator writes, and which links to hand out. All MySkool skills
share one config.

## Where it lives

- **Hosts with a persistent filesystem** (Claude Code, Cowork, OpenClaw,
  Codex, Cursor…): `.myskool/config.json` in the working directory (OpenClaw:
  the agent workspace). Create it the first time you learn something.
- **Hosts without one** (claude.ai chat, ChatGPT): keep it in the conversation.
  At the end of the first run, print the config as a JSON block and suggest the
  creator saves it in the Project's instructions/knowledge so the next chat
  starts with it. If the Project already has a `myskool-config` JSON, use it.

Never store API keys or tokens in it.

## Shape

```json
{
  "groupId": "0f1e2d3c4b5a69788796a5b4c3d2e1f0",
  "groupName": "Club Agentes IA",
  "creator": { "id": "…", "handle": "lucia-ramos-1234", "name": "Lucía Ramos" },
  "team": [{ "handle": "coach-luis-55", "name": "Luis", "role": "coach" }],
  "language": "auto",
  "voice": {
    "tone": "cercana, directa, con emojis puntuales",
    "signoff": "— Lucía",
    "samples": ["<2-3 real comments the creator wrote, copied from the feed>"]
  },
  "links": {
    "startHere": "https://www.skool.com/…/empieza-aqui",
    "support": "https://www.skool.com/…/soporte",
    "calendar": "https://www.skool.com/…/calendar",
    "join": "https://www.skool.com/…/about",
    "introThread": "https://www.skool.com/…/presentate-aqui"
  },
  "welcomeDm": false,
  "cancelHowTo": "<exact steps the creator confirmed, e.g. where members cancel in Skool>",
  "saveOffers": ["Pausar la membresía 1 mes", "1:1 de 15 min conmigo"],
  "billingUpdateHowTo": "<exact steps the creator confirmed to update a card in Skool>",
  "trialOffer": "<what the creator offers a trial member before it converts, or null>",
  "winBackOffer": "<what the creator offers a member who left, or null>",
  "events": [{ "title": "Llamada semanal", "when": "jueves 18:00", "timezone": "America/Mexico_City", "link": "https://…" }],
  "programSteps": ["Módulo 0: instala Claude Code", "Módulo 1: tu primer agente"],
  "thresholds": {
    "unansweredHours": 6, "ignoredHours": 24, "quietDays": 14,
    "offlineDays": 21, "trialWarnDays": 3, "activationDays": 30,
    "winBackDays": 30, "renewalWarnDays": 14, "contactCooldownDays": 14
  },
  "dashboard": { "maxActive": 3000 },
  "knowledgeBase": ".myskool/faq.md"
}
```

Every field is optional. Only ask for what the current skill needs.
`cancelHowTo`, `saveOffers`, `billingUpdateHowTo`, `trialOffer`,
`winBackOffer`, `events` and every link must come from the creator — never
fill them from memory of how Skool works. Upcoming calls come from the Skool
calendar (`list_events`) when that tool exists; `events` is only for calls the
creator runs outside the Skool calendar.

## First run (bootstrap)

1. `list_groups`. One group → use it. Several → ask which one (show names).
2. `whoami` → `creator`. If `account.id` is null, use the handle; if that is
   null too, ask the creator for their Skool handle (the `@name` on their
   profile).
3. `team`: look at the newest ~30 posts for frequent helpful commenters and ask:
   "Who else answers members on your behalf (coaches, mods)? I found @a, @b."
4. `voice.samples`: pick 2–3 recent comments written by the creator.
5. Ask only for links/offers the current skill will hand out. Never make them up.

Write the config, show a short summary, continue with the task.

## State files

Skills may keep small state next to the config:

- `.myskool/state/<skill>.json` — last run time, ids already reported, drafts
  sent (`{"sent": [{"draft": "D1", "target": "<postId>", "at": "…"}]}`).
- `.myskool/history/<YYYY-MM-DD>.json` — daily snapshots (pulse, churn
  signals) for trends.
- `.myskool/pulse-<YYYY-MM-DD>.html` — rendered pulse dashboards.
- `.myskool/faq.md` — the community knowledge base (answer desk).
- `.myskool/testimonials.md` — collected wins/testimonials (wins amplifier).
- `.myskool/state/contacts.json` — **shared contact log** for every skill that
  DMs members proactively (churn signals, save desk, activation coach, welcome
  DMs): `{"<memberId>": {"skill": "save-desk", "lane": "payment_failed",
  "at": "…"}}`. Read it before drafting; a member contacted less than
  `thresholds.contactCooldownDays` ago (default 14) gets no new DM — show
  "contacted 3 d ago by save-desk" instead. Append after each DM is sent.
- `.myskool/history/members-<YYYY-MM-DD>.json` — daily member counts (daily
  brief); `.myskool/history/growth-<YYYY-MM-DD>.json` and
  `.myskool/growth-<YYYY-MM-DD>.html` — growth dashboard totals and pages.
- `.myskool/private/` — temporary raw member pages from the CLI; delete after
  use.

State and history files hold member ids, handles and first names only —
never emails, amounts per person, LTV, join answers or DM text. When you create
`.myskool/` also write `.myskool/.gitignore` with `state/`, `history/`,
`private/` and `*.html`, so member data never ends up in a git repo (cloud
routines clone one).

Without a filesystem, skills fall back to time windows (`since`) and report
"first run, no history yet" where trends would go.
