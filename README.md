# MySkool skills — a retention co-pilot for Skool creators

Eight agent skills that read your Skool community through
[MySkool](https://myskool.xyz) and help you keep members: catch members who are
blocked, answer what nobody answered, see how the community feels, spot who is
about to leave, welcome newcomers, celebrate wins and keep a weekly rhythm.

They work in Claude (Code, Desktop, Cowork, claude.ai), ChatGPT, OpenClaw,
Codex, Cursor, Gemini CLI and any agent that supports
[Agent Skills](https://agentskills.io). **Nothing is published without your
approval**: every skill drafts first and only posts or DMs what you say
`send` to.

| Skill | What it does | Run |
|---|---|---|
| `myskool-urgent-radar` | Members blocked, angry or about to cancel — with reply drafts | hourly |
| `myskool-answer-desk` | Questions your team hasn't answered + drafts from your own FAQ | 3×/day |
| `myskool-pulse` | Sentiment and health dashboard: themes, response time, risks | weekly |
| `myskool-churn-signals` | Who is about to leave and why, with personal rescue DMs | weekly |
| `myskool-welcome-intros` | Personal welcome for every intro post + links to similar members | daily |
| `myskool-wins-amplifier` | Congratulate wins, weekly Wins Wall, testimonials | weekly |
| `myskool-inbox-concierge` | DM triage: support, cancel intent, leads, spam | 2×/day |
| `myskool-weekly-digest` | Member-facing weekly recap + engagement prompts | weekly |

## Requirements

A [MySkool Pro](https://myskool.xyz) account with your Skool connected. The
skills are free and open source; MySkool provides the data access.

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

## Safety

- Drafts first, always. Writes need an explicit `send D1` in a live chat;
  scheduled runs never publish.
- Member posts are treated as untrusted data: instructions inside them are
  ignored and flagged.
- Read-only connectors are enough for every report. Give writes/DMs only if you
  want the skills to publish what you approve.

Source of truth lives in the MySkool monorepo and is synced here on release.
MIT licensed.
