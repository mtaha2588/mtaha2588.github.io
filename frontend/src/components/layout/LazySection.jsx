import { Suspense, useEffect, useRef, useState } from "react";
import { useUniverse } from "../../store/universe";
import { useRenderAll } from "../../lib/renderAll";

/**
 * 2D mode only: renders its section when it comes within ~1.5 screens of
 * the viewport (or when the browser is idle), keeping the first paint
 * on phones light. In 3D mode it renders immediately, because the
 * camera's scroll stations need every section at its real size.
 *
 * The wrapper keeps the section's id and station number while waiting,
 * so links and the HUD work before the content exists.
 */
export default function LazySection({ id, station, minHeight = "100svh", children }) {
  const lite = useUniverse((s) => s.mode === "lite");
  const forced = useRenderAll();
  const [near, setNear] = useState(false);
  const ref = useRef(null);
  const show = !lite || forced || near;

  useEffect(() => {
    if (show) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "150% 0px" });
    io.observe(ref.current);
    // Fill in the rest a few seconds after load, when the browser is idle, so later scrolling never waits.
    let idle = 0;
    const timer = setTimeout(() => {
      idle = window.requestIdleCallback ? window.requestIdleCallback(() => setNear(true)) : setNear(true);
    }, 6000);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      if (idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
    };
  }, [show]);

  const placeholder = (
    <div
      ref={ref}
      id={id}
      data-station={station}
      data-section-placeholder=""
      style={{ minHeight }}
      aria-hidden="true"
    />
  );
  // Sections are also code-split: the placeholder stays until their code has loaded.
  return show ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder;
}
