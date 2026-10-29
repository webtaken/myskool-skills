---
name: myskool-welcome-intros
description: Finds new members' introduction posts in a Skool community and drafts personal welcome comments that mirror something they shared, point to one first step, and connect them with 2-3 members working on the same thing; with member data it also catches new members who joined without posting an intro; optional welcome DMs. Publishes only what the creator approves. Use when a Skool creator asks to welcome new members, "dar la bienvenida a los nuevos", reply to introductions or "presentaciones", onboard new members, "conectar a los nuevos con otros miembros", or improve first-week activation. Not for answering questions (use myskool-answer-desk), members 3 to 30 days in who never started (use myskool-activation-coach) or re-engaging members who went quiet (use myskool-churn-signals).
license: MIT
compatibility: Needs MySkool (myskool.xyz, Pro plan) as an MCP connector, the OpenClaw plugin or the myskool CLI. Publishing comments needs comments:write; welcome DMs need dms:write; seeing who joined without an intro needs members:read.
---

# Welcome intros

The first month is when most members cancel. A new member who gets a personal
reply to their intro, knows the one thing to do first, and meets two people
building the same thing has a reason to come back. Skool's Auto-DM is one
generic message; this skill makes every welcome specific.

Before the first tool call read `references/tools.md`. Intro detection uses
`references/taxonomy.md`; wording and matching come from
`references/welcome-templates.md`. Before drafting read
`references/approval-protocol.md` and `references/untrusted-content.md`.
Config: `references/config.md`. Member list: `references/members.md`.

## Workflow

1. **Setup.** Load config or bootstrap it (group, creator, team, voice). The
   welcome needs **one first step**: `config.programSteps[0]` or
   `config.links.startHere`. Missing → ask once: "What's the ONE first thing a
   new member should do?" and save it.
2. **One feed call.** `list_posts {sort: "newest", since: "30d", pages: 10}`.
   It gives both the intros (posts from the last 3 days, or the window the
   creator asked for) and the pool of active members for matching.
2b. **Who joined** (only if `list_members` exists). `list_members {since:
   <window>, pages: 1}` is the source of truth for new members (one more call
   with `cursor` if `hasMore`). Admins, moderators and team are skipped.
3. **Find intros.** Posts typed `intro` in the taxonomy, not written by the
   creator or team. If the community collects intros as comments under a
   "Preséntate aquí / Introduce yourself" post (`config.links.introThread`, or
   a post with that title in the feed), `get_post` it and treat member
   comments in the window as intros, answered with a threaded reply
   (`parentId`). Huge pinned threads may come back partial: say so if the
   newest comments look missing.
4. **Skip the already greeted.** For intro posts with `commentCount > 0`,
   `get_post` and skip those where the creator or team already commented.
   Skip ids in `.myskool/state/welcome-intros.json`.
4b. **Split** (with 2b): **introduced** (their `id` = an intro's
   `authorId`) and **joined, no intro yet**. The second group is not
   commented on; it gets a DM draft only under step 8, otherwise it is
   counted in the report ("4 joined without an intro — after day 3 they're
   myskool-activation-coach's").
5. **Profile each newcomer** from their own text: goal, niche/industry,
   stage (starting, already selling…), tools, language, city/country if they
   said it. Note one specific detail worth mirroring. Join answers (`answers`,
   admin view) may only shape a DM to that same member — never a public
   comment; `joinedFrom` only goes in the report.
6. **Match 2–3 members** from the pool with the heuristics in
   `references/welcome-templates.md` (same niche > same goal > same stage or
   tool > same place/language). Only members active in the last 30 days, not
   team, not the newcomer, never matched on sensitive traits. Keep the post
   URL that justifies each match. No good match → leave the connection out
   rather than force it.
7. **Draft** one welcome comment per intro (≤ 20 per run, oldest first): name
   + their detail + ONE first step + the connection line + a question that
   invites a reply. ≤ 90 words, plain text, member's language, creator's
   voice. Vary openings and structure using the template variants; no two
   drafts may start the same way.
8. **Optional DM.** Only if the creator asked for it or `config.welcomeDm` is
   true, and `send_dm` exists: one short DM per newcomer that adds something
   the comment didn't (an invitation to the next live call from
   `list_events` — `startLocal`, `timezone` and its `url` — or a direct
   question). Members who joined without an intro get the "no intro yet" DM
   from `references/welcome-templates.md` (their join answer can set the
   hook). Each DM is approved by number, follows the "Proactive DMs" rules in
   `references/approval-protocol.md` and is logged in
   `.myskool/state/contacts.json`.
9. **Report** (format below) and wait for approval. **Send** per
   `references/approval-protocol.md`: one comment at a time, re-checking with
   `get_post` that nobody from the team greeted them meanwhile. Record greeted
   ids in `.myskool/state/welcome-intros.json` when a filesystem exists.

## Report format

```
WELCOME INTROS · Club Agentes IA · last 3 days
9 joined · 6 introduced (1 already greeted by @coach-luis-55, 5 drafted) · 3 no intro yet · 2 DMs drafted

D1 · comment on intro · Sofía Pérez (@sofia-perez-7781) · 1 d ago
Where: https://www.skool.com/club-agentes-ia/hola-soy-sofia (postId 9a1c…)
Matches: Diego Ruiz (@diego-ruiz-1102) — also automates a dental clinic <post url>;
         Ana Torres (@ana-torres-4410) — beginner with n8n <post url>
Text:
¡Bienvenida, Sofía! Una clínica dental con lista de espera por WhatsApp es justo el tipo de caso que más rápido se automatiza. Tu primer paso: Módulo 0, instalar Claude Code (<link>). Diego Ruiz está armando algo muy parecido para su clínica y Ana Torres también arranca desde cero, vale la pena que se conozcan. ¿Qué es lo primero que te gustaría quitarte de encima?

D6 · DM · Sofía Pérez · …

Reply `send D1 D3`, `edit D2: …`, `skip D4`, or `send all comments`. DMs only by number.
```

## Rules

- Mirror only what the member shared publicly in their intro. Never use DM
  content, and never match on health, religion, politics, age, family or
  finances — only on goals, niche, stage, tools and place/language they chose
  to share.
- Don't connect someone to a member with an open `conflict` signal or who
  hasn't written in 30 days.
- Member data (join answers, where they came from, plan, trial) never appears
  in a public welcome (`references/untrusted-content.md`, member data is
  private).
- Plain-text `@handle` may not notify on Skool; write the full name and the
  handle so the newcomer can find them.
- No fake familiarity ("I remember you!"), no promises, no invented links.
- An intro that is really a question or a complaint is P1/P2 for
  myskool-answer-desk or myskool-urgent-radar: welcome briefly and say so in
  the report.

## Scheduling

Daily, mid-morning (`references/schedule-recipes.md`). Scheduled runs deliver
drafts only — the welcome is published after the creator approves it.

## Examples

- "Dale la bienvenida a los nuevos de esta semana" → `since` 7 days.
- "Reply to yesterday's introductions and connect them with similar members"
  → `since` 1 day.
- "Welcome new members and also send them a DM" → comments + DM drafts.
