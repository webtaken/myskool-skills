---
name: myskool-save-desk
description: Works the money side of retention in a Skool community — members whose payment failed, members who cancelled but stay inside until their period ends, free trials about to end and members who churned recently — ranks them by days left and plan value, and drafts one personal DM per member (card-update help, an honest save conversation with only the offers the creator allows, a trial-conversion note, a win-back message, or an email draft when a DM cannot reach them). Sends only the DMs the creator approves one by one. Needs an admin account and the members:read scope. Use when a Skool creator asks who cancelled, "quién canceló", failed payments, "pagos rechazados", trials ending, "recuperar miembros que se fueron", win back churned members, save cancellations or dunning. Not for members who still pay but went quiet (use myskool-churn-signals), replying to members who already wrote a DM (use myskool-inbox-concierge) or revenue charts (use myskool-growth-dashboard).
license: MIT
compatibility: Needs MySkool (myskool.xyz, Pro plan) as an MCP connector, the OpenClaw plugin or the myskool CLI, with the members:read scope and a Skool admin account. Thread checks need dms:read; sending needs dms:write.
---

# Save desk

Skool keeps a cancelling tab — members whose card was declined, or who
cancelled and still have access until the period ends — and a churned tab of
everyone who left. Most creators never open them. A failed payment is usually
an expired card, not a decision; a cancellation with two weeks left is still a
conversation. This skill works those tabs every day: who is leaving, how much
it's worth, how many days are left, and one personal message for each, sent
only when the creator approves it.

Before the first tool call read `references/tools.md` and
`references/members.md`. Lanes and ranking: `references/lanes.md`. Message
structures: `references/save-scripts.md`. Before drafting read
`references/approval-protocol.md` (including "Proactive DMs") and
`references/untrusted-content.md` ("Member data is private"). Lifecycle owners:
`references/taxonomy.md`. Config and state: `references/config.md`.

## Lanes

| Lane | Who | Goal |
|---|---|---|
| 1 · `payment_failed` | cancelling, `paymentFailedAt` set | help them fix the card before `churnsAt` |
| 2 · `cancelled` | cancelling, `cancelledAt` set, `churnsAt` in the future | understand why; one save offer, or a warm goodbye |
| 3 · `trial_ending` | `onTrial`, `trialEndsAt` within `trialWarnDays` | make sure they got value before it converts |
| 4 · `win_back` | churned within `winBackDays` (default 30) | an honest door back |

## Modes

