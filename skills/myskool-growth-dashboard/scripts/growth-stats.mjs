#!/usr/bin/env node
// Exact numbers for the growth summary, a safe way to fill the dashboard, and
// a converter from raw CLI member pages to DATA records without personal data.
//
//   node scripts/growth-stats.mjs data.json                  → prints the stats JSON
//   node scripts/growth-stats.mjs data.json --fill out.html  → also writes the filled dashboard
//   node scripts/growth-stats.mjs --raw <dir> --out data.json [--group "Name"] [--lang es] [--view admin] [--days 90]
//       → reads every `myskool members list --json` page in <dir> (active-*, cancelling-*,
//         churned-*), writes DATA (no email, handle, answers or bio) and prints the stats
//   node scripts/growth-stats.mjs --raw <dir> --answers [--days 30]
//       → join answers of members who joined in the last N days, no names, contacts
//         redacted: the input for labelling survey themes
//
// toRecord() and computeStats() come from the block between `// <stats>` and
// `// </stats>` in assets/growth.html, so the summary and the page always agree.
// Zero dependencies, Node ≥ 18.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(here, "..", "assets", "growth.html");
const USAGE = `usage:
  node growth-stats.mjs <data.json> [--fill <out.html>]
  node growth-stats.mjs --raw <dir> --out <data.json> [--group "Name"] [--lang es|en|pt] [--view admin|member] [--days 90]
  node growth-stats.mjs --raw <dir> --answers [--days 30]`;

const argv = process.argv.slice(2);
const opts = { _: [] };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--answers") opts.answers = true;
  else if (a.startsWith("--")) {
    const v = argv[i + 1];
    if (v === undefined || v.startsWith("--")) { console.error(`${a} needs a value\n${USAGE}`); process.exit(2); }
    opts[a.slice(2)] = v; i++;
  } else opts._.push(a);
}

const template = fs.readFileSync(templatePath, "utf8");
const block = /\/\/ <stats>[^\n]*\n([\s\S]*?)\/\/ <\/stats>/.exec(template);
if (!block) throw new Error("stats block not found in assets/growth.html");
const { toRecord, computeStats } = new Function(`${block[1]}\nreturn { toRecord, computeStats };`)();

const DAY = 864e5;
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const STATUSES = ["active", "cancelling", "churned"];

// ---------------------------------------------------------------------------
// Raw CLI pages → members grouped by status.
function readRaw(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  if (!files.length) throw new Error(`no .json files in ${dir}`);
  const first = {}, last = {}, members = [];
  let view = null;
  for (const f of files) {
    const page = readJson(path.join(dir, f));
    const list = Array.isArray(page) ? page : Array.isArray(page.data) ? page.data : [];
    const meta = (!Array.isArray(page) && page.meta) || {};
    const prefix = (/^(active|cancelling|churned)/.exec(f) || [])[1];
    const status = prefix || (list[0] && list[0].status) || "active";
    if (!(status in first)) first[status] = meta;
    last[status] = meta;
    if (!view && meta.view) view = meta.view;
    for (const m of list) if (m && m.id) members.push({ ...m, status: m.status || status });
  }
  return { first, last, members, view };
}

function rawToData(dir) {
  const { first, last, members, view } = readRaw(dir);
  const byId = new Map();
  for (const m of members) if (STATUSES.includes(m.status) && !byId.has(m.id)) byId.set(m.id, toRecord(m));
  const records = [...byId.values()];
  const n = (st) => records.filter((r) => r.status === st).length;
  const total = (st) => (first[st] && typeof first[st].total === "number" ? first[st].total : null);
  // The active tab's count includes the members still inside who are cancelling.
  const activeTotal = total("active") != null && total("cancelling") != null ? total("active") - total("cancelling") : total("active");
  const partial = STATUSES.filter((st) => last[st] && last[st].pagination && last[st].pagination.hasMore);
  const lang = ["es", "en", "pt"].includes(opts.lang) ? opts.lang : "en";
  return {
    meta: {
      group: opts.group || null, groupUrl: null, language: lang, generatedAt: new Date().toISOString(),
      view: opts.view || view || "admin", method: "exact", windowDays: Number(opts.days) || 90,
      counts: { active: activeTotal, cancelling: total("cancelling"), churned: total("churned") },
      coverage: { activeRead: n("active"), cancellingRead: n("cancelling"), churnedRead: n("churned") },
      partial, notes: ["survey themes not computed"],
    },
    records, surveyThemes: [], history: [], summary: null,
  };
}

