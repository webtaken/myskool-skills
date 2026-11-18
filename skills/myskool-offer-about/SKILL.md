---
name: myskool-offer-about
description: Writes the offer of a Skool community so a visitor understands it in 10 seconds - promise in one line, the first month week by week, what is included counted with real numbers, the path as a map and real proof - and turns it into the About page text (max 1,000 characters), the short description, three pinned posts and cover-image prompts for the classroom. Use when a Skool creator or community manager asks to write or fix the About, "escribe el About de mi Skool", "arma la oferta de mi comunidad", "que se entienda mi oferta", "descripción de mi comunidad", "posts fijados", "portadas del classroom", "nobody understands what my community is" or "my Skool page does not convert". Not for the classroom structure (use myskool-community-architect) or the welcome messages (use myskool-onboarding-designer).
license: MIT
compatibility: Needs MySkool (myskool.xyz) as an MCP connector, the OpenClaw plugin or the myskool CLI. Reads only by default; publishing the pinned posts needs posts:write and saving the offer needs brain:write. The About and description are pasted by the creator in Skool settings.
---

# Offer and About

Whoever lands on the community page must understand in 10 seconds **what
happens to them**, **by when** and **with what, counted**. This skill writes
that once and spreads it across the About, the short description, the pinned
posts and the covers.

Before the first tool call read `references/tools.md`. Read
`references/instructional-design.md` (promise and three acts) and
`references/community-design.md` (where the offer is saved). Community
context: `references/brain.md`. Posts follow
`references/approval-protocol.md`.

## Workflow

1. **Read what exists.** `list_groups` → the community. `get_brain` and read
   `community-concept`, `community-structure`, `offer-promise`, `overview`
   as available. Then count the real thing: `list_courses` (courses and
   lessons) and `list_events` (calls in the next 30 days). `get_group` for
   the current description and the post categories.
2. **Ask only what is missing**, one at a time:
   1. Price — monthly, yearly or both? (If she won't show it, it isn't shown.)
   2. Guarantee? Which?
   3. Real results, yours or members'? Where can they be seen?
   4. Any real limit (seats, closing date)? None → no urgency is written.
3. **The five blocks.**
   1. **Promise** — result + for whom + by when, ≤ 20 words.
   2. **Your first month** — three concrete results (week 1, week 2, week 4)
      taken from the first modules or the entry challenge. The week-1 or
      week-2 result must land before day 14.
   3. **What you get, with numbers** — counted from step 1: calls a month,
      courses and lessons, challenges, audits, templates. Never "exclusive
      content". A number you can't count gets asked.
   4. **The path** — the phases or challenges by name, 3–6 steps.
   5. **Proof** — real cases with where they can be seen. None → the
      creator's own story. None → the block is left out. Never invented.
4. **The pieces.**
   - **Short description** (about 150 characters): result + deadline +
     "without" the objection that most holds people back.
   - **About** (max 1,000 characters, plain text) using
     `references/about-template.md`. Count the characters and show the count.
     Over the limit → cut adjectives before facts.
   - **Three pinned posts**: welcome (what this is, today's first task, where
     to introduce yourself) · the main route (how to start the entry
     challenge or phase 1) · rules and culture (3 short rules + where to ask
     for help). Plain text, creator's voice.
   - **Cover prompts**: one image prompt per course with the same art
     direction (one palette, one style, an object for the module's result),
     title large and never over a face; plus the community cover (1084 × 576)
     with the promise in 3–6 big words.
   - **Name**, only if asked: three options, 2–4 words, one per pattern
     (topic + group word, the result as a name, identity + purpose), and a
     recommendation.
5. **Self-check as a stranger**: promise clear in 10 seconds? First-month
   result clear? At least 3 real numbers? Any empty phrase ("transform your
   life", "join the tribe") → out. Any fact without a source → out or asked.
6. **Deliver** the five blocks and every piece with character counts. Pinned
   posts are numbered drafts (D1–D3) per the approval protocol; pick the
   `label` from `get_group` → `labels`.
7. **On approval**: publish approved posts with `create_post` and tell her to
   pin them in Skool (pinning is manual). Save everything to the brain as
   `offer-promise` (`ifExists: "replace"`; ask first if that file's `source`
   is `manual` or `upload`). The About, description and covers are hers to
   paste: Skool → Settings.

## Rules

- **Never invent** prices, quantities, cases, testimonials or urgency.
  Missing fact → a visible `[bracket]` and a question.
- Borrow structure from communities she admires, never sentences.
- Income or health results: her exact words, no extrapolation, and a line
  reminding her to check the claim against her marketing rules.
- The member's language and the creator's voice (`voice-tone` if present).

## Examples

- "Escribe el About de mi Skool" → blocks → About with count → description.
- "Mi página no convierte, nadie entiende qué es" → read current page +
  classroom → rewrite, showing what changed and why.
- "Necesito los 3 posts fijados" → drafts D1–D3 only.