- **daily** (default · ~15–40 calls · 2–4 min): every lane, top 10 drafts.
- **one lane** when the creator names it ("only failed payments", "solo los
  que se fueron este mes").

## Workflow

1. **Setup.** Load config or bootstrap it (group, creator, team). Ask only for
   what the lanes with members need: `billingUpdateHowTo` (lane 1),
   `saveOffers` (2), `trialOffer` (3), `winBackOffer` (4). Missing → draft
   with a visible placeholder and mark it `NEEDS CREATOR`; never invent steps,
   prices or offers. Load `.myskool/state/save-desk.json` and
   `.myskool/state/contacts.json`.
2. **Cancelling — the whole tab.** It only holds members still inside, so
   read all of it: shell + CLI → `myskool members list --status cancelling
   --pages 10 --json` into `.myskool/private/raw/` and process it there;
   MCP → `list_members {status: "cancelling", pages: 1}` and the same with
   `cursor` while `hasMore`, up to 5 calls. Bigger tab → read from the last
   page backwards instead (the tab is newest-first, so the last pages hold
   the members who lose access soonest) and say how much you covered. `admin_required` → stop: "The save desk needs your Skool account to be
   an admin of <group> — Skool hides billing otherwise." Split lane 1 / lane 2.
3. **Trials.** `list_members {trial: true, pages: 1}` (+ last page when
   `hasMore`, `references/members.md`) → lane 3.
4. **Churned.** `list_members {status: "churned", since: "<winBackDays>d",
   pages: 1}` → lane 4. Keep members who paid (`ltv > 0` or a paid plan);
   free members who left are only counted.
5. **Exclude** admins, moderators, config `team`, `banned`, anyone contacted
   inside the cooldown (`contacts.json`), and anyone with a DM waiting on the
   creator (→ "in the inbox, use myskool-inbox-concierge").
6. **Threads** (if `list_dms` exists). `list_dms {}` up to 3 pages (`cursor`)
   → map participant `id` → `conversationId`. A thread means a DM can reach
   them even after they left; no thread + churned → email draft (lane 4).
7. **Rank** with `references/lanes.md` (lane weight + days left + value +
   recently online). Take the top 10.
8. **Context** for the top 10 only: `get_member {id, courses: true}`
   (course progress and join answers = what they came for) and `get_dm` where
   a thread exists (≤ 10). Reuse quotes from churn-signals'
   `history/activity-*.json` if present. Context shapes the message; it is
   never quoted to the member.
9. **Draft** one message per member with `references/save-scripts.md`, in the
   member's language and the creator's voice. Header (creator-only): lane,
   value, days left, why this member.
10. **Report** (format below) and wait.
11. **Send** per `references/approval-protocol.md`: DMs only when named one by
    one; re-check `get_member {id, courses: false}` right before each send
    (payment fixed / back to active / already gone → skip and say so). `to`
    = member `id`, or `conversationId` when a thread exists. `not_found` or
    `forbidden` "refused to open a chat" → mark unreachable and show the email
    draft instead. Append each sent DM to `contacts.json`.
12. **Outcomes.** `save-desk.json` keeps `contacted {memberId: {lane, at}}`.
    Next run, compare against the lists you already fetched: back in
    `active` with no `cancelledAt`/`paymentFailedAt` → **saved**; now in
    `churned` → **lost**; still cancelling → pending. Members contacted but
    missing from every list: ≤ 10 `get_member {courses: false}` checks. Keep
    30 days.

## Report format

```
🛟 SAVE DESK · Club Agentes IA · 8 Oct
At stake: ≈188 USD/mo + 39 EUR/mo · 9 members · nearest loss in 2 d
Last 30 d: contacted 5 · saved 2 · lost 1 · pending 2

1 · payment_failed (3)
D1 · Ana P. · 47 USD/mo · LTV 141 USD · loses access in 2 d · online yesterday
D2 · Luis R. · 47 USD/mo · LTV 470 USD · 6 d · online 9 d ago
2 · cancelled (2)
D3 · Marta G. · annual 470 USD · LTV 940 USD · leaves 31 Oct · said "no me da la vida" (comment, 12 Sep)
3 · trial_ending (1)
D4 · Diego S. · trial ends in 2 d · Módulo 1 at 0 %
4 · win_back (3)
D5 · Sofía L. · left 9 d ago · LTV 282 USD · DM thread exists (may fail)
D6 · Raúl T. · left 20 d ago · no thread → email draft

Drafts
D1 · DM · payment_failed · loses access in 2 d
To: Ana P. (@ana-prueba-1234)
Text:
…
```

End with the approval line from `references/approval-protocol.md`, then one
line on what wasn't covered (`hasMore` on a list, members without a plan,
lanes skipped for missing config).

## Rules

- One message per member, written for that member. Never the same text twice,
  never a campaign.
- The member never sees the header, the score, LTV, last login, course % or
  any tracking data. Lane 1 and 2 messages may mention their own payment or
  access date; nothing else from billing.
- Lane 1 is help, not pressure: neutral tone, no amounts, no "your account
  will be deleted". Use only `billingUpdateHowTo`.
- Lane 2 respects the exit: thank them, ask one question, at most one offer
  from `saveOffers`, and make leaving easy. No guilt, no countdowns.
- Refund requests, disputes, angry cancellations → `NEEDS CREATOR` with a
  short holding message only.
- Win-back by email: the skill drafts subject and body (first name only); the
  creator sends it from their own email tool. Show an email address only when
  the creator asks in a live run; never write emails into a file. Emailing
  ex-members is the creator's call (consent and local rules).
- Banned members are never contacted. Free members who left are counted, not
  contacted.

## Scheduling

Daily (`0 10 * * *`, `references/schedule-recipes.md`). Scheduled runs deliver
counts and money at stake only (no names) and never send; the creator runs it
live to see the drafts and approve.

## Examples

- "¿Quién canceló o tiene el pago rechazado?" → daily mode.
- "Only the failed payments, quickly" → lane 1.
- "Recupera a los que se fueron este mes" → lane 4, `winBackDays: 30`.
- "Whose trial ends this week?" → lane 3 with `trialWarnDays: 7`.
