# MySkool skills — a retention co-pilot for Skool creators

Twelve agent skills that read your Skool community through
[MySkool](https://myskool.xyz) — feed, comments, inbox and member list — and
help you keep members across the whole lifecycle: start the day with a brief,
catch members who are blocked, answer what nobody answered, welcome newcomers
and get them started, spot who is about to leave, save failed payments and
cancellations, win back who left, see revenue and growth, celebrate wins and
keep a weekly rhythm.

They work in Claude (Code, Desktop, Cowork, claude.ai), ChatGPT, OpenClaw,
Codex, Cursor, Gemini CLI and any agent that supports
[Agent Skills](https://agentskills.io). **Nothing is published without your
approval**: every skill drafts first and only posts or DMs what you say
`send` to.

| Skill | What it does | Run |
|---|---|---|
| `myskool-daily-brief` | Morning brief: joins, cancellations, failed payments, trials, inbox, urgent — and what to run first | daily |
| `myskool-urgent-radar` | Members blocked, angry or about to cancel — with reply drafts | hourly |
| `myskool-answer-desk` | Questions your team hasn't answered + drafts from your own FAQ | 3×/day |
| `myskool-pulse` | Sentiment and health dashboard: themes, response time, risks | weekly |
| `myskool-churn-signals` | Who is about to leave and why (incl. paying members who stopped logging in), with rescue DMs | weekly |
| `myskool-save-desk` | Failed payments, cancellations, trials ending, win-back — one personal message each | daily |
| `myskool-activation-coach` | New members who never started and lurkers, nudged toward one first step | weekly |
| `myskool-growth-dashboard` | Estimated MRR, churn rate, joins vs churn, LTV, sources, renewals | monthly |
| `myskool-welcome-intros` | Personal welcome for every intro post + links to similar members; DM for who joined without one | daily |
| `myskool-wins-amplifier` | Congratulate wins, weekly Wins Wall, testimonials | weekly |
| `myskool-inbox-concierge` | DM triage: support, cancel intent, leads, spam | 2×/day |
| `myskool-weekly-digest` | Member-facing weekly recap + engagement prompts | weekly |

## Requirements

A [MySkool Pro](https://myskool.xyz) account with your Skool connected. The
skills are free and open source; MySkool provides the data access.

The member skills (daily brief, save desk, activation coach, growth dashboard)
need the `members:read` scope; billing, cancellations and churn also need your
Skool account to be an admin of the group.

## Install

**Claude Code**

```
/plugin marketplace add webtaken/myskool-skills
/plugin install myskool@myskool-skills
```

The plugin bundles the MySkool MCP server; run `/mcp` and authenticate
`myskool` once.

**Claude Desktop, Cowork, claude.ai** — Customize → Plugins → Add marketplace →
`webtaken/myskool-skills`, then connect the bundled MySkool connector. Or
download a single skill zip from https://myskool.xyz/docs/skills and upload it
in Settings → Capabilities → Skills.

**OpenClaw**

```
openclaw plugins install clawhub:@webtaken/openclaw-myskool
```

The skills ship inside the plugin.

**Codex, Cursor, Gemini CLI, OpenCode and others**

```
npx skills add webtaken/myskool-skills
```

Then add the MySkool MCP server to that agent
(`https://api.myskool.xyz/v1/mcp`, Bearer key from https://myskool.xyz/keys)
or install the CLI. Setup per agent: https://myskool.xyz/docs/skills

**ChatGPT** — upload the skill zips (workspace plans with Skills), or create a
Project, paste the skill's `SKILL.md` as instructions and add the MySkool app.

## Try it

- "Corre el radar de urgencias de mi Skool"
- "Who is waiting for an answer in my community?"
- "Hazme el dashboard de sentimiento de esta semana"
- "¿Quién está por cancelar?"
- "Buenos días, ¿qué pasó en mi Skool?"
- "Who has a failed payment or cancelled this week?"
- "¿Cuánto factura mi comunidad y cuál es mi churn?"

## Safety

- Drafts first, always. Writes need an explicit `send D1` in a live chat;
  scheduled runs never publish.
- Member posts are treated as untrusted data: instructions inside them are
  ignored and flagged.
- Read-only connectors are enough for every report. Give writes/DMs only if you
  want the skills to publish what you approve.
- Member data (emails, plans, LTV, join answers, logins) stays in your reports:
  never in posts or comments, never cited in a DM; emails and amounts are
  never saved to disk.
  Proactive DMs are capped at 10 personal drafts per run, with a 14-day
  cooldown across skills.

Source of truth lives in the MySkool monorepo and is synced here on release.
MIT licensed.
