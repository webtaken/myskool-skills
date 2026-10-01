#!/usr/bin/env node
// Exact numbers for the pulse text summary, and a safe way to fill the dashboard.
//
//   node scripts/pulse-stats.mjs data.json                 → prints the stats JSON
//   node scripts/pulse-stats.mjs data.json --fill out.html → also writes the filled dashboard
//
// The stats come from the same computeStats() the dashboard runs (the block
// between `// <stats>` and `// </stats>` in assets/pulse.html), so the summary
// and the charts always agree.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(here, "..", "assets", "pulse.html");
const [dataPath, flag, outPath] = process.argv.slice(2);
if (!dataPath) {
  console.error("usage: node pulse-stats.mjs <data.json> [--fill <out.html>]");
  process.exit(2);
}

const template = fs.readFileSync(templatePath, "utf8");
const block = /\/\/ <stats>[^\n]*\n([\s\S]*?)\/\/ <\/stats>/.exec(template);
if (!block) throw new Error("computeStats block not found in assets/pulse.html");
const computeStats = new Function(`${block[1]}\nreturn computeStats;`)();

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const s = computeStats(data);
console.log(JSON.stringify({
  window: { days: s.windowDays, split: s.split, generatedAt: s.now },
  thisWeek: s.cur,
  previousWeek: s.prev,
  topSignals: s.signals.slice(0, 5),
  sentiment: s.sentiment,
  waiting: s.waiting.length,
  oldestWaitingHours: s.waiting.reduce((m, w) => Math.max(m, w.hours), 0) || null,
  voicesAtRisk: s.voices.length,
  wins: s.wins.length,
  champions: s.champions.slice(0, 3),
}, null, 2));

if (flag === "--fill") {
  if (!outPath) throw new Error("--fill needs an output path");
  // `<` escaped so member text can never close the <script> tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  if (!template.includes("/*DATA*/null")) throw new Error("placeholder /*DATA*/null not found");
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(outPath, template.replace("/*DATA*/null", () => json));
  console.error(`wrote ${outPath}`);
}
