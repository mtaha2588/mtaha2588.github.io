import { useApiStatus, retryNow } from "../../store/apiStatus";

const STYLES = {
  live: { dot: "bg-signal shadow-[0_0_8px_2px_rgba(52,211,153,0.55)]", text: "text-emerald-200", label: "Live" },
  checking: { dot: "bg-amber-300 animate-pulse", text: "text-amber-100", label: "Checking" },
  waking: { dot: "bg-amber-300 animate-pulse", text: "text-amber-100", label: "Waking" },
  offline: { dot: "bg-fg-subtle", text: "text-fg-muted", label: "Offline" },
};

/**
 * Small API status indicator (Live / Waking / Offline). Clicking it while
 * offline retries the connection.
 */
export default function ApiStatusDot({ className = "" }) {
  const status = useApiStatus((s) => s.status);
  const configured = useApiStatus((s) => s.configured);
  const style = STYLES[status] ?? STYLES.offline;
  // Callers may pass "hidden sm:inline-flex"; only default to inline-flex when they don't set a display.
  const display = /(^|\s)hidden(\s|$)/.test(className) ? "" : "inline-flex";
  const title = !configured
    ? "Live demos are not connected in this build"
    : status === "waking"
      ? "The free server is waking up (about 30–60 seconds)"
      : status === "offline"
        ? "The API is not reachable. Click to retry."
        : status === "live"
          ? "Live API connected"
          : "Checking the API…";

  return (
    <button
      type="button"
      onClick={status === "offline" || status === "waking" ? () => retryNow() : undefined}
      title={title}
      aria-label={`API ${style.label}: ${title}`}
      className={`${display} items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] whitespace-nowrap uppercase ${style.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      API {style.label}
    </button>
  );
}
