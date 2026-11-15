import { createStore } from "./createStore";
import { API_URL, isApiConfigured } from "../lib/api";

/**
 * Live state of the backend API, shared by the status dot, the demos and
 * the contact form.
 *
 *   status: "checking" | "live" | "waking" | "offline" | "browser"
 *
 * "browser": no backend in this build (free GitHub Pages hosting); the
 * demos run in the visitor's browser instead (lib/demoLocal.js).
 *
 * Free Render servers sleep after inactivity and take 30–60 s to wake.
 * On page load we send a silent /api/health request; while it fails we
 * stay in "waking" and retry with backoff (2 s → 4 s → 8 s → 15 s …).
 * After ~90 s without an answer we give up and report "offline", but
 * keep checking slowly in the background so the UI recovers by itself.
 */
export const [apiStatus, useApiStatus] = createStore({
  status: isApiConfigured ? "checking" : "browser",
  configured: isApiConfigured,
  startedAt: 0,
  lastError: "",
  attempts: 0,
});

const GIVE_UP_MS = 90_000;
const DELAYS = [2_000, 4_000, 8_000, 15_000, 15_000, 20_000, 30_000];
let timer = null;
let inFlight = null;

async function ping() {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(`${API_URL}/api/health`, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body?.status === "ok" || body?.status === "degraded";
  } finally {
    clearTimeout(t);
  }
}

function schedule(delay) {
  clearTimeout(timer);
  timer = setTimeout(check, delay);
}

/** Runs one health check and schedules the next one if the API isn't live yet. */
export async function check() {
  if (!isApiConfigured || inFlight) return inFlight;
  const s = apiStatus.get();
  if (!s.startedAt) apiStatus.set({ startedAt: Date.now() });

  inFlight = (async () => {
    try {
      await ping();
      apiStatus.set({ status: "live", lastError: "", attempts: 0 });
      // Re-verify occasionally so a server that falls asleep is noticed.
      schedule(5 * 60_000);
    } catch (err) {
      const { startedAt, attempts } = apiStatus.get();
      const elapsed = Date.now() - (startedAt || Date.now());
      const gaveUp = elapsed > GIVE_UP_MS;
      apiStatus.set({
        status: gaveUp ? "offline" : "waking",
        lastError: err?.message || String(err),
        attempts: attempts + 1,
      });
      schedule(gaveUp ? 60_000 : DELAYS[Math.min(attempts, DELAYS.length - 1)]);
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

/** Called from a user action: restarts the 90 s wake window and checks right away. */
export function retryNow() {
  apiStatus.set({ status: "waking", startedAt: Date.now(), attempts: 0 });
  return check();
}

/** Start the silent wake-up on page load (idempotent). */
export function wakeApi() {
  if (!isApiConfigured || apiStatus.get().startedAt) return;
  check();
}

/** Resolves true once the API is live, or false when it's declared offline or `maxWaitMs` passes. */
export function waitForApi(maxWaitMs = GIVE_UP_MS) {
  if (!isApiConfigured) return Promise.resolve(false);
  if (apiStatus.get().status === "live") return Promise.resolve(true);
  return new Promise((resolve) => {
    const done = (v) => {
      unsub();
      clearTimeout(limit);
      resolve(v);
    };
    const unsub = apiStatus.subscribe(() => {
      const st = apiStatus.get().status;
      if (st === "live") done(true);
      if (st === "offline") done(false);
    });
    const limit = setTimeout(() => done(apiStatus.get().status === "live"), maxWaitMs);
    check();
  });
}

/** Seconds since the wake-up started (for the "about 30–60 s" message). */
export const secondsWaking = () => Math.round((Date.now() - (apiStatus.get().startedAt || Date.now())) / 1000);
