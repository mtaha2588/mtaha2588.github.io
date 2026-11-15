import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Radio, WifiOff } from "lucide-react";
import { useApiStatus, retryNow, secondsWaking } from "../../store/apiStatus";

/**
 * Frame around each live demo: endpoint label and API state.
 *  - live:      the demo works against the API
 *  - waking:    "Waking up the live server…" with a counter; auto-retries with backoff
 *  - offline:   children receive `offline` so they can show a labelled offline preview
 */
export default function DemoShell({ title, endpoint, children, offlinePreview = null }) {
  const status = useApiStatus((s) => s.status);
  const configured = useApiStatus((s) => s.configured);
  const [, tick] = useState(0);

  // Re-render once a second while waking, so the elapsed-seconds text updates.
  useEffect(() => {
    if (status !== "waking" && status !== "checking") return;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  const browser = status === "browser";
  const waking = status === "waking" || status === "checking";
  const offline = status === "offline";

  return (
    <div className="mt-6 rounded-xl border border-line-strong bg-ink-950/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] tracking-[0.2em] text-cyan uppercase">{title}</p>
        {browser ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-signal uppercase">
            <Radio size={12} aria-hidden="true" /> Live · runs in your browser
          </span>
        ) : status === "live" ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-signal uppercase">
            <Radio size={12} aria-hidden="true" /> Live API
          </span>
        ) : waking ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-amber-200 uppercase">
            <Loader2 size={12} className="animate-spin" aria-hidden="true" /> Waking server
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-fg-muted uppercase">
            <WifiOff size={12} aria-hidden="true" /> Offline preview
          </span>
        )}
      </div>
      {!browser && <p className="mt-1 truncate font-mono text-[10px] text-fg-subtle">{endpoint}</p>}

      {waking && (
        <div
          className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2.5 text-sm text-amber-50/90"
          role="status"
        >
          <p className="flex items-center gap-2">
            <Loader2 size={14} className="shrink-0 animate-spin" aria-hidden="true" />
            Waking up the live server… this usually takes 30–60 seconds ({secondsWaking()} s so far). The demo below
            becomes interactive as soon as it answers.
          </p>
        </div>
      )}

      {offline && (
        <div
          className="mt-4 rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-sm text-fg-muted"
          role="status"
        >
          <p>
            {configured
              ? "The live server didn't answer. You're seeing an offline preview of this demo with sample results."
              : "Live demos aren't connected in this build; this is an offline preview with sample results."}
          </p>
          {configured && (
            <button type="button" onClick={() => retryNow()} className="btn-ghost mt-3 !px-3 !py-2 !text-sm">
              <RefreshCw size={14} aria-hidden="true" /> Try again
            </button>
          )}
        </div>
      )}

      <div className="mt-4">{offline && offlinePreview ? offlinePreview : children}</div>
    </div>
  );
}

export function Field({ label, htmlFor, children, hint }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-xs font-medium text-fg-muted">
        {label}
        {hint && <span className="font-mono text-[11px] text-fg">{hint}</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function ErrorNote({ error }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
      {error}
    </p>
  );
}

/** Labelled sample output shown instead of a live result while the API is offline. */
export function OfflinePreview({ children }) {
  return (
    <div className="relative rounded-lg border border-dashed border-line-strong p-3">
      <span className="absolute -top-2.5 left-3 rounded bg-ink-950 px-1.5 font-mono text-[9px] tracking-[0.2em] text-fg-subtle uppercase">
        Offline preview · sample result
      </span>
      <div className="mt-1 opacity-90">{children}</div>
    </div>
  );
}
