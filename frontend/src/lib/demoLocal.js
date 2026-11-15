/**
 * In-browser versions of the three project demos.
 *
 * The site is hosted for free on GitHub Pages with no server, so the demo
 * logic runs here, in the visitor's browser. It is a direct port of the
 * rule-based Python services in backend/app/demos/ (same rules, same
 * response shapes), so the demo components work unchanged with either.
 */
import { localTerrain } from "./terrainLocal";
import { SAMPLE_INVENTORY } from "../data/sampleInventory";

const pause = (ms = 180) => new Promise((r) => setTimeout(r, ms)); // feels like a real call

// ------------------------------------------------------------ avalanche

const DISCLAIMER =
  "Educational demonstration using synthetic or user-supplied values and general rules of thumb. " +
  "It is not an avalanche forecast and must not be used for safety decisions.";

const SLOPE_CLASSES = [
  { id: 0, label: "< 25°", meaning: "Generally below avalanche start-zone angles (may still be a runout zone)." },
  { id: 1, label: "25–30°", meaning: "Transitional: avalanches are possible but less frequent." },
  { id: 2, label: "30–45°", meaning: "Primary avalanche start-zone angles." },
  { id: 3, label: "> 45°", meaning: "Very steep: frequent small sluffs; deep slabs build up less often." },
];
const slopeClass = (d) => (d < 25 ? 0 : d < 30 ? 1 : d <= 45 ? 2 : 3);
const aspectName = (a) =>
  a < 0 ? "flat" : ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(((a + 22.5) % 360) / 45)];
const angleDiff = (a, b) => Math.abs(((((a - b + 180) % 360) + 360) % 360) - 180);
const fmt = (n) => String(Number(n));
const has = (v) => v !== null && v !== undefined && v !== "";

function assess(req) {
  const slope = Number(req.slope_deg);
  const snow = Number(req.new_snow_cm || 0);
  const wind = Number(req.wind_speed_kmh || 0);
  const cls = slopeClass(slope);
  const label = SLOPE_CLASSES[cls].label;

  const snowPresent = snow >= 30;
  const snowDetail = snowPresent
    ? `${fmt(snow)} cm of new snow in 72 h: significant new load.`
    : `${fmt(snow)} cm of new snow in 72 h: below the ~30 cm level often treated as significant.`;

  let lee = null;
  if (has(req.aspect_deg) && has(req.wind_from_deg)) {
    const downwind = (Number(req.wind_from_deg) + 180) % 360;
    lee = angleDiff(Number(req.aspect_deg), downwind) <= 60;
  }
  const windPresent = wind >= 25 && (lee === null || lee);
  const windDetail =
    wind < 25
      ? `Wind ${fmt(wind)} km/h: generally too light to transport much snow.`
      : lee === null
        ? `Wind ${fmt(wind)} km/h can transport snow; add aspect and wind direction to check lee loading.`
        : lee
          ? `Wind ${fmt(wind)} km/h and this slope faces downwind (lee side): likely wind loading.`
          : `Wind ${fmt(wind)} km/h, but this slope faces into the wind (windward): less loading.`;

  const warmingPresent = Boolean(req.rapid_warming) || (has(req.air_temp_c) && Number(req.air_temp_c) > 0);
  const factors = [
    {
      key: "slope",
      label: "Slope angle",
      present: cls === 2,
      detail: `${fmt(slope)}° (${label}): ${SLOPE_CLASSES[cls].meaning}`,
    },
    { key: "new_snow", label: "New snow load", present: snowPresent, detail: snowDetail },
    { key: "wind_loading", label: "Wind loading", present: windPresent, detail: windDetail },
    {
      key: "warming",
      label: "Warming",
      present: warmingPresent,
      detail: warmingPresent
        ? "Above-freezing or rapidly rising temperatures can weaken the snowpack (wet-snow instability)."
        : "No warming signal provided.",
    },
  ];
  const loading = factors.slice(1).filter((f) => f.present).length;
  const level =
    cls === 2
      ? loading >= 1
        ? "high"
        : "elevated"
      : cls === 1 || cls === 3
        ? loading >= 2
          ? "elevated"
          : "low"
        : "low";

  return {
    terrain_susceptibility: level,
    slope_class: cls,
    slope_class_label: label,
    aspect: has(req.aspect_deg) ? aspectName(Number(req.aspect_deg)) : null,
    factors,
    summary: {
      high: "Avalanche-prone slope angle combined with at least one loading or weakening factor.",
      elevated: "Terrain or conditions show some avalanche-relevant characteristics.",
      low: "Few avalanche-relevant indicators for this slope with the values provided.",
    }[level],
    method: "Rule-based indicators (slope angle, new snow, wind loading on lee slopes, warming)",
    disclaimer: DISCLAIMER,
  };
}

