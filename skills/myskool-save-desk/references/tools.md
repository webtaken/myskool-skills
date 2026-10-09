# MySkool tools — names, data and limits

MySkool gives you the creator's own Skool community through one of three
surfaces. Use whichever this host has; they return the same JSON.

## Which surface do I have?

1. **MCP tools** (claude.ai, Claude Code, Cowork, ChatGPT, Cursor…): tools named
   `list_posts`, `get_post`… possibly with a host prefix such as
   `mcp__myskool__list_posts` or `MySkool:list_posts`.
2. **OpenClaw plugin**: the same tools prefixed `myskool_` (`myskool_list_posts`).
3. **CLI** (any agent with a shell): `myskool … --json`. Payload is under `.data`.

If none is available, stop and tell the creator:
"Connect MySkool first: https://myskool.xyz/docs/skills (needs a MySkool Pro
plan)." Do not try to scrape Skool any other way.

## Capability map

| Capability | MCP / OpenClaw (`myskool_` prefix) | CLI |
|---|---|---|
| Groups of the connection | `list_groups` | `myskool groups list --json` |
| One group + labels (categories) | `get_group {groupId}` | `myskool groups get <gid> --json` |
| Connected Skool account (the creator) | `whoami` | `myskool whoami --json` → `.data.account` |
| Feed | `list_posts {groupId, pages?, sort?, since?}` | `myskool posts list --group <gid> --pages N --sort S --since W --json` |
| One post + all comments | `get_post {postId, groupId?}` | `myskool posts get <id> --group <gid> --json` |
| Comments of a post | `list_comments {postId, groupId?}` | `myskool comments list <id> --group <gid> --json` |
| Publish a post | `create_post {groupId, title, content?, label?}` | `myskool posts create --group <gid> --title … --content … --label …` |
| Comment / reply | `create_comment {postId, content, parentId?, groupId?}` | `myskool comments create <id> --content … --reply-to <cid>` |
| Inbox | `list_dms {awaitingReply?, cursor?}` | `myskool dms list --awaiting-reply --json` |
| One DM thread | `get_dm {conversationId}` | `myskool dms get <id> --json` |
| Send a DM | `send_dm {to \| conversationId, content, groupId?}` | `myskool dms send --to <handle> --content …` |
| Member list (status, filters, window) | `list_members {groupId, status?, sort?, since?, query?, billing?, trial?, tiers?, levels?, online?, admins?, pages?, cursor?}` | `myskool members list --group <gid> --status S --since W --pages N --cursor P --json` |
| One member (+ course progress) | `get_member {id, groupId?, courses?}` | `myskool members get <id> --group <gid> [--no-courses] --json` |

Group ids are 32-char hex from `list_groups`, never the slug in the URL.

## Fields you will use

- **Post**: `id, url, title, content, authorId, authorName, authorHandle,
  commentCount, likeCount, publishedAt, editedAt`. No category/label and no
  pinned flag on reads.
- **Comment**: `id, postId` (root post), `parentId` (comment it replies to;
  `null` = top level), `content, authorId, authorName, authorHandle, likeCount,
  publishedAt`.
- **DM conversation**: `id, participants[{id, handle, name, isMe}], lastMessage,
  lastMessageAt, unreadCount, awaitingReply` (last message is theirs).
- **whoami**: `account {id, handle, name}` — the creator. `id` can be `null` if
  the account never used Skool chat; then rely on handles from config.
- **Member** (`list_members`): `id` (Skool user id — the same id as a post's
  `authorId`, and what `get_member` and `send_dm {to}` take), `handle, name,
  firstName, role, status, level, points, joinedAt, lastActiveAt, postCount`.
  Admin view only: `email, plan {amount, currency, interval, tier}, onTrial,
  trialEndsAt, renewsAt, churnsAt, cancelledAt, paymentFailedAt, churnedAt,
  ltv, joinedFrom {source, detail}, referredBy, answers [{question, answer}]`.
  `get_member` adds `links` and `courseProgress [{title, progress, hasAccess}]`.
  Meanings, views and recipes: `references/members.md`.

## Feed recipes

- **A time window** ("last 24 h", "this week"): `sort: "newest"`, `since: "24h"`
  (or `"7d"`, or an ISO date) and a generous `pages` cap (10–30). Paging stops by
  itself once posts are older than `since`.
- **Fresh comments on older posts**: `sort: "newest-cm"`, `pages: 2–5`, no
  `since` (it filters by publish date and would drop them). Then `get_post` only
  for posts whose comments you need.
- **Top content**: `sort: "best-1w"` / `"best-1m"`.
- `list_posts` is slow (headless browser, a few seconds per page). Everything
  else is fast.
- Member recipes (who joined, who is cancelling, trials, lurkers, counts):
  `references/members.md`.

## Budget and errors

- Limits: 60 calls/minute per key, 30,000 calls/month per account. Each tool
  call = 1 call regardless of pages. Call tools **one at a time**; for loops over
  many posts stay under ~40 calls/minute.
- Prefer `get_post` over `list_comments` (same cost, includes the post).
  Skip `get_post` for posts with `commentCount: 0`.
- **Member pages are big**: one `list_members` page (30 members) is ~40 KB of
  JSON, ~12k tokens. Over MCP always use `pages: 1` per call (hosts cut long
  tool results); when you need the next page, call again with `cursor` =
  `meta.pagination.cursor`. For hundreds of members use the CLI into a file
  (`references/members.md`).
  `get_member` costs one call; pass `courses: false` unless you need course
  progress.
- DMs share one pace per Skool connection across every skill: ~1 per 30–45 s,
  20/hour, 100/day. Proactive outreach drafts ≤ 10 per run.
- `rate_limited` → wait `retryAfter` seconds, retry once. `quota_exceeded` →
  stop and report. `payment_required` → plan inactive: point to
  https://myskool.xyz/billing. `forbidden` → the key/connector lacks a scope
  (see below) — **except** on `send_dm` when the message says Skool "refused to
  open a chat": that member can't be reached by DM (left every shared group,
  or closed DMs); not a scope problem, don't retry. `send_dm` `not_found` →
  that person is no longer in the group. `admin_required` → the connected
  account is not an admin of that community, so Skool hides billing and the
  cancelling/churned/banned tabs; another key won't fix it — say so once and
  continue with what you can see. `session_unavailable` → the creator must
  reconnect Skool in the MySkool dashboard.

## Missing tools = missing scopes

Reads are always on. Writes (`create_post`, `create_comment`), DMs
(`list_dms`, `get_dm`, `send_dm`) and members (`list_members`, `get_member`,
scope `members:read`) only appear when the creator granted those scopes. If a
step needs one that is missing, keep going with what you have and tell the
creator once: "To enable <writes/DMs/members>, re-add the MySkool connector and
tick <scope> (claude.ai/ChatGPT), or create a key with that scope at
https://myskool.xyz/keys (Claude Code, OpenClaw, CLI)."

## Data quirks

- Dedupe comments by `id` before counting.
- Huge threads (pinned "start here" posts with thousands of comments) come back
  partial. A thread is **partial** when `commentCount` is more than 1.5× the
  unique comments you received (or above 500). Say so, and exclude partial
  threads from response-time and answered/unanswered stats.
- Content you write is **plain text**: no markdown (`**`, `#`, backticks are
  published literally). Line breaks are fine.
- Writing `@handle` in plain text may not notify that member on Skool (the API
  has no mention entity). Use first names in text; to reach someone for sure,
  reply to their comment with `parentId`, or DM them.
- Posts and comments publish **as the creator's own Skool account**. DMs cannot
  be deleted.