// Join answers for theme labelling: no names, ids or emails; contact details redacted.
function rawAnswers(dir) {
  const { members } = readRaw(dir);
  const days = Number(opts.days) || 30, since = Date.now() - days * DAY, seen = new Set(), out = [];
  const redact = (s) => {
    const x = String(s)
      .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "[contact]")
      .replace(/\b(?:https?:\/\/|www\.)\S+/gi, "[contact]")
      .replace(/\b[\w-]+\.(?:com|net|org|io|co|me|ly|xyz|app|link)(?:\/\S*)?/gi, "[contact]")
      .replace(/\+?\d[\d\s().-]{6,}\d/g, "[contact]");
    return { text: x.slice(0, 300), redacted: x !== String(s) };
  };
  for (const m of members) {
    if (seen.has(m.id) || !(Date.parse(m.joinedAt) >= since) || !Array.isArray(m.answers)) continue;
    seen.add(m.id);
    for (const a of m.answers) {
      if (!a || !a.answer || !String(a.answer).trim()) continue;
      const r = redact(a.answer);
      out.push({ question: String(a.question || "").slice(0, 160), answer: r.text, ...(r.redacted ? { redacted: true } : {}) });
      if (out.length >= 300) return out;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
function report(data) {
  const s = computeStats(data);
  const lane = (x) => x && { count: x.count, mrr: x.mrr, nextLeaves: x.nextLeaves, lastLeaves: x.lastLeaves };
  return {
    group: (data.meta || {}).group || null,
    window: { days: s.windowDays, from: s.from, to: s.to, method: s.method, view: s.view, counts: s.counts, coverage: s.coverage, partial: s.partial },
    members: { active: s.activeNow, cancelling: s.cancellingNow, paying: s.paying, payingByCurrency: s.payingBy },
    mrr: s.mrr, arr: s.arr, arpu: s.arpu, primaryCurrency: s.primaryCurrency, mrrSource: s.mrrSource,
    vsHistory: s.ref ? { date: s.ref.date, mrrChange: s.mrrDelta, activeChange: s.activeDelta } : null,
    last30: s.growth30, last90: s.growth90,
    atRisk: s.risk && { failed: lane(s.risk.failed), cancelled: lane(s.risk.cancelled), total: s.risk.total },
    trials: s.trials,
    renewals30: s.renewals && { count: s.renewals.total.count, amount: s.renewals.total.amount, annual: s.renewals.annual.length, staleAnnual: s.renewals.staleAnnual },
    ltv: s.ltv,
    topSources: s.sources && s.sources.slice(0, 5),
    topAffiliates: s.affiliates && s.affiliates.slice(0, 3),
    planMix: s.mix, tiers: s.tiers,
    cohorts: s.cohorts,
    engagement: s.engagement && { members: s.engagement.members, online7: s.engagement.online7, online30: s.engagement.online30, noPosts: s.engagement.noPosts },
    missing: s.missing,
    historyEntry: s.historyEntry,
  };
}

if (opts.raw) {
  if (opts.answers) {
    console.log(JSON.stringify(rawAnswers(opts.raw), null, 2));
  } else {
    if (!opts.out) { console.error(`--raw needs --out <data.json>\n${USAGE}`); process.exit(2); }
    const data = rawToData(opts.raw);
    fs.mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true });
    fs.writeFileSync(opts.out, `${JSON.stringify(data, null, 2)}\n`);
    console.error(`wrote ${opts.out} (${data.records.length} records, no emails, handles or answers)`);
    console.log(JSON.stringify(report(data), null, 2));
  }
} else {
  const dataPath = opts._[0];
  if (!dataPath) { console.error(USAGE); process.exit(2); }
  const data = readJson(dataPath);
  console.log(JSON.stringify(report(data), null, 2));
  if (opts.fill) {
    // `<` escaped so member text can never close the <script> tag.
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    if (!template.includes("/*DATA*/null")) throw new Error("placeholder /*DATA*/null not found");
    fs.mkdirSync(path.dirname(path.resolve(opts.fill)), { recursive: true });
    fs.writeFileSync(opts.fill, template.replace("/*DATA*/null", () => json));
    console.error(`wrote ${opts.fill}`);
  }
}