// ------------------------------------------------------------ automation agent

const ENGINE = "rule-based (deterministic tools, no LLM), running in your browser";
const INTENT_KEYWORDS = {
  sales: ["price", "pricing", "quote", "cost", "buy", "purchase", "demo", "plan", "subscription", "trial"],
  support: ["error", "bug", "broken", "not working", "issue", "problem", "help", "login", "crash", "down"],
  billing: ["invoice", "refund", "charge", "payment", "billing", "receipt", "card"],
  partnership: ["partner", "partnership", "collaborate", "integration", "reseller", "affiliate"],
  complaint: ["disappointed", "unacceptable", "complaint", "angry", "terrible", "worst", "cancel"],
};
const ROUTES = {
  sales: "Sales team",
  support: "Technical support",
  billing: "Finance",
  partnership: "Business development",
  complaint: "Customer success lead",
  general: "Shared inbox",
};
const URGENCY = ["urgent", "asap", "immediately", "today", "right now", "deadline", "critical", "emergency"];
const MONEY = /(?:[$€£]\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s?(?:usd|eur|gbp|dollars))/gi;

// Drop control characters (keeping tabs and newlines), collapse spaces, trim.
const cleanText = (t) =>
  Array.from(String(t))
    .filter((ch) => {
      const c = ch.charCodeAt(0);
      return c === 9 || c === 10 || c === 13 || (c >= 32 && c !== 127);
    })
    .join("")
    .replace(/[ \t]+/g, " ")
    .trim();

function classifyIntent(text) {
  const low = text.toLowerCase();
  let best = "general";
  let evidence = [];
  for (const [intent, keys] of Object.entries(INTENT_KEYWORDS)) {
    const hits = keys.filter((k) => low.includes(k));
    if (hits.length > evidence.length) {
      best = intent;
      evidence = hits;
    }
  }
  return [best, evidence];
}
function extractSignals(text) {
  const low = text.toLowerCase();
  return {
    urgency_terms: URGENCY.filter((w) => low.includes(w)),
    amounts: text.match(MONEY) || [],
    exclamations: (text.match(/!/g) || []).length,
    question: text.includes("?"),
  };
}
function prioritize(intent, s) {
  let score = 20 + 30 * Math.min(s.urgency_terms.length, 2);
  score += { complaint: 25, support: 15, billing: 10, sales: 10 }[intent] ?? 0;
  score += s.amounts.length ? 10 : 0;
  score += s.exclamations >= 2 ? 5 : 0;
  score = Math.min(score, 100);
  const level =
    score >= 70 ? "P1 - respond within 1 hour" : score >= 45 ? "P2 - respond today" : "P3 - respond within 2 days";
  return [score, level];
}

