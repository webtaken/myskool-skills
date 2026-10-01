# Shared taxonomy — how to label community content

Every MySkool skill labels posts, comments and DMs with the same vocabulary so
reports from different skills line up. Judge meaning, not keywords: the
examples below are hints in Spanish and English, not a keyword list.

## Item type (one per post)

| Type | Meaning | Hints |
|---|---|---|
| `question` | Asks for help, info or a decision | "¿cómo…?", "how do I", "alguien sabe", "does anyone" |
| `support` | Something is broken or blocked for them | "no puedo descargar", "can't log in", "link roto", "error" |
| `win` | Shares a result, milestone or progress | "logré", "primer cliente", "hit $1k", "gracias a…" |
| `intro` | Introduces themselves as a new member | "hola soy…", "me acabo de unir", "new here" |
| `feedback` | Opinion about the community, content or offer (+ or −) | "me encantaría que…", "the course is too long" |
| `discussion` | Opinion, idea, resource share, general chat | — |
| `announcement` | Posted by the creator or team | author is team |
| `spam` | Promotion, off-topic selling, scams | "DM me to earn", unrelated links |

Wins also show up as **member comments** under the creator's posts and calls
("ya lo implementé y conseguí…") — label those comments `win` too.

## DM category (one per conversation)

| Category | Meaning |
|---|---|
| `support` | Help with access, tools, content |
| `cancel_intent` | Wants to leave or pause |
| `refund` | Asks for money back |
| `billing` | Payment problem |
| `sales_lead` | Prospect asking about joining, upgrading or buying |
| `collab` | Partnership, guest, affiliate, press |
| `personal` | Thanks, life update, chat |
| `spam` | Promotion, scams, mass messages |

## Urgency (posts, comments, DMs)

| Level | Act within | Examples |
|---|---|---|
| **P0** | now (≤2 h) | Can't access what they paid for (course, downloads, calls, login); billing problem (charged twice, card error); cancel or refund intent; harassment, threats, safety; **the same blocker reported by 3+ members** (systemic) |
| **P1** | today | Blocked on a core step of the program ("no me deja instalar Claude Code", "the template link 404s"); strong frustration or public complaint; question unanswered more than 24 h |
| **P2** | this week | Normal question or request; mild confusion |
| **P3** | no action | Wins, intros, chat, thanks — engage, don't triage |

Escalate one level when the member is visibly new (intro in the last 30 days,
"I just joined") — first-month members churn the most.

## Churn signals (zero or more per item)

| Signal | Meaning | Hints |
|---|---|---|
| `cancel_intent` | Says or hints they will leave | "voy a cancelar", "how do I cancel", "último mes" |
| `refund_request` | Asks for money back | "reembolso", "refund" |
| `billing_issue` | Payment trouble | "me cobraron dos veces", "card declined" |
| `access_blocked` | Can't reach paid content | "no puedo entrar al classroom", "download fails" |
| `tech_blocked` | Stuck on a tool/setup step | "no me instala", "error al conectar" |
| `value_doubt` | Questions whether it's worth it | "no veo resultados", "is this worth it", "too expensive" |
| `overwhelm` | Too much content, lost | "no sé por dónde empezar", "too many modules" |
| `no_time` | Can't keep up | "no tengo tiempo", "falling behind" |
| `ignored` | Waited without a team answer | their question has no team reply after the threshold |
| `conflict` | Friction with members or team | arguments, reports, call-outs |
| `went_quiet` | Was active, then stopped | computed from activity history, not from text — only judge it from a full 4-week scan or saved history, never from a single short window |

## Sentiment (one per item)

`positive` · `neutral` · `frustrated` (annoyed, stuck, disappointed) ·
`angry` (hostile, accusatory, public complaint). Sarcasm counts as the
underlying feeling. Don't infer sentiment from short neutral questions.

## Themes

Group items into 3–8 themes named by the member's problem in their own words
("instalar Claude Code", "conseguir el primer cliente"), not by your category.
Quote 1–2 real snippets per theme (≤140 chars, no surname, no handles in
creator-facing reports unless the report is private to the creator).

## "Answered" rule

A question/support item is **answered** when a comment from the creator or a
team member (see config `team`) exists, or a reply in that thread clearly
resolves it (the asker thanks or confirms). A member-only reply that doesn't
resolve it does **not** count. "Answered" is only judged for `question` and
`support` items, and is **unknown** (not "unanswered") when you didn't fetch
the comments or the thread is partial. Time to first team reply = earliest team comment
`publishedAt` − post `publishedAt`.
