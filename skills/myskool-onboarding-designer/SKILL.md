---
name: myskool-onboarding-designer
description: Designs the onboarding of a Skool community so a new member gets a first win in 7 days - picks the onboarding type (triage plus roadmap, routes, entry challenge, first-audit slot, concierge), writes the 3 Skool membership questions, the triage with points per route, 2-3 routes each with today's first task and a 4-week roadmap with one win per week, and the welcome and rescue messages (on joining, day 1, 3, 7 and after 5 quiet days). Use when a Skool creator or community manager asks "arma el onboarding de mi comunidad", "qué le digo a los nuevos miembros", "preguntas de admisión de Skool", "mensaje de bienvenida automático", "AutoDM de Skool", "roadmap para nuevos", "rutas de mi comunidad", "design my Skool onboarding" or "new members join and never start". Not for welcoming the people who already posted an intro (use myskool-welcome-intros) or nudging existing inactive members (use myskool-activation-coach).
license: MIT
compatibility: Needs MySkool (myskool.xyz) as an MCP connector, the OpenClaw plugin or the myskool CLI. Reads only by default; saving the design needs brain:write and publishing the welcome post needs posts:write. Membership questions and the AutoDM are pasted by the creator in Skool settings.
---

# Onboarding designer

Onboarding has one goal: **the first win in 7 days or less**, in the part of
the community that will keep that person. This skill designs the path from
the join request to that win and writes every text on it.

Before the first tool call read `references/tools.md`. Read
`references/instructional-design.md` (sections 3 and 8) and
`references/community-design.md`. Community context: `references/brain.md`.
Posts and DMs follow `references/approval-protocol.md`.

## Workflow

1. **Read what exists.** `list_groups` → the community. `get_brain`; read
   `community-concept`, `community-structure`, `offer-promise`, `onboarding`
   as available. `list_courses` (and `get_course` on the first course) and
   `list_events`: every step of the roadmap must point at something that
   exists. No classroom yet → stop and suggest myskool-community-architect.
2. **Evidence (optional, admin + `members:read`).** `list_members {status:
   "active", since: "30d", pages: 1}`: read `answers` to see how recent
   members describe themselves — profiles for the routes, in their words.
   Never quote a member by name.
3. **Choose the type** and say why in two lines:

   | Type | When |
   |---|---|
   | Triage + roadmap (default) | Program engine, or members very different from each other |
   | Routes | 2–3 clear profiles ("starting from zero" / "already selling") |
   | Entry challenge | Challenges engine |
   | First-audit slot | Live-calls engine: they submit their case on joining and get the date of their first review |
   | Concierge | High tier or small community: a short call or personal audio within 48 h |

   One main type; a second can be layered on.
4. **Membership questions** (Skool allows 3; text, multiple choice or email):
   1. Starting point, **multiple choice** — the answer already picks the route.
   2. Goal for the next 30 days.
   3. "What day and time will you do your first task?" If she needs the
      email, it takes this slot and the when-question moves to the welcome DM.
5. **Triage** (if the type uses it): 4–5 multiple-choice questions asked
   after joining, each option with points per route — starting point, 90-day
   goal, real hours a week (changes the pace, not the route), what stopped
   them before (not knowing what to do → program; not sustaining → challenge;
   nobody to ask → calls). Tie → the route with more points on question 1.
6. **Routes** (2–3). For each: a short positive name (never "beginner"), who
   it is for in one line, **today's first task** (under 20 minutes, ends in
   something to post) and a **4-week roadmap**: one win per week, 2–4 tasks
   naming real lessons or challenge days, and which call to join.
   - First win before day 14: 7 days in a row (challenges), a first audit
     with a concrete correction (live), a first finished deliverable (program).
   - The roadmap starts with two steps already ticked ("You joined", "You
     answered").
   - Under 3 hours a week → stretch to 6 weeks, same wins.
7. **Messages** — plain text, short, with the member's first name
   placeholder, in `references/message-templates.md` format: on joining
   (Skool's AutoDM), day 1 (intro post prompt), day 3, day 7 (celebrate, or
   offer the way back for whoever did nothing), after 5 quiet days (a
   5-minute action, no guilt).
8. **Self-check**: is today's task doable in under 20 minutes? Does every
   week point at something that exists? Does day 7 have an exit for someone
   who did nothing?
9. **Deliver** everything, then:
   - Save as `onboarding` in the brain (`ifExists: "replace"`).
   - Give the paste list for Skool settings: the 3 questions, the AutoDM text.
   - Offer the welcome/roadmap post as a numbered draft; publish with
     `create_post` only on `send`.
   - Day-3, day-7 and quiet-member messages are **templates**, not sends:
     point to myskool-activation-coach and myskool-welcome-intros, which send
     them one by one with approval.

## Rules

- Never promise a result, date or call that the classroom and calendar don't
  contain.
- A short form gets answered: 3 questions at the door, the long triage
  after.
- No bulk DMs from this skill. No member names or answers in the brain file.
- The member's language, the creator's voice.

## Examples

- "Arma el onboarding de mi comunidad" → type → questions → routes →
  messages → paste list.
- "Qué pongo en el AutoDM de Skool?" → the on-joining message only, with the
  first task.
- "New members join and never start" → read the first course, redesign
  today's first task and the day-3 / day-7 messages.