function recorder() {
  const steps = [];
  return {
    steps,
    run(stage, tool, description, fn, summarize) {
      const t = performance.now();
      const out = fn();
      steps.push({
        index: steps.length + 1,
        stage,
        tool,
        description,
        duration_ms: Math.round((performance.now() - t) * 1000) / 1000,
        output_summary: summarize(out),
      });
      return out;
    },
  };
}
const runId = () => Math.random().toString(16).slice(2, 14);
const money = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function triage(req) {
  const rec = recorder();
  const messages = rec.run(
    "input",
    "ingest_messages",
    "Clean and normalise incoming messages",
    () => req.messages.map(cleanText).filter((m) => m.length >= 3),
    (m) => `${m.length} messages ingested`,
  );
  const intents = rec.run(
    "processing",
    "classify_intent",
    "Classify each message by intent using keyword evidence",
    () => messages.map(classifyIntent),
    (out) => {
      const c = {};
      out.forEach(([i]) => (c[i] = (c[i] || 0) + 1));
      return Object.entries(c)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    },
  );
  const signals = rec.run(
    "processing",
    "extract_signals",
    "Extract urgency terms and monetary amounts",
    () => messages.map(extractSignals),
    (out) =>
      `${out.filter((s) => s.urgency_terms.length).length} urgent, ${out.filter((s) => s.amounts.length).length} mention amounts`,
  );
  const triaged = rec.run(
    "decision",
    "prioritize_and_route",
    "Score priority and route each message to a team",
    () =>
      messages
        .map((msg, i) => {
          const [intent, evidence] = intents[i];
          const [score, level] = prioritize(intent, signals[i]);
          return {
            id: i + 1,
            preview: msg.length > 90 ? `${msg.slice(0, 90)}…` : msg,
            intent,
            evidence,
            route_to: ROUTES[intent],
            priority_score: score,
            priority: level,
            signals: signals[i],
          };
        })
        .sort((a, b) => b.priority_score - a.priority_score),
    (out) => ["P1", "P2", "P3"].map((p) => `${out.filter((x) => x.priority.startsWith(p)).length} ${p}`).join(", "),
  );
  const markdown = rec.run(
    "output",
    "compose_report",
    "Generate a structured triage report",
    () =>
      [
        "# Inquiry triage report",
        "",
        `${triaged.length} messages processed.`,
        "",
        "| # | Priority | Intent | Route to | Preview |",
        "|---|---|---|---|---|",
        ...triaged.map(
          (x) =>
            `| ${x.id} | ${x.priority.split(" ")[0]} | ${x.intent} | ${x.route_to} | ${x.preview.replace(/\|/g, "/").replace(/\n/g, " ")} |`,
        ),
      ].join("\n"),
    (md) => `${md.split("\n").length}-line markdown report`,
  );
  return {
    run_id: runId(),
    task: req.task,
    engine: ENGINE,
    steps: rec.steps,
    result: { items: triaged },
    report_markdown: markdown,
    notes: ["Classification uses transparent keyword rules so every decision can be explained."],
  };
}

function sales(req) {
  const rec = recorder();
  const records = rec.run(
    "input",
    "validate_records",
    "Validate and load sales records",
    () =>
      req.records
        .map((r) => ({ ...r, amount: Number(r.amount) }))
        .filter((r) => r.date && r.product && r.region && Number.isFinite(r.amount) && r.amount >= 0),
    (r) => `${r.length} valid records`,
  );
  const agg = rec.run(
    "processing",
    "aggregate_sales",
    "Aggregate revenue by product and region",
    () => {
      const byP = {};
      const byR = {};
      records.forEach((r) => {
        byP[r.product] = (byP[r.product] || 0) + r.amount;
        byR[r.region] = (byR[r.region] || 0) + r.amount;
      });
      const sort = (o) => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]));
      const total = records.reduce((s, r) => s + r.amount, 0);
      return {
        total: Math.round(total * 100) / 100,
        count: records.length,
        average: Math.round((total / records.length) * 100) / 100,
        by_product: sort(byP),
        by_region: sort(byR),
      };
    },
    (a) => `total ${money(a.total)} across ${Object.keys(a.by_product).length} products`,
  );
  const trend = rec.run(
    "processing",
    "detect_trend",
    "Compare the first and second half of the period",
    () => {
      const o = [...records].sort((a, b) => String(a.date).localeCompare(String(b.date)));
      const half = Math.floor(o.length / 2);
      const first = o.slice(0, half).reduce((s, r) => s + r.amount, 0);
      const second = o.slice(half).reduce((s, r) => s + r.amount, 0);
      const change = first ? ((second - first) / first) * 100 : null;
      return {
        period_start: o[0].date,
        period_end: o[o.length - 1].date,
        first_half_total: first,
        second_half_total: second,
        change_pct: change === null ? null : Math.round(change * 10) / 10,
        direction: change === null ? "flat" : change > 5 ? "up" : change < -5 ? "down" : "flat",
      };
    },
    (t) => (t.change_pct !== null ? `trend ${t.direction} (${t.change_pct}%)` : "trend n/a"),
  );
  const insights = rec.run(
    "decision",
    "flag_insights",
    "Decide which findings deserve attention",
    () => {
      const out = [];
      const [topP, topV] = Object.entries(agg.by_product)[0];
      const share = agg.total ? (topV / agg.total) * 100 : 0;
      out.push(`Top product: ${topP} (${Math.round(share)}% of revenue).`);
      if (share > 50 && Object.keys(agg.by_product).length > 1)
        out.push(`Concentration risk: more than half of revenue comes from ${topP}.`);
      const regions = Object.entries(agg.by_region);
      if (regions.length > 1)
        out.push(`Lowest-revenue region: ${regions[regions.length - 1][0]}. Consider reviewing activity there.`);
      if (trend.change_pct !== null) {
        const verb = { up: "grew", down: "declined", flat: "was roughly flat" }[trend.direction];
        const sign = trend.change_pct >= 0 ? "+" : "";
        out.push(
          `Revenue ${verb} between the first and second half of the period (${sign}${trend.change_pct.toFixed(1)}%).`,
        );
      }
      return out;
    },
    (i) => `${i.length} insights flagged`,
  );
  const markdown = rec.run(
    "output",
    "compose_report",
    "Generate the written summary report",
    () =>
      [
        "# Sales summary",
        "",
        `Period: ${trend.period_start} to ${trend.period_end}`,
        `Total revenue: ${money(agg.total)} from ${agg.count} sales (average ${money(agg.average)}).`,
        "",
        "## Key insights",
        ...insights.map((i) => `- ${i}`),
        "",
        "## Revenue by product",
        ...Object.entries(agg.by_product).map(([k, v]) => `- ${k}: ${money(v)}`),
        "",
        "## Revenue by region",
        ...Object.entries(agg.by_region).map(([k, v]) => `- ${k}: ${money(v)}`),
      ].join("\n"),
    (md) => `${md.split("\n").length}-line markdown report`,
  );
  return {
    run_id: runId(),
    task: req.task,
    engine: ENGINE,
    steps: rec.steps,
    result: { aggregates: agg, trend, insights },
    report_markdown: markdown,
    notes: ["All figures are computed from the records you entered; nothing is estimated."],
  };
}

