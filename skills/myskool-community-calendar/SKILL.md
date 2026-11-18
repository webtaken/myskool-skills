---
name: myskool-community-calendar
description: Sets the weekly rhythm of a Skool community and plans the next 4 weeks - decides the live calls for the community's engine, creates them once as recurring events in the Skool calendar, writes one anchor post per day with its category (kick-off, tip, wins, what comes next) and publishes each post only when the creator approves it. Use when a Skool creator or community manager asks "qué publico cada día en mi comunidad", "arma el calendario de mi Skool", "calendario de actividades del mes", "cuándo hago los vivos", "programa mis directos semanales", "plan my Skool posts for the month", "set up my weekly calls" or "publica lo de hoy en mi Skool". Not for the recap of the week that already happened (use myskool-weekly-digest) or the classroom structure (use myskool-community-architect).
license: MIT
compatibility: Needs MySkool (myskool.xyz) as an MCP connector, the OpenClaw plugin or the myskool CLI. Reads only by default; creating the calls needs events:write and a Skool account that is admin of the community, publishing posts needs posts:write, saving the plan needs brain:write.
---

# Community calendar

A community with a fixed rhythm feels alive: members learn the week by heart
and come back for it. This skill decides the rhythm, puts the calls on the
Skool calendar, writes the month and publishes each day's post when the
creator says so.

Before the first tool call read `references/tools.md`. Read
`references/instructional-design.md` (section 7) and
`references/community-design.md`. Weekly patterns:
`references/weekly-patterns.md`. Community context: `references/brain.md`.
Every post follows `references/approval-protocol.md`; recurring runs follow
`references/schedule-recipes.md`.

## Workflow

1. **Read what exists.** `list_groups` → the community. `get_brain`; read
   `community-concept` (engine), `community-structure` (challenges,
   categories), `onboarding`, `operations`. `get_group` → `labels`.
   `list_events {from: today, to: +30d}`: calls that already exist are kept,
   never duplicated. `list_posts {sort: "newest", since: "14d", pages: 2}` to
   see what she already publishes and how.
2. **Ask what is missing**, one at a time: which days and times can you
   really go live, in which time zone? From what date does the calendar
   start? What is the meeting link (Zoom, Meet)? 
3. **Calls.** By engine (rules file, section 7): challenges 1 a week, live
   calls 2–3, program 1–2. Same day and time every week. If she has less time
   than the engine asks for, drop a call and say so — no promised calls that
   won't happen. Each call has a format that corrects something concrete
   (hot seat, delivery review, week closing).
4. **Week pattern.** One anchor post per day with its category, from
   `references/weekly-patterns.md` for the engine. Every week includes one
   **wins** post and one **what comes next** post.
5. **4-week calendar.** Each entry: date, time, type, category (`label`),
   title, body in plain text ready for Skool, and `auto` (yes / needs her).
   - Challenge days come from `community-structure`; don't reinvent them.
   - Start a challenge on a Monday or the 1st.
   - `needs her` = anything that requires a photo, a real case, a link she
     has not given. Leave `[real case]` visible; never invent one.
   - Calls are referred to as "link in the Skool calendar".
6. **Self-check**: a wins post and a what's-next post every week? Any empty
   day? Any post that depends on a fact that doesn't exist?
7. **Report** in the format below and stop.
8. **On approval:**
   - **Calls** (`events:write`, admin): `create_event` once per call as a
     weekly recurring event with her `timezone`, `startTime` as wall-clock
     time and the meeting link; `sendReminder` only if she asks. Confirm the
     list before creating; skip any that step 1 found already.
   - **Plan**: save as `operations` in the brain (`ifExists: "replace"`) —
     calls, pattern and the 4 weeks with a status per entry.
   - **Posts**: nothing is scheduled inside Skool (it has no scheduler).
     Offer to publish today's entry now (`send D…`), and a daily run that
     brings her that day's draft for approval.
9. **Daily run** ("publica lo de hoy"): read `operations`, show today's
   entries as numbered drafts, publish with `create_post` only what she
   approves, mark them published in `operations`. Scheduled runs only
   deliver the drafts; they never publish.

## Report format

```
CALENDAR · Reto Plato Real · engine: challenges · Mon 23 Nov → Sun 20 Dec · America/Lima

CALLS (to create as weekly events)
E1 · Cierre de semana · Sundays 19:00 · 60 min · Zoom

WEEK PATTERN
Mon kick-off + check-in · Tue tip · Wed featured win · Thu flash · Fri streak ranking · Sun closing call + what's next

WEEK 1
D1 · Mon 23 · 08:00 · 🔥 Reto · "Día 1: tu plato de hoy" · auto
D2 · Tue 24 · 08:00 · 💡 Tips · "El truco del plato dividido" · auto
D3 · Wed 25 · 12:00 · 🏆 Victorias · "Victoria de la semana" · needs her: [real case]
…

28 posts · 22 ready · 6 need you
Reply `create calls`, `send D1`, `edit D2: …`, or `save plan`.
```

## Rules

- Never publish without an approval naming the draft. Never create an event
  without her confirming day, time and zone.
- Plain text posts. `label` is mandatory when the community has categories:
  use the exact name; none fits → ask.
- No invented numbers, cases or deadlines.
- Don't overload: one anchor a day is enough. If the feed is already busy,
  propose fewer.

## Scheduling

Good cadence: monthly for the plan (last week of the month); daily for
"today's post" — see `references/schedule-recipes.md`. Scheduled runs only
deliver drafts.

## Examples

- "Arma el calendario de mi Skool para diciembre" → calls → pattern → 4
  weeks → report.
- "Programa mis directos de los martes 7 pm" → one recurring event after
  confirming zone and link.
- "Publica lo de hoy" → today's drafts from `operations`.
