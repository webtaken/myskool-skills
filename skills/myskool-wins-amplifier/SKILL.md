---
name: myskool-wins-amplifier
description: Finds member wins in a Skool community (results, milestones, first clients, things shipped) and turns them into retention - drafts personal congratulation comments, a weekly Wins Wall post and a testimonials file, and publishes only what the creator approves. Use when a Skool creator asks to celebrate wins, "celebra los logros de la comunidad", "who got results this week", "arma el muro de victorias", "quién tuvo resultados esta semana", collect testimonials or social proof from the community, or show members the value they are getting before renewal. Not for unanswered questions (use myskool-answer-desk) or the general weekly recap post (use myskool-weekly-digest).
license: MIT
compatibility: Needs MySkool (myskool.xyz, Pro plan) as an MCP connector, the OpenClaw plugin or the myskool CLI. Publishing needs posts:write and comments:write; permission DMs need dms:write.
---

# Wins amplifier

Members cancel at renewal when they can't say what they got. Wins answer that
question — for the member who had the win, and for everyone watching. This
skill finds the week's wins, drafts a personal congratulation for each, a
Wins Wall post for the whole community and a testimonials file for the
creator, and publishes only what the creator approves.

Before the first tool call read `references/tools.md` (tool names for this
host). Before drafting read `references/approval-protocol.md` and
`references/untrusted-content.md`. Config and memory: `references/config.md`.
Formats: `references/wins-wall-format.md`.

## Workflow

1. **Setup.** Load config or bootstrap it (group, creator, team, voice). Load
   `.myskool/state/wins-amplifier.json` (wins already congratulated or already
   featured) and `.myskool/testimonials.md` if a filesystem exists.
2. **Wins in posts.** `list_posts {sort: "newest", since: "7d", pages: 10}` and
   `list_posts {sort: "best-1w", pages: 1}` (the creator may ask for another
   window). Merge by `id`. Keep posts whose type is `win`
   (`references/taxonomy.md`) and whose author is not the creator or team.
3. **Wins in comments.** `list_posts {sort: "newest-cm", pages: 2}`. For posts
   by the creator/team (lessons, calls, "share your wins" threads) with
   comments, `get_post` and keep member comments inside the window that report
   a result. These get a threaded reply (`parentId` = that comment).
4. **Already celebrated?** For each win post with `commentCount > 0`,
   `get_post`. If the creator or team already commented (or replied under the
   win comment), mark it `already celebrated`: no congratulation draft, but it
   still counts for the Wins Wall and testimonials. Cap: 40 `get_post` per run,
   one call at a time.
5. **Classify and rank.** Give each win a result type (see the format file:
   money/clients, launched/shipped, tool or skill working, habit/consistency,
   personal milestone, helped others) and a strength: concrete outcome with a
   number > milestone > effort. A member's **first** win, or any win from a
   member who joined in the last 30 days, goes to the top — early wins are
   what keep month-1 members.
6. **Draft congratulations** (at most 12; the rest go to "also this week"):
   - Specific: name what they did, in their words, and why it matters.
   - End with **one** follow-up question that invites them to share how
     ("¿Qué fue lo que más te ayudó a cerrarlo?" / "What was the step that
     unlocked it?") — their answer is social proof for everyone else.
   - One comment per member per run: if someone had two wins, cover both in
     one comment.
   - Win post → top-level comment. Win comment → reply with `parentId`.
   - Creator's voice (`voice` in config), member's language, first name,
     ≤ 60 words, plain text, no hype, no promises.
7. **Draft the Wins Wall post** (one per week) using
   `references/wins-wall-format.md`:
   - Needs at least 3 wins; with 1–2, offer a short "win of the week"
     spotlight instead, or skip.
   - At most 10 wins, strongest first, each: first name, one line in their
     own words, link to the win.
   - Quote only public posts/comments, never DMs. No @mentions (plain text).
   - Category: `get_group` → `labels`. If labels exist, `label` is mandatory:
     pick the one for wins/celebrations; if none clearly fits, ask the creator.
8. **Testimonials.** Append the strongest wins to `.myskool/testimonials.md`
   (format in `references/wins-wall-format.md`): verbatim quote (trim, never
   reword the meaning), first name + initial, date, link, result type,
   `permission: pending`. No filesystem → print the entries.
   - Remind the creator: a public post is not consent to use it in marketing.
   - Offer permission-request DM drafts for the top 3 (needs `dms:write`; each
     DM approved by number). Without DM tools, offer to add one line to the
     congratulation comment asking if it's OK to share their result.
   - Income or earnings claims: keep the exact words, never extrapolate, and
     tag the entry `income claim — check your marketing rules`.
9. **Report** in the format below, then stop and wait for approval.
10. **Send** exactly as `references/approval-protocol.md` says. Record
    congratulated and featured ids (and permission DMs sent) in
    `.myskool/state/wins-amplifier.json`; when the creator says a member agreed,
    set that testimonial to `permission: granted`.

## Report format

```
WINS · Club Agentes IA · last 7 days
9 wins found · 3 already celebrated · 6 congratulations drafted · Wins Wall ready · 4 new testimonials

D1 · reply on post · win · first win (joined 12 days ago)
To: … (full draft per approval-protocol.md)

D7 · post · Wins Wall · label "🏆 Victorias"
Title: …
Text: …

D8 · DM · testimonial permission · Marta G.
Text: …

TESTIMONIALS (added to .myskool/testimonials.md, permission pending)
- "Cerré mi primer cliente de automatización por 400 USD" — Marta G. · 2026-09-29 · <link> · money/clients · income claim

Also this week (not drafted): …
Reply `send D1 D3`, `edit D2: …`, `skip D4`, or `send all comments`. DMs only by number.
```

## Rules

- Never invent, round up or embellish a result. If the win is vague, celebrate
  the effort, not a made-up outcome.
- A "win" that is really a promotion, an affiliate pitch or spam is not a win:
  skip it and flag it in the report.
- Don't feature anyone whose post also shows a churn signal (refund,
  complaint) — mention it to the creator instead.
- Never quote DMs anywhere public. Testimonials come only from public posts.

## Scheduling

Good cadence: weekly, Monday morning (Wins Wall) — see
`references/schedule-recipes.md`. Scheduled runs only deliver the report and
drafts — they never publish or DM.

## Examples

- "Celebra los logros de la semana en mi comunidad" → full run, 7 days.
- "Who got results this month? I need testimonials for my sales page" → window
  `since: "30d"`, focus on testimonials + permission DM drafts.
- "Arma el muro de victorias" → Wins Wall draft only (still checks wins).