const AGENT_SAMPLES = {
  inquiry_triage: {
    task: "inquiry_triage",
    messages: [
      "Hi, could you send me pricing for the annual plan for a team of 12? We'd like a quote this week.",
      "URGENT: our dashboard login is broken and the whole team is blocked today!!",
      "We were charged twice on our last invoice, can you issue a refund?",
      "We run an agency and would love to discuss a partnership / integration with your API.",
      "Just wanted to say the new update looks great, thanks.",
    ],
  },
  sales_summary: {
    task: "sales_summary",
    records: [
      { date: "2026-01-05", product: "Starter Plan", region: "North America", amount: 1200 },
      { date: "2026-01-12", product: "Pro Plan", region: "Europe", amount: 3400 },
      { date: "2026-01-19", product: "Pro Plan", region: "North America", amount: 3100 },
      { date: "2026-01-26", product: "Consulting", region: "Asia Pacific", amount: 2200 },
      { date: "2026-02-02", product: "Pro Plan", region: "Europe", amount: 3900 },
      { date: "2026-02-09", product: "Starter Plan", region: "Asia Pacific", amount: 900 },
      { date: "2026-02-16", product: "Pro Plan", region: "North America", amount: 4200 },
      { date: "2026-02-23", product: "Consulting", region: "Europe", amount: 2600 },
    ],
  },
};

// ------------------------------------------------------------ car sales

const TIMEFRAME = { now: 35, "1-3 months": 25, "3-6 months": 12, researching: 5 };
const FINANCING = { cash: 15, "pre-approved": 15, "needs financing": 8, undecided: 0 };
const LEADS_KEY = "aiu:demo-leads";
const vehicles = () => SAMPLE_INVENTORY.vehicles;

function loadLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveLeads(leads) {
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads.slice(-100)));
  } catch {
    /* private mode: the pipeline just won't persist */
  }
}

function scoreLead(lead, v) {
  const items = [
    { factor: "timeframe", points: TIMEFRAME[lead.timeframe] ?? 0, reason: `Buying timeframe: ${lead.timeframe}` },
    { factor: "financing", points: FINANCING[lead.financing] ?? 0, reason: `Financing: ${lead.financing}` },
  ];
  const ratio = lead.budget / v.price;
  if (ratio >= 1) items.push({ factor: "budget", points: 25, reason: "Budget covers the vehicle price" });
  else if (ratio >= 0.9) items.push({ factor: "budget", points: 15, reason: "Budget within 10% of the price" });
  else if (ratio >= 0.75) items.push({ factor: "budget", points: 5, reason: "Budget within 25% of the price" });
  else items.push({ factor: "budget", points: 0, reason: "Budget well below the price" });
  if (lead.wants_test_drive) items.push({ factor: "test_drive", points: 20, reason: "Requested a test drive" });
  if (lead.has_trade_in) items.push({ factor: "trade_in", points: 5, reason: "Has a trade-in vehicle" });
  return [
    Math.min(
      items.reduce((s, i) => s + i.points, 0),
      100,
    ),
    items,
  ];
}
const stageFor = (s) => (s >= 70 ? "Hot" : s >= 40 ? "Warm" : "Nurture");
const at = (now, ms) => ({ when: new Date(now + ms).toISOString(), simulated: true });

