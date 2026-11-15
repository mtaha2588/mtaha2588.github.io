import { MousePointerClick } from "lucide-react";
import { useUniverse } from "../../store/universe";

/**
 * Camera station 6 (3D only): the holographic project gallery, where every
 * project's real screenshot plays on a curved wall of screens
 * (three/environments/ProjectGallery.jsx). The page shows only a slim
 * caption so the screens stay in view. In 2D mode the Work cards above
 * already show the same projects, so this renders nothing.
 */
export default function GallerySection() {
  const immersive = useUniverse((s) => s.mode === "immersive");
  if (!immersive) return null;
  return (
    <section
      id="gallery"
      data-station="6"
      aria-labelledby="gallery-title"
      className="pointer-events-none relative flex min-h-[150svh] items-end pb-[18svh]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass pointer-events-auto inline-flex max-w-md items-start gap-3 rounded-2xl !bg-ink-950/75 p-4">
          <MousePointerClick size={18} className="mt-0.5 shrink-0 text-holo-cyan" aria-hidden="true" />
          <div>
            <h2 id="gallery-title" className="font-display text-base font-semibold text-fg">
              Project gallery
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              Real screenshots of my work. Click a screen to open its case study, or use the live demo and GitHub links
              beneath it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
