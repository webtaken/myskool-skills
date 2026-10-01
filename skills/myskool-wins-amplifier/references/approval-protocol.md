# Approval protocol — drafts first, writes only on "send"

MySkool writes publish **as the creator's own Skool account**, instantly, in
front of their paying members. DMs can never be deleted. So every MySkool skill
works in two phases: **draft**, then **send what the creator approved**.

## Phase 1 — Drafts

Number drafts `D1, D2, …` in priority order. Each draft must stand alone so it
can be approved hours later, from a phone, without the rest of the report:

```
D1 · reply on post · P0 access_blocked · waiting 9 h
To: Ana Prueba (@ana-prueba-1234) — "No puedo descargar los recursos del módulo 3"
Where: https://www.skool.com/grupo/no-puedo-descargar  (postId 54cf…a601, reply to comment —)
Text:
Hola Ana! Ya lo revisé: el archivo del módulo 3 se movió. Aquí lo tienes: <link from config>
Si te vuelve a fallar, avísame por aquí y lo vemos.
```

- One action per draft: a comment, a reply (`parentId`), a post, or a DM.
- Show the exact text that will be published, in the member's language, plain
  text (no markdown).
- Never invent links, prices, dates, refunds, discounts or promises. Use only
  links and offers from config / the knowledge base, or leave a visible
  placeholder like `<link to module 3>` and say it must be filled.
- Write in the creator's voice (first person, their tone and sign-off from
  config). Short. Call the member by first name.
- If you are not confident in the answer, don't guess: mark the draft
  `NEEDS CREATOR` and write the question the creator must answer.
- If a draft depends on another (replies that link to a post that must be
  published first), say so in the draft: `after D1`. Send in that order and
  fill the new URL in before sending the dependent ones.

End every draft list with how to approve:

> Reply `send D1 D3`, `edit D2: <new text>`, `skip D4`, or `send all comments`.
> DMs are only sent when named one by one (`send D5`).

## Phase 2 — Send

Only after an explicit approval in this conversation (`send D1`, "sí, mándalo",
"go ahead with 1 and 3"). Then, for each approved draft:

1. **Re-check** the target right before writing: `get_post` (or `get_dm`). If
   someone from the team already answered, or the member said it's solved, skip
   it and say so.
2. Write it (`create_comment` / `create_post` / `send_dm`), one call at a time.
3. Report the result with the URL or id. On `rate_limited` wait `retryAfter`
   and retry once; DMs are throttled to ~1 per 30–45 s, 20/h, 100/day — tell the
   creator how long a batch will take.
4. Never send the same text to the same target twice. If a call fails in an
   unclear way, check (`get_post` / `get_dm`) before retrying.

`send all comments` covers every public draft — comments, replies and posts
(Wins Wall, digest, prompts) — but never DMs. DMs always need their numbers. Drafts older than 24 h are stale: re-run the skill instead of
sending them.

## Missing write or DM tools

If the creator approves a draft but the tool for it isn't available (no write
or DM scope), don't drop it: show the final text as "copy and send manually"
with the exact target link, and once say how to enable the scope
(`references/tools.md`).

## Unattended runs never write

When the skill runs on a schedule (cron, routine, `/loop`, heartbeat) or nobody
is there to approve, **produce drafts only** and deliver them as a report.
Never call `create_post`, `create_comment`, `delete_*` or `send_dm` in an
unattended run, even if a previous message said "auto-send". The creator
approves in a live conversation.