function planAutomation(stage, lead, now) {
  const H = 3600_000;
  let actions;
  if (stage === "Hot") {
    actions = [
      { action: "Notify the sales team immediately", ...at(now, 0) },
      { action: "Personal follow-up call", ...at(now, 2 * H) },
    ];
    if (lead.wants_test_drive) actions.push({ action: "Offer test-drive slots", ...at(now, 4 * H) });
  } else if (stage === "Warm") {
    actions = [
      { action: "Send vehicle brochure and pricing email", ...at(now, 5 * 60_000) },
      { action: "Follow-up email", ...at(now, 24 * H) },
    ];
  } else {
    actions = [
      { action: "Add to monthly newsletter sequence", ...at(now, 5 * 60_000) },
      { action: "Check-in email", ...at(now, 7 * 24 * H) },
    ];
  }
  if (lead.financing === "needs financing") actions.push({ action: "Send financing options", ...at(now, H) });
  return actions;
}

function createLead(body) {
  const lead = {
    ...body,
    budget: Number(body.budget),
    financing: body.financing || "undecided",
  };
  const v = vehicles().find((x) => x.id === lead.vehicle_id);
  if (!v) {
    const err = new Error("Please choose a vehicle.");
    err.status = 422;
    throw err;
  }
  if (!(lead.budget >= 1000 && lead.budget <= 1_000_000)) {
    const err = new Error("Budget must be between 1,000 and 1,000,000.");
    err.status = 422;
    err.fieldErrors = { budget: "Enter a budget between 1,000 and 1,000,000." };
    throw err;
  }
  const [score, breakdown] = scoreLead(lead, v);
  const stage = stageFor(score);
  const now = Date.now();
  const leads = loadLeads();
  const id = (leads.at(-1)?.id ?? 0) + 1;
  leads.push({ id, vehicle_id: v.id, stage, score, created_at: new Date(now).toISOString() });
  saveLeads(leads);

  const alternatives =
    lead.budget >= v.price * 0.9
      ? []
      : vehicles()
          .filter((x) => x.price <= lead.budget && x.id !== v.id)
          .sort(
            (a, b) => Number(a.body_type !== v.body_type) - Number(b.body_type !== v.body_type) || b.price - a.price,
          )
          .slice(0, 2);

  return {
    lead_id: id,
    vehicle: v,
    score,
    stage,
    score_breakdown: breakdown,
    automation: planAutomation(stage, lead, now),
    alternatives,
    notes: ["Runs entirely in your browser: leads are saved only on this device, and no messages are sent."],
  };
}

function pipeline() {
  const leads = loadLeads();
  const by_stage = { Hot: 0, Warm: 0, Nurture: 0 };
  const by_vehicle = {};
  leads.forEach((l) => {
    by_stage[l.stage] = (by_stage[l.stage] || 0) + 1;
    by_vehicle[l.vehicle_id] = (by_vehicle[l.vehicle_id] || 0) + 1;
  });
  return {
    total_leads: leads.length,
    by_stage,
    average_score: leads.length ? Math.round((leads.reduce((s, l) => s + l.score, 0) / leads.length) * 10) / 10 : null,
    by_vehicle,
    recent: [...leads].reverse().slice(0, 5),
    note: "Counts come from leads you created in this browser.",
  };
}

// ------------------------------------------------------------ public API (same shape as demoApi)

export const demoLocal = {
  terrain: async (size = 64, seed = 7) => ({ ...localTerrain(size, seed), source: "browser" }),
  assess: async (body) => (await pause(), assess(body)),
  agentSamples: async () => ({ sample_data: true, samples: AGENT_SAMPLES }),
  runAgent: async (body) => {
    await pause(260);
    if (body.task === "sales_summary") {
      if (!body.records?.length || body.records.length < 2) {
        const err = new Error("Add at least two sales records.");
        err.status = 422;
        throw err;
      }
      return sales(body);
    }
    if (!body.messages?.some((m) => cleanText(m).length >= 3)) {
      const err = new Error("Add at least one message.");
      err.status = 422;
      throw err;
    }
    return triage(body);
  },
  inventory: async () => SAMPLE_INVENTORY,
  createLead: async (body) => (await pause(), createLead(body)),
  pipeline: async () => pipeline(),
};
