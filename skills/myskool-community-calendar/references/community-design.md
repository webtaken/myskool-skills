# Where a community's design lives

MySkool has no separate "design document". The design is stored in two
places every other skill can read:

1. **The brain** (markdown context files, `references/brain.md`) — the
   decisions and the texts.
2. **The Skool community itself** — classroom, calendar and posts, built with
   a blueprint.

## Brain files for the design

Write them with `write_brain_file` (needs `brain:write`), `ifExists:
"replace"` for a file the design skills own. Never replace a file whose
`source` is `manual` or `upload` without asking. Each file links the others
with `[[slug]]` and has a one-line `summary`.

| Slug | Owner skill | Contents |
|---|---|---|
| `community-concept` | community-architect | Engine and mix, state A → state B, deadline, promise, method name and phases, member identity, the three acts with their concrete wins |
| `community-structure` | community-architect | Classroom tree (module → lessons → deliverable → unlock rule), challenge ladder with exits, post categories, level names and what each unlocks |
| `offer-promise` | offer-about | The five offer blocks, About text, short description, pinned posts, cover prompts |
| `onboarding` | onboarding-designer | Onboarding type, membership questions, triage, routes with 4-week roadmap, the timed messages |
| `operations` | community-calendar | Calls (day, time, zone, format), the weekly pattern, the current 4-week calendar |

Before designing, load the index (`get_brain`) and read whichever of these
exist: a later step never re-asks what an earlier file already answers. If
`overview`, `audience` or `voice-tone` exist (brains inferred from a
classroom), read them too.

No brain scope or no brain tools → keep the same content in
`.myskool/design/<slug>.md` if a filesystem exists, else print it.

No member personal data in any of these files.

## Blueprint: the buildable part

A blueprint is the JSON MySkool builds in Skool in one job:

```
meta        { name, niche, language, engine: challenges|live|theory, promise }
classroom[] { title ≤50, description, access, deliverable,
              lessons[] { title ≤50, content (markdown), task,
                          recording? { format, minutes, hook, outline[] } } }
events[]    { title, description, weekday: mon…sun, time "HH:MM",
              durationMinutes, weekly, location? }
posts[]     { title, body (plain text), label, pinSuggested }
brainFiles[]{ slug, title, summary, markdown }
manualSteps[]{ area, title, content }
```

- `access`: `{type:"everyone"}`, `{type:"time", days:N}` (days since joining),
  `{type:"level", level:N}` or `{type:"private"}`. Paid courses are not built
  from a blueprint.
- `recording.format`: `talking_head`, `screencast`, `mixed`, `masterclass`.
- `manualSteps.area`: `about`, `description`, `categories`, `levels`,
  `admission_questions`, `auto_dm`, `pinned_posts`, `cover`, `other` — the
  things Skool only allows from its own settings.
- Limits: 12 courses, 40 lessons per course, 150 lessons, 10 events, 12
  posts, 12 brain files.

Flow (tools in `references/tools.md`):

1. `list_templates` → `get_template {slug}`: start from the closest template,
   never from an empty object.
2. Adapt it. Replace every `[placeholder]`.
3. `validate_blueprint` until `ready: true`. Fix `lint` warnings and
   `placeholders`; read `plan.skipped` to see what will not be created and why.
4. Show the creator the plan. Apply only on an explicit yes.
5. `apply_blueprint` → poll `get_blueprint_job` about every 15 s.
6. `done` → hand over `recordings`, `postDrafts` and `manualSteps`.

Facts that keep the creator safe:

- **Courses are created as drafts.** Members see nothing until the creator
  publishes each course.
- **Posts are not published** unless `options.publishPosts` is true (Skool has
  no post drafts). Default: they come back as `postDrafts` and go through
  `references/approval-protocol.md`.
- **Events need** `options.timezone` (IANA) and a meeting link
  (`options.eventLocation` or the event's own `location`). Without them the
  events are skipped, not failed.
- The connected Skool account must be an **admin** of the community.
- A job that ends in `error` with `resumable: true` continues with
  `apply_blueprint {groupId, resumeJobId}`. **Never apply the same blueprint
  again to retry**: it would duplicate the courses.
- One build at a time per community; builds per month depend on the plan.
