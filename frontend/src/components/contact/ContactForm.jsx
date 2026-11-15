import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { apiRequest, isApiConfigured } from "../../lib/api";
import { exhibits } from "../../store/exhibits";
import { useApiStatus, waitForApi } from "../../store/apiStatus";
import { profile } from "../../data/profile";
import { SERVICES, BUDGETS } from "../../data/services";

const EMPTY = { name: "", email: "", company: "", service: "", budget: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (f.message.trim().length < 10) e.message = "Please write at least 10 characters.";
  return e;
}

function mailtoHref(form) {
  const subject = `Project enquiry${form.service ? `: ${form.service}` : ""}`;
  const body = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    form.company && `Company: ${form.company}`,
    form.service && `Service: ${form.service}`,
    form.budget && `Budget: ${form.budget}`,
    "",
    form.message,
  ]
    .filter((l) => l !== undefined && l !== false)
    .join("\n");
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Contact form → POST /api/contact (FastAPI). The backend validates,
 * filters spam (honeypot + timing + rate limit), stores the message and
 * optionally emails it. If the free server is still waking up we wait for
 * it (with a visible message); if it's offline, the visitor gets a
 * pre-filled email link instead of an error.
 */
export default function ContactForm() {
  // Start from any "Get a quote" choice made before the form was on screen.
  const [form, setForm] = useState(() => {
    const p = exhibits.get().contactPrefill;
    return p ? { ...EMPTY, service: p.service || "", message: p.message || "" } : EMPTY;
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | waking | sending | sent | fallback | error
  const [message, setMessage] = useState("");
  const startedAt = useRef(null);
  const honeypot = useRef(null);
  const apiState = useApiStatus((s) => s.status);

  // Apply each new "Get a quote" prefill once. The store also changes on hover etc.,
  // so compare timestamps rather than re-applying (which would overwrite typing).
  const appliedPrefill = useRef(exhibits.get().contactPrefill?.at ?? null);
  useEffect(
    () =>
      exhibits.subscribe(() => {
        const p = exhibits.get().contactPrefill;
        if (!p || p.at === appliedPrefill.current) return;
        appliedPrefill.current = p.at;
        setForm((f) => ({ ...f, service: p.service || f.service, message: p.message || f.message }));
      }),
    [],
  );

  const update = (k) => (e) => {
    startedAt.current ??= Date.now();
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setMessage("");

    // Free static build (no server): hand the message to the visitor's email app, fully pre-filled.
    if (!isApiConfigured) {
      if (profile.email) window.location.href = mailtoHref(form);
      setStatus("mailto");
      return;
    }

    // Give a sleeping free server time to wake before we call it.
    if (apiState !== "live") {
      setStatus("waking");
      const live = await waitForApi(60_000);
      if (!live) {
        setStatus("fallback");
        return;
      }
    }

    setStatus("sending");
    try {
      await apiRequest("/api/contact", {
        method: "POST",
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || null,
          service: form.service || null,
          budget: form.budget || null,
          message: form.message.trim(),
          website: honeypot.current?.value || null,
          elapsed_ms: startedAt.current ? Date.now() - startedAt.current : null,
        },
      });
      setStatus("sent");
      setForm(EMPTY);
      startedAt.current = null;
      exhibits.set((s) => ({ contactPulse: s.contactPulse + 1 }));
    } catch (err) {
      if (err.status === 0) {
        setStatus("fallback"); // network problem: offer email instead of a raw error
        return;
      }
      setStatus("error");
      setErrors(err.fieldErrors || {});
      setMessage(err.message);
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.07] p-6 text-center" role="status">
        <CheckCircle2 size={36} className="mx-auto text-emerald-300" aria-hidden="true" />
        <p className="mt-3 font-display text-xl font-semibold text-fg">Message received</p>
        <p className="mt-1 text-sm text-fg-muted">
          Thanks for reaching out. I'll reply by email, usually within one business day.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-5 !px-4 !py-2 !text-sm">
          Send another message
        </button>
      </div>
    );
  }

  if (status === "mailto") {
    return (
      <div className="rounded-xl border border-cyan/30 bg-cyan/[0.06] p-6 text-center" role="status">
        <Mail size={32} className="mx-auto text-cyan" aria-hidden="true" />
        {profile.email ? (
          <>
            <p className="mt-3 font-display text-xl font-semibold text-fg">Your email app should open now</p>
            <p className="mt-1 text-sm text-fg-muted">
              Your message is filled in; just press Send. If nothing opened, email me at{" "}
              <a href={mailtoHref(form)} className="text-cyan underline underline-offset-2">
                {profile.email}
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 font-display text-xl font-semibold text-fg">Let's talk</p>
            <p className="mt-1 text-sm text-fg-muted">
              Please reach me through{" "}
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-cyan underline">
                GitHub
              </a>{" "}
              for now.
            </p>
          </>
        )}
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-5 !px-4 !py-2 !text-sm">
          Back to the form
        </button>
      </div>
    );
  }

  if (status === "fallback") {
    return (
      <div className="rounded-xl border border-amber-300/25 bg-amber-300/[0.06] p-6 text-center" role="status">
        <Mail size={32} className="mx-auto text-amber-200" aria-hidden="true" />
        <p className="mt-3 font-display text-xl font-semibold text-fg">The live server isn't reachable right now</p>
        <p className="mt-1 text-sm text-fg-muted">
          Your message wasn't lost. Send it by email instead; the button opens your mail app with everything filled in.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {profile.email ? (
            <a href={mailtoHref(form)} className="btn-primary !px-4 !py-2 !text-sm">
              <Mail size={16} /> Send by email
            </a>
          ) : (
            <p className="text-sm text-fg-muted">Please try again in a minute.</p>
          )}
          <button type="button" onClick={() => setStatus("idle")} className="btn-ghost !px-4 !py-2 !text-sm">
            Back to the form
          </button>
        </div>
      </div>
    );
  }

  const field = (k) => ({
    id: `contact-${k}`,
    value: form[k],
    onChange: update(k),
    "aria-invalid": errors[k] ? "true" : undefined,
    "aria-describedby": errors[k] ? `contact-${k}-error` : undefined,
  });
  const err = (k) =>
    errors[k] && (
      <p id={`contact-${k}-error`} className="mt-1 text-xs text-red-300">
        {errors[k]}
      </p>
    );
  const busy = status === "sending" || status === "waking";

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="contact-name" className="text-xs font-medium text-fg-muted">
          Name
        </label>
        <input {...field("name")} autoComplete="name" maxLength={100} className="field mt-1.5" />
        {err("name")}
      </div>
      <div>
        <label htmlFor="contact-email" className="text-xs font-medium text-fg-muted">
          Email
        </label>
        <input {...field("email")} type="email" autoComplete="email" maxLength={254} className="field mt-1.5" />
        {err("email")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="contact-company" className="text-xs font-medium text-fg-muted">
          Company <span className="text-fg-subtle">(optional)</span>
        </label>
        <input {...field("company")} autoComplete="organization" maxLength={120} className="field mt-1.5" />
        {err("company")}
      </div>
      <div>
        <label htmlFor="contact-service" className="text-xs font-medium text-fg-muted">
          Service
        </label>
        <select {...field("service")} className="field mt-1.5 !py-2.5">
          <option value="">Not sure yet</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Other">Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-budget" className="text-xs font-medium text-fg-muted">
          Budget range <span className="text-fg-subtle">(optional)</span>
        </label>
        <select {...field("budget")} className="field mt-1.5 !py-2.5">
          <option value="">Prefer not to say</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="contact-message" className="flex justify-between text-xs font-medium text-fg-muted">
          Message <span className="font-mono text-fg-subtle">{form.message.length}/5000</span>
        </label>
        <textarea
          {...field("message")}
          rows={5}
          maxLength={5000}
          className="field mt-1.5 resize-y"
          placeholder="What are you trying to build or automate? Any deadline?"
        />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people, bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input ref={honeypot} id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "waking" && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2 text-sm text-amber-50/90 sm:col-span-2"
        >
          <Loader2 size={14} className="shrink-0 animate-spin" aria-hidden="true" />
          Waking up the live server (about 30–60 seconds)… your message will be sent automatically.
        </p>
      )}

      {status === "error" && message && (
        <div
          role="alert"
          className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200 sm:col-span-2"
        >
          {message}
        </div>
      )}

      <button type="submit" disabled={busy} className="btn-primary justify-center sm:col-span-2">
        {busy ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Send size={16} aria-hidden="true" />
        )}
        {status === "waking" ? "Connecting…" : status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className="text-center text-xs text-fg-subtle sm:col-span-2">
        I reply to every genuine enquiry. Your details are only used to answer you.
      </p>
    </form>
  );
}
