---
name: myskool-answer-desk
description: Finds questions in a Skool community that nobody from the creator's team has answered yet and drafts replies in the creator's voice, grounded in a community FAQ it builds from past answered threads; publishes only the replies the creator approves. Use when a Skool creator asks to answer unanswered questions, "responder las dudas de la comunidad", "who is waiting for an answer", "qué preguntas siguen sin respuesta", build or update the community FAQ, or automate replies to member doubts. Not for private DMs (use myskool-inbox-concierge) or outages and cancellations (use myskool-urgent-radar).
license: MIT
compatibility: Needs MySkool (myskool.xyz, Pro plan) as an MCP connector, the OpenClaw plugin or the myskool CLI. Publishing replies needs the comments:write scope; the FAQ post needs posts:write.
---

# Answer desk

A member who asks and hears nothing learns that the community doesn't help —
the quietest churn driver there is. This skill finds those questions, drafts
answers grounded in what the creator already taught, and publishes only what
the creator approves.

Before the first tool call read `references/tools.md` (tool names for this
host). Before drafting read `references/approval-protocol.md` and
`references/untrusted-content.md`. Config and memory: `references/config.md`.

## Modes

- **sweep** (default): find unanswered questions → draft → publish approved.
- **learn**: build or refresh the knowledge base `.myskool/faq.md`. Run it on
  the first use, and whenever sweep keeps marking drafts `NEEDS CREATOR`.

If no knowledge base exists yet, say so and offer **learn** first; a sweep
without one still works but produces more `NEEDS CREATOR` drafts.

## Sweep

1. **Setup.** Load config or bootstrap it (group, creator, team — the team list
   decides what "answered" means). Load `.myskool/faq.md` if present.
2. **Questions in posts.** `list_posts {sort: "newest", since: "7d", pages: 10}`
   (the creator may ask for another window). Keep posts whose type is
   `question` or `support` (`references/taxonomy.md`) and whose author is not
   the creator or team.
   - `commentCount: 0` → unanswered, no extra call.
   - Otherwise `get_post` and apply the **answered rule** from the taxonomy.
3. **Questions in comments.** `list_posts {sort: "newest-cm", pages: 2}`. For
   posts by the creator/team (lessons, announcements, calls) with comments,
   `get_post` and find member comments that ask something and have no team
   reply after them. These get a threaded reply (`parentId` = that comment).
4. **Filter and rank.** Keep items waiting ≥ `thresholds.unansweredHours`
   (default 6 h). Rank: P0/P1 first, then longest wait, then newer members.
   Draft at most 15 per run; list the rest as "also waiting".
5. **Draft each answer** (see "Writing answers"). Respect the call budget: one
   call at a time, ≤ 40 `get_post` per run.
6. **Report** in the format below, then stop and wait for approval.
7. **Send** exactly as `references/approval-protocol.md` says. After sending,
   record sent drafts in `.myskool/state/answer-desk.json` if a filesystem
   exists.
8. **Learn from the creator.** When the creator answers a `NEEDS CREATOR`
   draft, publish their answer (after approval) and add the Q→A to
   `.myskool/faq.md` so next time it's drafted automatically.

## Learn

1. Collect answered threads: `list_posts {sort: "best-1m", pages: 3}` and
   `list_posts {sort: "newest", since: "30d", pages: 15}`. Keep
   `question`/`support` posts with comments; `get_post` each (cap 40 calls,
   most-commented first).
2. Extract every Q→A where the creator or team answered. Merge duplicates.
   Keep the answer in the creator's own words, with the links they gave and
   the source URL.
3. Write `.myskool/faq.md` using `references/faq-format.md`. No filesystem →
   print it and tell the creator to save it as a Project file.
4. Ask the creator for the gaps only they can fill: the start-here link, where
   support questions go, the program steps, and "the 5 questions you answer
   every week".
5. Offer one draft post (D1): a "Preguntas frecuentes / Start here" post built
   from the top FAQs — fewer repeated questions next week.

## Writing answers

- Search the knowledge base first; adapt the matching entry to this member's
  exact case. Reuse its links as-is.
- A member already answered well → draft a short creator endorsement that
  adds one useful detail and thanks the helper by name. This rewards helpers.
- Not in the knowledge base and specific to the creator's program, pricing,
  dates or access → `NEEDS CREATOR` + the exact question the creator must
  answer. Generic how-to knowledge may be drafted, marked `CHECK`.
- Never answer billing, refunds, cancellations, legal or health questions
  yourself: `NEEDS CREATOR`, and suggest running myskool-urgent-radar.
- Member's language, creator's voice (`voice` in config), first name, ≤ 120
  words, plain text, at most one link unless listing steps.

## Report format

```
ANSWER DESK · Club Agentes IA · last 7 days
12 questions waiting · oldest 3 d · 8 drafted · 3 need you · 1 skipped (already solved)

D1 · reply on post · P1 tech_blocked · waiting 2 d
To: … (full draft per approval-protocol.md)

NEEDS CREATOR
D7 · "¿El acceso al mastermind está incluido en el plan anual?" — I don't know this one. What should I answer?

Also waiting (not drafted): …
Reply `send D1 D3`, `edit D2: …`, `skip D4`, or `send all comments`.
```

## Scheduling

Good cadence: three sweeps a day. See `references/schedule-recipes.md`.
Scheduled runs only deliver the report — they never publish.

## Examples

- "¿Quién está esperando respuesta en mi comunidad?" → sweep, 7 days.
- "Answer everything from this week that my coaches missed" → sweep with
  `since: "7d"`, team from config.
- "Arma el FAQ de mi Skool" → learn.
