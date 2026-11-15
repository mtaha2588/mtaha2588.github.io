import { useEffect } from "react";
import gsap from "gsap";
import { finishIntroValues, motion, useUniverse } from "../../store/universe";

const SEEN_KEY = "aiu:intro-seen";

function introSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Background reveal of the 3D world. It never blocks the page: the hero
 * text, navigation and scrolling are available from the first paint,
 * while behind them the stars fade in, the floor grid lights up, the
 * globe materialises and the camera settles from deep space.
 *
 * The full sweep (about 4 s) plays once per browser session; repeat
 * visits get a short fade, and reduced-motion users get the finished
 * scene immediately. Renders nothing.
 */
export default function Intro() {
  const ready = useUniverse((s) => s.canvasReady);
  const reduced = useUniverse((s) => s.reducedMotion);

  useEffect(() => {
    if (!ready) return;
    const finish = () => {
      finishIntroValues();
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage unavailable: the sweep simply plays again next time */
      }
    };

    if (reduced) {
      finish();
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    if (introSeen()) {
      tl.to(motion.intro, { stars: 1, grid: 1, reveal: 1, dolly: 0, orbit: 0, duration: 1.2, ease: "power2.out" });
    } else {
      tl.to(motion.intro, { stars: 1, duration: 1.4, ease: "power1.inOut" }, 0)
        .to(motion.intro, { grid: 1, duration: 2.6, ease: "power2.inOut" }, 0.3)
        .to(motion.intro, { reveal: 1, duration: 2.4, ease: "power2.inOut" }, 0.4)
        .to(motion.intro, { dolly: 0, orbit: 0, duration: 3.8, ease: "power3.inOut" }, 0.1);
    }
    return () => {
      tl.kill();
      finishIntroValues();
    };
  }, [ready, reduced]);

  return null;
}
